"use server";

import { getCourse } from "@/lib/catalogStore";
import { getCurrentUser } from "@/lib/dal";
import { normalizePromoCode, type AppliedPromo } from "@/lib/enrollment";
import { fulfilOrder, getPaymentOrder, startCoursePayment } from "@/lib/onlinePayments";
import { checkPromoCode } from "@/lib/promo";
import { razorpayEnabled, razorpayKeyId, razorpayTestMode, verifyPaymentSignature } from "@/lib/razorpay";
import { hit } from "@/lib/rateLimit";
import { getSettings } from "@/lib/settings";
import { findUserById } from "@/lib/users";

export type StartPaymentResult =
  | {
      ok: true;
      keyId: string;
      orderId: string;
      amount: number;
      business: string;
      description: string;
      prefill: { name: string; email: string; contact: string };
      testMode: boolean;
    }
  | { ok: false; error: string; promoError?: boolean };

/** Prices the course on the server (with any promo code) and opens a Razorpay order for it. */
export async function startOnlinePaymentAction(courseId: string, promoCode: string): Promise<StartPaymentResult> {
  if (!razorpayEnabled()) return { ok: false, error: "Online payment is not available right now. Please choose “Pay after a call”." };
  const session = await getCurrentUser();
  if (!session) return { ok: false, error: "Please log in again to pay." };
  if (!hit(`pay:${session.id}`, 10, 10 * 60_000).ok) return { ok: false, error: "Too many attempts. Please wait a few minutes and try again." };

  const [user, course] = await Promise.all([findUserById(session.id), getCourse(String(courseId))]);
  if (!user?.profile?.completedAt) return { ok: false, error: "Please complete your profile before paying." };
  if (!course || course.disabled || course.launch || course.price <= 0) return { ok: false, error: "This course is not available for online payment." };
  if (user.payments?.[course.id]?.status === "paid" || user.payments?.[course.id]?.status === "waived") {
    return { ok: false, error: "You have already paid for this course." };
  }

  // The code is checked here: the browser's earlier “Apply” is only a preview.
  const code = normalizePromoCode(String(promoCode ?? "").slice(0, 40));
  const existing = user.promos?.[course.id];
  let promo: AppliedPromo | undefined;
  let promoIsNew = false;
  if (code && existing?.code === code) promo = existing;
  else if (code) {
    const r = await checkPromoCode(code);
    if (!r.ok) return { ok: false, error: `${r.error} Remove it to pay the full fee.`, promoError: true };
    promo = r.promo;
    promoIsNew = true;
  }

  try {
    const [order, settings] = await Promise.all([
      startCoursePayment({ userId: user.id, courseId: course.id, courseTitle: course.title, price: course.price, promo, promoIsNew }),
      getSettings(),
    ]);
    return {
      ok: true,
      keyId: razorpayKeyId(),
      orderId: order.orderId,
      amount: order.amount,
      business: settings.organizationName || "NextGen Educator",
      description: course.title.replace(/^[^A-Za-z0-9]+/, "").slice(0, 120),
      prefill: { name: `${user.firstName} ${user.lastName}`, email: user.email, contact: user.profile.phone ? `+91${user.profile.phone}` : "" },
      testMode: razorpayTestMode(),
    };
  } catch (e) {
    console.error("[razorpay] order creation failed", e);
    return { ok: false, error: "We couldn’t start the payment. Please try again in a moment." };
  }
}

export type ConfirmPaymentResult = { ok: true; courseId: string } | { ok: false; error: string };

/** Called by Checkout’s success handler. Verifies Razorpay’s signature, then unlocks the course. */
export async function confirmOnlinePaymentAction(input: { orderId: string; paymentId: string; signature: string }): Promise<ConfirmPaymentResult> {
  const session = await getCurrentUser();
  if (!session) return { ok: false, error: "Please log in again. If money was deducted, your course will unlock automatically within a few minutes." };
  const orderId = String(input?.orderId ?? "");
  const paymentId = String(input?.paymentId ?? "");
  const order = await getPaymentOrder(orderId);
  if (!order || order.userId !== session.id) return { ok: false, error: "We couldn’t match this payment to your order. Please contact us with your payment ID." };
  if (!verifyPaymentSignature(order.orderId, paymentId, String(input?.signature ?? ""))) {
    return { ok: false, error: "We couldn’t verify this payment. If money was deducted, please contact us with your payment ID." };
  }
  try {
    const r = await fulfilOrder(order.orderId, paymentId);
    if (r.ok) return { ok: true, courseId: r.courseId };
    return { ok: false, error: "Your payment is still being confirmed by the bank. Your course will unlock automatically as soon as it is." };
  } catch (e) {
    console.error("[razorpay] confirmation failed", e);
    return { ok: false, error: "Your payment went through, but we couldn’t confirm it just now. It will unlock automatically within a few minutes." };
  }
}
