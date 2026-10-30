"use client";

import { useState } from "react";
import { IconBadge, IconClock, IconSignal } from "./Icons";

const CATEGORIES = ["All", "AI Tools for Teachers", "Assessment Design", "Classroom Management"] as const;
type Category = (typeof CATEGORIES)[number];
type Level = "Beginner" | "Intermediate" | "Advanced";

type Course = { title: string; category: Exclude<Category, "All">; duration: string; level: Level; cert: string; blurb: string; enrolled: string };

const COURSES: Course[] = [
  { title: "Generative AI Foundations for Educators", category: "AI Tools for Teachers", duration: "4 hrs", level: "Beginner", cert: "Certified AI-Ready Educator", blurb: "Use AI assistants to plan lessons, differentiate materials, and save hours each week.", enrolled: "3.2k" },
  { title: "Prompt Engineering for Lesson Design", category: "AI Tools for Teachers", duration: "6 hrs", level: "Intermediate", cert: "AI Lesson Design Specialist", blurb: "Craft prompts that produce standards-aligned activities, rubrics, and exemplars.", enrolled: "2.1k" },
  { title: "Ethics & Academic Integrity in the AI Era", category: "AI Tools for Teachers", duration: "3 hrs", level: "Advanced", cert: "AI Integrity Practitioner", blurb: "Build fair AI-use policies and redesign tasks that reward authentic thinking.", enrolled: "1.4k" },
  { title: "Designing Rubrics for Active Learning", category: "Assessment Design", duration: "5 hrs", level: "Beginner", cert: "Rubric Design Certificate", blurb: "Write criteria that measure the skills you actually teach — not just compliance.", enrolled: "2.8k" },
  { title: "Scenario-Based Question Writing", category: "Assessment Design", duration: "7 hrs", level: "Advanced", cert: "Assessment Author Credential", blurb: "Author MCQs that test judgment and application, with item-analysis basics.", enrolled: "980" },
  { title: "Formative Feedback That Moves Learning", category: "Assessment Design", duration: "4 hrs", level: "Intermediate", cert: "Feedback Literacy Certificate", blurb: "Give timely, actionable feedback at scale using peer and digital tools.", enrolled: "1.9k" },
  { title: "Positive Behavior Systems", category: "Classroom Management", duration: "5 hrs", level: "Beginner", cert: "Classroom Climate Certificate", blurb: "Set routines and expectations that prevent disruptions before they start.", enrolled: "3.6k" },
  { title: "Differentiated Instruction in Mixed-Ability Rooms", category: "Classroom Management", duration: "8 hrs", level: "Intermediate", cert: "Differentiation Specialist", blurb: "Plan tiered tasks, flexible grouping, and choice boards that work in practice.", enrolled: "2.4k" },
  { title: "Managing Hybrid & Online Classrooms", category: "Classroom Management", duration: "6 hrs", level: "Advanced", cert: "Hybrid Teaching Credential", blurb: "Keep remote and in-person learners equally engaged and accountable.", enrolled: "1.1k" },
];

const LEVEL_STYLES: Record<Level, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Intermediate: "bg-sky-50 text-sky-700 ring-sky-100",
  Advanced: "bg-orange-50 text-orange-700 ring-orange-100",
};

const CATEGORY_ACCENT: Record<Course["category"], string> = {
  "AI Tools for Teachers": "from-brand to-brand-teal",
  "Assessment Design": "from-navy-800 to-brand",
  "Classroom Management": "from-accent to-amber-400",
};

export default function CourseCatalog() {
  const [active, setActive] = useState<Category>("All");
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const visible = active === "All" ? COURSES : COURSES.filter((c) => c.category === active);

  return (
    <section id="courses" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Course catalog</span>
            <h2 className="section-title mt-4">Certification-ready courses</h2>
            <p className="mt-4 text-lg text-slate-600">Every course ends with a proctored exam and a verifiable digital credential.</p>
          </div>
          <p className="text-sm text-slate-500">{visible.length} courses</p>
        </div>

        <div role="tablist" aria-label="Course categories" className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                active === c
                  ? "bg-navy-900 text-white shadow-md shadow-navy-900/20"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-navy-900 hover:ring-slate-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => {
            const isEnrolled = enrolled.has(c.title);
            return (
              <article key={c.title} className="card card-hover animate-fade-up flex flex-col overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${CATEGORY_ACCENT[c.category]}`} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-brand">{c.category}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${LEVEL_STYLES[c.level]}`}>{c.level}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg leading-snug font-semibold text-navy-900">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600">{c.blurb}</p>

                  <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><IconClock className="h-4 w-4" /> {c.duration}</span>
                    <span className="flex items-center gap-1.5"><IconSignal className="h-4 w-4" /> {c.level}</span>
                    <span>{c.enrolled} enrolled</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-orange-50/70 px-3 py-2 ring-1 ring-orange-100">
                    <IconBadge className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-xs font-semibold text-navy-900">{c.cert}</span>
                  </div>

                  <button
                    onClick={() => setEnrolled((s) => new Set(s).add(c.title))}
                    disabled={isEnrolled}
                    className={`mt-5 w-full ${isEnrolled ? "btn bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 disabled:opacity-100" : "btn-primary"}`}
                  >
                    {isEnrolled ? "✓ Enrolled" : "Enroll Now"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
