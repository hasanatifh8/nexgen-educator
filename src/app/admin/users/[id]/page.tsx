import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { IconCheck, IconDownload, IconX } from "@/components/Icons";
import { coursesFor } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalogStore";
import { isAdminEmail, requireAdmin } from "@/lib/dal";
import { findUserById } from "@/lib/users";
import { reviewProfileAction } from "../../actions";
import { AccessDenied, Flash, adminSkeleton, one } from "../../ui";
import { ProfileBadge } from "../badges";
import AssignmentForm from "./AssignmentForm";

type P = PageProps<"/admin/users/[id]">;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-navy-900">{children}</dd>
    </div>
  );
}

async function UserDetail({ params, searchParams }: { params: P["params"]; searchParams: P["searchParams"] }) {
  const { id } = await params;
  if (!(await requireAdmin(`/admin/users/${id}`))) return <AccessDenied />;
  const sp = await searchParams;
  const user = await findUserById(id);
  if (!user || isAdminEmail(user.email)) notFound();
  const { programs, courses } = await getCatalog();

  const p = user.profile;
  const saved = one(sp.saved);
  const groups = programs.map((g) => ({
    id: g.id,
    title: g.title,
    price: g.price,
    courses: coursesFor(courses, g.id).map((c) => ({
      id: c.id,
      title: c.title,
      lessons: c.modules.reduce((n, m) => n + m.lessons.length, 0),
      done: (user.progress[c.id] ?? []).length,
    })),
  }));
  const requested = Object.fromEntries(user.requests.map((r) => [r.courseId, fmtDate(r.at)]));

  return (
    <>
      <Link href="/admin/users" className="text-sm font-semibold text-brand-ink hover:underline">← All learners</Link>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-teal font-display text-lg font-bold text-white">
            {user.firstName[0]}{user.lastName[0]}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-900">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-slate-500">{user.email} · joined {fmtDate(user.createdAt)}</p>
          </div>
        </div>
        <ProfileBadge user={user} />
      </div>

      <Flash
        saved={saved === "assignments" ? "course assignments" : saved === "verified" ? "verification (verified)" : saved === "rejected" ? "verification (changes requested)" : undefined}
        error={one(sp.error)}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-navy-900">Profile</h2>
            {p ? (
              <dl className="mt-3 divide-y divide-slate-100">
                <Row label="Mobile">+91 {p.phone}</Row>
                <Row label="Location">{p.city}, {p.state}</Row>
                <Row label="Qualification">{p.qualification}</Row>
                <Row label="Experience">{p.experienceYears} years</Row>
                <Row label="Role (at sign-up)">{user.role}</Row>
                {user.institution && <Row label="School">{user.institution}</Row>}
                <Row label="Submitted">{fmtDate(p.completedAt)}</Row>
              </dl>
            ) : (
              <p className="mt-3 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">This learner hasn’t completed their profile yet.</p>
            )}
          </section>

          {p && (
            <section className="card p-6">
              <h2 className="font-display text-lg font-semibold text-navy-900">Documents</h2>
              <div className="mt-4 space-y-4">
                {([["id", p.idType === "pan" ? "PAN card" : "Aadhaar (masked)", p.idDocument], ["cv", "CV", p.cv]] as const).map(([kind, label, f]) => (
                  <div key={kind} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy-900">{label}</p>
                        <p className="truncate text-xs text-slate-500">{f.originalName} · {fmtSize(f.size)} · {fmtDate(f.uploadedAt)}</p>
                      </div>
                      <a href={`/admin/documents/${user.id}/${kind}`} target="_blank" rel="noopener noreferrer" className="btn-secondary shrink-0 py-2 text-xs">
                        <IconDownload className="h-4 w-4" /> {f.mime.startsWith("image/") || f.mime === "application/pdf" ? "Open" : "Download"}
                      </a>
                    </div>
                    {f.mime.startsWith("image/") && (
                      // eslint-disable-next-line @next/next/no-img-element -- private, auth-gated document route
                      <img src={`/admin/documents/${user.id}/${kind}`} alt={`${label} of ${user.firstName}`} className="mt-3 max-h-64 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain" />
                    )}
                  </div>
                ))}
              </div>

              <form action={reviewProfileAction} className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                <input type="hidden" name="userId" value={user.id} />
                <label htmlFor="note" className="block text-sm font-semibold text-navy-900">Note to learner <span className="font-normal text-slate-400">(required when requesting changes)</span></label>
                <input id="note" name="note" defaultValue={user.verification.note} maxLength={300} placeholder="e.g. ID photo is blurry — please re-upload" className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-sky-100" />
                <div className="flex gap-3">
                  <button name="decision" value="verified" className="btn flex-1 bg-emerald-600 text-white hover:bg-emerald-700"><IconCheck className="h-4 w-4" /> Verify</button>
                  <button name="decision" value="rejected" className="btn flex-1 border border-red-200 bg-white text-red-600 hover:bg-red-50"><IconX className="h-4 w-4" /> Request changes</button>
                </div>
                {user.verification.reviewedAt && <p className="text-xs text-slate-500">Last reviewed {fmtDate(user.verification.reviewedAt)}</p>}
              </form>
            </section>
          )}
        </div>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">Assign courses</h2>
          <p className="mt-1 text-sm text-slate-500">
            Learners can only open course material — and take a program’s exam after finishing all its courses — for what you assign here.
          </p>
          {!p && (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              You can assign now, but the learner can’t open courses until they complete their profile.
            </p>
          )}
          <div className="mt-5">
            <AssignmentForm key={user.assignedCourses.join(",")} userId={user.id} groups={groups} assigned={user.assignedCourses} requested={requested} />
          </div>
        </section>
      </div>
    </>
  );
}

export default function AdminUserPage({ params, searchParams }: P) {
  return <Suspense fallback={adminSkeleton}><UserDetail params={params} searchParams={searchParams} /></Suspense>;
}
