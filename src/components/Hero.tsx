import Link from "next/link";
import { Suspense } from "react";
import { HeroCertificate } from "./home/HomeCatalog";
import { HERO, OUTCOME_QUOTES, PARTNERS, PROOF_STATS } from "@/lib/marketing";
import { IconArrowRight, IconBadge, IconCheck, IconShield, IconSparkles } from "./Icons";

/** Facts about the credential itself — always true, so safe to show before there are learner numbers. */
const credentialFacts = [
  { value: "QR", label: "Verification on every certificate" },
  { value: "ID-checked", label: "Holders verified before issue" },
  { value: "Timed", label: "Scenario-based final exams" },
  { value: "Instant", label: "Issued the moment you pass" },
];

export default function Hero() {
  const stats = PROOF_STATS.length ? PROOF_STATS : credentialFacts;
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-48 -left-24 h-[24rem] w-[24rem] rounded-full bg-brand-teal/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:pt-24 lg:pb-28">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200">
            <IconSparkles className="h-4 w-4 text-accent" /> {HERO.eyebrow}
          </span>
          <h1 className="mt-6 font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {HERO.headline}{" "}
            <span className="bg-gradient-to-r from-brand to-brand-teal bg-clip-text text-transparent">{HERO.headlineAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-slate-300">{HERO.lede}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses" className="btn-primary px-6 py-3.5 text-base">
              Explore certifications <IconArrowRight className="h-4 w-4" />
            </Link>
            <a href="#finder" className="btn-ghost-dark px-6 py-3.5 text-base">Find my program in 30 seconds</a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
            {["Free to register", "Free & paid courses", "Add to LinkedIn in one click"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <IconCheck className="h-4 w-4 text-brand-teal" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: the real certificate, plus what a hiring committee sees when they scan its QR code */}
        <div className="relative mx-auto w-full max-w-lg pb-16 sm:pb-10 lg:max-w-none" aria-hidden="true">
          <div className="absolute inset-6 -z-0 rounded-full bg-gradient-to-tr from-brand/40 via-brand-teal/20 to-accent/30 blur-3xl" />

          {/* Certificate */}
          <div className="animate-float relative">
            <div className="-rotate-3 rounded-xl ring-1 ring-white/20 transition-transform duration-700 hover:rotate-0">
              <Suspense fallback={<div className="aspect-[297/210] w-full animate-pulse rounded-xl bg-white/10" />}>
                <HeroCertificate />
              </Suspense>
            </div>
          </div>

          {/* LinkedIn chip */}
          <div className="animate-float-slow absolute -top-5 right-2 flex items-center gap-2.5 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-navy-900 shadow-xl shadow-black/30 sm:right-10">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0a66c2] text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
              </svg>
            </span>
            <span className="text-xs leading-tight">
              <span className="block font-bold">Added to LinkedIn</span>
              <span className="text-slate-600">Licenses &amp; certifications</span>
            </span>
          </div>

          {/* Phone: verification result after scanning the QR */}
          <div className="animate-float-slow absolute right-0 -bottom-2 w-40 rotate-3 rounded-[2rem] bg-navy-950 p-2 shadow-2xl shadow-black/50 ring-1 ring-white/15 sm:-right-4 sm:w-48">
            <div className="relative overflow-hidden rounded-[1.6rem] bg-white px-3.5 pt-5 pb-4 text-navy-900">
              <span className="absolute top-1.5 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-navy-950/90" />
              <span className="animate-scan absolute inset-x-3 h-0.5 rounded-full bg-gradient-to-r from-transparent via-brand-teal to-transparent shadow-[0_0_12px_2px] shadow-brand-teal/60" />
              <span className="mx-auto mt-2 grid h-11 w-11 place-items-center rounded-full bg-emerald-600 text-white ring-4 ring-emerald-100">
                <IconCheck className="h-6 w-6" />
              </span>
              <p className="mt-2.5 text-center font-display text-sm font-bold">Credential verified</p>
              <p className="text-center text-[10px] text-slate-600">Scanned from QR · just now</p>
              <dl className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-2.5 text-[10px] ring-1 ring-slate-100">
                {[["Holder", "Priya Sharma"], ["Program", "AI-Ready Educator"], ["Score", "92%"], ["ID check", "Passed"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="truncate font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-brand-ink">
                <IconShield className="h-3 w-3" /> NextGen Educator
              </p>
            </div>
          </div>

          {/* Career-outcome quote */}
          <figure className="animate-float absolute bottom-0 -left-2 max-w-[14rem] rounded-xl border border-white/10 bg-navy-800/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-8 sm:max-w-[16rem]">
            <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-accent uppercase">
              <IconBadge className="h-3.5 w-3.5" /> {OUTCOME_QUOTES[0].context}
            </span>
            <blockquote className="mt-1 text-sm leading-snug font-semibold text-white">“{OUTCOME_QUOTES[0].quote}”</blockquote>
          </figure>
        </div>
      </div>

      {/* Trust strip */}
      <div className="relative border-t border-white/10 bg-navy-950/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {PARTNERS.length > 0 && (
            <>
              <p className="text-center text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Trusted by schools including</p>
              <ul className="mt-5 mb-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                {PARTNERS.map((n) => (
                  <li key={n} className="font-display text-sm font-semibold text-slate-300">{n}</li>
                ))}
              </ul>
            </>
          )}
          <dl className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-center">
                <dt className="mt-1 text-sm text-slate-300">{s.label}</dt>
                <dd className="font-display text-2xl font-bold text-white sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
