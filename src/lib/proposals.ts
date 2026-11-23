import { randomBytes } from "node:crypto";
import type { Proposal, ProposalInput } from "./proposal/types";
import { getJson, setJson, withLock } from "./store";

/** School proposals, stored as one document (Postgres in production, data/proposals.json locally — see ./store). */
const KEY = "proposals";

async function readAll(): Promise<Proposal[]> {
  return (await getJson<Proposal[]>(KEY)) ?? [];
}

export async function listProposals() {
  return (await readAll()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProposal(id: string) {
  return (await readAll()).find((p) => p.id === id);
}

/** Next reference for the year: NGE/PR/2026/0001, 0002, … */
function nextRef(list: Proposal[], year: string) {
  const prefix = `NGE/PR/${year}/`;
  const max = list.reduce((m, p) => (p.ref.startsWith(prefix) ? Math.max(m, Number(p.ref.slice(prefix.length)) || 0) : m), 0);
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

/** Creates a proposal (no id) or updates one. Returns null if the id no longer exists. */
export async function saveProposal(input: ProposalInput, id?: string): Promise<Proposal | null> {
  return withLock(KEY, async () => {
    const list = await readAll();
    const now = new Date().toISOString();
    if (id) {
      const i = list.findIndex((p) => p.id === id);
      if (i < 0) return null;
      list[i] = { ...list[i], ...input, updatedAt: now };
      await setJson(KEY, list);
      return list[i];
    }
    const created: Proposal = { ...input, id: randomBytes(8).toString("hex"), ref: nextRef(list, input.issuedOn.slice(0, 4)), createdAt: now, updatedAt: now };
    await setJson(KEY, [...list, created]);
    return created;
  });
}

export async function markProposalDownloaded(id: string) {
  await withLock(KEY, async () => {
    const list = await readAll();
    const p = list.find((x) => x.id === id);
    if (p) {
      p.downloadedAt = new Date().toISOString();
      await setJson(KEY, list);
    }
  });
}

export async function deleteProposal(id: string) {
  await withLock(KEY, async () => {
    await setJson(KEY, (await readAll()).filter((p) => p.id !== id));
  });
}
