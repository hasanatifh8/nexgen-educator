import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCourse } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import CurriculumBuilder, { type CurriculumData } from "./CurriculumBuilder";
import { AccessDenied, AdminTitle, Flash, adminSkeleton, one } from "../../../ui";

type P = PageProps<"/admin/courses/[id]/content">;

async function Content({ params, searchParams }: { params: P["params"]; searchParams: P["searchParams"] }) {
  const { id } = await params;
  if (!(await requireAdmin(`/admin/courses/${id}/content`))) return <AccessDenied />;
  const sp = await searchParams;
  const course = await getCourse(id);
  if (!course) notFound();

  const data: CurriculumData = course.modules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map((l) => ({ id: l.id, title: l.title, minutes: l.minutes, blockCount: l.blocks.length })),
  }));
  const saved = one(sp.saved);

  return (
    <>
      <AdminTitle
        title="Course content"
        subtitle={course.title}
        action={
          <div className="flex gap-2">
            <Link href={`/admin/courses/${course.id}`} className="btn-secondary">Course details</Link>
            <Link href={`/courses/${course.id}`} className="btn-secondary">Preview as learner ↗</Link>
          </div>
        }
      />
      {sp.created === "1" && (
        <p className="mt-6 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-100">
          <span className="font-semibold">Course created.</span> Add a module, then add lessons from a template.
        </p>
      )}
      <Flash saved={saved === "1" ? "curriculum" : saved} />
      {/* Key forces a fresh builder after each save so drafts match the stored curriculum. */}
      <CurriculumBuilder key={JSON.stringify(data)} courseId={course.id} initial={data} />
    </>
  );
}

export default function CourseContentPage({ params, searchParams }: P) {
  return <Suspense fallback={adminSkeleton}><Content params={params} searchParams={searchParams} /></Suspense>;
}
