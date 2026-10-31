import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { toCourseSummary } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import CourseForm from "../CourseForm";
import { AccessDenied, AdminTitle, adminSkeleton } from "../../ui";

async function EditCourse({ params }: { params: PageProps<"/admin/courses/[id]">["params"] }) {
  const { id } = await params;
  if (!(await requireAdmin(`/admin/courses/${id}`))) return <AccessDenied />;
  const { programs, courses } = await getCatalog();
  const options = programs.map(({ id, title, price, category }) => ({ id, title, price, category }));

  if (!programs.length) {
    return (
      <div className="card p-10 text-center">
        <p className="text-slate-600">Create a certification program first — every course belongs to one.</p>
        <Link href="/admin/programs/new" className="btn-primary mt-5">New program</Link>
      </div>
    );
  }
  if (id === "new") {
    return (
      <>
        <AdminTitle title="New course" subtitle="It appears on the Courses page as soon as you save." />
        <CourseForm programs={options} />
      </>
    );
  }
  const course = courses.find((c) => c.id === id);
  if (!course) notFound();
  return (
    <>
      <AdminTitle
        title="Edit course"
        subtitle={course.title}
        action={
          <div className="flex gap-2">
            <Link href={`/courses/${course.id}`} className="btn-secondary">View page</Link>
            <Link href={`/admin/courses/${course.id}/content`} className="btn-primary">Edit content →</Link>
          </div>
        }
      />
      <CourseForm course={toCourseSummary(course)} programs={options} />
    </>
  );
}

export default function EditCoursePage({ params }: PageProps<"/admin/courses/[id]">) {
  return <Suspense fallback={adminSkeleton}><EditCourse params={params} /></Suspense>;
}
