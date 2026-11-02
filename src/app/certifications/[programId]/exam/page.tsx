import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { IconBadge, IconCheck, IconLock } from "@/components/Icons";
import { examEligibility, isCourseComplete } from "@/lib/access";
import { activeCourses, coursesFor } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { requireLearner } from "@/lib/dal";
import { getSettings } from "@/lib/settings";
import CertExam from "./CertExam";

export const metadata: Metadata = { title: "Certification Exam — NextGen Educator" };

type Params = PageProps<"/certifications/[programId]/exam">["params"];

async function ExamContent({ params }: { params: Params }) {
  const { programId } = await params;
  const user = await requireLearner(`/certifications/${programId}/exam`);
  const [{ programs, courses }, settings] = await Promise.all([getCatalog(), getSettings()]);
  const program = programs.find((p) => p.id === programId);
  if (!program) notFound();
  if (!program.exam.questions.length) redirect("/my-learning/courses#programs");
  const eligible = examEligibility(user, program.id, courses);

  const cert = user.certificates.find((c) => c.programId === program.id);

  return (
    <>
      <PageHeader crumb="Certification Exam" title={program.title}>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">{program.description}</p>
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        {!cert && !eligible.ok ? (
          <div className="card p-8 sm:p-10">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-orange-50 text-accent-strong ring-1 ring-orange-100"><IconLock className="h-7 w-7" /></span>
            <h2 className="mt-5 font-display text-2xl font-bold text-navy-900">Exam locked</h2>
            <p className="mt-2 text-slate-600">
              {!eligible.ok && eligible.reason === "unverified"
                ? "You’ve finished the coursework. Certificates are only issued to identity-verified learners, so the exam opens once our team verifies your ID document."
                : "Finish every course in this program to unlock the certification exam."}
            </p>
            <ul className="mt-6 space-y-2">
              {activeCourses(coursesFor(courses, program.id)).map((c) => {
                const assigned = user.assignedCourses.includes(c.id) || user.isAdmin;
                const done = isCourseComplete(user, c);
                return (
                  <li key={c.id} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
                    <span className={`grid h-6 w-6 place-items-center rounded-full ${done ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {done ? <IconCheck className="h-3.5 w-3.5" /> : <IconLock className="h-3 w-3" />}
                    </span>
                    <Link href={`/courses/${c.id}`} className="flex-1 font-medium text-navy-900 hover:text-brand-ink">{c.title}</Link>
                    <span className={`text-xs font-semibold ${done ? "text-emerald-600" : assigned ? "text-brand-ink" : "text-slate-500"}`}>
                      {done ? "Completed" : assigned ? "In progress" : "Not assigned"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link href="/my-learning" className="btn-primary mt-6">Go to My Learning</Link>
          </div>
        ) : cert ? (
          <div className="card p-8 text-center sm:p-10">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <IconBadge className="h-7 w-7" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold text-navy-900">You’re already certified</h2>
            <p className="mt-2 text-slate-600">
              {cert.total ? `You passed with ${cert.score}/${cert.total}.` : "Awarded by our team."} Credential ID <span className="font-mono font-semibold text-navy-900">{cert.credentialId}</span>
            </p>
            <Link href="/my-learning/certificates" className="btn-primary mt-6">View & download certificate</Link>
          </div>
        ) : (
          <CertExam
            programId={program.id}
            title={program.title}
            minutes={program.exam.minutes}
            passPercent={program.exam.passPercent}
            questionCount={program.exam.questions.length}
            userName={`${user.firstName} ${user.lastName}`}
            settings={settings}
          />
        )}
      </div>
    </>
  );
}

export default function ExamPage({ params }: PageProps<"/certifications/[programId]/exam">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50">
        <Suspense fallback={<div className="mx-auto my-16 h-96 max-w-3xl animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />}>
          <ExamContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
