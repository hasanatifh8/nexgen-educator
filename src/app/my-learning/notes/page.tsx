import Link from "next/link";
import { Suspense } from "react";
import { IconDownload, IconFile } from "@/components/Icons";
import { fmtDate, fmtSize } from "@/lib/learner";
import { notesForUser } from "@/lib/notes";
import { loadLearner } from "../data";
import { Empty, PageTitle, Pill, portalSkeleton } from "../ui";

const WEEK = 7 * 24 * 60 * 60 * 1000;

async function Notes() {
  const { session: user, catalog } = await loadLearner("/my-learning/notes");
  const notes = await notesForUser(user.id);
  const courseTitle = Object.fromEntries(catalog.courses.map((c) => [c.id, c.title]));
  // Render time is per request here, so "new" reflects when the learner opens the page.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  return (
    <>
      <PageTitle
        eyebrow="Study material"
        title="My notes"
        subtitle="PDF notes our team has shared with you. Read them online or download them to study offline."
      />
      {notes.length ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {notes.map((n) => (
            <li key={n.id} className="flex min-w-0 flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
                  <IconFile className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-base leading-snug font-semibold text-navy-900">{n.title}</h2>
                    {now - Date.parse(n.createdAt) < WEEK && <Pill tone="green">New</Pill>}
                  </div>
                  {n.courseId && courseTitle[n.courseId] && (
                    <Link href={`/courses/${n.courseId}`} className="mt-0.5 block truncate text-xs font-semibold text-brand-ink hover:underline">{courseTitle[n.courseId]}</Link>
                  )}
                  {n.description && <p className="mt-2 text-sm text-slate-600">{n.description}</p>}
                  <p className="mt-2 text-xs text-slate-500">PDF · {fmtSize(n.file.size)} · added {fmtDate(n.createdAt)}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <a href={`/my-learning/notes/${n.id}/file`} target="_blank" rel="noopener noreferrer" className="btn-primary py-2.5 text-sm">Read notes</a>
                <a href={`/my-learning/notes/${n.id}/file?download`} className="btn-secondary py-2.5 text-sm"><IconDownload className="h-4 w-4" /> Download</a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="No notes yet">
          When our team shares study notes with you, they appear here and we let you know by email.
        </Empty>
      )}
      <p className="mt-6 text-center text-xs text-slate-500">These notes are shared with you personally. Please do not forward or publish them.</p>
    </>
  );
}

export default function NotesPage() {
  return <Suspense fallback={portalSkeleton}><Notes /></Suspense>;
}
