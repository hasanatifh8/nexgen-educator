"use server";

import { redirect } from "next/navigation";
import { canAccessCourse } from "@/lib/access";
import { allLessons } from "@/lib/catalog";
import { getCourse } from "@/lib/catalogStore";
import { getCurrentUser } from "@/lib/dal";
import { markLessonComplete } from "@/lib/users";

export async function completeLesson(fd: FormData) {
  const courseId = String(fd.get("courseId") ?? "");
  const lessonId = String(fd.get("lessonId") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/courses/${courseId}/learn/${lessonId}`)}`);

  const course = await getCourse(courseId);
  if (!course) redirect("/courses");
  if (!canAccessCourse(user, course.id)) redirect(`/courses/${course.id}`);

  const lessons = allLessons(course);
  const i = lessons.findIndex((l) => l.id === lessonId);
  if (i === -1) redirect(`/courses/${course.id}`);

  const done = new Set((await markLessonComplete(user.id, course.id, lessonId)) ?? []);
  // Continue with the next unfinished lesson after this one, then any earlier one that was skipped.
  const next = [...lessons.slice(i + 1), ...lessons.slice(0, i)].find((l) => !done.has(l.id));
  redirect(next ? `/courses/${course.id}/learn/${next.id}` : `/courses/${course.id}?completed=1`);
}
