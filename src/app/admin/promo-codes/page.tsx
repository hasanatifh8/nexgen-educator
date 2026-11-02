import { Suspense } from "react";
import { IconTag } from "@/components/Icons";
import { getCatalog } from "@/lib/catalogStore";
import { requireAdmin } from "@/lib/dal";
import { fmtDate } from "@/lib/learner";
import { listPromoCodes } from "@/lib/promo";
import { listUsers } from "@/lib/users";
import { deletePromoAction, setPromoActiveAction } from "../actions";
import ConfirmDelete from "../ConfirmDelete";
import { AccessDenied, AdminTitle, Flash, adminSkeleton, one } from "../ui";
import PromoForm from "./PromoForm";

const todayIST = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

async function PromoCodes({ searchParams }: { searchParams: PageProps<"/admin/promo-codes">["searchParams"] }) {
  if (!(await requireAdmin("/admin/promo-codes"))) return <AccessDenied />;
  const sp = await searchParams;
  const [codes, users, { courses }] = await Promise.all([listPromoCodes(), listUsers(), getCatalog()]);
  const courseTitle = Object.fromEntries(courses.map((c) => [c.id, c.title]));
  // Who applied each code, for the "used by" list.
  const usedBy = new Map<string, { name: string; course: string }[]>();
  for (const u of users) for (const [courseId, p] of Object.entries(u.promos ?? {})) {
    usedBy.set(p.code, [...(usedBy.get(p.code) ?? []), { name: `${u.firstName} ${u.lastName}`, course: courseTitle[courseId] ?? courseId }]);
  }
  const today = todayIST();

  return (
    <>
      <AdminTitle title="Promo codes" subtitle="Create referral or promo codes with a percentage discount. Learners enter them at checkout for paid courses." />
      <Flash saved={one(sp.saved) && `promo code ${one(sp.saved)}`} deleted={sp.deleted === "1"} />
      {(one(sp.paused) || one(sp.enabled)) && (
        <p role="status" className="mt-6 rounded-lg bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900 ring-1 ring-sky-100">
          {one(sp.paused) ? `${one(sp.paused)} is paused. Learners can’t apply it until you turn it back on.` : `${one(sp.enabled)} is active again.`}
        </p>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="card self-start p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">New promo code</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">The discount is taken off the course fee, then 18% GST is added.</p>
          <PromoForm />
        </section>

        <section className="card overflow-x-auto">
          {codes.length ? (
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr><th className="px-5 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Used</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {codes.map((p) => {
                  const expired = !!p.expiresOn && p.expiresOn < today;
                  const full = !!p.maxUses && p.uses >= p.maxUses;
                  const status = !p.active ? ["Paused", "bg-slate-100 text-slate-600 ring-slate-200"] : expired ? ["Expired", "bg-red-50 text-red-700 ring-red-200"] : full ? ["Limit reached", "bg-amber-50 text-amber-700 ring-amber-200"] : ["Active", "bg-emerald-50 text-emerald-700 ring-emerald-200"];
                  const who = usedBy.get(p.code) ?? [];
                  return (
                    <tr key={p.code} className={`align-top ${p.active ? "" : "bg-slate-50/70"}`}>
                      <td className="px-5 py-4">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-base font-bold tracking-wider text-navy-900">{p.code}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ring-1 ${status[1]}`}>{status[0]}</span>
                        </p>
                        {p.note && <p className="text-xs text-slate-500">{p.note}</p>}
                        <p className="text-xs text-slate-400">
                          Created {fmtDate(p.createdAt)}{p.expiresOn ? ` · valid until ${fmtDate(p.expiresOn)}` : " · no expiry"}
                        </p>
                      </td>
                      <td className="px-4 py-4"><span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-sm font-bold whitespace-nowrap text-orange-700 ring-1 ring-orange-100">{p.percent}% off</span></td>
                      <td className="px-4 py-4 text-slate-600">
                        <p className="font-semibold text-navy-900">{p.uses}{p.maxUses ? ` / ${p.maxUses}` : ""}</p>
                        {who.length > 0 && (
                          <details className="mt-1 text-xs">
                            <summary className="cursor-pointer font-semibold text-brand-ink">Who used it</summary>
                            <ul className="mt-1 space-y-0.5">{who.map((w, i) => <li key={i}>{w.name} · {w.course}</li>)}</ul>
                          </details>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <form action={setPromoActiveAction}>
                            <input type="hidden" name="code" value={p.code} />
                            <input type="hidden" name="active" value={p.active ? "0" : "1"} />
                            <button type="submit" className={`rounded-md px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap ${p.active ? "text-amber-700 hover:bg-amber-50" : "text-emerald-700 hover:bg-emerald-50"}`}>{p.active ? "Pause" : "Turn on"}</button>
                          </form>
                          <ConfirmDelete action={deletePromoAction} id={p.code} name={p.code} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400"><IconTag className="h-6 w-6" /></span>
              <p className="mt-3 font-semibold text-navy-900">No promo codes yet</p>
              <p className="mt-1 text-sm text-slate-500">Create your first code, for example JACK50 for 50% off.</p>
            </div>
          )}
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Deleting or pausing a code stops new learners from using it. Learners who already applied it keep their discounted fee.
          </p>
        </section>
      </div>
    </>
  );
}

export default function PromoCodesPage({ searchParams }: PageProps<"/admin/promo-codes">) {
  return <Suspense fallback={adminSkeleton}><PromoCodes searchParams={searchParams} /></Suspense>;
}
