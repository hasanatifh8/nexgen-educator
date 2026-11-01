import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { IconArrowRight, IconBook, IconCheck, IconClock, IconSignal, IconWallet } from "@/components/Icons";
import { allLessons, formatINR, gstOn, priceWithGst } from "@/lib/catalog";
import { fmtDate } from "@/lib/learner";
import { CATEGORY_ACCENT } from "@/lib/styles";
import { loadLearner } from "../../data";
import { Pill, portalSkeleton } from "../../ui";

type P = PageProps<"/my-learning/requests/[courseId]">;

async function RequestSent({ params }: { params: P["params"] }) {
  const { courseId } = await params;
  const { session: user, record, catalog } = await loadLearner(`/my-learning/requests/${courseId}`);
  const course = catalog.courses.find((c) => c.id === courseId);
  if (!course) notFound();
  if (user.assignedCourses.includes(course.id)) redirect(`/courses/${course.id}`);
  const request = record.requests.find((r) => r.courseId === course.id);
  if (!request) redirect(`/courses/${course.id}`);

  const program = catalog.programs.find((p) => p.id === course.programId);
  const paid = (program?.price ?? 0) > 0;
  const lessons = allLessons(course);
  const minutes = lessons.reduce((n, l) => n + l.minutes, 0);
  const others = record.requests
    .filter((r) => r.courseId !== course.id)
    .map((r) => catalog.courses.find((c) => c.id === r.courseId))
    .filter((c) => !!c);
  const verified = user.verification.status === "verified";

  const steps = [
    { title: "Request received", text: `Submitted on ${fmtDate(request.at)}. A confirmation has been sent to ${user.email}.`, done: true },
    { title: "Review by our team", text: verified ? "We check your request and confirm the course is right for you." : "We verify your profile documents and review your request together.", done: false },
    ...(paid && program
      ? [{ title: "Program fee", text: `Our team will contact you with payment details for the one-time fee of ${formatINR(priceWithGst(program.price))} (including GST).`, done: false }]
      : []),
    { title: "Course approved", text: "You receive an email, and the course appears in My courses, ready to start.", done: false },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-6 py-10 text-center text-white sm:px-10">
        <div className="bg-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-emerald-600 shadow-lg ring-8 ring-white/20">
            <IconCheck className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Request submitted successfully</h1>
          <p className="mx-auto mt-3 max-w-xl text-emerald-50">
            Thank you, {user.firstName}. Your request to join <span className="font-semibold text-white">{course.title}</span> has been sent to our team.
            {paid ? " We will be in touch about the program fee." : " Approval usually takes 1–2 working days."}
          </p>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr]">
        <article className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <div className={`h-2 bg-gradient-to-r ${CATEGORY_ACCENT[course.category]}`} />
          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-brand-ink">{program?.title}</p>
              <Pill tone="amber">Under review</Pill>
            </div>
            <h2 className="mt-2 font-display text-xl leading-snug font-semibold text-navy-900">{course.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{course.blurb}</p>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: IconBook, label: "Lessons", value: lessons.length },
                { icon: IconClock, label: "Duration", value: minutes >= 60 ? `${Math.round(minutes / 6) / 10} h` : `${minutes} min` },
                { icon: IconSignal, label: "Level", value: course.level },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl bg-slate-50 px-2 py-3 ring-1 ring-slate-100">
                  <Icon className="mx-auto h-5 w-5 text-brand-ink" />
                  <dd className="mt-1 text-sm font-bold text-navy-900">{value}</dd>
                  <dt className="text-xs text-slate-500">{label}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-center gap-3 rounded-xl p-4 ring-1 ring-slate-100">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${paid ? "bg-orange-50 text-accent-strong" : "bg-emerald-50 text-emerald-600"}`}><IconWallet className="h-5 w-5" /></span>
              {paid && program ? (
                <div className="text-sm">
                  <p className="font-semibold text-navy-900">{formatINR(priceWithGst(program.price))} one-time program fee</p>
                  <p className="text-xs text-slate-500">{formatINR(program.price)} + {formatINR(gstOn(program.price))} GST · covers every course in the program</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="font-semibold text-navy-900">Free course</p>
                  <p className="text-xs text-slate-500">No payment is required.</p>
                </div>
              )}
            </div>
          </div>
        </article>

        <section className="min-w-0 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="font-display text-lg font-semibold text-navy-900">What happens next</h2>
          <ol className="mt-5">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < steps.length - 1 && <span className="absolute top-9 bottom-1 left-[17px] w-0.5 bg-slate-200" aria-hidden="true" />}
                <span className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${s.done ? "bg-emerald-500 text-white" : i === 1 ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {s.done ? <IconCheck className="h-4 w-4" /> : i + 1}
                </span>
                <div className="pt-1.5">
                  <p className="font-semibold text-navy-900">{s.title}{i === 1 && <span className="ml-2 text-xs font-semibold text-brand-ink">In progress</span>}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {!user.profileComplete || user.verification.status === "rejected" ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-5 py-4 text-sm text-amber-900 ring-1 ring-amber-200">
          <span className="font-semibold">Action needed:</span> please <Link href="/onboarding" className="font-semibold underline">update your profile</Link> so our team can approve your course.
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/my-learning/courses" className="btn-primary">Track my requests <IconArrowRight className="h-4 w-4" /></Link>
        <Link href="/courses" className="btn-secondary">Browse more courses</Link>
        <Link href="/my-learning" className="btn-secondary">Go to dashboard</Link>
      </div>

      {others.length > 0 && (
        <p className="mt-6 text-center text-sm text-slate-500">
          Also awaiting approval: {others.map((c, i) => (
            <span key={c.id}>{i > 0 && ", "}<Link href={`/courses/${c.id}`} className="font-semibold text-brand-ink hover:underline">{c.title}</Link></span>
          ))}
        </p>
      )}
    </div>
  );
}

export default function RequestSentPage({ params }: P) {
  return <Suspense fallback={portalSkeleton}><RequestSent params={params} /></Suspense>;
}
