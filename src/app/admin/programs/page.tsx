import Link from "next/link";
import { Suspense } from "react";
import { coursesFor, formatINR, priceShort, priceWithGst } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import { deleteProgramAction } from "../actions";
import ConfirmDelete from "../ConfirmDelete";
import { AccessDenied, AdminTitle, Flash, adminSkeleton, one } from "../ui";

async function Programs({ searchParams }: { searchParams: PageProps<"/admin/programs">["searchParams"] }) {
  if (!(await requireAdmin("/admin/programs"))) return <AccessDenied />;
  const sp = await searchParams;
  const { programs, courses } = await getCatalog();

  return (
    <>
      <AdminTitle
        title="Programs & Exams"
        subtitle="Group courses into certifications and build each program’s exam. Fees are set on each course; the price shown is the total of its courses."
        action={<Link href="/admin/programs/new" className="btn-primary">+ New program</Link>}
      />
      <Flash saved={one(sp.saved)} deleted={sp.deleted === "1"} error={one(sp.error)} />

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3">Program</th><th className="px-5 py-3">Total fee</th><th className="px-5 py-3">Courses</th>
              <th className="px-5 py-3">Exam</th><th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programs.map((p) => {
              const n = coursesFor(courses, p.id).length;
              const qs = p.exam.questions.length;
              return (
                <tr key={p.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-navy-900">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.category} · {p.level}</p>
                  </td>
                  <td className="px-5 py-4">
                    {p.price === 0 ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">Free</span>
                    ) : (
                      <>
                        <span className="font-semibold text-navy-900">{priceShort(p.price)}</span>
                        <span className="block text-xs text-slate-500">{formatINR(priceWithGst(p.price))} incl. GST · all courses</span>
                      </>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{n}</td>
                  <td className="px-5 py-4">
                    {qs ? (
                      <span className="text-slate-600">{qs} Q · {p.exam.minutes} min · {p.exam.passPercent}% pass</span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">No questions</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/programs/${p.id}`} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-100">Edit</Link>
                      <Link href={`/admin/programs/${p.id}/exam`} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-ink hover:bg-sky-50">Exam</Link>
                      <ConfirmDelete action={deleteProgramAction} id={p.id} name={p.title} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {programs.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">No programs yet.</p>}
      </div>
    </>
  );
}

export default function AdminProgramsPage({ searchParams }: PageProps<"/admin/programs">) {
  return <Suspense fallback={adminSkeleton}><Programs searchParams={searchParams} /></Suspense>;
}
