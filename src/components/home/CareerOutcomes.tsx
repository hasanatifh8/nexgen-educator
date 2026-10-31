import Link from "next/link";
import { CV_TRANSFORM, HIRING_SIGNALS, OUTCOME_QUOTES, TESTIMONIALS } from "@/lib/marketing";
import { IconArrowRight, IconCheck, IconShield, IconX } from "../Icons";

/** Career-outcome messaging: why the credential matters to a hiring committee. */
export default function CareerOutcomes() {
  return (
    <section id="outcomes" aria-labelledby="outcomes-title" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <span className="eyebrow">Career outcomes</span>
            <h2 id="outcomes-title" className="section-title mt-4">A credential a hiring committee can check — not just a line on your CV</h2>
            <p className="section-lede">
              School leaders see hundreds of applications claiming “strong classroom practice.” A verifiable credential, with a score
              and an issue date behind it, is evidence instead of an adjective.
            </p>
            <blockquote className="pull-quote mt-10">
              “{OUTCOME_QUOTES[1].quote}”
            </blockquote>
          </div>

          {/* CV before / after */}
          <div className="grid gap-4 sm:grid-cols-2" role="group" aria-label="How a CV changes with NextGen credentials">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">{CV_TRANSFORM.before.label}</p>
              <ul className="mt-4 space-y-3">
                {CV_TRANSFORM.before.lines.map((l) => (
                  <li key={l} className="flex gap-2.5 text-sm text-slate-600">
                    <IconX className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" /> {l}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-slate-500">Claims a panel has to take on trust.</p>
            </div>
            <div className="relative rounded-2xl bg-navy-900 p-6 text-white shadow-card-hover">
              <span className="absolute -top-3 right-5 rounded-full bg-accent-strong px-3 py-1 text-xs font-bold">Stands out</span>
              <p className="text-xs font-bold tracking-wide text-sky-200 uppercase">{CV_TRANSFORM.after.label}</p>
              <ul className="mt-4 space-y-3">
                {CV_TRANSFORM.after.lines.map((l) => (
                  <li key={l} className="flex gap-2.5 text-sm text-slate-100">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" /> {l}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-slate-300">Evidence a panel can verify before the interview.</p>
            </div>
          </div>
        </div>

        {/* What the employer can verify */}
        <div className="mt-20">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold text-navy-900">
            <IconShield className="h-6 w-6 text-brand-ink" aria-hidden="true" /> What a hiring committee can confirm
          </h3>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HIRING_SIGNALS.map((s, i) => (
              <li key={s.title} className="card p-6">
                <span className="font-display text-sm font-bold text-accent-strong">0{i + 1}</span>
                <p className="mt-2 font-display text-lg font-semibold text-navy-900">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link href="/verify" className="btn-secondary">
              See how verification works <IconArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-slate-600">Employers can check any credential at <span className="font-mono text-navy-900">/verify</span> — no account needed.</p>
          </div>
        </div>

        {TESTIMONIALS.length > 0 && (
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card flex flex-col p-6">
                <blockquote className="flex-1 text-slate-700">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-slate-100 pt-4 text-sm">
                  <span className="block font-semibold text-navy-900">{t.name}</span>
                  <span className="text-slate-500">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
