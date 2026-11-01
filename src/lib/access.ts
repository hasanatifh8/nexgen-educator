import { activeCourses, coursesFor, type Course } from "./catalog";

/** Access rules: shared by pages, actions and the exam engine. Safe for client import. */
export type AccessUser = {
  isAdmin?: boolean;
  profileComplete: boolean;
  assignedCourses: string[];
  progress: Record<string, string[]>;
  /** Admin review of the learner's ID document. Certificates are only issued to verified identities. */
  verification: { status: "pending" | "verified" | "rejected" };
};

/** Learners open course material only when their profile is complete and an admin assigned the course. */
export function canAccessCourse(user: AccessUser, courseId: string) {
  return user.isAdmin === true || (user.profileComplete && user.assignedCourses.includes(courseId));
}

/** Certification-exam attempts per program in a rolling window — stops answer-guessing by brute-force retakes. */
export const EXAM_ATTEMPT_POLICY = { maxAttempts: 3, windowMs: 24 * 60 * 60 * 1000 };

export function isCourseComplete(user: Pick<AccessUser, "progress">, course: Pick<Course, "id" | "modules">) {
  const lessons = course.modules.flatMap((m) => m.lessons);
  const done = new Set(user.progress[course.id] ?? []);
  return lessons.length > 0 && lessons.every((l) => done.has(l.id));
}

export type ExamEligibility =
  | { ok: true }
  | { ok: false; reason: "no-courses" | "not-assigned" | "incomplete" | "unverified"; remaining: { id: string; title: string }[] };

/**
 * A program’s exam unlocks only after every course in it is assigned and finished, and the learner’s
 * identity is verified — the name on a certificate has to belong to the person who earned it.
 */
export function examEligibility(user: AccessUser, programId: string, courses: Course[]): ExamEligibility {
  if (user.isAdmin) return { ok: true };
  // Disabled courses are no longer offered, so they no longer count towards the certificate.
  const inProgram = activeCourses(coursesFor(courses, programId));
  if (!inProgram.length) return { ok: false, reason: "no-courses", remaining: [] };
  const notAssigned = inProgram.filter((c) => !canAccessCourse(user, c.id));
  if (notAssigned.length) return { ok: false, reason: "not-assigned", remaining: notAssigned.map(({ id, title }) => ({ id, title })) };
  const unfinished = inProgram.filter((c) => !isCourseComplete(user, c));
  if (unfinished.length) return { ok: false, reason: "incomplete", remaining: unfinished.map(({ id, title }) => ({ id, title })) };
  if (user.verification.status !== "verified") return { ok: false, reason: "unverified", remaining: [] };
  return { ok: true };
}
