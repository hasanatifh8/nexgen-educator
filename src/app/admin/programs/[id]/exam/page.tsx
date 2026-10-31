import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProgram } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import ExamBuilder from "./ExamBuilder";
import { AccessDenied, AdminTitle, adminSkeleton } from "../../../ui";

async function EditExam({ params }: { params: PageProps<"/admin/programs/[id]/exam">["params"] }) {
  const { id } = await params;
  if (!(await requireAdmin(`/admin/programs/${id}/exam`))) return <AccessDenied />;
  const program = await getProgram(id);
  if (!program) notFound();
  return (
    <>
      <AdminTitle title="Certification exam" subtitle={program.title} />
      <ExamBuilder programId={program.id} exam={program.exam} />
    </>
  );
}

export default function EditExamPage({ params }: PageProps<"/admin/programs/[id]/exam">) {
  return <Suspense fallback={adminSkeleton}><EditExam params={params} /></Suspense>;
}
