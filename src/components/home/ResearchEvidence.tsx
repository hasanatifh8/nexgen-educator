import Link from "next/link";
import { NEP_2020, NEP_QUOTES, NOT_AFFILIATED, UNESCO_AI_TEACHERS, UNESCO_FINDINGS, cite } from "@/lib/research";
import { finderHref } from "@/lib/courseFinder";
import { IconArrowRight, IconBook, IconLink } from "../Icons";

/**
 * Published evidence behind the “why now” story, quoted verbatim with links. No logos and no implied
 * endorsement — see the rules in lib/research.ts.
 */
export default function ResearchEvidence() {
  return (
    <section id="research" aria-labelledby="research-title" className="border-y border-slate-200 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow"><IconBook className="h-3.5 w-3.5" /> What the research says</span>
          <h2 id="research-title" className="section-title mt-4">It’s not just you. Policy and global research agree.</h2>
          <p className="section-lede">Teachers everywhere are being asked to learn new skills — and many have not been given the training to do it.</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* UNESCO */}
          <figure className="card flex flex-col p-7 sm:p-8">
            <p className="text-xs font-bold tracking-wide text-brand-ink uppercase">Global research · {UNESCO_AI_TEACHERS.year}</p>
            <blockquote className="mt-4 flex-1 font-display text-xl leading-snug font-semibold text-balance text-navy-900 sm:text-2xl">
              “…{UNESCO_FINDINGS.gap}.”
            </blockquote>
            <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm text-slate-600">
                The framework sets out <span className="font-semibold text-navy-900">{UNESCO_FINDINGS.scope}</span> that teachers need in the age of AI:
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {UNESCO_FINDINGS.dimensions.map((d) => (
                  <li key={d} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-900 ring-1 ring-slate-200">{d}</li>
                ))}
              </ul>
            </div>
            <figcaption className="mt-5 text-sm text-slate-500">
              Source:{" "}
              <a href={UNESCO_AI_TEACHERS.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-ink hover:underline">
                {cite(UNESCO_AI_TEACHERS)} <IconLink className="h-3.5 w-3.5" />
              </a>
            </figcaption>
          </figure>

          {/* NEP 2020 */}
          <figure className="card flex flex-col p-7 sm:p-8">
            <p className="text-xs font-bold tracking-wide text-accent-strong uppercase">India’s education policy · {NEP_2020.year}</p>
            <blockquote className="mt-4 flex-1 font-display text-xl leading-snug font-semibold text-balance text-navy-900 sm:text-2xl">
              “{NEP_QUOTES.teachers}.”
            </blockquote>
            <div className="mt-6 rounded-xl bg-orange-50/60 p-4 ring-1 ring-orange-100">
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-navy-900">What this means for you:</span> professional development is now an expectation, not an extra.
                Short, self-paced courses with a certificate are the simplest way to make those hours count — and to show them.
              </p>
            </div>
            <figcaption className="mt-5 text-sm text-slate-500">
              Source:{" "}
              <a href={NEP_2020.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-ink hover:underline">
                {cite(NEP_2020)} <IconLink className="h-3.5 w-3.5" />
              </a>
            </figcaption>
          </figure>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Link href={finderHref()} className="btn-primary px-6 py-3">
            Find the course that fills your gap <IconArrowRight className="h-4 w-4" />
          </Link>
          <p className="max-w-2xl text-xs text-slate-400">{NOT_AFFILIATED}</p>
        </div>
      </div>
    </section>
  );
}
