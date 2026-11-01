import Link from "next/link";
import { Suspense } from "react";
import { formatINR, priceShort, priceWithGst } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import { deleteCourseAction, setCourseDisabledAction } from "../actions";
import ConfirmDelete from "../ConfirmDelete";
import { AccessDenied, AdminTitle, Flash, adminSkeleton, one } from "../ui";

async function Courses({ searchParams }: { searchParams: PageProps<"/admin/courses">["searchParams"] }) {
  if (!(await requireAdmin("/admin/courses"))) return <AccessDenied />;
  const sp = await searchParams;
  const { programs, courses } = await getCatalog();
  const programById = Object.fromEntries(programs.map((p) => [p.id, p]));

  return (
    <>
      <AdminTitle
        title="Courses"
        subtitle="Set each course’s fee, hide a course with Disable (assigned learners keep access), or delete it for good."
        action={<Link href="/admin/courses/new" className="btn-primary">+ New course</Link>}
      />
      <Flash saved={one(sp.saved)} deleted={sp.deleted === "1"} />
      {(one(sp.disabled) || one(sp.enabled)) && (
        <p role="status" className="mt-6 rounded-lg bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900 ring-1 ring-sky-100">
          {one(sp.disabled)
            ? `“${one(sp.disabled)}” is disabled. It is hidden from the website, the course finder and new requests; learners already assigned keep access.`
            : `“${one(sp.enabled)}” is enabled and visible on the website again.`}
        </p>
      )}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3">Course</th><th className="px-5 py-3">Program</th><th className="px-5 py-3">Fee</th>
              <th className="px-5 py-3">Content</th><th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((c) => {
              const p = programById[c.programId];
              return (
                <tr key={c.id} className={`align-top ${c.disabled ? "bg-slate-50/80 text-slate-400" : ""}`}>
                  <td className="px-5 py-4">
                    <p className="flex flex-wrap items-center gap-2 font-semibold text-navy-900">
                      {c.title}
                      {c.disabled && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-600">Disabled</span>}
                    </p>
                    <p className="text-xs text-slate-500">{c.category} · {c.level}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{p?.title ?? <span className="text-red-600">Missing program</span>}</td>
                  <td className="px-5 py-4">
                    {c.price === 0 ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">Free</span>
                    ) : (
                      <>
                        <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-orange-700 ring-1 ring-orange-100">Paid · {priceShort(c.price)}</span>
                        <span className="mt-1 block text-xs whitespace-nowrap text-slate-500">{formatINR(priceWithGst(c.price))} incl. GST</span>
                      </>
                    )}
                    <Link href={`/admin/courses/${c.id}`} className="mt-1 block text-xs font-semibold text-brand-ink hover:underline">Change fee</Link>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {(() => {
                      const n = c.modules.reduce((k, m) => k + m.lessons.length, 0);
                      return n ? `${c.modules.length} modules · ${n} lessons` : <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">No lessons</span>;
                    })()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/courses/${c.id}`} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-100">Edit</Link>
                      <Link href={`/admin/courses/${c.id}/content`} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-ink hover:bg-sky-50">Content</Link>
                      <form action={setCourseDisabledAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="disabled" value={c.disabled ? "0" : "1"} />
                        <button type="submit" title={c.disabled ? "Show this course on the website again" : "Hide from the website; assigned learners keep access"} className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${c.disabled ? "text-emerald-700 hover:bg-emerald-50" : "text-amber-700 hover:bg-amber-50"}`}>
                          {c.disabled ? "Enable" : "Disable"}
                        </button>
                      </form>
                      <ConfirmDelete action={deleteCourseAction} id={c.id} name={c.title} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {courses.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">No courses yet.</p>}
      </div>
    </>
  );
}

export default function AdminCoursesPage({ searchParams }: PageProps<"/admin/courses">) {
  return <Suspense fallback={adminSkeleton}><Courses searchParams={searchParams} /></Suspense>;
}
