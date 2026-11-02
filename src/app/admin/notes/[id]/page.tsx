import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { IconDownload, IconFile } from "@/components/Icons";
import { getCatalog } from "@/lib/catalogStore";
import { isAdminEmail, requireAdmin } from "@/lib/dal";
import { fmtDate, fmtSize } from "@/lib/learner";
import { getNote } from "@/lib/notes";
import { listUsers } from "@/lib/users";
import { assignNoteAction, deleteNoteAction, updateNoteAction } from "../../actions";
import ConfirmDelete from "../../ConfirmDelete";
import { AccessDenied, Flash, adminSkeleton, one } from "../../ui";
import NoteForm from "../NoteForm";
import PickList from "../PickList";

type P = PageProps<"/admin/notes/[id]">;

const SAVED: Record<string, string> = { new: "notes upload", details: "note details", assigned: "learner access" };

async function NoteDetail({ params, searchParams }: { params: P["params"]; searchParams: P["searchParams"] }) {
  const { id } = await params;
  if (!(await requireAdmin(`/admin/notes/${id}`))) return <AccessDenied />;
  const sp = await searchParams;
  const [note, users, { courses }] = await Promise.all([getNote(id), listUsers(), getCatalog()]);
  if (!note) notFound();
  const course = note.courseId ? courses.find((c) => c.id === note.courseId) : undefined;
  const learners = users.filter((u) => !isAdminEmail(u.email)).sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));

  return (
    <>
      <Link href="/admin/notes" className="text-sm font-semibold text-brand-ink hover:underline">← All notes</Link>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600"><IconFile className="h-7 w-7" /></span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold text-navy-900">{note.title}</h1>
            <p className="text-sm text-slate-500">{note.file.originalName} · {fmtSize(note.file.size)} · uploaded {fmtDate(note.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/admin/notes/${note.id}/file`} target="_blank" rel="noopener noreferrer" className="btn-secondary py-2 text-sm">Open PDF</a>
          <a href={`/admin/notes/${note.id}/file?download`} className="btn-secondary py-2 text-sm"><IconDownload className="h-4 w-4" /> Download</a>
          <ConfirmDelete action={deleteNoteAction} id={note.id} name={note.title} />
        </div>
      </div>

      <Flash saved={SAVED[one(sp.saved) ?? ""]} error={one(sp.error)} />
      {sp.saved === "new" && (
        <p className="mt-3 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-100">Next step: choose the learners who should see these notes.</p>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">Who can read these notes</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">Selected learners see the notes under Notes in their portal. Unticking someone removes their access straight away.</p>
          <PickList
            action={assignNoteAction}
            hidden={{ id: note.id }}
            name="userIds"
            noun="learner"
            empty="No learners have registered yet."
            selected={note.assignedTo}
            items={learners.map((u) => ({
              id: u.id,
              title: `${u.firstName} ${u.lastName}`,
              sub: u.email,
              tag: course && u.assignedCourses.includes(course.id) ? "In course" : undefined,
            }))}
            shortcut={course ? { label: `Add everyone in “${course.title}”`, ids: learners.filter((u) => u.assignedCourses.includes(course.id)).map((u) => u.id) } : undefined}
          />
        </section>

        <section className="card self-start p-6">
          <h2 className="mb-5 font-display text-lg font-semibold text-navy-900">Details</h2>
          <NoteForm
            action={updateNoteAction}
            courses={courses.map((c) => ({ id: c.id, title: c.title }))}
            note={{ id: note.id, title: note.title, description: note.description, courseId: note.courseId, fileName: note.file.originalName }}
          />
        </section>
      </div>
    </>
  );
}

export default function NoteDetailPage({ params, searchParams }: P) {
  return <Suspense fallback={adminSkeleton}><NoteDetail params={params} searchParams={searchParams} /></Suspense>;
}
