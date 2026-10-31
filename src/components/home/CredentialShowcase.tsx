"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import Certificate from "../Certificate";
import { coursesFor, priceShort, type CourseOutline, type PublicProgram } from "@/lib/catalog";
import { OUTCOME_QUOTES } from "@/lib/marketing";
import type { SiteSettings } from "@/lib/siteSettings";
import { LEVEL_STYLES } from "@/lib/styles";
import { IconArrowRight, IconBadge, IconBook, IconCheck, IconClock, IconTimer } from "../Icons";

type Props = { programs: PublicProgram[]; courses: CourseOutline[]; settings: SiteSettings };

/** Interactive program cards → curriculum path, competency breakdown and a live preview of the certificate. */
export default function CredentialShowcase({ programs, courses, settings }: Props) {
  const listed = useMemo(() => programs.filter((p) => coursesFor(courses, p.id).length > 0), [programs, courses]);
  const [selectedId, setSelectedId] = useState(listed[0]?.id);
  const uid = useId();
  const program = listed.find((p) => p.id === selectedId) ?? listed[0];
  if (!program) return null;

  const inProgram = coursesFor(courses, program.id);
  const hours = inProgram.reduce((h, c) => h + c.hours, 0);
  const competencies = [...new Set(inProgram.flatMap((c) => c.outcomes))].slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <section id="credentials" aria-labelledby="credentials-title" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Certification programs</span>
          <h2 id="credentials-title" className="section-title mt-4">Preview the credential before you start</h2>
          <p className="section-lede">{OUTCOME_QUOTES[2].quote} Pick a program to see its path, the competencies it assesses and the certificate you’ll earn.</p>
        </div>

        {/* Program cards (radio-group semantics: one program is always selected) */}
        <div role="radiogroup" aria-label="Certification programs" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listed.map((p) => {
            const active = p.id === program.id;
            const n = coursesFor(courses, p.id).length;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-controls={`${uid}-detail`}
                onClick={() => setSelectedId(p.id)}
                className={`card group relative flex flex-col p-5 text-left ${
                  active ? "ring-2 ring-brand-ink shadow-card-hover" : "card-hover hover:border-slate-300"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${LEVEL_STYLES[p.level]}`}>{p.level}</span>
                  <span className={`text-xs font-bold ${p.price === 0 ? "text-emerald-700" : "text-orange-700"}`}>{priceShort(p.price)}</span>
                </span>
                <span className="mt-3 font-display text-lg leading-snug font-semibold text-navy-900">{p.title}</span>
                <span className="mt-1 text-xs text-slate-600">{p.category}</span>
                <span className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1"><IconBook className="h-4 w-4" /> {n} course{n === 1 ? "" : "s"}</span>
                  <span className="flex items-center gap-1"><IconClock className="h-4 w-4" /> {coursesFor(courses, p.id).reduce((h, c) => h + c.hours, 0)} hrs</span>
                </span>
                {active && (
                  <span className="absolute top-4 right-4 hidden h-6 w-6 place-items-center rounded-full bg-brand-ink text-white sm:grid">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div id={`${uid}-detail`} aria-live="polite" className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.25fr]">
          <div className="card p-6 sm:p-8">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Your path to certification</p>
            <h3 className="mt-1 font-display text-2xl font-bold text-navy-900">{program.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{program.description}</p>

            {/* Visual curriculum path */}
            <ol className="relative mt-6 space-y-4 before:absolute before:top-3 before:bottom-3 before:left-[15px] before:w-0.5 before:bg-gradient-to-b before:from-brand before:via-brand-teal before:to-accent">
              {inProgram.map((c, i) => (
                <li key={c.id} className="relative flex gap-4">
                  <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white ring-4 ring-white">{i + 1}</span>
                  <div className="min-w-0 pt-1">
                    <Link href={`/courses/${c.id}`} className="font-semibold text-navy-900 hover:text-brand-ink hover:underline">{c.title}</Link>
                    <p className="text-xs text-slate-600">{c.hours} hrs · {c.lessonCount} lessons · {c.level}</p>
                  </div>
                </li>
              ))}
              {program.exam.questionCount > 0 && (
                <li className="relative flex gap-4">
                  <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-100 text-brand-ink ring-4 ring-white"><IconTimer className="h-4 w-4" /></span>
                  <div className="pt-1">
                    <p className="font-semibold text-navy-900">Certification exam</p>
                    <p className="text-xs text-slate-600">{program.exam.questionCount} scenario questions · {program.exam.minutes} min · {program.exam.passPercent}% to pass</p>
                  </div>
                </li>
              )}
              <li className="relative flex gap-4">
                <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-strong text-white ring-4 ring-white"><IconBadge className="h-4 w-4" /></span>
                <div className="pt-1">
                  <p className="font-semibold text-navy-900">Verifiable credential</p>
                  <p className="text-xs text-slate-600">QR-verified certificate · PDF download · Add to LinkedIn</p>
                </div>
              </li>
            </ol>

            {competencies.length > 0 && (
              <>
                <p className="mt-8 text-xs font-bold tracking-wide text-slate-500 uppercase">Core competencies assessed</p>
                <ul className="mt-3 grid gap-2">
                  {competencies.map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm text-slate-700">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {o}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/courses/${inProgram[0].id}`} className="btn-primary">
                Start with {inProgram.length > 1 ? "course 1" : "this course"} <IconArrowRight className="h-4 w-4" />
              </Link>
              <p className="self-center text-xs text-slate-600">{hours} hours total · self-paced</p>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Certificate
              settings={settings}
              data={{ name: "Your Name Here", title: program.title, score: 9, total: 10, credentialId: `SAMPLE-${year}-PREVIEW`, issuedOn: `Issued ${year}`, sample: true }}
            />
            <p className="mt-4 text-center text-sm text-slate-600">
              Live preview · your certificate carries your name, score, issue date and a unique QR code employers can scan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
