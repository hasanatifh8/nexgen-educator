import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { IconBell, IconDownload } from "@/components/Icons";
import { launchLabel } from "@/lib/catalog";
import { getCourse } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import { fmtDate } from "@/lib/learner";
import { emailWaitingListAction } from "../../../actions";
import { AccessDenied, adminSkeleton } from "../../../ui";
import { waitlistRows } from "./rows";

type P = PageProps<"/admin/courses/[id]/waitlist">;

const PROFILE_TONE = {
  Verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Awaiting review": "bg-amber-50 text-amber-700 ring-amber-200",
  "Needs changes": "bg-red-50 text-red-700 ring-red-200",
  Incomplete: "bg-slate-100 text-slate-600 ring-slate-200",
} as const;

/** Who tapped “Notify me” on a course, so the team can follow up before and after it opens. */
async function Waitlist({ params }: { params: P["params"] }) {
  const { id } = await params;
  if (!(await requireAdmin(`/admin/courses/${id}/waitlist`))) return <AccessDenied />;
  const course = await getCourse(id);
  if (!course) notFound();
  const rows = await waitlistRows(id);
  const open = !course.launch && !course.disabled;

  return (
    <>
      <Link href="/admin/courses" className="text-sm font-semibold text-brand-ink hover:underline">← All courses</Link>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-navy-900"><IconBell className="h-6 w-6 text-violet-600" /> Waiting list</h1>
          <p className="mt-1 text-slate-600">
            {course.title} ·{" "}
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap ring-1 ${course.launch ? "bg-violet-100 text-violet-700 ring-violet-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}>
              {course.launch ? launchLabel(course.launch) : "Open for enrollment"}
            </span>
          </p>
        </div>
        {rows.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <a href={`/admin/courses/${course.id}/waitlist/export`} className="btn-secondary py-2 text-sm"><IconDownload className="h-4 w-4" /> Download CSV</a>
            {open && (
              <form action={emailWaitingListAction}>
                <input type="hidden" name="id" value={course.id} />
                <button type="submit" className="btn bg-violet-600 py-2 text-sm text-white hover:bg-violet-700">Email all {rows.length} that it’s open</button>
              </form>
            )}
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-slate-500">
        {rows.length} learner{rows.length === 1 ? "" : "s"} tapped “Notify me”.{" "}
        {open ? "Emailing them clears the list." : "When the course opens, you can email everyone from here or from the Courses list."}
      </p>

      <div className="card mt-6 overflow-x-auto">
        {rows.length ? (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr><th className="px-5 py-3">Learner</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Work</th><th className="px-5 py-3">Profile</th><th className="px-5 py-3">Joined list</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.userId} className="align-top">
                  <td className="px-5 py-3">
                    <Link href={`/admin/users/${r.userId}`} className="font-semibold text-navy-900 hover:text-brand-ink">{r.name}</Link>
                    <p className="text-xs text-slate-500">Registered {fmtDate(r.registeredAt)}{r.location ? ` · ${r.location}` : ""}</p>
                    {r.enrolled && <span className="mt-1 inline-block rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700 ring-1 ring-sky-100">Already enrolled or requested</span>}
                  </td>
                  <td className="px-5 py-3">
                    <a href={`mailto:${r.email}`} className="block text-brand-ink hover:underline">{r.email}</a>
                    {r.phone ? <a href={`tel:+91${r.phone}`} className="block text-slate-600 hover:underline">+91 {r.phone}</a> : <span className="text-xs text-slate-400">No mobile yet (profile incomplete)</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {r.workStatus ?? "—"}
                    {r.institution && <span className="block text-xs text-slate-500">{r.institution}</span>}
                  </td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ring-1 ${PROFILE_TONE[r.profile]}`}>{r.profile}</span></td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-600">{r.joinedListAt ? fmtDate(r.joinedListAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-violet-50 text-violet-500"><IconBell className="h-6 w-6" /></span>
            <p className="mt-3 font-semibold text-navy-900">No one on the waiting list yet</p>
            <p className="mt-1 text-sm text-slate-500">Learners who tap “Notify me” on this course will appear here.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function WaitlistPage({ params }: P) {
  return <Suspense fallback={adminSkeleton}><Waitlist params={params} /></Suspense>;
}
