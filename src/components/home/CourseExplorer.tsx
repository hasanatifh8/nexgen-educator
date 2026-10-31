"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, priceShort, type Category, type CourseOutline, type PublicProgram } from "@/lib/catalog";
import { CATEGORY_ACCENT, LEVEL_STYLES } from "@/lib/styles";
import EnquiryDialog from "../EnquiryDialog";
import { IconArrowRight, IconBadge, IconBook, IconCheck, IconChevronDown, IconClock } from "../Icons";

const TABS = ["All", ...CATEGORIES] as const;

export default function CourseExplorer({ courses, programs }: { courses: CourseOutline[]; programs: PublicProgram[] }) {
  const [tab, setTab] = useState<"All" | Category>("All");
  const byId = Object.fromEntries(programs.map((p) => [p.id, p]));
  const listed = courses.filter((c) => byId[c.programId]);
  const shown = listed.filter((c) => tab === "All" || c.category === tab).slice(0, tab === "All" ? 6 : undefined);
  const lessons = listed.reduce((n, c) => n + c.lessonCount, 0);

  return (
    <section id="explore" className="border-t border-slate-200 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Explore the catalog</span>
            <h2 className="section-title mt-4">See exactly what you’ll learn</h2>
            <p className="mt-4 text-lg text-slate-600">
              {listed.length} courses · {lessons} lessons · {programs.filter((p) => p.price === 0).length} free certification programs. Open any course to see its full syllabus.
            </p>
          </div>
          <div role="tablist" aria-label="Course categories" className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${tab === t ? "bg-navy-900 text-white shadow-md" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-navy-900"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => {
            const p = byId[c.programId];
            return (
              <article key={c.id} className="card card-hover animate-fade-up flex flex-col overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${CATEGORY_ACCENT[c.category]}`} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-brand-ink">{c.category}</span>
                    {p.price === 0
                      ? <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">Free</span>
                      : <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700 ring-1 ring-orange-100">{priceShort(p.price)}</span>}
                  </div>
                  <h3 className="mt-3 font-display text-lg leading-snug font-semibold text-navy-900">
                    <Link href={`/courses/${c.id}`} className="hover:text-brand-ink">{c.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{c.blurb}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><IconClock className="h-4 w-4" /> {c.hours} hrs</span>
                    <span className="flex items-center gap-1.5"><IconBook className="h-4 w-4" /> {c.lessonCount} lessons</span>
                    <span className={`rounded-full px-2 py-0.5 font-semibold ring-1 ${LEVEL_STYLES[c.level]}`}>{c.level}</span>
                  </div>

                  {c.outcomes.length > 0 && (
                    <ul className="mt-5 space-y-2">
                      {c.outcomes.slice(0, 3).map((o) => (
                        <li key={o} className="flex gap-2 text-sm text-slate-700"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {o}</li>
                      ))}
                    </ul>
                  )}

                  {c.syllabus.length > 0 && (
                    <details className="group mt-5 rounded-xl bg-slate-50 ring-1 ring-slate-100">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                        What’s covered · {c.syllabus.length} modules
                        <IconChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <ol className="space-y-3 px-4 pb-4">
                        {c.syllabus.map((m, i) => (
                          <li key={m.title + i}>
                            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Module {i + 1} · {m.title}</p>
                            <ul className="mt-1 space-y-1">
                              {m.lessons.map((l, j) => (
                                <li key={l.title + j} className="flex justify-between gap-3 text-sm text-slate-700">
                                  <span>{l.title}</span><span className="shrink-0 text-xs text-slate-400">{l.minutes}m</span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ol>
                    </details>
                  )}

                  <div className="mt-auto pt-5">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-navy-900"><IconBadge className="h-4 w-4 text-accent-strong" /> {p.title}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <EnquiryDialog courseId={c.id} courseTitle={c.title} className="btn-primary px-3" />
                      <Link href={`/courses/${c.id}`} className="btn-secondary px-3">Syllabus <IconArrowRight className="h-4 w-4" /></Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/courses" className="btn-primary px-6 py-3">Browse all {listed.length} courses</Link>
          <a href="#finder" className="btn-secondary px-6 py-3">Help me choose</a>
        </div>
      </div>
    </section>
  );
}
