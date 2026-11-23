import Link from "next/link";
import { Suspense } from "react";
import { todayIST } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";
import { blankProposal } from "@/lib/proposal/types";
import { AccessDenied, AdminTitle, adminSkeleton } from "../../ui";
import ProposalEditor from "../ProposalEditor";
import { proposalEditorData } from "../editorData";

async function NewProposal() {
  const admin = await requireAdmin("/admin/proposals/new");
  if (!admin) return <AccessDenied />;
  const { sender, ...data } = await proposalEditorData(admin);
  // Programmes that have real lessons are ticked by default; empty placeholders are left for the admin to add.
  const ready = data.programs.filter((p) => p.courses.some((c) => c.lessons > 0)).map((p) => p.id);
  const initial = blankProposal(todayIST(), sender, ready.length ? ready : data.programs.map((p) => p.id));
  return (
    <>
      <Link href="/admin/proposals" className="text-sm font-semibold text-brand-ink hover:underline">← All proposals</Link>
      <div className="mt-3">
        <AdminTitle title="New school proposal" subtitle="Fill in the principal’s and school’s details — the preview updates as you type. Download the PDF and send it." />
      </div>
      <div className="mt-6">
        <ProposalEditor initial={initial} {...data} />
      </div>
    </>
  );
}

export default function NewProposalPage() {
  return <Suspense fallback={adminSkeleton}><NewProposal /></Suspense>;
}
