import { randomUUID } from "node:crypto";
import { getJson, setJson, withLock } from "./store";

/** Course enquiries, stored as one document (Postgres in production, data/enquiries.json locally — see ./store). */
const KEY = "enquiries";

import type { EnquiryStatus } from "./enquiryOptions";

export { CALL_TIMES, ENQUIRY_STATUSES, type EnquiryStatus } from "./enquiryOptions";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  courseId: string;
  courseTitle: string;
  callTime: string;
  message?: string;
  /** Where the enquiry was made, e.g. "home" or "course-page". */
  source: string;
  createdAt: string;
  status: EnquiryStatus;
  adminNote?: string;
  updatedAt?: string;
};

async function readAll(): Promise<Enquiry[]> {
  return (await getJson<Enquiry[]>(KEY)) ?? [];
}

async function writeAll(list: Enquiry[]) {
  await setJson(KEY, list);
}

export async function listEnquiries() {
  return (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Enquiries from this phone number in the last 24 hours (basic flood protection). */
export async function recentFromPhone(phone: string) {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  return (await readAll()).filter((e) => e.phone === phone && Date.parse(e.createdAt) > since).length;
}

export async function addEnquiry(input: Omit<Enquiry, "id" | "createdAt" | "status">) {
  return withLock(KEY, async () => {
    const list = await readAll();
    const enquiry: Enquiry = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), status: "new" };
    await writeAll([...list, enquiry]);
    return enquiry;
  });
}

export async function updateEnquiry(id: string, patch: { status: EnquiryStatus; adminNote?: string }) {
  return withLock(KEY, async () => {
    const list = await readAll();
    const e = list.find((x) => x.id === id);
    if (!e) return null;
    e.status = patch.status;
    if (patch.adminNote) e.adminNote = patch.adminNote;
    else delete e.adminNote;
    e.updatedAt = new Date().toISOString();
    await writeAll(list);
    return e;
  });
}
