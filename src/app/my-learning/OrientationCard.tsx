import Link from "next/link";
import { courseProgress } from "@/components/learn/progress";
import { IconArrowRight, IconCheck, IconSparkles } from "@/components/Icons";
import type { Catalog } from "@/lib/catalog";
import type { CurrentUser } from "@/lib/dal";
import { ORIENTATION_COURSE_ID, ORIENTATION_PROGRAM_ID } from "@/lib/orientation";

/** The mandatory orientation: a bold “Start here” card until it is passed, then a slim “completed” line. */
export default function OrientationCard({ user, catalog }: { user: CurrentUser; catalog: Catalog }) {
  const course = catalog.courses.find((c) => c.id === ORIENTATION_COURSE_ID);
  const program = catalog.programs.find((p) => p.id === ORIENTATION_PROGRAM_ID);
  if (!course || !program || user.isAdmin) return null;
  const prog = courseProgress(course, user.progress[course.id]);
  const lessonsDone = prog.total > 0 && prog.count === prog.total;

  if (user.orientationPassed) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
        <IconCheck className="h-4 w-4 shrink-0" /> Orientation complete — every certification exam is unlocked for you.
      </p>
    );
  }

  const href = lessonsDone ? `/certifications/${program.id}/exam` : `/courses/${course.id}`;
  const cta = lessonsDone ? "Take the final quiz" : prog.count ? "Continue orientation" : "Start the orientation";
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-white p-6 ring-1 ring-orange-200 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-accent-strong uppercase">
            <IconSparkles className="h-4 w-4" /> Start here · mandatory
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-navy-900">{course.title}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {prog.total} short lessons on AI basics and how NextGen works, then a {program.exam.questions.length}-question quiz ({program.exam.passPercent}% to pass).
            No certificate — passing it unlocks every certification exam.
          </p>
          <div className="mt-3 flex max-w-sm items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-white ring-1 ring-orange-100">
              <div className="h-2 rounded-full bg-gradient-to-r from-accent to-amber-400" style={{ width: `${prog.percent}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-600">{lessonsDone ? "Lessons done · quiz next" : `${prog.count}/${prog.total} lessons`}</span>
          </div>
        </div>
        <Link href={href} className="btn-primary shrink-0 px-6 py-3">{cta} <IconArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
