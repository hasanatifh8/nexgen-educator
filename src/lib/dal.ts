import { redirect } from "next/navigation";
import { cache } from "react";
import { getSession } from "./session";
import { findUserById, type EarnedCertificate, type StoredUser } from "./users";

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: "free" | "pro";
  purchases: string[];
  certificates: EarnedCertificate[];
  progress: Record<string, string[]>;
  isAdmin: boolean;
  profileComplete: boolean;
  verification: StoredUser["verification"];
  assignedCourses: string[];
  requests: StoredUser["requests"];
};

/** Power admins are configured by email in ADMIN_EMAILS (comma-separated). */
export function isAdminEmail(email: string) {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

/** Verified current user (session cookie + user record), memoized per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session) return null;
  const u = await findUserById(session.uid);
  // Sessions issued before the latest password reset are revoked.
  if (!u || (u.sessionsValidAfter && session.iat < u.sessionsValidAfter)) return null;
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    plan: u.plan,
    purchases: u.purchases,
    certificates: u.certificates,
    progress: u.progress,
    isAdmin: isAdminEmail(u.email),
    profileComplete: !!u.profile?.completedAt,
    verification: u.verification,
    assignedCourses: u.assignedCourses,
    requests: u.requests,
  };
});

export async function requireUser(nextPath: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

/** Signed-in learner with a completed profile (admins skip onboarding). */
export async function requireLearner(nextPath: string) {
  const user = await requireUser(nextPath);
  if (!user.isAdmin && !user.profileComplete) redirect(`/onboarding?next=${encodeURIComponent(nextPath)}`);
  return user;
}

/** Returns the admin user, or null when signed in without admin rights. */
export async function requireAdmin(nextPath: string) {
  const user = await requireUser(nextPath);
  return user.isAdmin ? user : null;
}
