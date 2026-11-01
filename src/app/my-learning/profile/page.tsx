import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { IconAlert, IconCheck, IconClock, IconDownload, IconFile, IconPencil, IconShield } from "@/components/Icons";
import { fmtDate, fmtSize } from "@/lib/learner";
import type { StoredFile } from "@/lib/users";
import { loadLearner } from "../data";
import { Empty, PageTitle, Panel, Pill, portalSkeleton } from "../ui";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-semibold text-navy-900">{children || <span className="font-normal text-slate-400">Not provided</span>}</dd>
    </div>
  );
}

function DocCard({ kind, label, file }: { kind: string; label: string; file: StoredFile }) {
  const viewable = file.mime.startsWith("image/") || file.mime === "application/pdf";
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-50 text-brand-ink"><IconFile className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy-900">{label}</p>
        <p className="truncate text-xs text-slate-500">{file.originalName} · {fmtSize(file.size)} · uploaded {fmtDate(file.uploadedAt)}</p>
      </div>
      <a href={`/my-learning/documents/${kind}${viewable ? "" : "?download"}`} target="_blank" rel="noopener noreferrer" className="btn-secondary shrink-0 py-2 text-xs">
        <IconDownload className="h-4 w-4" /> {viewable ? "View" : "Download"}
      </a>
    </div>
  );
}

async function Profile() {
  const { record: u } = await loadLearner("/my-learning/profile");
  const p = u.profile;
  const v = u.verification;
  const fields = [!!p?.phone, !!p?.city, !!p?.qualification, p?.experienceYears !== undefined, !!p?.idDocument, !!p?.cv, !!u.institution];
  const completeness = Math.round(((fields.filter(Boolean).length + 3) / (fields.length + 3)) * 100); // name, email and role are always set

  return (
    <>
      <PageTitle
        eyebrow="Account"
        title="My profile"
        subtitle="Your personal details and the documents you shared for verification."
        action={<Link href="/onboarding" className="btn-primary"><IconPencil className="h-4 w-4" /> {p ? "Update profile" : "Complete profile"}</Link>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <Panel>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-teal font-display text-2xl font-bold text-white">
                {u.firstName[0]}{u.lastName[0]}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl font-bold text-navy-900">{u.firstName} {u.lastName}</h2>
                <p className="text-slate-600">{u.role}{u.institution ? ` · ${u.institution}` : ""}</p>
                <p className="mt-1 text-sm text-slate-500">Member since {fmtDate(u.createdAt)}</p>
              </div>
            </div>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <Field label="Email">{u.email}</Field>
              <Field label="Mobile">{p ? `+91 ${p.phone}` : ""}</Field>
              <Field label="Location">{p ? `${p.city}, ${p.state}` : ""}</Field>
              <Field label="Highest qualification">{p?.qualification}</Field>
              <Field label="Teaching experience">{p ? `${p.experienceYears} year${p.experienceYears === 1 ? "" : "s"}` : ""}</Field>
              <Field label="School / institution">{u.institution}</Field>
            </dl>
          </Panel>

          <Panel title="Documents">
            {p ? (
              <div className="space-y-3">
                <DocCard kind="id" label={p.idType === "pan" ? "PAN card" : "Aadhaar (masked)"} file={p.idDocument} />
                <DocCard kind="cv" label="CV / resume (original)" file={p.cv} />
                {u.resumeService?.file && <DocCard kind="resume" label="Enhanced resume (by our team)" file={u.resumeService.file} />}
              </div>
            ) : (
              <Empty title="No documents uploaded yet">Upload your government ID and CV to get verified and start learning.</Empty>
            )}
          </Panel>
        </div>

        <div className="min-w-0 space-y-6">
          <Panel title="Verification">
            {v.status === "verified" ? (
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><IconCheck className="h-5 w-5" /></span>
                <div><Pill tone="green">Verified</Pill><p className="mt-2 text-sm text-slate-600">Your identity is verified{v.reviewedAt ? ` (${fmtDate(v.reviewedAt)})` : ""}. Certificates will carry your name.</p></div>
              </div>
            ) : v.status === "rejected" ? (
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600"><IconAlert className="h-5 w-5" /></span>
                <div>
                  <Pill tone="red">Changes requested</Pill>
                  <p className="mt-2 text-sm text-slate-600">{v.note || "Your documents could not be verified."}</p>
                  <Link href="/onboarding" className="mt-3 inline-block text-sm font-semibold text-brand-ink hover:underline">Update documents →</Link>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-600"><IconClock className="h-5 w-5" /></span>
                <div>
                  <Pill tone="amber">{p ? "Under review" : "Not submitted"}</Pill>
                  <p className="mt-2 text-sm text-slate-600">{p ? "Our team is reviewing your documents. This usually takes 1–2 working days." : "Complete your profile so our team can verify you."}</p>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Profile strength">
            <p className="font-display text-4xl font-bold text-navy-900">{completeness}%</p>
            <div className="mt-3 h-2.5 rounded-full bg-slate-100">
              <div className="h-2.5 rounded-full bg-gradient-to-r from-brand to-brand-teal" style={{ width: `${completeness}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-500">{completeness === 100 ? "Your profile is complete." : "Complete every field so our team can verify you faster."}</p>
          </Panel>

          <Panel title="Security">
            <p className="flex items-start gap-2 text-sm text-slate-600"><IconShield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Your documents are stored privately and are only visible to you and our verification team.</p>
            <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-brand-ink hover:underline">Change password →</Link>
          </Panel>
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return <Suspense fallback={portalSkeleton}><Profile /></Suspense>;
}
