import { isCourseComplete } from "./access";
import { gstOn, priceWithGst, type Catalog, type Program } from "./catalog";
import { discountedFee, type AppliedPromo } from "./enrollment";
import type { PaymentRecord, PaymentStatus, StoredUser } from "./users";

/** Derived learner state shared by the learner portal and the admin learner page. */

export type PaymentRow = {
  course: { id: string; title: string; price: number };
  program?: Program;
  /** Assigned (enrolled) or only requested so far. */
  assigned: boolean;
  amountDue: number;
  promo?: AppliedPromo;
  status: PaymentStatus;
  record?: PaymentRecord;
};

/** What this learner pays for a course: the listed fee, less any promo code applied at checkout, plus GST. */
export function learnerFee(user: Pick<StoredUser, "promos">, course: { id: string; price: number }) {
  const promo: AppliedPromo | undefined = course.price > 0 ? user.promos?.[course.id] : undefined;
  const fee = discountedFee(course.price, promo?.percent);
  return { listPrice: course.price, promo, discount: course.price - fee, fee, gst: gstOn(fee), total: priceWithGst(fee) };
}

/**
 * Paid courses the learner is enrolled in or has asked to join, with the payment our team recorded.
 * Payments are per course; records saved when fees were per program still cover that program's courses.
 */
export function paymentRows(user: Pick<StoredUser, "assignedCourses" | "requests" | "payments" | "purchases" | "promos">, { programs, courses }: Catalog): PaymentRow[] {
  const requested = new Set(user.requests.map((r) => r.courseId));
  return courses
    .filter((c) => c.price > 0 && (user.assignedCourses.includes(c.id) || requested.has(c.id) || user.payments?.[c.id]))
    .map((c) => {
      const record = user.payments?.[c.id] ?? user.payments?.[c.programId];
      const status: PaymentStatus = record?.status ?? (user.purchases.includes(c.programId) ? "paid" : "pending");
      return {
        course: { id: c.id, title: c.title, price: c.price },
        program: programs.find((p) => p.id === c.programId),
        assigned: user.assignedCourses.includes(c.id),
        amountDue: learnerFee(user, c).total,
        promo: user.promos?.[c.id],
        status,
        record,
      };
    });
}

export type ResumeStage = "locked" | "queued" | "in_progress" | "ready";

/** Where the learner's resume upgrade stands. It starts once they complete their first course. */
export function resumeStage(user: Pick<StoredUser, "resumeService" | "progress" | "assignedCourses">, { courses }: Pick<Catalog, "courses">): ResumeStage {
  const s = user.resumeService;
  if (s?.status === "delivered" && s.file) return "ready";
  if (s?.status === "in_progress") return "in_progress";
  const completedAny = courses.some((c) => user.assignedCourses.includes(c.id) && isCourseComplete(user, c));
  return completedAny ? "queued" : "locked";
}

export const PAYMENT_LABEL: Record<PaymentStatus, string> = { pending: "Payment pending", paid: "Paid", waived: "Fee waived" };

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
