import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { IconDownload, IconPhone } from "@/components/Icons";
import { requireAdmin } from "@/lib/dal";
import { ENQUIRY_STATUSES, listEnquiries, type EnquiryStatus } from "@/lib/enquiries";
import { updateEnquiryAction } from "../actions";
import { AccessDenied, AdminTitle, adminSkeleton, one } from "../ui";
import { formatIST, requestTime, timeAgo } from "./format";

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  new: "bg-orange-50 text-orange-700 ring-orange-200",
  contacted: "bg-sky-50 text-sky-700 ring-sky-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};
const LABEL: Record<EnquiryStatus, string> = { new: "New", contacted: "Contacted", closed: "Closed" };

async function Enquiries({ searchParams }: { searchParams: PageProps<"/admin/enquiries">["searchParams"] }) {
  if (!(await requireAdmin("/admin/enquiries"))) return <AccessDenied />;
  await connection();
  const sp = await searchParams;
  const status = one(sp.status) ?? "new";
  const q = (one(sp.q) ?? "").trim().toLowerCase();
  const course = one(sp.course) ?? "";

  const all = await listEnquiries();
  const now = requestTime();
  const counts = Object.fromEntries([["all", all.length], ...ENQUIRY_STATUSES.map((s) => [s, all.filter((e) => e.status === s).length])]);
  const courses = [...new Map(all.map((e) => [e.courseId, e.courseTitle])).entries()];
  const shown = all
    .filter((e) => status === "all" || e.status === status)
    .filter((e) => !course || e.courseId === course)
    .filter((e) => !q || `${e.name} ${e.phone} ${e.email ?? ""} ${e.courseTitle} ${e.message ?? ""}`.toLowerCase().includes(q));
  const qs = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ status, ...(q ? { q } : {}), ...(course ? { course } : {}), ...patch });
    return `/admin/enquiries?${p}`;
  };
  const back = qs({});

  return (
    <>
      <AdminTitle
        title="Course enquiries"
        subtitle="Call-back requests from the website. Times are shown in IST."
        action={<a href={`/admin/enquiries/export?status=${status}`} className="btn-secondary"><IconDownload className="h-4 w-4" /> Download CSV</a>}
      />

      <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {(["new", "contacted", "closed", "all"] as const).map((s) => (
            <Link key={s} href={qs({ status: s })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${status === s ? "bg-navy-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-navy-900"}`}>
              {s === "all" ? "All" : LABEL[s]} <span className="ml-1 opacity-60">{counts[s]}</span>
            </Link>
          ))}
        </nav>
        <form className="flex flex-wrap gap-2">
          <input type="hidden" name="status" value={status} />
          <select name="course" defaultValue={course} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand">
            <option value="">All courses</option>
            {courses.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
          </select>
          <input name="q" defaultValue={q} placeholder="Search name, phone, email" className="w-56 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-sky-100" />
          <button className="btn-secondary py-2">Filter</button>
        </form>
      </div>

      <div className="mt-6 space-y-4">
        {shown.map((e) => (
          <article key={e.id} className={`card p-5 ${e.status === "new" ? "border-l-4 border-l-accent" : ""}`}>
            <div className="grid gap-5 lg:grid-cols-[200px_1fr_300px]">
              <div>
                <p className="text-sm font-semibold text-navy-900">{formatIST(e.createdAt)}</p>
                <p className="text-xs text-slate-500">{timeAgo(e.createdAt, now)}</p>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLE[e.status]}`}>{LABEL[e.status]}</span>
                {e.updatedAt && <p className="mt-1 text-[11px] text-slate-400">Updated {formatIST(e.updatedAt)}</p>}
              </div>

              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-navy-900">{e.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <a href={`tel:+91${e.phone}`} className="flex items-center gap-1.5 font-semibold text-brand-ink hover:underline"><IconPhone className="h-4 w-4" /> +91 {e.phone}</a>
                  <a href={`https://wa.me/91${e.phone}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-700 hover:underline">WhatsApp</a>
                  {e.email && <a href={`mailto:${e.email}`} className="text-slate-600 hover:underline">{e.email}</a>}
                </div>
                <p className="mt-3 text-sm text-slate-700">
                  <span className="text-slate-500">Course:</span>{" "}
                  <Link href={`/courses/${e.courseId}`} className="font-semibold text-navy-900 hover:text-brand-ink">{e.courseTitle}</Link>
                </p>
                <p className="text-sm text-slate-700"><span className="text-slate-500">Best time:</span> {e.callTime} · <span className="text-slate-500">via</span> {e.source === "course-page" ? "course page" : "home page"}</p>
                {e.message && <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-100">“{e.message}”</p>}
              </div>

              <form action={updateEnquiryAction} className="space-y-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="back" value={back} />
                <label className="block text-xs font-semibold text-slate-600" htmlFor={`st-${e.id}`}>Status</label>
                <select id={`st-${e.id}`} name="status" defaultValue={e.status} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand">
                  {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                </select>
                <input name="note" defaultValue={e.adminNote} maxLength={300} placeholder="Note, e.g. called — interested, send fee details" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand" />
                <button className="btn-primary w-full py-2">Save</button>
              </form>
            </div>
          </article>
        ))}
        {shown.length === 0 && (
          <div className="card px-5 py-14 text-center">
            <p className="font-display text-lg font-semibold text-navy-900">No enquiries here</p>
            <p className="mt-1 text-sm text-slate-500">{all.length ? "Try another filter." : "Enquiries from the website’s “Enquire now” buttons will appear here."}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminEnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  return <Suspense fallback={adminSkeleton}><Enquiries searchParams={searchParams} /></Suspense>;
}
