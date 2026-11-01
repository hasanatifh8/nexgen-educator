import { isCourseComplete } from "./access";
import { coursesFor, priceWithGst, type Catalog, type Program } from "./catalog";
import type { PaymentRecord, PaymentStatus, StoredUser } from "./users";

/** Derived learner state shared by the learner portal and the admin learner page. */

export type PaymentRow = {
  program: Program;
  /** Courses of this program the learner has been assigned or has requested. */
  courses: { id: string; title: string; assigned: boolean }[];
  amountDue: number;
  status: PaymentStatus;
  record?: PaymentRecord;
};

/** Paid programs the learner is enrolled in or has asked to join, with the payment our team recorded. */
export function paymentRows(user: Pick<StoredUser, "assignedCourses" | "requests" | "payments" | "purchases">, { programs, courses }: Catalog): PaymentRow[] {
  const requested = new Set(user.requests.map((r) => r.courseId));
  return programs
    .filter((p) => p.price > 0)
    .map((program) => {
      const mine = coursesFor(courses, program.id)
        .filter((c) => user.assignedCourses.includes(c.id) || requested.has(c.id))
        .map((c) => ({ id: c.id, title: c.title, assigned: user.assignedCourses.includes(c.id) }));
      const record = user.payments?.[program.id];
      const status: PaymentStatus = record?.status ?? (user.purchases.includes(program.id) ? "paid" : "pending");
      return { program, courses: mine, amountDue: priceWithGst(program.price), status, record };
    })
    .filter((r) => r.courses.length > 0 || r.record);
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
