import { allLessons, type Course } from "@/lib/catalog";

export function courseProgress(course: Course, completed: string[] = []) {
  const lessons = allLessons(course);
  const done = new Set(completed.filter((id) => lessons.some((l) => l.id === id)));
  const total = lessons.length;
  return {
    lessons,
    done,
    total,
    count: done.size,
    percent: total ? Math.round((done.size / total) * 100) : 0,
    next: lessons.find((l) => !done.has(l.id)) ?? lessons[0],
    minutes: lessons.reduce((m, l) => m + l.minutes, 0),
  };
}
