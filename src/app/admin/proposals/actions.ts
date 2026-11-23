"use server";

import { redirect } from "next/navigation";
import { getCatalog } from "@/lib/catalogStore";
import { getCurrentUser } from "@/lib/dal";
import { proposalPrograms } from "@/lib/proposal/data";
import { cleanProposal, validateProposal, type ProposalErrors, type ProposalInput } from "@/lib/proposal/types";
import { deleteProposal, markProposalDownloaded, saveProposal } from "@/lib/proposals";

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) throw new Error("Not authorized");
  return user;
}

export type SaveProposalResult = { ok: true; id: string; ref: string } | { ok: false; error: string; fieldErrors?: ProposalErrors };

/** Creates (id = null) or updates a proposal. Called directly from the editor with the form values. */
export async function saveProposalAction(id: string | null, raw: ProposalInput): Promise<SaveProposalResult> {
  await assertAdmin();
  const known = proposalPrograms(await getCatalog()).map((p) => p.id);
  const input = cleanProposal(raw ?? {}, known);
  const fieldErrors = validateProposal(input);
  if (Object.keys(fieldErrors).length) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  const saved = await saveProposal(input, id ?? undefined);
  if (!saved) return { ok: false, error: "This proposal was deleted. Reload the page to start a new one." };
  return { ok: true, id: saved.id, ref: saved.ref };
}

export async function markProposalDownloadedAction(id: string) {
  await assertAdmin();
  await markProposalDownloaded(String(id));
}

export async function deleteProposalAction(fd: FormData) {
  await assertAdmin();
  await deleteProposal(String(fd.get("id") ?? ""));
  redirect("/admin/proposals?deleted=1");
}
