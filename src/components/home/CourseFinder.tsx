"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { priceShort, type Category, type CourseOutline, type Level, type PublicProgram } from "@/lib/catalog";
import { LEVEL_STYLES } from "@/lib/styles";
import { IconArrowRight, IconCheck, IconClock, IconRefresh, IconSparkles } from "../Icons";

const ROLES = ["Classroom teacher", "Preschool / primary teacher", "School leader", "Instructional coach", "Student teacher"] as const;
const GOALS: { label: string; category: Category | null; hint: string }[] = [
  { label: "Use AI in my teaching", category: "AI Tools for Teachers", hint: "Plan faster, differentiate smarter" },
  { label: "Design better assessments", category: "Assessment Design", hint: "Rubrics, questions, feedback" },
  { label: "Run a calmer classroom", category: "Classroom Management", hint: "Routines, behavior, inclusion" },
  { label: "Teach young children (playgroup–Class 5)", category: "Early Years & Primary", hint: "Play, phonics, hands-on maths" },
  { label: "Not sure yet", category: null, hint: "Show me the best starting points" },
];
const LEVELS: { label: string; level: Level }[] = [
  { label: "I’m new to this", level: "Beginner" },
  { label: "I know the basics", level: "Intermediate" },
  { label: "I’m experienced", level: "Advanced" },
];
const RANK: Record<Level, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };

type Answers = { role?: string; goal?: number; level?: Level };

function recommend(courses: CourseOutline[], programs: Record<string, PublicProgram>, a: Required<Answers>) {
  const goal = GOALS[a.goal];
  return courses
    .map((c) => {
      const reasons: string[] = [];
      let score = 0;
      if (!goal.category || c.category === goal.category) { score += 4; if (goal.category) reasons.push("Matches your goal"); }
      const gap = Math.abs(RANK[c.level] - RANK[a.level]);
      score += gap === 0 ? 3 : gap === 1 ? 1 : -1;
      if (gap === 0) reasons.push("Right level for you");
      const free = c.price === 0;
      if (free) { score += a.role === "Student teacher" || !goal.category ? 1.5 : 0.5; reasons.push("Free"); }
      if (a.role === "School leader" && c.category === "Assessment Design") score += 1;
      if (a.role === "Preschool / primary teacher" && c.category === "Early Years & Primary") { score += 2; reasons.push("Made for early-years teachers"); }
      if (a.role === "Instructional coach" && c.level !== "Beginner") score += 0.5;
      if (c.lessonCount > 0) score += 0.5;
      return { c, score, reasons };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, 3);
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${selected ? "border-brand-teal bg-brand-teal/15 text-white ring-2 ring-brand-teal/40" : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10"}`}>
      {children}
    </button>
  );
}

export default function CourseFinder({ courses, programs }: { courses: CourseOutline[]; programs: PublicProgram[] }) {
  const [a, setA] = useState<Answers>({});
  const byId = useMemo(() => Object.fromEntries(programs.map((p) => [p.id, p])), [programs]);
  const done = a.role !== undefined && a.goal !== undefined && a.level !== undefined;
  const picks = done ? recommend(courses, byId, a as Required<Answers>) : [];

  return (
    <section id="finder" className="relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-brand-teal/20 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200 uppercase">
            <IconSparkles className="h-4 w-4 text-accent" /> 30-second course finder
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">Which course is right for you?</h2>
          <p className="mt-4 text-lg text-slate-300">Answer three quick questions and we’ll match you with the best place to start.</p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-200">1. I am a…</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {ROLES.map((r) => <Choice key={r} selected={a.role === r} onClick={() => setA((s) => ({ ...s, role: r }))}>{r}</Choice>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">2. I want to…</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {GOALS.map((g, i) => (
                  <Choice key={g.label} selected={a.goal === i} onClick={() => setA((s) => ({ ...s, goal: i }))}>
                    <span className="block font-semibold">{g.label}</span>
                    <span className="text-xs text-slate-400">{g.hint}</span>
                  </Choice>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">3. My experience with it…</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {LEVELS.map((l) => <Choice key={l.level} selected={a.level === l.level} onClick={() => setA((s) => ({ ...s, level: l.level }))}>{l.label}</Choice>)}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:pt-10">
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
              <Link href="/register" className="btn-primary w-full py-3.5 text-base">Register free to enroll</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
