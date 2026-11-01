"use server";

import { redirect } from "next/navigation";
import { formatINR, priceWithGst } from "@/lib/catalog";
import { getCourse, getProgram } from "@/lib/catalogStore";
import { courseRequestedEmail } from "@/lib/emails";
import { appUrl, sendMail } from "@/lib/mailer";
import { getCurrentUser } from "@/lib/dal";
import { findUserById, requestCourse } from "@/lib/users";

/** Learner asks an admin to assign a course; shows up under Admin → Learners → Course requests. */
export async function requestAccessAction(fd: FormData) {
  const courseId = String(fd.get("courseId") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/register?next=${encodeURIComponent(`/courses/${courseId}`)}`);
  if (!user.profileComplete) redirect(`/onboarding?next=${encodeURIComponent(`/courses/${courseId}`)}`);
  const course = await getCourse(courseId);
  if (!course || course.disabled) redirect("/courses");
  if (user.assignedCourses.includes(courseId)) redirect(`/courses/${courseId}`);

  const before = await findUserById(user.id);
  const isNew = !before?.requests.some((r) => r.courseId === courseId);
  await requestCourse(user.id, courseId);

  const [program, base] = await Promise.all([getProgram(course.programId), appUrl()]);
  if (isNew && program && base) {
    const fee = course.price > 0 ? formatINR(priceWithGst(course.price)) : undefined;
    await sendMail({ to: user.email, ...courseRequestedEmail(user.firstName, base, { courseTitle: course.title, programTitle: program.title, fee }) });
  }
  redirect(`/my-learning/requests/${encodeURIComponent(courseId)}`);
}
