import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { IconBadge, IconBook, IconCheck, IconTimer } from "@/components/Icons";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create your account — NextGen Educator",
  description: "Register for free to access courses, practice tests, and verifiable teaching certifications.",
};

const perks = [
  { icon: IconBook, title: "Free starter modules", body: "Begin learning modern pedagogy today." },
  { icon: IconTimer, title: "Practice tests", body: "Timed, scenario-based diagnostics." },
  { icon: IconBadge, title: "Verifiable credentials", body: "QR-verified certificates for your resume." },
];

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:px-8 lg:py-20">
          <aside className="relative hidden overflow-hidden rounded-3xl bg-navy-900 p-10 text-white lg:block">
            <div className="bg-grid absolute inset-0" aria-hidden="true" />
            <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase">Train. Test. Certify.</p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight">Join 10,000+ certified educators.</h2>
              <ul className="mt-10 space-y-6">
                {perks.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-teal">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-slate-300">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <figure className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
                <blockquote className="text-sm leading-relaxed text-slate-200">
                  “The AI Tools course saved me hours of planning every week — and the certificate helped me land a coaching role.”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <IconCheck className="h-4 w-4 text-brand-teal" /> Sample testimonial · Grade 8 Science Teacher
                </figcaption>
              </figure>
            </div>
          </aside>

          <section className="card p-6 sm:p-10">
            <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900">Create your free account</h1>
            <p className="mt-2 text-slate-600">No credit card required. Takes less than a minute.</p>
            <div className="mt-8">
              <Suspense fallback={<div className="h-[640px] animate-pulse rounded-xl bg-slate-100" />}>
                <RegisterForm />
              </Suspense>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
