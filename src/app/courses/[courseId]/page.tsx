import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { LEVEL_STYLES } from "@/lib/styles";
import RichText from "@/components/learn/RichText";
import { courseProgress } from "@/components/learn/progress";
import { IconArrowRight, IconBadge, IconBook, IconCheck, IconChevronDown, IconClock, IconLock, IconPlay, IconTimer } from "@/components/Icons";
import { connection } from "next/server";
import { canAccessCourse, examEligibility } from "@/lib/access";
import { GST_RATE, formatINR, priceShort, priceWithGst } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { getCurrentUser } from "@/lib/dal";
import { requestAccessAction } from "../actions";
import EnquiryDialog from "@/components/EnquiryDialog";

export const metadata: Metadata = { title: "Course — NextGen Educator" };

type P = PageProps<"/courses/[courseId]">;

async function CourseOverview({ params, searchParams }: { params: P["params"]; searchParams: P["searchParams"] }) {
  const { courseId } = await params;
  await connection();
  const user = await getCurrentUser();
  const { completed, requested } = await searchParams;
  const { courses, programs } = await getCatalog();
  const course = courses.find((c) => c.id === courseId);
  const program = course && programs.find((p) => p.id === course.programId);
  if (!course || !program) notFound();
  // Disabled courses stay open only to admins and learners who were already assigned them.
  if (course.disabled && !(user?.isAdmin || user?.assignedCourses.includes(course.id))) notFound();

  const here = `/courses/${course.id}`;
  const unlocked = !!user && canAccessCourse(user, course.id);
  const hasRequested = !!user?.requests.some((r) => r.courseId === course.id);
  const prog = courseProgress(course, user?.progress[course.id]);
  const finished = prog.total > 0 && prog.count === prog.total;
  const certified = !!user?.certificates.some((c) => c.programId === program.id);
  const exam = user ? examEligibility(user, program.id, courses) : null;
  const learnHref = prog.next ? `/courses/${course.id}/learn/${prog.next.id}` : "#";
  const cta = !prog.total ? "Content coming soon" : finished ? "Review course" : prog.count ? "Continue learning" : "Start course";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
              <Link href="/" className="-my-2 inline-block py-2 hover:text-white">Home</Link><span className="mx-2">/</span>
              <Link href="/courses" className="-my-2 inline-block py-2 hover:text-white">Courses</Link><span className="mx-2">/</span>
              <span className="text-slate-200">{course.title}</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sky-200">{course.category}</span>
              <span className={`rounded-full px-3 py-1 ring-1 ${LEVEL_STYLES[course.level]}`}>{course.level}</span>
              {course.price === 0 ? (
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-300">Free</span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-orange-400/15 px-3 py-1 text-orange-300">{!unlocked && <IconLock className="h-3 w-3" />} Paid · {priceShort(course.price)}</span>
              )}
            </div>
            <h1 className="mt-4 font-display text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">{course.blurb}</p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><IconClock className="h-4 w-4 text-brand-teal" /> {course.hours} hours</li>
              <li className="flex items-center gap-2"><IconBook className="h-4 w-4 text-brand-teal" /> {course.modules.length} modules · {prog.total} lessons</li>
              <li className="flex items-center gap-2"><IconBadge className="h-4 w-4 text-brand-teal" /> {program.title}</li>
            </ul>
            {course.instructor && (
              <div className="mt-8 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-teal font-bold">
                  {course.instructor.name.replace(/^Dr\.\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
                <div className="text-sm">
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-slate-400">{course.instructor.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action card */}
          <div className="self-start rounded-2xl bg-white p-6 text-navy-900 shadow-2xl shadow-black/30">
            {unlocked ? (
              <>
                <div className="flex items-end justify-between">
                  <p className="text-sm font-semibold">Your progress</p>
                  <p className="font-display text-2xl font-bold">{prog.percent}%</p>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-brand to-brand-teal transition-all" style={{ width: `${prog.percent}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{prog.count} of {prog.total} lessons complete · ~{prog.minutes} min total</p>
                {prog.total ? (
                  <Link href={learnHref} className="btn-primary mt-6 w-full py-3.5 text-base">
                    <IconPlay className="h-5 w-5" /> {cta}
                  </Link>
                ) : (
                  <span className="btn mt-6 w-full cursor-default bg-slate-100 py-3.5 text-slate-500">{cta}</span>
                )}
                {prog.next && prog.count > 0 && !finished && (
                  <p className="mt-3 text-center text-xs text-slate-500">Up next: <span className="font-semibold text-navy-900">{prog.next.title}</span></p>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-accent-strong ring-1 ring-orange-100"><IconLock className="h-6 w-6" /></span>
                  <span className="text-right">
                    <span className="block font-display text-2xl font-bold">{course.price === 0 ? "Free" : formatINR(course.price)}</span>
                    <span className="text-xs text-slate-500">
                      {course.price === 0 ? "free course" : `+ ${Math.round(GST_RATE * 100)}% GST · ${formatINR(priceWithGst(course.price))} total`}
                    </span>
                  </span>
                </div>
                {!user ? (
                  <>
                    <p className="mt-4 font-display text-xl font-bold">Enroll in this course</p>
                    <p className="mt-1 text-sm text-slate-600">Create a free account, complete your profile and our team will assign the course to you.</p>
                    <Link href={`/register?next=${encodeURIComponent(here)}`} className="btn-primary mt-6 w-full py-3.5 text-base">Register to enroll</Link>
                    <Link href={`/login?next=${encodeURIComponent(here)}`} className="btn-secondary mt-3 w-full">I already have an account</Link>
                  </>
                ) : !user.profileComplete ? (
                  <>
                    <p className="mt-4 font-display text-xl font-bold">One step left</p>
                    <p className="mt-1 text-sm text-slate-600">Complete your profile (ID and CV) so our team can verify you and assign this course.</p>
                    <Link href={`/onboarding?next=${encodeURIComponent(here)}`} className="btn-primary mt-6 w-full py-3.5 text-base">Complete my profile</Link>
                  </>
                ) : hasRequested ? (
                  <>
                    <p className="mt-4 flex items-center gap-2 font-display text-xl font-bold"><IconCheck className="h-5 w-5 text-emerald-600" /> Access requested</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {requested ? "Thanks! " : ""}Our team will review your request{course.price > 0 ? " and contact you about the course fee" : ""}. The course unlocks as soon as it’s assigned.
                    </p>
                    <Link href="/my-learning" className="btn-secondary mt-6 w-full">Go to My Learning</Link>
                  </>
                ) : (
                  <>
                    <p className="mt-4 font-display text-xl font-bold">Request this course</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Part of <span className="font-semibold text-navy-900">{program.title}</span>. Courses are assigned by our team{course.price > 0 ? " after the course fee is confirmed" : ""}.
                    </p>
                    <form action={requestAccessAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <button type="submit" className="btn-primary mt-6 w-full py-3.5 text-base">Request access</button>
                    </form>
                  </>
                )}
                <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                  <p className="text-xs text-slate-500">Have questions about fees or eligibility?</p>
                  <EnquiryDialog courseId={course.id} courseTitle={course.title} source="course-page" label="Talk to an advisor" className="mt-1 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand-ink hover:underline" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {(completed === "1" || finished) && unlocked && (
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-bold">🎉 Course complete!</p>
              <p className="text-sm text-emerald-50">
                {certified
                  ? "You’re already certified in this program."
                  : exam?.ok
                    ? `You’re ready for the ${program.title} exam.`
                    : exam && !exam.ok && exam.remaining.length
                      ? `Finish ${exam.remaining.map((r) => r.title).join(", ")} to unlock the ${program.title} exam.`
                      : exam && !exam.ok && exam.reason === "unverified"
                        ? `The ${program.title} exam unlocks once our team verifies your ID document.`
                      : `Great work on finishing ${course.title}.`}
              </p>
            </div>
            {!certified && program.exam.questions.length > 0 && exam?.ok && (
              <Link href={`/certifications/${program.id}/exam`} className="btn shrink-0 bg-white px-6 py-3 text-emerald-700 hover:bg-emerald-50">
                <IconTimer className="h-4 w-4" /> Take certification exam
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8 lg:py-16">
        <div className="min-w-0 space-y-12">
          {course.overview && (
            <section>
              <h2 className="section-title !text-2xl">About this course</h2>
              <RichText text={course.overview} className="mt-4" />
            </section>
          )}

          {course.outcomes.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-xl font-bold text-navy-900">What you’ll learn</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-sm text-slate-700">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"><IconCheck className="h-3.5 w-3.5" /></span>
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <div className="flex items-end justify-between">
              <h2 className="section-title !text-2xl">Curriculum</h2>
              <p className="text-sm text-slate-500">{prog.total} lessons · {prog.minutes} min</p>
            </div>
            {course.modules.length === 0 && (
              <p className="mt-6 rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-500">Lessons are being prepared.</p>
            )}
            <div className="mt-6 space-y-4">
              {course.modules.map((m, mi) => {
                const doneInModule = m.lessons.filter((l) => prog.done.has(l.id)).length;
                return (
                  <details key={m.id} open={mi === 0 || m.lessons.some((l) => l.id === prog.next?.id)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                    <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-900 font-display font-bold text-white">{mi + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-navy-900">{m.title}</span>
                        <span className="text-xs text-slate-500">
                          {m.lessons.length} lessons · {m.lessons.reduce((n, l) => n + l.minutes, 0)} min
                          {unlocked && doneInModule > 0 && <> · <span className="font-semibold text-emerald-600">{doneInModule}/{m.lessons.length} done</span></>}
                        </span>
                      </span>
                      <IconChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <ol className="divide-y divide-slate-100 border-t border-slate-100">
                      {m.lessons.map((l, li) => {
                        const isDone = prog.done.has(l.id);
                        const inner = (
                          <>
                            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                              isDone ? "bg-emerald-600 text-white" : unlocked ? "bg-sky-50 text-brand-ink ring-1 ring-sky-100" : "bg-slate-100 text-slate-400"
                            }`}>
                              {isDone ? <IconCheck className="h-4 w-4" /> : unlocked ? li + 1 : <IconLock className="h-3.5 w-3.5" />}
                            </span>
                            <span className={`flex-1 text-sm ${unlocked ? "font-medium text-navy-900" : "text-slate-500"}`}>{l.title}</span>
                            <span className="shrink-0 text-xs text-slate-500">{l.minutes} min</span>
                          </>
                        );
                        return (
                          <li key={l.id}>
                            {unlocked ? (
                              <Link href={`/courses/${course.id}/learn/${l.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-sky-50/50">{inner}</Link>
                            ) : (
                              <div className="flex items-center gap-4 px-5 py-3.5">{inner}</div>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </details>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-accent-strong ring-1 ring-orange-100"><IconBadge className="h-6 w-6" /></span>
            <p className="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Earn your credential</p>
            <p className="mt-1 font-display text-lg font-semibold text-navy-900">{program.title}</p>
            <p className="mt-2 text-sm text-slate-600">
              {program.exam.questions.length
                ? `Finish ${courses.filter((c) => c.programId === program.id && !c.disabled).length > 1 ? "every course in this program" : "this course"}, then pass a ${program.exam.questions.length}-question, ${program.exam.minutes}-minute exam to earn a QR-verified certificate.`
                : "The certification exam for this program is coming soon."}
            </p>
            {certified ? (
              <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700"><IconCheck className="h-4 w-4" /> You’re certified</p>
            ) : unlocked ? (
              <Link href="/my-learning/courses#programs" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline">
                Track your progress <IconArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </aside>
      </div>
    </>
  );
}

export default function CoursePage({ params, searchParams }: P) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50">
        <Suspense fallback={<div className="h-[28rem] animate-pulse bg-navy-900" />}>
          <CourseOverview params={params} searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
