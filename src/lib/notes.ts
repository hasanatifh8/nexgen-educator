import { randomUUID } from "node:crypto";
import { getJson, setJson, withLock } from "./store";
import { NOTES_OWNER, deleteUpload, readUpload } from "./uploads";
import type { StoredFile } from "./users";

/**
 * PDF study notes uploaded by admins and shared with chosen learners. Stored as one document (Postgres in
 * production, data/notes.json locally — see ./store), separate from user accounts. Files are private and
 * only served to admins and the learners a note is assigned to.
 */
const KEY = "notes";

export type Note = {
  id: string;
  title: string;
  description?: string;
  /** Optional course the notes accompany, shown to learners as context. */
  courseId?: string;
  file: StoredFile;
  /** User ids of the learners who can open this note. */
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
};

async function readAll(): Promise<Note[]> {
  return (await getJson<Note[]>(KEY)) ?? [];
}

const newestFirst = (a: Note, b: Note) => b.createdAt.localeCompare(a.createdAt);

export async function listNotes() {
  return (await readAll()).sort(newestFirst);
}

export async function getNote(id: string) {
  return (await readAll()).find((n) => n.id === id);
}

export async function notesForUser(userId: string) {
  return (await readAll()).filter((n) => n.assignedTo.includes(userId)).sort(newestFirst);
}

export async function createNote(input: Pick<Note, "title" | "description" | "courseId" | "file">) {
  return withLock(KEY, async () => {
    const now = new Date().toISOString();
    const note: Note = { ...input, id: randomUUID(), assignedTo: [], createdAt: now, updatedAt: now };
    await setJson(KEY, [...(await readAll()), note]);
    return note;
  });
}

/** Updates details and optionally swaps the PDF; the replaced file is deleted. */
export async function updateNote(id: string, patch: Pick<Note, "title" | "description" | "courseId"> & { file?: StoredFile }) {
  const old = await withLock(KEY, async () => {
    const list = await readAll();
    const note = list.find((n) => n.id === id);
    if (!note) return null;
    const previous = patch.file ? note.file : undefined;
    Object.assign(note, { title: patch.title, description: patch.description, courseId: patch.courseId, updatedAt: new Date().toISOString() });
    if (patch.file) note.file = patch.file;
    await setJson(KEY, list);
    return { previous };
  });
  if (old?.previous) await deleteUpload(NOTES_OWNER, old.previous);
  return !!old;
}

export async function deleteNote(id: string) {
  const removed = await withLock(KEY, async () => {
    const list = await readAll();
    const note = list.find((n) => n.id === id);
    if (note) await setJson(KEY, list.filter((n) => n.id !== id));
    return note;
  });
  if (removed) await deleteUpload(NOTES_OWNER, removed.file);
}

/** Sets who can open one note. Returns the learners who were newly given access. */
export async function setNoteAssignees(id: string, userIds: string[]) {
  return withLock(KEY, async () => {
    const list = await readAll();
    const note = list.find((n) => n.id === id);
    if (!note) return null;
    const added = userIds.filter((u) => !note.assignedTo.includes(u));
    note.assignedTo = [...new Set(userIds)];
    note.updatedAt = new Date().toISOString();
    await setJson(KEY, list);
    return { note, added };
  });
}

/** Sets which notes one learner can open. Returns the notes newly shared with them. */
export async function setUserNotes(userId: string, noteIds: string[]) {
  return withLock(KEY, async () => {
    const list = await readAll();
    const added: Note[] = [];
    for (const note of list) {
      const has = note.assignedTo.includes(userId);
      const want = noteIds.includes(note.id);
      if (want && !has) {
        note.assignedTo.push(userId);
        added.push(note);
      } else if (!want && has) {
        note.assignedTo = note.assignedTo.filter((u) => u !== userId);
      }
    }
    await setJson(KEY, list);
    return added;
  });
}

/** Streams a note's PDF. Callers must have checked that the viewer may open it. */
export async function noteResponse(note: Note | undefined, download = false) {
  const data = note ? await readUpload(NOTES_OWNER, note.file) : null;
  if (!note || !data) return new Response("Not found", { status: 404 });
  const name = `${note.title}.pdf`.replace(/[^\w.-]+/g, "_");
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(data.length),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      // A malicious PDF can never run scripts in our origin.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "Referrer-Policy": "no-referrer",
    },
  });
}
