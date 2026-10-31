import Link from "next/link";
import { IconBadge, IconBook, IconCheck, IconShield, IconSparkles } from "../Icons";

const steps = [
  { icon: IconSparkles, title: "Register free", body: "Create your account in under a minute." },
  { icon: IconShield, title: "Complete your profile", body: "Add your details, Aadhaar or PAN, and CV for verification." },
  { icon: IconCheck, title: "Get your courses", body: "Our team assigns the free or premium courses you request." },
  { icon: IconBook, title: "Learn at your pace", body: "Bite-sized lessons, scenarios and knowledge checks." },
  { icon: IconBadge, title: "Get certified", body: "Finish the courses, pass the exam, share your QR-verified certificate." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="section-title mt-4">From sign-up to certified in five steps</h2>
          <p className="mt-4 text-lg text-slate-600">A verified, guided path — so every certificate we issue means something.</p>
        </div>
        <ol className="relative mt-14 grid gap-6 md:grid-cols-5">
          <span className="absolute top-7 right-[10%] left-[10%] hidden h-0.5 bg-gradient-to-r from-brand via-brand-teal to-accent md:block" aria-hidden="true" />
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="relative text-center">
              <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-900 text-white shadow-lg ring-4 ring-slate-50">
                <Icon className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold">{i + 1}</span>
              </span>
              <p className="mt-4 font-display font-semibold text-navy-900">{title}</p>
              <p className="mt-1 text-sm text-slate-600">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <Link href="/register" className="btn-primary px-6 py-3">Start step 1 — it’s free</Link>
        </div>
      </div>
    </section>
  );
}
