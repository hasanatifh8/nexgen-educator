"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { priceShort, type CourseOutline } from "@/lib/catalog";
import { FINDER_GOALS, FINDER_LEVELS, FINDER_ROLES, recommendCourses, type FinderAnswers, type FinderGoal, type FinderLevel, type FinderRole } from "@/lib/courseFinder";
import { LEVEL_STYLES } from "@/lib/styles";
import EnquiryDialog from "./EnquiryDialog";
import { IconArrowRight, IconCheck, IconClock, IconRefresh, IconShield, IconSparkles } from "./Icons";

const keys = <T extends string>(o: Record<T, unknown>) => Object.keys(o) as T[];

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${selected ? "border-brand-teal bg-brand-teal/15 text-white ring-2 ring-brand-teal/40" : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10"}`}>
      {children}
    </button>
  );
}

type Props = {
  courses: CourseOutline[];
  /** Answers pre-filled from the link, e.g. a “Find yourself here” card on the home page. */
  initial?: FinderAnswers;
  signedIn?: boolean;
};

export default function CourseFinder({ courses, initial = {}, signedIn = false }: Props) {
  const [a, setA] = useState<FinderAnswers>(initial);
  const done = a.role !== undefined && a.goal !== undefined && a.level !== undefined;
  const picks = done ? recommendCourses(courses, a as Required<FinderAnswers>) : [];
  const registerHref = `/register?courses=${picks.map((p) => p.c.id).join(",")}`;
  const resultsRef = useRef<HTMLDivElement>(null);
  const pickKey = picks.map((p) => p.c.id).join(",");

  // On phones the results sit below the questions: bring them into view once all three are answered.
  useEffect(() => {
    const el = resultsRef.current;
    if (!pickKey || !el || el.getBoundingClientRect().top < window.innerHeight * 0.6) return;
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, [pickKey]);

  return (
    <section id="finder" className="relative overflow-hidden bg-navy-900 py-14 text-white lg:py-20">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-brand-teal/20 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200 uppercase">
            <IconSparkles className="h-4 w-4 text-accent" /> 30-second course finder
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Which course is right for you?</h1>
          <p className="mt-4 text-lg text-slate-300">Answer three quick questions and we’ll match you with the best place to start.</p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-200">1. I am a…</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {keys(FINDER_ROLES).map((r: FinderRole) => <Choice key={r} selected={a.role === r} onClick={() => setA((s) => ({ ...s, role: r }))}>{FINDER_ROLES[r]}</Choice>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">2. I want to…</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {keys(FINDER_GOALS).map((g: FinderGoal) => (
                  <Choice key={g} selected={a.goal === g} onClick={() => setA((s) => ({ ...s, goal: g }))}>
                    <span className="block font-semibold">{FINDER_GOALS[g].label}</span>
                    <span className="text-xs text-slate-400">{FINDER_GOALS[g].hint}</span>
                  </Choice>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">3. My experience with it…</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {keys(FINDER_LEVELS).map((l: FinderLevel) => <Choice key={l} selected={a.level === l} onClick={() => setA((s) => ({ ...s, level: l }))}>{FINDER_LEVELS[l].label}</Choice>)}
              </div>
            </div>
          </div>
        </div>

        <div ref={resultsRef} className="scroll-mt-24 lg:pt-10">
          {!done ? (
            <div className="grid h-full min-h-80 place-items-center rounded-2xl border border-dashed border-white/20 p-8 text-center">
              <div>
                <IconSparkles className="mx-auto h-10 w-10 text-brand-teal" />
                <p className="mt-4 font-display text-xl font-semibold">Your recommendations appear here</p>
                <p className="mt-1 text-sm text-slate-400">{3 - [a.role, a.goal, a.level].filter((x) => x !== undefined).length} question(s) to go</p>
              </div>
            </div>
          ) : (
            <div className="animate-fade-up space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-xl font-semibold">Recommended for you</p>
                <button type="button" onClick={() => setA({})} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white">
                  <IconRefresh className="h-3.5 w-3.5" /> Start over
                </button>
              </div>
              {picks.map(({ c, reasons }, i) => {
                return (
                  <Link key={c.id} href={`/courses/${c.id}`} className="group block rounded-2xl bg-white p-5 text-navy-900 shadow-xl transition-transform hover:-translate-y-0.5">
                    <div className="flex items-start gap-4">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display font-bold ${i === 0 ? "bg-accent text-white" : "bg-slate-100 text-navy-900"}`}>{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        {i === 0 && <p className="text-xs font-bold tracking-wide text-accent uppercase">Best match</p>}
                        <p className="font-display text-lg leading-snug font-semibold group-hover:text-brand">{c.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{c.blurb}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className={`rounded-full px-2 py-0.5 font-semibold ring-1 ${LEVEL_STYLES[c.level]}`}>{c.level}</span>
                          <span className="flex items-center gap-1 text-slate-500"><IconClock className="h-3.5 w-3.5" /> {c.hours} hrs · {c.lessonCount} lessons</span>
                          <span className="font-semibold text-slate-700">{priceShort(c.price)}</span>
                        </div>
                        {reasons.length > 0 && (
                          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-emerald-700">
                            {reasons.map((r) => <span key={r} className="flex items-center gap-1"><IconCheck className="h-3.5 w-3.5" /> {r}</span>)}
                          </p>
                        )}
                      </div>
                      <IconArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                    </div>
                  </Link>
                );
              })}

              {/* Next step, right under the picks: enroll in exactly these courses */}
              <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-5 ring-1 ring-brand-teal/20 backdrop-blur">
                {signedIn ? (
                  <>
                    <p className="font-display text-lg font-semibold">Ready to start?</p>
                    <p className="mt-1 text-sm text-slate-300">Open your best match and tap <span className="font-semibold text-white">Request access</span> or <span className="font-semibold text-white">Enroll now</span>.</p>
                    <Link href={`/courses/${picks[0]?.c.id ?? ""}`} className="btn-primary mt-4 w-full py-3.5 text-base">
                      Open my best match <IconArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="font-display text-lg font-semibold">Love these picks? Enroll in {picks.length === 1 ? "it" : `all ${picks.length}`} today.</p>
                    <p className="mt-1 text-sm text-slate-300">Create your free account — we’ll save these courses to your profile so you can start right away.</p>
                    <Link href={registerHref} className="btn-primary mt-4 w-full py-3.5 text-base">
                      Register free &amp; enroll <IconArrowRight className="h-4 w-4" />
                    </Link>
                    <EnquiryDialog
                      courses={picks.map((p) => ({ id: p.c.id, title: p.c.title }))}
                      source="course-finder"
                      label="Prefer to talk first? Request a call back"
                      className="btn-ghost-dark mt-2 w-full py-3"
                    />
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                      <IconShield className="h-3.5 w-3.5" /> Free registration · pay only for the courses you choose
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
