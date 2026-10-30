import { IconArrowRight, IconBadge, IconCheck, IconSparkles } from "./Icons";

const stats = [
  { value: "10,000+", label: "Educators Certified" },
  { value: "98%", label: "Pass Rate" },
  { value: "45+", label: "Countries" },
  { value: "4.9/5", label: "Learner Rating" },
];

const networks = ["Global Schools Alliance", "EduTrust Network", "Metro Academies", "Horizon Learning", "BrightPath Schools"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-48 -left-24 h-[24rem] w-[24rem] rounded-full bg-brand-teal/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:pt-24 lg:pb-28">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200">
            <IconSparkles className="h-4 w-4 text-accent" /> New: AI in the Classroom Certification
          </span>
          <h1 className="mt-6 font-display text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Master Modern Pedagogy &{" "}
            <span className="bg-gradient-to-r from-brand to-brand-teal bg-clip-text text-transparent">AI-Powered Teaching.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Empowering educators with practical skills, rigorous online assessments, and globally recognized teaching credentials.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#certifications" className="btn-primary px-6 py-3.5 text-base">
              Explore Certification Programs <IconArrowRight className="h-4 w-4" />
            </a>
            <a href="#practice-tests" className="btn-ghost-dark px-6 py-3.5 text-base">Take Diagnostic Quiz</a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
            {["No credit card required", "Self-paced modules", "Shareable credentials"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <IconCheck className="h-4 w-4 text-brand-teal" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: certificate + progress mock */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
          <div className="rotate-1 rounded-2xl bg-white p-6 text-navy-900 shadow-2xl shadow-black/30 transition-transform duration-500 hover:rotate-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Certificate of Completion</span>
              <IconBadge className="h-7 w-7 text-accent" />
            </div>
            <p className="mt-5 font-display text-2xl font-bold">AI Tools for Teachers</p>
            <p className="mt-1 text-sm text-slate-500">Awarded to <span className="font-semibold text-navy-900">Jordan Rivera</span></p>
            <div className="mt-6 space-y-3">
              {[
                ["Prompting for Lesson Design", 100],
                ["AI Feedback & Grading Ethics", 100],
                ["Adaptive Learning Pathways", 86],
              ].map(([label, pct]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>{label}</span><span>{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-brand to-brand-teal" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span>ID: NGE-2026-48A1F</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600"><IconCheck className="h-4 w-4" /> Verified</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-xl border border-white/10 bg-navy-800/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-8">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 font-display text-lg font-bold text-accent">92</span>
            <div className="text-sm">
              <p className="font-semibold">Diagnostic Score</p>
              <p className="text-xs text-slate-400">Top 8% of educators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="relative border-t border-white/10 bg-navy-950/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Recognized by leading school networks</p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {networks.map((n) => (
              <li key={n} className="font-display text-sm font-semibold text-slate-400/80 transition-colors hover:text-white">{n}</li>
            ))}
          </ul>
          <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-bold text-white">{s.value}</dd>
                <dd className="mt-1 text-sm text-slate-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
