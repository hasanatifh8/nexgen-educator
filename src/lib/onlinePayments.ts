import { randomBytes } from "node:crypto";
import { formatINR, priceWithGst } from "./catalog";
import { getCourse } from "./catalogStore";
import { courseApprovedEmail, paymentReceivedEmail } from "./emails";
import { discountedFee, type AppliedPromo } from "./enrollment";
import { emailBrand, sendMail } from "./mailer";
import { recordPromoUse } from "./promo";
import { capturePayment, createOrder, fetchOrderPayments, fetchPayment, type RazorpayPayment } from "./razorpay";
import { getJson, setJson, withLock } from "./store";
import { findUserById, recordOnlinePayment } from "./users";

/**
 * Online course payments. Every Razorpay order we create is stored here with the learner, course and the exact
 * amount, so a payment is only ever matched to what our server priced — never to amounts sent by the browser.
 * Fulfilment is idempotent: the browser confirmation and the webhook may both arrive.
 */
const KEY = "payment-orders";

export type PaymentOrder = {
  orderId: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  /** Amount in paise, including GST. */
  amount: number;
  promo?: AppliedPromo;
  /** Whether the promo code is new to this learner and course (so its use must be counted on payment). */
  promoIsNew?: boolean;
  status: "created" | "paid";
  paymentId?: string;
  createdAt: string;
  paidAt?: string;
};

async function readAll(): Promise<PaymentOrder[]> {
  return (await getJson<PaymentOrder[]>(KEY)) ?? [];
}

export async function getPaymentOrder(orderId: string) {
  return (await readAll()).find((o) => o.orderId === orderId);
}

/** Creates a Razorpay order for a course at the server's price. */
export async function startCoursePayment(input: { userId: string; courseId: string; courseTitle: string; price: number; promo?: AppliedPromo; promoIsNew?: boolean }) {
  const total = priceWithGst(discountedFee(input.price, input.promo?.percent));
  const amount = Math.round(total * 100);
  const order = await createOrder({
    amount,
    receipt: `nge_${Date.now().toString(36)}_${randomBytes(3).toString("hex")}`,
    notes: { userId: input.userId, courseId: input.courseId, course: input.courseTitle.slice(0, 200), ...(input.promo ? { promo: input.promo.code } : {}) },
  });
  if (order.amount !== amount) throw new Error("Razorpay order amount mismatch");
  const record: PaymentOrder = {
    orderId: order.id,
    userId: input.userId,
    courseId: input.courseId,
    courseTitle: input.courseTitle,
    amount,
    ...(input.promo ? { promo: input.promo, promoIsNew: !!input.promoIsNew } : {}),
    status: "created",
    createdAt: new Date().toISOString(),
  };
  await withLock(KEY, async () => setJson(KEY, [...(await readAll()), record]));
  return record;
}

/** A payment that really belongs to this order, for the full amount, and is (or can be) captured. */
async function settledPayment(order: PaymentOrder, payment: RazorpayPayment): Promise<RazorpayPayment | null> {
  if (payment.order_id !== order.orderId || payment.amount !== order.amount || payment.currency !== "INR") return null;
  if (payment.status === "captured") return payment;
  // Auto-capture is Razorpay's default; capture ourselves if the account has it switched off.
  if (payment.status === "authorized") return capturePayment(payment.id, order.amount).catch(() => null);
  return null;
}

export type FulfilResult = { ok: true; courseId: string; alreadyDone: boolean } | { ok: false; reason: "unknown-order" | "not-paid" };

/**
 * Marks the order paid, records the payment and unlocks the course, then emails a receipt.
 * `paymentId` comes from Checkout (already signature-checked); without it (webhook) we look the payment up.
 */
export async function fulfilOrder(orderId: string, paymentId?: string): Promise<FulfilResult> {
  const order = await getPaymentOrder(orderId);
  if (!order) return { ok: false, reason: "unknown-order" };
  if (order.status === "paid") return { ok: true, courseId: order.courseId, alreadyDone: true };

  const candidates = paymentId ? [await fetchPayment(paymentId)] : (await fetchOrderPayments(orderId)).items;
  let paid: RazorpayPayment | null = null;
  for (const p of candidates) if ((paid = await settledPayment(order, p))) break;
  if (!paid) return { ok: false, reason: "not-paid" };

  // Flip the order under a lock so only one caller records the payment and sends emails.
  const won = await withLock(KEY, async () => {
    const all = await readAll();
    const o = all.find((x) => x.orderId === orderId);
    if (!o || o.status === "paid") return false;
    o.status = "paid";
    o.paymentId = paid!.id;
    o.paidAt = new Date().toISOString();
    await setJson(KEY, all);
    return true;
  });
  if (!won) return { ok: true, courseId: order.courseId, alreadyDone: true };

  const paidAt = new Date().toISOString();
  const result = await recordOnlinePayment(
    order.userId,
    order.courseId,
    { status: "paid", amount: order.amount / 100, reference: paid.id, paidAt, updatedAt: paidAt, method: "razorpay", orderId },
    order.promo,
  );
  // The learner has paid the discounted fee, so the code's use is counted even if it closed in the meantime.
  if (order.promo && order.promoIsNew) await recordPromoUse(order.promo.code).catch(() => false);

  // Emails are best-effort: the payment is already recorded and the course unlocked.
  try {
    const [brand, course, user] = await Promise.all([emailBrand(), getCourse(order.courseId), findUserById(order.userId)]);
    if (brand && user) {
      const date = new Date(paidAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" });
      await sendMail({ to: user.email, ...paymentReceivedEmail(user.firstName, brand, { courseTitle: order.courseTitle, amount: formatINR(order.amount / 100), reference: paid.id, date }) }).catch(() => {});
      if (course && result && !result.before.assigned) {
        await sendMail({ to: user.email, ...courseApprovedEmail(user.firstName, brand, [{ id: course.id, title: course.title }]) }).catch(() => {});
      }
    }
  } catch (e) {
    console.error("[razorpay] receipt email failed", e);
  }
  return { ok: true, courseId: order.courseId, alreadyDone: false };
}

/** Recent online payments, newest first (admin view). */
export async function listPaymentOrders() {
  return (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
