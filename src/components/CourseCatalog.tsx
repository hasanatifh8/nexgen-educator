"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, launchLabel, priceShort, type Category, type CourseSummary, type PublicProgram } from "@/lib/catalog";
import { CATEGORY_ACCENT, LEVEL_STYLES } from "@/lib/styles";
import { notifyMeAction, requestAccessAction } from "@/app/courses/actions";
import { IconBadge, IconBell, IconBook, IconCalendar, IconCheck, IconClock, IconLock, IconSignal } from "./Icons";

const TABS = ["All", ...CATEGORIES] as const;
type Tab = "All" | Category;
type Access = "all" | "free" | "premium" | "soon";

/** Who is browsing: null for visitors. */
export type CatalogViewer = {
  profileComplete: boolean;
  /** Course ids the viewer can open (assigned, or everything for admins). */
  unlocked: string[];
  requested: string[];
  /** Upcoming courses the viewer asked to be notified about. */
  notified: string[];
  /** courseId → number of completed lessons */
  completed: Record<string, number>;
} | null;

type Props = { courses: CourseSummary[]; programs: PublicProgram[]; viewer: CatalogViewer };

function NotifyButton({ course, on }: { course: CourseSummary; on: boolean }) {
  return (
    <form action={notifyMeAction} className="mt-5">
      <input type="hidden" name="courseId" value={course.id} />
      <input type="hidden" name="back" value={`/courses#${course.id}`} />
      {on ? (
        <button type="submit" className="btn w-full border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" title="Tap to stop notifications">
          <IconCheck className="h-4 w-4" /> You’ll be notified
        </button>
      ) : (
        <button type="submit" className="btn w-full bg-violet-600 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700">
          <IconBell className="h-4 w-4" /> Notify me
        </button>
      )}
    </form>
  );
}

function CourseAction({ course, viewer, percent, done }: { course: CourseSummary; viewer: CatalogViewer; percent: number; done: number }) {
  const href = `/courses/${course.id}`;
  if (course.launch && !viewer?.unlocked.includes(course.id)) return <NotifyButton course={course} on={!!viewer?.notified.includes(course.id)} />;
  if (!viewer) return <Link href={href} className="btn-primary mt-5 w-full">View syllabus & enroll</Link>;
  if (viewer.unlocked.includes(course.id)) {
    return (
      <Link href={href} className={`mt-5 w-full ${percent === 100 ? "btn bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100" : "btn-primary"}`}>
        {percent === 100 ? "✓ Review course" : done > 0 ? "Continue learning" : "Start course"}
      </Link>
    );
  }
  const paid = course.price > 0;
  const checkout = `/checkout/${course.id}`;
  if (!viewer.profileComplete) {
    return <Link href={`/onboarding?next=${encodeURIComponent(paid ? checkout : href)}`} className="btn mt-5 w-full bg-navy-900 text-white hover:bg-navy-800">Complete profile to enroll</Link>;
  }
  if (viewer.requested.includes(course.id)) {
    return (
      <Link href={`/my-learning/requests/${course.id}`} className="btn mt-5 w-full bg-amber-50 text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100">
        <IconCheck className="h-4 w-4" /> {paid ? "Enrollment requested" : "Access requested"}
      </Link>
    );
  }
  if (paid) return <Link href={checkout} className="btn mt-5 w-full bg-navy-900 text-white hover:bg-navy-800">Enroll now</Link>;
  return (
    <form action={requestAccessAction} className="mt-5">
      <input type="hidden" name="courseId" value={course.id} />
      <button type="submit" className="btn w-full bg-navy-900 text-white hover:bg-navy-800"><IconLock className="h-4 w-4" /> Request access</button>
    </form>
  );
}

