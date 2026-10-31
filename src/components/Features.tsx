import Link from "next/link";
import { IconArrowRight, IconBadge, IconBook, IconCheck, IconTimer } from "./Icons";

const pillars = [
  {
    icon: IconBook,
    title: "Learn Modern Pedagogy",
    body: "Bite-sized interactive modules you can finish between classes.",
    points: ["AI in the classroom", "Active learning rubrics", "Differentiated instruction"],
    tone: "bg-sky-50 text-brand-ink ring-sky-100",
  },
  {
    icon: IconTimer,
    title: "Rigorous Online Exams",
    body: "Assessments built to mirror real classroom decision-making.",
    points: ["Timed, auto-submitted exams", "Scenario-based questions, shuffled per attempt", "Limited attempts with a retake cool-down"],
    tone: "bg-cyan-50 text-brand-teal ring-cyan-100",
  },
  {
    icon: IconBadge,
    title: "Verifiable Certificates",
    body: "Credentials that school hiring committees can trust and check in seconds.",
    points: ["Issued the moment you pass", "Unique QR verification codes", "One-click “Add to LinkedIn profile”"],
    tone: "bg-orange-50 text-accent-strong ring-orange-100",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">The platform</span>
          <h2 className="section-title mt-4">One platform to train, test, and certify</h2>
          <p className="mt-4 text-lg text-slate-600">
            Go from professional learning to a verified credential without juggling tools, vendors, or paperwork.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body, points, tone }, i) => (
            <article key={title} className="card card-hover group p-8">
              <div className="flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-xl ring-1 ${tone}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-display text-4xl font-bold text-slate-100 transition-colors group-hover:text-slate-200">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-slate-600">{body}</p>
              <ul className="mt-6 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" /> {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/courses" className="btn-secondary px-6 py-3">
            Browse all courses <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
