import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import CourseCatalog from "@/components/CourseCatalog";
import Footer from "@/components/Footer";
import PageHeader, { GridSkeleton } from "@/components/PageHeader";
import { IconArrowRight, IconBadge, IconClock, IconShield } from "@/components/Icons";
import { connection } from "next/server";
import { toCourseSummary, toPublicProgram } from "@/lib/catalog";
import { canAccessCourse } from "@/lib/access";
import { getCatalog } from "@/lib/catalogStore";
import { getCurrentUser } from "@/lib/dal";
import { courseProgress } from "@/components/learn/progress";

export const metadata: Metadata = {
  title: "Courses — NextGen Educator",
  description: "Certification-ready courses in AI tools for teachers, assessment design, and classroom management.",
};

const highlights = [
  { icon: IconClock, label: "Self-paced, 3–8 hour courses" },
  { icon: IconShield, label: "Timed, scenario-based final exam" },
  { icon: IconBadge, label: "Verifiable digital credential" },
];

/** Public catalog: anyone can browse; buttons adapt to the viewer’s profile and assignments. */
async function Catalog({ searchParams }: { searchParams: PageProps<"/courses">["searchParams"] }) {
  await connection(); // catalog changes from the admin portal must show immediately
  const [user, { programs, courses }, { requested }] = await Promise.all([getCurrentUser(), getCatalog(), searchParams]);
  const requestedTitle = typeof requested === "string" ? courses.find((c) => c.id === requested)?.title : undefined;
  return (
    <>
      {requestedTitle && (
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <p role="status" className="rounded-xl bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
            Request sent for <span className="font-semibold">{requestedTitle}</span>. Our team will review it and assign the course to you.
          </p>
        </div>
      )}
      <CourseCatalog
        courses={courses.map(toCourseSummary)}
        programs={programs.map(toPublicProgram)}
        viewer={
          user && {
            profileComplete: user.profileComplete,
            unlocked: courses.filter((c) => canAccessCourse(user, c.id)).map((c) => c.id),
            requested: user.requests.map((r) => r.courseId),
            completed: Object.fromEntries(courses.map((c) => [c.id, courseProgress(c, user.progress[c.id]).count])),
          }
        }
      />
    </>
  );
}

export default function CoursesPage({ searchParams }: PageProps<"/courses">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader crumb="Courses" title="Certification-ready courses">
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Browse every course and its full syllabus. Register, complete your profile, and our team assigns your courses — then finish them to unlock the certification exam.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Icon className="h-4 w-4 text-brand-teal" /> {label}
              </li>
            ))}
          </ul>
        </PageHeader>

        <Suspense fallback={<GridSkeleton />}>
          <Catalog searchParams={searchParams} />
        </Suspense>

        <section className="py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:px-6">
            <h2 className="section-title">Not sure where to start?</h2>
            <p className="text-lg text-slate-600">Take the free 5-minute diagnostic and we’ll show you where you stand.</p>
            <Link href="/#practice-tests" className="btn-primary px-6 py-3">
              Take Diagnostic Quiz <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
