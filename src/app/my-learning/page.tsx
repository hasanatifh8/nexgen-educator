import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { courseProgress } from "@/components/learn/progress";
import { IconArrowRight, IconBadge, IconCheck, IconClock, IconShield, IconTimer } from "@/components/Icons";
import CertificateDownload from "@/components/CertificateDownload";
import LinkedInAddButton from "@/components/LinkedInAddButton";
import { canAccessCourse, examEligibility, isCourseComplete } from "@/lib/access";
import { coursesFor } from "@/lib/catalog";
import { formatCertDate } from "@/lib/certificate/design";
import { getSettings } from "@/lib/settings";
import { getCatalog } from "@/lib/catalogStore";
import { requireUser } from "@/lib/dal";
import { CATEGORY_ACCENT } from "@/lib/styles";

export const metadata: Metadata = { title: "My Learning — NextGen Educator" };

async function Dashboard({ searchParams }: { searchParams: PageProps<"/my-learning">["searchParams"] }) {
  await connection();
  const user = await requireUser("/my-learning");
  const sp = await searchParams;
  const [{ programs, courses }, settings] = await Promise.all([getCatalog(), getSettings()]);
  const mine = courses.filter((c) => user.assignedCourses.includes(c.id));
  const requested = user.requests.map((r) => courses.find((c) => c.id === r.courseId)).filter((c) => !!c);
  const programTitle = (id: string) => programs.find((p) => p.id === id)?.title ?? "";
  const readyExams = programs.filter(
    (p) => p.exam.questions.length && examEligibility(user, p.id, courses).ok && !user.certificates.some((c) => c.programId === p.id),
  );

  // Programs the learner is working towards: at least one course assigned, or already certified.
  const myPrograms = programs
    .map((p) => {
      const inProgram = coursesFor(courses, p.id);
      const cert = user.certificates.find((c) => c.programId === p.id);
      return {
        p,
        cert,
        inProgram,
        assigned: inProgram.filter((c) => canAccessCourse(user, c.id)),
        done: inProgram.filter((c) => canAccessCourse(user, c.id) && isCourseComplete(user, c)),
        exam: examEligibility(user, p.id, courses),
      };
    })
    .filter((x) => x.assigned.length > 0 || x.cert);

  const v = user.verification.status;
  const steps = [
    { label: "Account created", done: true },
    { label: "Profile & documents", done: user.profileComplete, href: "/onboarding" },
    { label: v === "verified" ? "Verified" : v === "rejected" ? "Changes requested" : "Verification", done: v === "verified", warn: v === "rejected", href: v === "rejected" ? "/onboarding" : undefined },
    { label: "Courses assigned", done: mine.length > 0 },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-400">My Learning</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Welcome back, {user.firstName}</h1>
          <ol className="mt-8 grid gap-3 sm:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.label}>
                {(() => {
                  const inner = (
                    <span className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${s.done ? "bg-emerald-400/15 text-emerald-200" : s.warn ? "bg-orange-400/20 text-orange-200" : "bg-white/5 text-slate-300 ring-1 ring-white/10"}`}>
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${s.done ? "bg-emerald-400 text-navy-900" : "bg-white/10"}`}>
                        {s.done ? <IconCheck className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      {s.label}
                    </span>
                  );
                  return s.href && !s.done ? <Link href={s.href}>{inner}</Link> : inner;
                })()}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {sp.profile === "1" && (
          <p role="status" className="rounded-xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800 ring-1 ring-emerald-200">
            <span className="font-semibold">Profile submitted!</span> Our team will verify your documents. Meanwhile, browse courses and request the ones you want.
          </p>
        )}
        {!user.profileComplete && (
          <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-accent to-amber-500 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-bold">Complete your profile to get started</p>
              <p className="text-sm text-orange-50">Upload your Aadhaar or PAN and your CV so we can verify you and assign courses.</p>
            </div>
            <Link href="/onboarding" className="btn shrink-0 bg-white px-6 py-3 text-accent-strong hover:bg-orange-50">Complete profile <IconArrowRight className="h-4 w-4" /></Link>
          </div>
        )}
        {v === "rejected" && user.profileComplete && (
          <p className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800 ring-1 ring-red-200">
            <span className="font-semibold">Action needed:</span> {user.verification.note} <Link href="/onboarding" className="font-semibold underline">Update profile</Link>
          </p>
        )}

        {readyExams.length > 0 && (
          <section className="rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 p-6 text-white">
            <p className="font-display text-xl font-bold">🎉 You’re ready for {readyExams.length === 1 ? "an exam" : `${readyExams.length} exams`}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {readyExams.map((p) => (
                <Link key={p.id} href={`/certifications/${p.id}/exam`} className="btn bg-white text-emerald-700 hover:bg-emerald-50"><IconTimer className="h-4 w-4" /> {p.title}</Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-end justify-between">
            <h2 className="section-title !text-2xl">My courses</h2>
            <Link href="/courses" className="text-sm font-semibold text-brand-ink hover:underline">Browse all courses →</Link>
          </div>
          {mine.length === 0 ? (
            <div className="card mt-6 p-10 text-center">
              <p className="font-display text-lg font-semibold text-navy-900">No courses assigned yet</p>
              <p className="mt-1 text-sm text-slate-500">
                {requested.length ? "Your requests are with our team — courses appear here once assigned." : "Explore the catalog and request the courses you’re interested in."}
              </p>
              <Link href="/courses" className="btn-primary mt-5">Explore courses</Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mine.map((c) => {
                const pr = courseProgress(c, user.progress[c.id]);
                const open = canAccessCourse(user, c.id);
                return (
                  <article key={c.id} className="card card-hover flex flex-col overflow-hidden">
                    <div className={`h-1.5 bg-gradient-to-r ${CATEGORY_ACCENT[c.category]}`} />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-semibold text-brand-ink">{programTitle(c.programId)}</p>
                      <h3 className="mt-2 font-display text-lg leading-snug font-semibold text-navy-900">{c.title}</h3>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><IconClock className="h-4 w-4" /> {pr.total} lessons · {pr.minutes} min</p>
                      <div className="mt-auto pt-5">
                        <div className="flex justify-between text-xs font-semibold text-slate-600"><span>{pr.count}/{pr.total} lessons</span><span>{pr.percent}%</span></div>
                        <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                          <div className={`h-2 rounded-full ${pr.percent === 100 ? "bg-emerald-600" : "bg-gradient-to-r from-brand to-brand-teal"}`} style={{ width: `${pr.percent}%` }} />
                        </div>
                        {open ? (
                          <Link href={pr.percent === 100 || !pr.next ? `/courses/${c.id}` : `/courses/${c.id}/learn/${pr.next.id}`} className={`mt-4 w-full ${pr.percent === 100 ? "btn bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "btn-primary"}`}>
                            {pr.percent === 100 ? "✓ Completed — review" : pr.count ? "Continue" : "Start course"}
                          </Link>
                        ) : (
                          <Link href="/onboarding" className="btn mt-4 w-full bg-navy-900 text-white">Complete profile to open</Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section id="programs" className="scroll-mt-24">
          <h2 className="section-title !text-2xl">My certification programs</h2>
          <p className="mt-1 text-sm text-slate-600">Finish every course in a program to unlock its exam — pass it to earn your certificate.</p>
          {myPrograms.length === 0 ? (
            <p className="card mt-6 p-8 text-center text-sm text-slate-500">Your programs appear here once courses are assigned to you.</p>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {myPrograms.map(({ p, cert, inProgram, assigned, done, exam }) => {
                const eligible = exam.ok;
                const pct = inProgram.length ? Math.round((done.length / inProgram.length) * 100) : 0;
                return (
                  <article key={p.id} className="card flex flex-col p-6">
                    <div className="flex items-start gap-4">
                      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ${cert ? "bg-emerald-50 text-emerald-600 ring-emerald-100" : "bg-orange-50 text-accent-strong ring-orange-100"}`}>
                        <IconBadge className="h-6 w-6" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-brand-ink">{p.category}</p>
                        <h3 className="font-display text-lg leading-snug font-semibold text-navy-900">{p.title}</h3>
                      </div>
                      {cert ? (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">Certified</span>
                      ) : eligible ? (
                        <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700 ring-1 ring-sky-200">Exam ready</span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">In progress</span>
                      )}
                    </div>

                    <ul className="mt-5 space-y-2">
                      {inProgram.map((c) => {
                        const isDone = done.some((d) => d.id === c.id);
                        const isAssigned = assigned.some((a) => a.id === c.id);
                        return (
                          <li key={c.id} className="flex items-center gap-3 text-sm">
                            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${isDone ? "bg-emerald-600 text-white" : isAssigned ? "ring-2 ring-brand-teal" : "bg-slate-100"}`}>
                              {isDone && <IconCheck className="h-3 w-3" />}
                            </span>
                            <Link href={`/courses/${c.id}`} className="flex-1 text-navy-900 hover:text-brand-ink">{c.title}</Link>
                            <span className={`text-xs font-semibold ${isDone ? "text-emerald-600" : isAssigned ? "text-brand-ink" : "text-slate-400"}`}>
                              {isDone ? "Completed" : isAssigned ? "In progress" : "Not assigned"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-5">
                      <div className="flex justify-between text-xs font-semibold text-slate-600"><span>Courses completed</span><span>{done.length}/{inProgram.length}</span></div>
                      <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                        <div className={`h-2 rounded-full ${pct === 100 ? "bg-emerald-600" : "bg-gradient-to-r from-brand to-brand-teal"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="mt-auto pt-5">
                      {cert ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <CertificateDownload
                            className="btn-primary w-full"
                            label="Download certificate"
                            settings={settings}
                            data={{ name: cert.holderName ?? `${user.firstName} ${user.lastName}`, title: cert.programTitle, score: cert.score, total: cert.total, credentialId: cert.credentialId, issuedOn: formatCertDate(cert.issuedAt) }}
                          />
                          <LinkedInAddButton certificate={cert} settings={settings} className="btn-secondary w-full" />
                          <Link href={`/verify/${cert.credentialId}`} className="btn-secondary w-full sm:col-span-2">Public verification page — share with employers</Link>
                          <p className="text-xs text-slate-500 sm:col-span-2">Credential ID <span className="font-mono font-semibold text-navy-900">{cert.credentialId}</span> · {cert.score}/{cert.total}</p>
                        </div>
                      ) : eligible && p.exam.questions.length > 0 ? (
                        <Link href={`/certifications/${p.id}/exam`} className="btn-primary w-full"><IconTimer className="h-4 w-4" /> Take certification exam</Link>
                      ) : (
                        <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-100">
                          {assigned.length < inProgram.length
                            ? `${inProgram.length - assigned.length} more course(s) in this program need to be assigned before the exam unlocks.`
                            : !exam.ok && exam.reason === "unverified"
                              ? "All courses done! The exam unlocks as soon as our team verifies your ID document."
                            : eligible
                              ? "The exam for this program is coming soon."
                              : `Finish ${inProgram.length - done.length} more course(s) to unlock the exam.`}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="grid gap-6">
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-navy-900">Pending requests</h2>
            {requested.length ? (
              <ul className="mt-4 divide-y divide-slate-100">
                {requested.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <Link href={`/courses/${c.id}`} className="font-medium text-navy-900 hover:text-brand-ink">{c.title}</Link>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">Awaiting assignment</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No pending requests.</p>
            )}
          </section>
        </div>

        <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <IconShield className="h-4 w-4" /> Your documents are private. <Link href="/onboarding" className="font-semibold text-brand-ink hover:underline">View or update profile</Link>
        </p>
      </div>
    </>
  );
}

export default function MyLearningPage({ searchParams }: PageProps<"/my-learning">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50">
        <Suspense fallback={<div className="h-72 animate-pulse bg-navy-900" />}>
          <Dashboard searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
