"use server";

import { redirect } from "next/navigation";
import { formatINR, type Course } from "@/lib/catalog";
import { getCourse, getProgram } from "@/lib/catalogStore";
import { courseRequestedEmail } from "@/lib/emails";
import { emailBrand, sendMail } from "@/lib/mailer";
import { getCurrentUser } from "@/lib/dal";
import { CALL_SLOTS, normalizePromoCode, type AppliedPromo, type CallPreference, type CallSlot } from "@/lib/enrollment";
import { learnerFee } from "@/lib/learner";
import { checkPromoCode, recordPromoUse } from "@/lib/promo";
import { hit } from "@/lib/rateLimit";
import { findUserById, requestCourse } from "@/lib/users";

type Learner = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Shared gate: signed in, profile done, course open for requests and not already assigned. */
async function requestableCourse(courseId: string, from: string): Promise<{ user: Learner; course: Course }> {
  const user = await getCurrentUser();
  if (!user) redirect(`/register?next=${encodeURIComponent(from)}`);
  if (!user.profileComplete) redirect(`/onboarding?next=${encodeURIComponent(from)}`);
  const course = await getCourse(courseId);
  if (!course || course.disabled) redirect("/courses");
  if (user.assignedCourses.includes(courseId)) redirect(`/courses/${courseId}`);
  return { user, course };
}

/** Records the request, emails a confirmation the first time, and opens the confirmation page. */
async function submitRequest(user: Learner, course: Course, call?: CallPreference, promo?: AppliedPromo | null): Promise<never> {
  const before = await findUserById(user.id);
  const isNew = !before?.requests.some((r) => r.courseId === course.id);
  const after = await requestCourse(user.id, course.id, call, promo);

  const [program, brand] = await Promise.all([getProgram(course.programId), emailBrand()]);
  if (isNew && program && brand) {
    const price = after ? learnerFee(after, course) : undefined;
    const fee = course.price > 0 && price ? `${formatINR(price.total)}${price.promo ? ` after your ${price.promo.percent}% promo code ${price.promo.code}` : ""}` : undefined;
    await sendMail({
      to: user.email,
      ...courseRequestedEmail(user.firstName, brand, {
        courseTitle: course.title,
        programTitle: program.title,
        fee,
        call: call && { phone: `+91 ${call.phone}`, slot: CALL_SLOTS[call.slot] },
      }),
    });
  }
  redirect(`/my-learning/requests/${encodeURIComponent(course.id)}`);
}

/** Learner asks an admin to assign a free course; shows up under Admin → Learners → Course requests. Paid courses go through checkout. */
export async function requestAccessAction(fd: FormData) {
  const courseId = String(fd.get("courseId") ?? "");
  const { user, course } = await requestableCourse(courseId, `/courses/${courseId}`);
  if (course.price > 0) redirect(`/checkout/${encodeURIComponent(courseId)}`);
  await submitRequest(user, course);
}

export type PromoResult = { ok: true; code: string; percent: number } | { ok: false; error: string };

/** Checkout’s “Apply” button. Limited per learner so codes can’t be guessed by trying many. */
export async function checkPromoAction(raw: string): Promise<PromoResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in to use a promo code." };
  if (!hit(`promo:${user.id}`, 10, 15 * 60_000).ok) return { ok: false, error: "Too many attempts. Please try again in a few minutes." };
  const r = await checkPromoCode(String(raw ?? "").slice(0, 40));
  return r.ok ? { ok: true, ...r.promo } : r;
}

export type CheckoutField = "phone" | "slot" | "note" | "agree" | "promo";
export type CheckoutState = {
  errors?: Partial<Record<CheckoutField, string>>;
  /** What the learner submitted, so the form can show it again next to the errors. */
  values?: { phone: string; slot: string; note: string; agree: boolean; promo: string };
};

/** Final checkout step for a paid course: no payment is taken online, so we record when to call the learner. */
export async function confirmEnrollmentAction(_prev: CheckoutState, fd: FormData): Promise<CheckoutState> {
  const courseId = String(fd.get("courseId") ?? "");
  const { user, course } = await requestableCourse(courseId, `/checkout/${courseId}`);
  if (course.price === 0) return submitRequest(user, course);

  const phone = String(fd.get("phone") ?? "").replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
  const slot = String(fd.get("slot") ?? "");
  const note = String(fd.get("note") ?? "").trim();
  const errors: CheckoutState["errors"] = {};
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!(slot in CALL_SLOTS)) errors.slot = "Choose a time that suits you for the call.";
  if (note.length > 300) errors.note = "Keep your note under 300 characters.";
  if (fd.get("agree") !== "on") errors.agree = "Please confirm you understand how enrollment works.";

  // The code is checked again here: the browser's earlier "Apply" is only a preview.
  const code = normalizePromoCode(String(fd.get("promo") ?? "").slice(0, 40));
  const existing = (await findUserById(user.id))?.promos?.[course.id];
  let promo: AppliedPromo | null = null;
  if (code && existing?.code === code) promo = existing; // already applied to this enrollment; keep it even if the code has since closed
  else if (code) {
    const r = await checkPromoCode(code);
    if (r.ok) promo = r.promo;
    else errors.promo = `${r.error} Remove it to continue at the full fee.`;
  }

  const values = { phone: String(fd.get("phone") ?? "").slice(0, 20), slot, note: note.slice(0, 300), agree: fd.get("agree") === "on", promo: code };
  if (Object.keys(errors).length) return { errors, values };
  // Count the use only when a new code is applied to this enrollment.
  if (promo && promo !== existing && !(await recordPromoUse(promo.code))) {
    return { errors: { promo: "This promo code is no longer available. Remove it to continue at the full fee." }, values };
  }

  return submitRequest(user, course, { phone, slot: slot as CallSlot, ...(note ? { note } : {}) }, promo);
}
