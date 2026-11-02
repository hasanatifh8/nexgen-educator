import Link from "next/link";
import { Suspense } from "react";
import { IconFile } from "@/components/Icons";
import { getCatalog } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import { fmtDate, fmtSize } from "@/lib/learner";
import { listNotes } from "@/lib/notes";
import { deleteNoteAction, createNoteAction } from "../actions";
import ConfirmDelete from "../ConfirmDelete";
import { AccessDenied, AdminTitle, Flash, adminSkeleton, one } from "../ui";
import NoteForm from "./NoteForm";

async function Notes({ searchParams }: { searchParams: PageProps<"/admin/notes">["searchParams"] }) {
  if (!(await requireAdmin("/admin/notes"))) return <AccessDenied />;
  const sp = await searchParams;
  const [notes, { courses }] = await Promise.all([listNotes(), getCatalog()]);
  const courseTitle = Object.fromEntries(courses.map((c) => [c.id, c.title]));

  return (
    <>
      <AdminTitle title="PDF notes" subtitle="Upload study notes as PDFs and choose which learners can read them. Notes stay private to the learners you assign." />
      <Flash deleted={sp.deleted === "1"} error={one(sp.error)} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="card self-start p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">Upload new notes</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">After uploading, you choose the learners on the next screen.</p>
          <NoteForm action={createNoteAction} courses={courses.map((c) => ({ id: c.id, title: c.title }))} />
        </section>

        <section className="card overflow-x-auto">
          {notes.length ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr><th className="px-5 py-3">Notes</th><th className="px-5 py-3">Assigned to</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes.map((n) => (
                  <tr key={n.id} className="align-top">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600"><IconFile className="h-4 w-4" /></span>
                        <div className="min-w-0">
                          <Link href={`/admin/notes/${n.id}`} className="font-semibold text-navy-900 hover:text-brand-ink">{n.title}</Link>
                          <p className="text-xs text-slate-500">
                            {n.courseId && courseTitle[n.courseId] ? `${courseTitle[n.courseId]} · ` : ""}{fmtSize(n.file.size)} · uploaded {fmtDate(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {n.assignedTo.length ? (
                        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700 ring-1 ring-sky-100">{n.assignedTo.length} learner{n.assignedTo.length === 1 ? "" : "s"}</span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200">Not assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/notes/${n.id}`} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-ink hover:bg-sky-50">Assign & edit</Link>
                        <a href={`/admin/notes/${n.id}/file`} target="_blank" rel="noopener noreferrer" className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-100">Open</a>
                        <ConfirmDelete action={deleteNoteAction} id={n.id} name={n.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400"><IconFile className="h-6 w-6" /></span>
              <p className="mt-3 font-semibold text-navy-900">No notes yet</p>
              <p className="mt-1 text-sm text-slate-500">Upload your first PDF using the form.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default function NotesPage({ searchParams }: PageProps<"/admin/notes">) {
  return <Suspense fallback={adminSkeleton}><Notes searchParams={searchParams} /></Suspense>;
}
