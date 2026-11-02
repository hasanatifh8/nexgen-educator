import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { IconArrowRight, IconLock, IconShield } from "@/components/Icons";
import Logo from "@/components/Logo";
import { allLessons } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { requireUser } from "@/lib/dal";
import { findUserById } from "@/lib/users";
import CheckoutWizard from "./CheckoutWizard";

export const metadata: Metadata = { title: "Enroll — NextGen Educator" };

type P = PageProps<"/checkout/[courseId]">;

async function Checkout({ params, searchParams }: { params: P["params"]; searchParams: P["searchParams"] }) {
  const { courseId } = await params;
  const { edit } = await searchParams;
  await connection();
  const here = `/checkout/${courseId}`;
  const session = await requireUser(here);
  const { courses, programs } = await getCatalog();
  const course = courses.find((c) => c.id === courseId);
  const program = course && programs.find((p) => p.id === course.programId);
  if (!course || !program || course.disabled) notFound();
  if (session.isAdmin || course.price === 0 || course.launch || session.assignedCourses.includes(course.id)) redirect(`/courses/${course.id}`);

  const user = await findUserById(session.id);
  if (!user?.profile?.completedAt) redirect(`/onboarding?next=${encodeURIComponent(here)}`);
  const request = user.requests.find((r) => r.courseId === course.id);
  // Already confirmed: show the confirmation, unless the learner came back to change their call preference.
  if (request?.call && edit !== "1") redirect(`/my-learning/requests/${encodeURIComponent(course.id)}`);

  const p = user.profile;
  const lessons = allLessons(course);
  const minutes = lessons.reduce((n, l) => n + l.minutes, 0);

  return (
    <CheckoutWizard
      editing={!!request?.call}
      learner={{
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: p.phone,
        location: `${p.city}, ${p.state}`,
        qualification: p.qualification,
        experienceYears: p.experienceYears,
        verification: user.verification.status,
      }}
      course={{
        id: course.id,
        title: course.title,
        blurb: course.blurb,
        category: course.category,
        level: course.level,
        program: program.title,
        modules: course.modules.length,
        lessons: lessons.length,
        duration: minutes >= 60 ? `${Math.round(minutes / 6) / 10} h` : `${minutes} min`,
        outcomes: course.outcomes.slice(0, 4),
        instructor: course.instructor?.name,
        price: course.price,
      }}
      call={request?.call}
      promo={request ? user.promos?.[course.id] : undefined}
    />
  );
}

/** Paid-course enrollment. There is no payment gateway: the learner confirms their details and when to call them. */
export default function CheckoutPage({ params, searchParams }: P) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 sm:text-sm">
            <IconLock className="h-4 w-4 text-emerald-600" /> Secure enrollment
          </span>
        </div>
      </header>
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Suspense fallback={<div className="mx-auto h-[36rem] max-w-6xl animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />}>
          <Checkout params={params} searchParams={searchParams} />
        </Suspense>
      </main>
      <footer className="flex flex-col items-center gap-2 px-4 pb-8 text-center text-xs text-slate-500 sm:flex-row sm:justify-center sm:gap-6">
        <span className="flex items-center gap-1.5"><IconShield className="h-4 w-4" /> Your details are private and used only for your enrollment.</span>
        <Link href="/courses" className="flex items-center gap-1 font-semibold text-brand-ink hover:underline">Browse courses <IconArrowRight className="h-3 w-3" /></Link>
      </footer>
    </div>
  );
}
