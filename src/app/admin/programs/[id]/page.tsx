import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { toPublicProgram } from "@/lib/catalog";
import { getProgram } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import ProgramForm from "../ProgramForm";
import { AccessDenied, AdminTitle, adminSkeleton } from "../../ui";

async function EditProgram({ params }: { params: PageProps<"/admin/programs/[id]">["params"] }) {
  const { id } = await params;
  if (!(await requireAdmin(`/admin/programs/${id}`))) return <AccessDenied />;
  if (id === "new") {
    return (
      <>
        <AdminTitle title="New certification program" subtitle="After creating it, add courses and build its exam." />
        <ProgramForm />
      </>
    );
  }
  const program = await getProgram(id);
  if (!program) notFound();
  return (
    <>
      <AdminTitle
        title="Edit program"
        subtitle={program.title}
        action={<Link href={`/admin/programs/${program.id}/exam`} className="btn-secondary">Edit exam →</Link>}
      />
      <ProgramForm program={toPublicProgram(program)} />
    </>
  );
}

export default function EditProgramPage({ params }: PageProps<"/admin/programs/[id]">) {
  return <Suspense fallback={adminSkeleton}><EditProgram params={params} /></Suspense>;
}
