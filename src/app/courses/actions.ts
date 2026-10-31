"use server";

import { redirect } from "next/navigation";
import { getCourse } from "@/lib/catalogStore";
import { getCurrentUser } from "@/lib/dal";
import { requestCourse } from "@/lib/users";

/** Learner asks an admin to assign a course; shows up under Admin → Learners → Course requests. */
export async function requestAccessAction(fd: FormData) {
  const courseId = String(fd.get("courseId") ?? "");
  const back = fd.get("from") === "list" ? "/courses" : `/courses/${courseId}`;
  const user = await getCurrentUser();
  if (!user) redirect(`/register?next=${encodeURIComponent(`/courses/${courseId}`)}`);
  if (!user.profileComplete) redirect(`/onboarding?next=${encodeURIComponent(`/courses/${courseId}`)}`);
  if (!(await getCourse(courseId))) redirect("/courses");
  await requestCourse(user.id, courseId);
  redirect(`${back}?requested=${encodeURIComponent(courseId)}`);
}
