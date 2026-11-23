import Link from "next/link";
import { FINDER_ROLES, finderHref, type FinderRole } from "@/lib/courseFinder";
import { IconArrowRight, IconCheck, IconSparkles } from "../Icons";

const roles = Object.keys(FINDER_ROLES) as FinderRole[];

/** Home-page invitation to the course finder: the first question is answered right here. */
export default function FinderCta() {
  return (
    <section id="finder" aria-labelledby="finder-cta-title" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200 uppercase">
                <IconSparkles className="h-4 w-4 text-accent" /> 30-second course finder
              </span>
              <h2 id="finder-cta-title" className="mt-5 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Not sure which course to choose? <span className="text-brand-teal">We’ll pick for you.</span>
              </h2>
              <p className="mt-4 text-lg text-slate-300">Answer three simple questions and get the courses that fit your role, your goal and your experience.</p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
                {["3 quick questions", "Personal recommendations", "Free to use"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-brand-teal" /> {t}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 text-navy-900 shadow-2xl shadow-black/30 sm:p-7">
              <p className="text-xs font-bold tracking-wide text-accent-strong uppercase">Question 1 of 3</p>
              <p className="mt-1 font-display text-xl font-semibold">I am a…</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {roles.map((r) => (
                  <Link key={r} href={finderHref({ role: r })}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-all hover:border-brand hover:bg-sky-50 hover:text-brand-ink">
                    {FINDER_ROLES[r]}
                    <IconArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-ink" />
                  </Link>
                ))}
              </div>
              <Link href={finderHref()} className="btn-primary mt-5 w-full py-3">
                Find my course <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