export default function CourseCatalog({ courses, programs, viewer }: Props) {
  const programById = Object.fromEntries(programs.map((p) => [p.id, p]));
  const [active, setActive] = useState<Tab>("All");
  const [access, setAccess] = useState<Access>("all");

  const listed = courses.filter((c) => programById[c.programId]);
  const visible = listed
    .filter((c) => {
      const free = c.price === 0;
      const matchesAccess = access === "all" || (access === "soon" ? !!c.launch : !c.launch && (access === "free") === free);
      return (active === "All" || c.category === active) && matchesAccess;
    })
    // Courses you can join now come first; upcoming ones follow, soonest first.
    .sort((a, b) => (a.launch ? 1 : 0) - (b.launch ? 1 : 0) || (a.launch?.on ?? "9999").localeCompare(b.launch?.on ?? "9999"));
  const upcomingCount = listed.filter((c) => c.launch).length;

  return (
    <section id="courses" className="bg-slate-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Course categories" className="flex gap-2 overflow-x-auto pb-2">
            {TABS.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                onClick={() => setActive(c)}
                className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                  active === c
                    ? "bg-navy-900 text-white shadow-md shadow-navy-900/20"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-navy-900 hover:ring-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="inline-flex rounded-lg bg-white p-1 ring-1 ring-slate-200" role="group" aria-label="Filter by access">
              {(["all", "free", "premium", ...(upcomingCount ? (["soon"] as const) : [])] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAccess(a)}
                  aria-pressed={access === a}
                  className={`min-h-10 rounded-md px-3.5 py-2 text-sm font-semibold capitalize transition-colors sm:min-h-0 sm:py-1.5 sm:text-xs ${
                    access === a ? "bg-sky-50 text-brand-ink" : "text-slate-500 hover:text-navy-900"
                  }`}
                >
                  {a === "premium" ? "Paid" : a === "soon" ? "Starting soon" : a}
                </button>
              ))}
            </div>
            <p className="shrink-0 text-sm text-slate-500">
              <span className="font-semibold text-navy-900">{visible.length}</span> of {listed.length}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => {
            const program = programById[c.programId];
            const unlocked = !!viewer?.unlocked.includes(c.id);
            const done = Math.min(viewer?.completed[c.id] ?? 0, c.lessonCount);
            const percent = c.lessonCount ? Math.round((done / c.lessonCount) * 100) : 0;
            return (
              <article key={c.id} id={c.id} className={`card card-hover animate-fade-up flex scroll-mt-24 flex-col overflow-hidden ${c.launch ? "ring-1 ring-violet-200" : ""}`}>
                <div className={`h-1.5 bg-gradient-to-r ${c.launch ? "from-violet-500 to-fuchsia-500" : CATEGORY_ACCENT[c.category]}`} />
                {c.launch && (
                  <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-6 py-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-violet-800"><IconCalendar className="h-4 w-4" /> {launchLabel(c.launch)}</span>
                    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-60 motion-reduce:animate-none" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-fuchsia-500" />
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-brand-ink">{c.category}</span>
                    {c.price === 0 ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">Free</span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
                        {viewer && !unlocked && <IconLock className="h-3 w-3" />} Paid · {priceShort(c.price)}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-lg leading-snug font-semibold text-navy-900">
                    <Link href={`/courses/${c.id}`} className="transition-colors hover:text-brand-ink">{c.title}</Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600">{c.blurb}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><IconClock className="h-4 w-4" /> {c.hours} hrs</span>
                    <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold ring-1 ${LEVEL_STYLES[c.level]}`}>
                      <IconSignal className="h-3.5 w-3.5" /> {c.level}
                    </span>
                    <span className="flex items-center gap-1.5"><IconBook className="h-4 w-4" /> {c.lessonCount} lessons</span>
                    <span>{c.enrolled ? `${c.enrolled} enrolled` : "New"}</span>
                  </div>

                  <p className="mt-4 flex items-center gap-2 rounded-lg bg-orange-50/70 px-3 py-2 ring-1 ring-orange-100" title="Certificate awarded on completion">
                    <IconBadge className="h-5 w-5 shrink-0 text-accent-strong" />
                    <span className="text-xs font-semibold text-navy-900">Certificate: {program.title}</span>
                  </p>

                  {unlocked && done > 0 && (
                    <div className="mt-4 flex items-center gap-3" aria-label={`${percent}% complete`}>
                      <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                        <div className={`h-1.5 rounded-full ${percent === 100 ? "bg-emerald-600" : "bg-gradient-to-r from-brand to-brand-teal"}`} style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{percent}%</span>
                    </div>
                  )}

                  <CourseAction course={c} viewer={viewer} percent={percent} done={done} />
                </div>
              </article>
            );
          })}
          {visible.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
              No courses match these filters.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
