import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import LessonContent from "@/components/learn/LessonContent";
import { courseProgress } from "@/components/learn/progress";
import { IconArrowRight, IconCheck, IconChevronDown, IconClock } from "@/components/Icons";
import type { Course } from "@/lib/catalog";
import { canAccessCourse } from "@/lib/access";
import { getCatalog } from "@/lib/catalogStore";
import { requireLearner } from "@/lib/dal";
import { completeLesson } from "../../actions";
import CompleteButton from "./CompleteButton";

export const metadata: Metadata = { title: "Lesson — NextGen Educator" };

type P = PageProps<"/courses/[courseId]/learn/[lessonId]">;

function Curriculum({ course, currentId, done }: { course: Course; currentId: string; done: Set<string> }) {
  return (
    <nav aria-label="Course content" className="space-y-5">
      {course.modules.map((m, mi) => (
        <div key={m.id}>
          <p className="px-3 text-xs font-bold tracking-wide text-slate-500 uppercase">Module {mi + 1}</p>
          <p className="px-3 text-sm font-semibold text-navy-900">{m.title}</p>
          <ol className="mt-2 space-y-0.5">
            {m.lessons.map((l) => {
              const current = l.id === currentId;
              const isDone = done.has(l.id);
              return (
                <li key={l.id}>
                  <Link
                    href={`/courses/${course.id}/learn/${l.id}`}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      current ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-white hover:text-navy-900"
                    }`}
                  >
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                      isDone ? "bg-emerald-600 text-white" : current ? "ring-2 ring-brand-teal" : "ring-1 ring-slate-300"
                    }`}>
                      {isDone && <IconCheck className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">{l.title}</span>
                    <span className={`shrink-0 text-xs ${current ? "text-slate-300" : "text-slate-400"}`}>{l.minutes}m</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </nav>
  );
}

async function LessonView({ params }: { params: P["params"] }) {
  const { courseId, lessonId } = await params;
  const user = await requireLearner(`/courses/${courseId}/learn/${lessonId}`);
  const { courses, programs } = await getCatalog();
  const course = courses.find((c) => c.id === courseId);
  const program = course && programs.find((p) => p.id === course.programId);
  if (!course || !program) notFound();
  if (!canAccessCourse(user, course.id)) redirect(`/courses/${course.id}`);

  const prog = courseProgress(course, user.progress[course.id]);
  const index = prog.lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) notFound();
  const lesson = prog.lessons[index];
  const prev = prog.lessons[index - 1];
  const next = prog.lessons[index + 1];
  const isDone = prog.done.has(lesson.id);

  return (
    <>
      {/* Course bar */}
      <div className="sticky top-18 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/courses/${course.id}`} className="min-w-0 flex-1 truncate text-sm font-semibold text-navy-900 hover:text-brand-ink">
            ← {course.title}
          </Link>
          <div className="hidden w-56 items-center gap-3 sm:flex">
            <div className="h-2 flex-1 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-gradient-to-r from-brand to-brand-teal" style={{ width: `${prog.percent}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-600">{prog.percent}%</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[290px_1fr] lg:px-8 lg:py-12">
        <aside className="hidden lg:sticky lg:top-36 lg:block lg:max-h-[calc(100vh-10rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
          <p className="mb-4 px-3 text-sm text-slate-500">{prog.count} of {prog.total} lessons complete</p>
          <Curriculum course={course} currentId={lesson.id} done={prog.done} />
        </aside>

        <article className="min-w-0">
          <div className="mx-auto max-w-3xl">
            <details className="group mb-6 rounded-xl border border-slate-200 bg-white lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                Course content · {prog.count}/{prog.total} done
                <IconChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-slate-100 p-3"><Curriculum course={course} currentId={lesson.id} done={prog.done} /></div>
            </details>

            <p className="text-sm font-semibold text-brand-ink">{lesson.moduleTitle}</p>
            <h1 className="mt-2 font-display text-3xl leading-tight font-bold tracking-tight text-navy-900 sm:text-4xl">{lesson.title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>Lesson {index + 1} of {prog.total}</span>
              <span className="flex items-center gap-1.5"><IconClock className="h-4 w-4" /> {lesson.minutes} min</span>
              {isDone && <span className="flex items-center gap-1 font-semibold text-emerald-600"><IconCheck className="h-4 w-4" /> Completed</span>}
            </p>

            <div className="mt-10">
              <LessonContent blocks={lesson.blocks} storagePrefix={`nge:${user.id}:${course.id}:${lesson.id}`} />
            </div>

            <div className="mt-14 flex flex-col-reverse gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
              {prev ? (
                <Link href={`/courses/${course.id}/learn/${prev.id}`} className="btn-secondary">← Previous</Link>
              ) : (
                <span />
              )}
              {isDone ? (
                next ? (
                  <Link href={`/courses/${course.id}/learn/${next.id}`} className="btn-primary px-6 py-3">
                    Next lesson <IconArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link href={`/courses/${course.id}`} className="btn-primary px-6 py-3">Back to course overview</Link>
                )
              ) : (
                <form action={completeLesson}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <CompleteButton label={next ? "Mark complete & continue" : "Complete course"} />
                </form>
              )}
            </div>
            {next && (
              <p className="mt-4 text-right text-xs text-slate-500">Up next: <span className="font-semibold text-navy-900">{next.title}</span></p>
            )}
          </div>
        </article>
      </div>
    </>
  );
}

export default function LessonPage({ params }: P) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50">
        <Suspense fallback={<div className="mx-auto my-12 h-[32rem] max-w-3xl animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />}>
          <LessonView params={params} />
        </Suspense>
      </main>
    </>
  );
}
