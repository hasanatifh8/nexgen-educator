import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { allLessons } from "@/lib/catalog";
import { getCourse } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import LessonEditor from "./LessonEditor";
import { AccessDenied, AdminTitle, adminSkeleton } from "../../../../ui";

type P = PageProps<"/admin/courses/[id]/content/[lessonId]">;

async function EditLesson({ params }: { params: P["params"] }) {
  const { id, lessonId } = await params;
  if (!(await requireAdmin(`/admin/courses/${id}/content/${lessonId}`))) return <AccessDenied />;
  const course = await getCourse(id);
  const lesson = course && allLessons(course).find((l) => l.id === lessonId);
  if (!course || !lesson) notFound();

  return (
    <>
      <AdminTitle
        title="Edit lesson"
        subtitle={`${course.title} · ${lesson.moduleTitle}`}
        action={<Link href={`/courses/${course.id}/learn/${lesson.id}`} className="btn-secondary">Open in course ↗</Link>}
      />
      <LessonEditor courseId={course.id} lessonId={lesson.id} initial={{ title: lesson.title, minutes: lesson.minutes, blocks: lesson.blocks }} />
    </>
  );
}

export default function EditLessonPage({ params }: P) {
  return <Suspense fallback={adminSkeleton}><EditLesson params={params} /></Suspense>;
}
