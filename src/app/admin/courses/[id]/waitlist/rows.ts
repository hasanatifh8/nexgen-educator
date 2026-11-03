import { WORK_STATUSES } from "@/app/register/validation";
import { getWaitlist } from "@/lib/launchInterest";
import { listUsers } from "@/lib/users";

export type WaitlistRow = {
  userId: string;
  name: string;
  email: string;
  /** 10-digit Indian mobile, without +91. */
  phone?: string;
  location?: string;
  workStatus?: string;
  institution?: string;
  profile: "Incomplete" | "Awaiting review" | "Verified" | "Needs changes";
  joinedListAt?: string;
  registeredAt: string;
  /** Already assigned or requested this course (e.g. after it opened). */
  enrolled: boolean;
};

/** Everyone who tapped “Notify me” on a course, with the contact details our team needs to follow up. */
export async function waitlistRows(courseId: string): Promise<WaitlistRow[]> {
  const [entries, users] = await Promise.all([getWaitlist(courseId), listUsers()]);
  const byId = new Map(users.map((u) => [u.id, u]));
  return entries.flatMap((e) => {
    const u = byId.get(e.userId);
    if (!u) return []; // account since deleted
    const v = u.verification.status;
    return [{
      userId: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      phone: u.profile?.phone,
      location: u.profile ? `${u.profile.city}, ${u.profile.state}` : undefined,
      workStatus: u.workStatus ? WORK_STATUSES[u.workStatus].label : undefined,
      institution: u.institution || undefined,
      profile: !u.profile ? "Incomplete" : v === "verified" ? "Verified" : v === "rejected" ? "Needs changes" : "Awaiting review",
      joinedListAt: e.at,
      registeredAt: u.createdAt,
      enrolled: u.assignedCourses.includes(courseId) || u.requests.some((r) => r.courseId === courseId),
    }];
  });
}
