import type { Metadata } from "next";
import Link from "next/link";
import AiToolBadge from "@/components/AiToolBadge";
import Footer from "@/components/Footer";
import { IconArrowRight, IconCheck, IconInfo, IconLink, IconSparkles } from "@/components/Icons";
import SiteHeader from "@/components/SiteHeader";
import { AI_RESOURCES, CHECKED_ON, TRADEMARK_NOTICE } from "@/lib/aiResources";
import { finderHref } from "@/lib/courseFinder";
import { ORG } from "@/lib/organization";

export const metadata: Metadata = {
  title: "Free AI courses for teachers from Claude, ChatGPT, Gemini and Copilot",
  description:
    "A simple guide to the free AI-learning courses that Anthropic (Claude), OpenAI (ChatGPT), Google (Gemini) and Microsoft (Copilot) offer teachers — with links to the official pages.",
  alternates: { canonical: "/free-ai-learning" },
};

const different = [
  ["Made for Indian classrooms", "CBSE and ICSE examples, Indian classrooms and NEP 2020 — not a generic global course."],
  ["Simple English, step by step", "Written for teachers who are new to technology, with 10–15 minute lessons you can finish on your phone."],
  ["A certificate schools can verify", "Every certificate has a QR code and credential ID that any principal can check in seconds."],
  ["A real person to help", "Our team calls you, answers your questions and helps you choose the right course."],
];

export default function FreeAiLearningPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-navy-900 py-16 text-white lg:py-20">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200 uppercase">
              <IconSparkles className="h-4 w-4 text-accent" /> Free resources · for information
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              Free AI courses from the companies that make the tools
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
              The makers of Claude, ChatGPT, Gemini and Copilot each offer free courses for teachers. Here they are in one place, with links to the official pages.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-3">
              {AI_RESOURCES.map((r) => (
                <li key={r.id} className="flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-navy-900">
                  <AiToolBadge r={r} size="sm" /> {r.tool}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {AI_RESOURCES.map((r) => (
                <li key={r.id} className="card flex flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-4">
                    <AiToolBadge r={r} />
                    <div>
                      <p className="font-display text-lg font-bold text-navy-900">{r.tool}</p>
                      <p className="text-sm text-slate-500">by {r.company}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-xs font-bold tracking-wide text-brand-ink uppercase">{r.note ? "Official resource" : "Free course for teachers"}</p>
                  <p className="mt-1 font-display text-xl leading-snug font-semibold text-navy-900">{r.course}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {r.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {d}
                      </li>
                    ))}
                  </ul>
                  {r.note && (
                    <p className="mt-4 flex gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-900 ring-1 ring-amber-200">
                      <IconInfo className="mt-0.5 h-4 w-4 shrink-0" /> {r.note}
                    </p>
                  )}
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6 w-full">
                    Open on {r.urlLabel} <IconLink className="h-4 w-4" />
                  </a>
                </li>
              ))}
              <li className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-700 p-7 text-white">
                <p className="font-display text-xl font-bold">Not sure where to begin?</p>
                <p className="mt-2 text-sm text-slate-300">Answer three quick questions and we’ll suggest the right course for you — ours or theirs, start where you’re comfortable.</p>
                <Link href={finderHref()} className="btn-primary mt-5">Find my course <IconArrowRight className="h-4 w-4" /></Link>
              </li>
            </ul>
            <p className="mt-6 text-center text-xs text-slate-500">
              Details checked in {CHECKED_ON}. Courses are run by their providers, mostly in English, and may change — please check the provider’s page.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Learn with both</span>
              <h2 className="section-title mt-4">Free tool courses teach the tool. We teach you to teach with it.</h2>
              <p className="section-lede">These courses are a great complement to NextGen Educator. Here is what we add for teachers in India.</p>
            </div>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {different.map(([t, b]) => (
                <li key={t} className="card p-6">
                  <IconCheck className="h-6 w-6 text-brand-ink" />
                  <p className="mt-3 font-display font-semibold text-navy-900">{t}</p>
                  <p className="mt-1 text-sm text-slate-600">{b}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary px-6 py-3">Start learning free <IconArrowRight className="h-4 w-4" /></Link>
              <Link href="/courses" className="btn-secondary px-6 py-3">See our courses</Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="trademarks" className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 id="trademarks" className="text-xs font-bold tracking-wide text-slate-500 uppercase">Trademark and copyright notice</h2>
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-500">
              {TRADEMARK_NOTICE.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
              <p>Contact: {ORG.phone.label}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
