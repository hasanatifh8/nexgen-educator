import { TEACHER_WORRIES } from "@/lib/marketing";
import { IconAlert, IconArrowRight, IconCheck } from "../Icons";

/** Empathy first: name the visitor's career worries, then show there is a simple way forward. */
export default function TeacherWorries() {
  return (
    <section id="worries" aria-labelledby="worries-title" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Sound familiar?</span>
          <h2 id="worries-title" className="section-title mt-4">If you’ve been worried about your career, you’re not alone</h2>
          <p className="section-lede">
            Many experienced teachers across India feel the same way. Teaching is changing faster than ever, and
            nobody gave teachers the time or training to keep up.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {TEACHER_WORRIES.map((w) => (
            <li key={w.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-accent-strong">
                <IconAlert className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg leading-snug font-semibold text-navy-900">{w.title}</p>
                <p className="mt-1.5 text-slate-600">{w.body}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* The turn: from worry to a simple, achievable plan */}
        <div className="relative mt-10 overflow-hidden rounded-3xl bg-navy-900 px-6 py-10 text-white sm:px-10 lg:px-14">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-brand-teal/25 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="font-display text-2xl leading-snug font-bold text-balance sm:text-3xl">
                The good news: it’s not too late, and it’s not as hard as it looks.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-300">
                NEP 2020 expects every teacher to complete at least 50 hours of professional development each year. NextGen
                Educator turns those hours into skills you can use in class tomorrow, and a certificate you can show at your
                next interview or appraisal.
              </p>
            </div>
            <ul className="space-y-3">
              {["Simple English, no jargon", "One small lesson at a time", "A certificate that proves your skills"].map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium">
                  <IconCheck className="h-5 w-5 shrink-0 text-brand-teal" /> {t}
                </li>
              ))}
              <li>
                <a href="#made-for-you" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-200 hover:text-white">
                  See how we make it easy <IconArrowRight className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
