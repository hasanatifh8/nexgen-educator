import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import CourseFinder from "@/components/CourseFinder";
import Footer from "@/components/Footer";
import { IconBadge, IconBook, IconPhone, IconShield, IconSparkles } from "@/components/Icons";
import SiteHeader from "@/components/SiteHeader";
import { toCourseOutline } from "@/lib/catalog";
import { getPublicCatalog } from "@/lib/catalogStore";
import { FINDER_PATH, parseFinderAnswers } from "@/lib/courseFinder";
import { getCurrentUser } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Find the right course for you",
  description:
    "Answer three quick questions and get the teacher training courses that fit your role, your goal and your experience — free and paid courses with a certificate.",
  alternates: { canonical: FINDER_PATH },
};

async function Finder({ searchParams }: { searchParams: PageProps<"/find-my-course">["searchParams"] }) {
  await connection(); // catalog changes from the admin portal must show immediately
  const [sp, { courses }, user] = await Promise.all([searchParams, getPublicCatalog(), getCurrentUser()]);
  return <CourseFinder courses={courses.map(toCourseOutline)} initial={parseFinderAnswers(sp)} signedIn={!!user} />;
}

const after = [
  { icon: IconSparkles, title: "Register free", body: "Your picked courses are saved to your account automatically." },
  { icon: IconShield, title: "Complete your profile", body: "A one-time step with your ID and CV, so your certificate is trusted." },
  { icon: IconPhone, title: "We help you start", body: "Our team unlocks your courses — and calls you first for paid ones." },
  { icon: IconBook, title: "Learn at your pace", body: "Short lessons on your phone, whenever you have a free moment." },
  { icon: IconBadge, title: "Get certified", body: "Pass the online exam and download your certificate the same day." },
];

export default function FindMyCoursePage({ searchParams }: PageProps<"/find-my-course">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="h-[44rem] animate-pulse bg-navy-900" />}>
          <Finder searchParams={searchParams} />
        </Suspense>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">After you choose</span>
              <h2 className="section-title mt-4">What happens next is simple</h2>
              <p className="section-lede">No technical skills needed. We guide you at every step.</p>
            </div>
            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {after.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="card p-6">
                  <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-sky-50 text-brand-ink ring-1 ring-sky-100">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-white">{i + 1}</span>
                  </span>
                  <p className="mt-4 font-display font-semibold text-navy-900">{title}</p>
                  <p className="mt-1 text-sm text-slate-600">{body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-center text-sm text-slate-600">
              Prefer to look around first?{" "}
              <Link href="/courses" className="font-semibold text-brand-ink hover:underline">Browse every course</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
