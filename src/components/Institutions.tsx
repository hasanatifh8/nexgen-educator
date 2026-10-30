import { IconArrowRight, IconBuilding, IconCheck } from "./Icons";

const benefits = [
  "Bulk seat licensing & cohort management",
  "Admin dashboard with staff progress analytics",
  "Custom exams aligned to your PD framework",
  "SSO, LMS integrations & co-branded certificates",
];

export default function Institutions() {
  return (
    <section id="institutions" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-14 text-white sm:px-12 lg:px-16">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div className="absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200 uppercase">
                <IconBuilding className="h-4 w-4" /> For schools & districts
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">Upskill your entire faculty — and prove it.</h2>
              <p className="mt-4 text-lg text-slate-300">
                Roll out professional development at scale with measurable outcomes and credentials your teachers will actually value.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#" className="btn-primary px-6 py-3">Request a Demo <IconArrowRight className="h-4 w-4" /></a>
                <a href="#pricing" className="btn-ghost-dark px-6 py-3">See Institution Plans</a>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <IconCheck className="h-5 w-5 text-brand-teal" />
                  <p className="mt-3 text-sm font-medium text-slate-200">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
