import Link from "next/link";
import { Suspense } from "react";
import { courseProgress } from "@/components/learn/progress";
import { IconArrowRight, IconBadge, IconBook, IconCheck, IconClock, IconFile, IconPlay, IconTimer, IconWallet } from "@/components/Icons";
import { canAccessCourse, examEligibility, isCourseComplete } from "@/lib/access";
import { formatINR } from "@/lib/catalog";
import { paymentRows, resumeStage } from "@/lib/learner";
import { CATEGORY_ACCENT } from "@/lib/styles";
import { loadLearner } from "./data";
import { Panel, Pill, portalSkeleton, type Tone } from "./ui";

const RESUME_COPY = {
  locked: { tone: "slate", label: "Locked", text: "Complete a course to unlock your professional resume upgrade." },
  queued: { tone: "blue", label: "Queued", text: "You completed a course! Our career team will start on your resume soon." },
  in_progress: { tone: "amber", label: "In progress", text: "Our career team is rewriting your resume." },
  ready: { tone: "green", label: "Ready", text: "Your upgraded resume is ready to compare and download." },
} satisfies Record<string, { tone: Tone; label: string; text: string }>;

async function Overview({ searchParams }: { searchParams: PageProps<"/my-learning">["searchParams"] }) {
  const { session: user, record, catalog } = await loadLearner("/my-learning");
  const sp = await searchParams;
  const { programs, courses } = catalog;

  const mine = courses.filter((c) => user.assignedCourses.includes(c.id)).map((c) => ({ c, pr: courseProgress(c, user.progress[c.id]) }));
  const completed = mine.filter(({ c }) => isCourseComplete(user, c));
  const lessonsDone = mine.reduce((n, { pr }) => n + pr.count, 0);
  const minutesDone = mine.reduce((n, { pr }) => n + pr.lessons.filter((l) => pr.done.has(l.id)).reduce((m, l) => m + l.minutes, 0), 0);
  const overall = mine.length ? Math.round(mine.reduce((n, { pr }) => n + pr.percent, 0) / mine.length) : 0;
  // Continue where they left off: the furthest-along unfinished course, else the first not started.
  const current = mine.filter(({ pr }) => pr.percent < 100).sort((a, b) => b.pr.percent - a.pr.percent)[0];
  const readyExams = programs.filter((p) => p.exam.questions.length && examEligibility(user, p.id, courses).ok && !user.certificates.some((c) => c.programId === p.id));
  const payments = paymentRows(record, catalog);
  const due = payments.filter((r) => r.status === "pending");
  const resume = RESUME_COPY[resumeStage(record, catalog)];
  const v = user.verification.status;

  const journey = [
    { label: "Account created", done: true },
    { label: "Profile submitted", done: user.profileComplete, href: "/onboarding" },
    { label: "Identity verified", done: v === "verified" },
    { label: "Courses approved", done: mine.length > 0, href: "/courses" },
    { label: "Course completed", done: completed.length > 0 },
    { label: "Certified", done: user.certificates.length > 0 },
    { label: "Resume upgraded", done: resume.label === "Ready", href: "/my-learning/resume" },
  ];
  const nextStep = journey.findIndex((s) => !s.done);
  const journeyPct = Math.round((journey.filter((s) => s.done).length / journey.length) * 100);

  // The single most useful thing to do next.
  const action = !user.profileComplete
    ? { title: "Complete your profile", text: "Upload your Aadhaar or PAN and your CV so our team can verify you and approve courses.", href: "/onboarding", cta: "Complete profile" }
    : v === "rejected"
      ? { title: "Update your documents", text: user.verification.note || "Our team could not verify your documents.", href: "/onboarding", cta: "Update profile" }
      : readyExams.length
        ? { title: `Take the ${readyExams[0].title} exam`, text: "You have completed every course in this program. Pass the exam to earn your certificate.", href: `/certifications/${readyExams[0].id}/exam`, cta: "Start exam" }
        : current
          ? { title: current.pr.count ? `Continue ${current.c.title}` : `Start ${current.c.title}`, text: `Next lesson: ${current.pr.next.title}`, href: `/courses/${current.c.id}/learn/${current.pr.next.id}`, cta: current.pr.count ? "Resume lesson" : "Start course" }
          : mine.length === 0
            ? { title: user.requests.length ? "Your requests are under review" : "Request your first course", text: user.requests.length ? "Our team will approve your requested courses shortly. Explore more while you wait." : "Browse the catalog and request the courses you would like to take.", href: "/courses", cta: "Browse courses" }
            : { title: "All your courses are complete", text: "Request another course to keep growing your skills.", href: "/courses", cta: "Browse courses" };

  return (
    <div className="min-w-0 space-y-6">
      {sp.profile === "1" && (
        <p role="status" className="rounded-xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800 ring-1 ring-emerald-200">
          <span className="font-semibold">Profile submitted.</span> Our team will verify your documents, usually within 1–2 working days. Meanwhile, browse the catalog and request the courses you want.
        </p>
      )}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-6 text-white sm:p-8">
        <div className="bg-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm text-sky-200">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Welcome back, {user.firstName}</h1>
            <div className="mt-6 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
              <p className="text-xs font-bold tracking-[0.15em] text-amber-300 uppercase">Your next step</p>
              <p className="mt-1 font-display text-xl font-semibold">{action.title}</p>
              <p className="mt-1 text-sm text-slate-200">{action.text}</p>
              <Link href={action.href} className="btn mt-4 bg-accent text-white hover:bg-accent-dark">{action.cta} <IconArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="mx-auto text-center">
            <div className="relative grid h-36 w-36 place-items-center rounded-full" style={{ background: `conic-gradient(#38bdf8 ${overall * 3.6}deg, rgba(255,255,255,0.12) 0deg)` }}>
              <div className="grid h-28 w-28 place-items-center rounded-full bg-navy-900">
                <div><p className="font-display text-3xl font-bold">{overall}%</p><p className="text-xs text-slate-300">overall progress</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Courses approved", value: mine.length, sub: `${completed.length} completed`, icon: IconBook, tone: "bg-sky-50 text-brand-ink" },
          { label: "Lessons completed", value: lessonsDone, sub: `of ${mine.reduce((n, { pr }) => n + pr.total, 0)} lessons`, icon: IconCheck, tone: "bg-emerald-50 text-emerald-600" },
          { label: "Learning time", value: minutesDone >= 60 ? `${Math.floor(minutesDone / 60)}h ${minutesDone % 60}m` : `${minutesDone}m`, sub: "time spent on lessons", icon: IconClock, tone: "bg-violet-50 text-violet-600" },
          { label: "Certificates", value: user.certificates.length, sub: readyExams.length ? `${readyExams.length} exam ready` : "earned so far", icon: IconBadge, tone: "bg-orange-50 text-accent-strong" },
        ].map(({ label, value, sub, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-navy-900">{value}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      <Panel title="Your journey" action={<span className="text-sm font-semibold text-slate-500">{journeyPct}% complete</span>}>
        <ol className="grid gap-3 sm:grid-cols-4 xl:grid-cols-7">
          {journey.map((s, i) => {
            const isNext = i === nextStep;
            const inner = (
              <div className={`h-full rounded-xl p-3 text-sm ring-1 transition ${s.done ? "bg-emerald-50 ring-emerald-100" : isNext ? "bg-navy-900 text-white ring-navy-900" : "bg-slate-50 ring-slate-100"}`}>
                <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${s.done ? "bg-emerald-500 text-white" : isNext ? "bg-white/15" : "bg-white text-slate-400 ring-1 ring-slate-200"}`}>
                  {s.done ? <IconCheck className="h-4 w-4" /> : i + 1}
                </span>
                <p className={`mt-2 font-semibold ${s.done ? "text-emerald-800" : isNext ? "" : "text-slate-500"}`}>{s.label}</p>
                {isNext && <p className="text-xs text-sky-200">Up next</p>}
              </div>
            );
            return <li key={s.label}>{isNext && s.href ? <Link href={s.href}>{inner}</Link> : inner}</li>;
          })}
        </ol>
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Panel title="Continue learning" action={<Link href="/my-learning/courses" className="text-sm font-semibold text-brand-ink hover:underline">All courses →</Link>}>
          {mine.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
              <p className="font-display font-semibold text-navy-900">No courses approved yet</p>
              <p className="mt-1 text-sm text-slate-500">{user.requests.length ? `${user.requests.length} request${user.requests.length === 1 ? " is" : "s are"} with our team.` : "Request a course from the catalog to get started."}</p>
              <Link href="/courses" className="btn-primary mt-5">Explore courses</Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {mine.sort((a, b) => Number(a.pr.percent === 100) - Number(b.pr.percent === 100) || b.pr.percent - a.pr.percent).slice(0, 4).map(({ c, pr }) => {
                const open = canAccessCourse(user, c.id);
                const href = !open ? "/onboarding" : pr.percent === 100 ? `/courses/${c.id}` : `/courses/${c.id}/learn/${pr.next.id}`;
                return (
                  <li key={c.id}>
                    <Link href={href} className="group flex items-center gap-4 rounded-xl p-3 ring-1 ring-slate-100 transition hover:bg-slate-50 hover:ring-slate-200">
                      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white ${CATEGORY_ACCENT[c.category]}`}>
                        {pr.percent === 100 ? <IconCheck className="h-5 w-5" /> : <IconPlay className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-navy-900 group-hover:text-brand-ink">{c.title}</p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                            <div className={`h-1.5 rounded-full ${pr.percent === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-brand to-brand-teal"}`} style={{ width: `${pr.percent}%` }} />
                          </div>
                          <span className="w-24 shrink-0 text-right text-xs font-semibold text-slate-500">{pr.count}/{pr.total} · {pr.percent}%</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="min-w-0 space-y-6">
          <Panel title="Resume upgrade" action={<Pill tone={resume.tone}>{resume.label}</Pill>}>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-accent-strong"><IconFile className="h-5 w-5" /></span>
              <p className="text-sm text-slate-600">{resume.text}</p>
            </div>
            <Link href="/my-learning/resume" className="btn-secondary mt-4 w-full py-2 text-sm">{resume.label === "Ready" ? "Compare and download" : "View details"}</Link>
          </Panel>

          <Panel title="Payments" action={<Pill tone={due.length ? "amber" : "green"}>{due.length ? `${due.length} pending` : "All clear"}</Pill>}>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-brand-ink"><IconWallet className="h-5 w-5" /></span>
              <p className="text-sm text-slate-600">
                {due.length
                  ? `${formatINR(due.reduce((n, r) => n + r.amountDue, 0))} due for ${due.map((r) => r.course.title).join(", ")}.`
                  : payments.length ? "All your course fees are settled." : "You have no paid course fees."}
              </p>
            </div>
            <Link href="/my-learning/payments" className="btn-secondary mt-4 w-full py-2 text-sm">View payments</Link>
          </Panel>

          {readyExams.length > 0 && (
            <Panel title="Exams ready">
              <ul className="space-y-2">
                {readyExams.map((p) => (
                  <li key={p.id}><Link href={`/certifications/${p.id}/exam`} className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"><IconTimer className="h-4 w-4" /> {p.title}</Link></li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyLearningPage({ searchParams }: PageProps<"/my-learning">) {
  return <Suspense fallback={portalSkeleton}><Overview searchParams={searchParams} /></Suspense>;
}
