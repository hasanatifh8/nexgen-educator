import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/dal";
import { fmtDate } from "@/lib/learner";
import { cleanProposal } from "@/lib/proposal/types";
import { getProposal } from "@/lib/proposals";
import ConfirmDelete from "../../ConfirmDelete";
import { AccessDenied, adminSkeleton } from "../../ui";
import ProposalEditor from "../ProposalEditor";
import { deleteProposalAction } from "../actions";
import { proposalEditorData } from "../editorData";

type P = PageProps<"/admin/proposals/[id]">;

async function EditProposal({ params, searchParams }: { params: P["params"]; searchParams: P["searchParams"] }) {
  const { id } = await params;
  const admin = await requireAdmin(`/admin/proposals/${id}`);
  if (!admin) return <AccessDenied />;
  const [proposal, sp] = await Promise.all([getProposal(id), searchParams]);
  if (!proposal) notFound();
  const { programs, org, stats, attemptsPerDay } = await proposalEditorData(admin);
  const { ref, createdAt, downloadedAt } = proposal;
  // Re-clean against today's catalog: programmes deleted since the proposal was saved drop out.
  const input = cleanProposal(proposal, programs.map((p) => p.id));

  return (
    <>
      <Link href="/admin/proposals" className="text-sm font-semibold text-brand-ink hover:underline">← All proposals</Link>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900">{proposal.schoolName}</h1>
          <p className="mt-1 text-slate-600">
            <span className="font-mono text-sm font-semibold text-navy-900">{ref}</span> · created {fmtDate(createdAt)}
            {downloadedAt ? ` · last downloaded ${fmtDate(downloadedAt)}` : " · not downloaded yet"}
          </p>
        </div>
        <ConfirmDelete action={deleteProposalAction} id={proposal.id} name={`the proposal for ${proposal.schoolName}`} label="Delete proposal" />
      </div>
      <div className="mt-6">
        <ProposalEditor key={proposal.id} initial={input} saved={{ id: proposal.id, ref }} programs={programs} org={org} stats={stats} attemptsPerDay={attemptsPerDay} autoDownload={sp.download === "1"} />
      </div>
    </>
  );
}

export default function EditProposalPage({ params, searchParams }: P) {
  return <Suspense fallback={adminSkeleton}><EditProposal params={params} searchParams={searchParams} /></Suspense>;
}
