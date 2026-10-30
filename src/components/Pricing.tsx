import { IconCheck } from "./Icons";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    desc: "Explore the platform and benchmark your skills.",
    features: ["Free diagnostic assessment", "2 intro modules", "Practice quizzes", "Community forum access"],
    cta: "Start Free Assessment",
    href: "#practice-tests",
    featured: false,
  },
  {
    name: "Educator Pro",
    price: "$19",
    period: "per month",
    desc: "Everything you need to earn verified credentials.",
    features: ["Full course catalog", "Unlimited proctored exams", "Verifiable QR certificates", "LinkedIn & resume sharing", "Priority support"],
    cta: "Get Educator Pro",
    href: "#",
    featured: true,
  },
  {
    name: "Institution",
    price: "Custom",
    period: "volume pricing",
    desc: "For schools, districts, and training networks.",
    features: ["Everything in Pro", "Admin & analytics dashboard", "Custom exam authoring", "SSO & LMS integration", "Dedicated success manager"],
    cta: "Contact Sales",
    href: "#institutions",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="section-title mt-4">Simple plans for every educator</h2>
          <p className="mt-4 text-lg text-slate-600">Start free. Upgrade when you’re ready to certify.</p>
        </div>
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`card relative flex flex-col p-8 ${p.featured ? "border-brand ring-2 ring-brand lg:-translate-y-3 lg:shadow-card-hover" : "card-hover"}`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-navy-900">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
              <p className="mt-6">
                <span className="font-display text-4xl font-bold text-navy-900">{p.price}</span>
                <span className="ml-2 text-sm text-slate-500">{p.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {f}
                  </li>
                ))}
              </ul>
              <a href={p.href} className={`mt-8 w-full ${p.featured ? "btn-primary" : "btn-secondary"}`}>{p.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
