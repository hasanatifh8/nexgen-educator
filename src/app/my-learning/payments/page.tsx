import Link from "next/link";
import { Suspense } from "react";
import { IconCheck, IconClock, IconInfo, IconWallet } from "@/components/Icons";
import { formatINR, gstOn } from "@/lib/catalog";
import { PAYMENT_LABEL, fmtDate, paymentRows } from "@/lib/learner";
import type { PaymentStatus } from "@/lib/users";
import { loadLearner } from "../data";
import { Empty, PageTitle, Panel, Pill, portalSkeleton, type Tone } from "../ui";

const TONE: Record<PaymentStatus, Tone> = { pending: "amber", paid: "green", waived: "blue" };

async function Payments() {
  const { record, catalog } = await loadLearner("/my-learning/payments");
  const rows = paymentRows(record, catalog);
  const pending = rows.filter((r) => r.status === "pending");
  const paidTotal = rows.filter((r) => r.status === "paid").reduce((n, r) => n + (r.record?.amount ?? r.amountDue), 0);
  const freePrograms = catalog.programs.filter((p) => p.price === 0).length;

  return (
    <>
      <PageTitle eyebrow="Billing" title="Payments" subtitle="Fees for the premium programs you have joined or requested, and the status of each payment." />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Amount due", value: formatINR(pending.reduce((n, r) => n + r.amountDue, 0)), icon: IconClock, tone: "text-amber-600 bg-amber-50" },
          { label: "Total paid", value: formatINR(paidTotal), icon: IconCheck, tone: "text-emerald-600 bg-emerald-50" },
          { label: "Premium programs", value: String(rows.length), icon: IconWallet, tone: "text-brand-ink bg-sky-50" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <span className={`grid h-12 w-12 place-items-center rounded-xl ${tone}`}><Icon className="h-6 w-6" /></span>
            <div><p className="text-sm text-slate-500">{label}</p><p className="font-display text-2xl font-bold text-navy-900">{value}</p></div>
          </div>
        ))}
      </div>

      <Panel title="Program fees" className="mt-6">
        {rows.length === 0 ? (
          <Empty title="Nothing to pay">
            You have not joined any premium programs. {freePrograms > 0 && `${freePrograms} certification program${freePrograms === 1 ? " is" : "s are"} completely free. `}
            <Link href="/courses" className="font-semibold text-brand-ink hover:underline">Browse courses</Link>
          </Empty>
        ) : (
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                <tr><th className="px-6 py-3">Program</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Status</th><th className="px-6 py-3">Details</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.program.id} className="align-top">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-navy-900">{r.program.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{r.courses.map((c) => `${c.title}${c.assigned ? "" : " (requested)"}`).join(" · ")}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-semibold text-navy-900">{formatINR(r.amountDue)}</p>
                      <p className="text-xs text-slate-500">{formatINR(r.program.price)} + {formatINR(gstOn(r.program.price))} GST</p>
                    </td>
                    <td className="px-4 py-4"><Pill tone={TONE[r.status]}>{PAYMENT_LABEL[r.status]}</Pill></td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {r.status === "paid" ? (
                        <>
                          {r.record?.amount !== undefined && <p>Received {formatINR(r.record.amount)}</p>}
                          {r.record?.paidAt && <p>on {fmtDate(r.record.paidAt)}</p>}
                          {r.record?.reference && <p className="font-mono">Ref: {r.record.reference}</p>}
                          {!r.record && <p>Confirmed by our team</p>}
                        </>
                      ) : r.status === "waived" ? (
                        <p>No payment is required for this program.</p>
                      ) : (
                        <p>Our team will share payment instructions with you.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="mt-6 flex gap-3 rounded-2xl bg-sky-50 p-5 text-sm text-sky-900 ring-1 ring-sky-100">
        <IconInfo className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          Premium programs are a one-time fee per program, including 18% GST. After you request a course, our team contacts you with payment details (UPI or bank transfer). Once the payment is confirmed, its status updates here and the course is approved for you.
        </p>
      </div>
    </>
  );
}

export default function PaymentsPage() {
  return <Suspense fallback={portalSkeleton}><Payments /></Suspense>;
}
