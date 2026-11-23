import Link from "next/link";
import { Suspense } from "react";
import { IconBuilding, IconDownload, IconPencil } from "@/components/Icons";
import { requireAdmin } from "@/lib/dal";
import { fmtDate } from "@/lib/learner";
import { addressee } from "@/lib/proposal/types";
import { listProposals } from "@/lib/proposals";
import ConfirmDelete from "../ConfirmDelete";
import { AccessDenied, AdminTitle, Flash, adminSkeleton } from "../ui";
import { deleteProposalAction } from "./actions";

const todayIST = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

async function Proposals({ searchParams }: { searchParams: PageProps<"/admin/proposals">["searchParams"] }) {
  if (!(await requireAdmin("/admin/proposals"))) return <AccessDenied />;
  const [list, sp] = await Promise.all([listProposals(), searchParams]);
  const today = todayIST();

  return (
    <>
      <AdminTitle
        title="School proposals"
        subtitle="Personalised PDF proposals for principals and school managers, built from your live catalog."
        action={<Link href="/admin/proposals/new" className="btn-primary">+ New proposal</Link>}
      />
      <Flash deleted={sp.deleted === "1"} />

      <section className="card mt-6 overflow-x-auto">
        {list.length ? (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr><th className="px-5 py-3">School</th><th className="px-4 py-3">Addressed to</th><th className="px-4 py-3">Programmes</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((p) => {
                const expired = p.validUntil < today;
                return (
                  <tr key={p.id} className="align-top">
                    <td className="px-5 py-4">
                      <Link href={`/admin/proposals/${p.id}`} className="font-semibold text-navy-900 hover:text-brand-ink">{p.schoolName}</Link>
                      <p className="text-xs text-slate-500">{p.city}{p.board ? ` · ${p.board}` : ""}</p>
                      <p className="font-mono text-[11px] text-slate-400">{p.ref}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-navy-900">{addressee(p)}</p>
                      <p className="text-xs text-slate-500">{p.designation}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {p.programIds.length}
                      {p.teachers > 0 && <span className="block text-xs text-slate-500">{p.teachers} teachers</span>}
                      {p.discountPercent > 0 && <span className="block text-xs font-semibold text-orange-700">{p.discountPercent}% off</span>}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <span className={`rounded-full px-2 py-0.5 font-bold whitespace-nowrap ring-1 ${expired ? "bg-slate-100 text-slate-600 ring-slate-200" : p.downloadedAt ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>
                        {expired ? "Expired" : p.downloadedAt ? "Downloaded" : "Draft"}
                      </span>
                      <p className="mt-1.5 text-slate-500">Dated {fmtDate(p.issuedOn)}</p>
                      <p className="text-slate-400">Valid until {fmtDate(p.validUntil)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/proposals/${p.id}?download=1`} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-brand-ink hover:bg-sky-50">
                          <IconDownload className="h-3.5 w-3.5" /> PDF
                        </Link>
                        <Link href={`/admin/proposals/${p.id}`} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-navy-900 hover:bg-slate-100">
                          <IconPencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <ConfirmDelete action={deleteProposalAction} id={p.id} name={`the proposal for ${p.schoolName}`} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sky-50 text-brand-ink"><IconBuilding className="h-6 w-6" /></span>
            <p className="mt-3 font-semibold text-navy-900">No proposals yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Create a polished, 10-page proposal for any principal in a couple of minutes: type the school’s details, pick the programmes and download the PDF.
            </p>
            <Link href="/admin/proposals/new" className="btn-primary mt-5">Create your first proposal</Link>
          </div>
        )}
      </section>
    </>
  );
}

export default function ProposalsPage({ searchParams }: PageProps<"/admin/proposals">) {
  return <Suspense fallback={adminSkeleton}><Proposals searchParams={searchParams} /></Suspense>;
}
