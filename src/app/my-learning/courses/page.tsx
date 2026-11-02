import Link from "next/link";
import { Suspense } from "react";
import { courseProgress } from "@/components/learn/progress";
import { IconBadge, IconCheck, IconClock, IconTimer } from "@/components/Icons";
import CertificateDownload from "@/components/CertificateDownload";
import LinkedInAddButton from "@/components/LinkedInAddButton";
import { canAccessCourse, examEligibility, isCourseComplete } from "@/lib/access";
import { activeCourses, coursesFor } from "@/lib/catalog";
import { formatCertDate } from "@/lib/certificate/design";
import { fmtDate } from "@/lib/learner";
import { CATEGORY_ACCENT } from "@/lib/styles";
import { loadLearner } from "../data";
import { PageTitle, Panel, Pill, portalSkeleton } from "../ui";

async function Courses() {
  const { session: user, catalog, settings } = await loadLearner("/my-learning/courses");
  const { programs, courses } = catalog;
  const mine = courses.filter((c) => user.assignedCourses.includes(c.id));
  const requested = user.requests
    .map((r) => ({ at: r.at, course: courses.find((c) => c.id === r.courseId) }))
    .filter((r) => !!r.course);
  const programTitle = (id: string) => programs.find((p) => p.id === id)?.title ?? "";
  const myPrograms = programs
    .map((p) => {
      const inProgram = activeCourses(coursesFor(courses, p.id));
      return {
        p,
        cert: user.certificates.find((c) => c.programId === p.id),
        inProgram,
        assigned: inProgram.filter((c) => canAccessCourse(user, c.id)),
        done: inProgram.filter((c) => canAccessCourse(user, c.id) && isCourseComplete(user, c)),
        exam: examEligibility(user, p.id, courses),
      };
    })
    .filter((x) => x.assigned.length > 0 || x.cert);

  return (
    <>
      <PageTitle
        eyebrow="Learning"
        title="My courses"
        subtitle="Courses our team has approved for you, the programs they belong to, and the requests still under review."
        action={<Link href="/courses" className="btn-primary">Request a course</Link>}
      />
      <div className="space-y-10">
        <Panel title="Requested courses" action={<Pill tone={requested.length ? "amber" : "slate"}>{requested.length} awaiting approval</Pill>}>
          {requested.length ? (
            <ul className="divide-y divide-slate-100">
              {requested.map(({ at, course }) => (
                <li key={course!.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link href={`/my-learning/requests/${course!.id}`} className="font-semibold text-navy-900 hover:text-brand-ink">{course!.title}</Link>
                    <p className="text-xs text-slate-500">
                      {programTitle(course!.programId)} · requested {fmtDate(at)}
                      {course!.price > 0 && " · our representative will call you before the course is assigned"}
                    </p>
                  </div>
                  <Pill tone="amber">{course!.price > 0 ? "Awaiting call" : "Under review"}</Pill>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No pending requests. Browse the catalog and request any course you would like to take.</p>
          )}
        </Panel>

        <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold text-navy-900">Assigned courses</h2>
            <Link href="/courses" className="text-sm font-semibold text-brand-ink hover:underline">Browse all courses →</Link>
          </div>
          {mine.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200/70">
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
                  <article key={c.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md">
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
          <h2 className="font-display text-xl font-semibold text-navy-900">Certification programs</h2>
          <p className="mt-1 text-sm text-slate-600">Finish every course in a program to unlock its exam — pass it to earn your certificate.</p>
          {myPrograms.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/70">Your programs appear here once courses are assigned to you.</p>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {myPrograms.map(({ p, cert, inProgram, assigned, done, exam }) => {
                const eligible = exam.ok;
                const pct = inProgram.length ? Math.round((done.length / inProgram.length) * 100) : 0;
                return (
                  <article key={p.id} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
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
                          <p className="text-xs text-slate-500 sm:col-span-2">Credential ID <span className="font-mono font-semibold text-navy-900">{cert.credentialId}</span>{cert.total ? ` · ${cert.score}/${cert.total}` : ""}</p>
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

      </div>
    </>
  );
}

export default function CoursesPage() {
  return <Suspense fallback={portalSkeleton}><Courses /></Suspense>;
}
