import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { IconCheck, IconDownload, IconPhone, IconX } from "@/components/Icons";
import { coursesFor, formatINR, priceWithGst } from "@/lib/catalog";
import { CALL_SLOTS } from "@/lib/enrollment";
import { PAYMENT_LABEL, learnerFee, paymentRows, resumeStage } from "@/lib/learner";
import { isCourseComplete } from "@/lib/access";
import { getCatalog } from "@/lib/catalogStore";
import { isAdminEmail, requireAdmin } from "@/lib/dal";
import { findUserById } from "@/lib/users";
import { listNotes } from "@/lib/notes";
import PickList from "../../notes/PickList";
import { assignUserNotesAction, awardCertificateAction, reviewProfileAction, revokeCertificateAction, savePaymentAction, saveResumeAction } from "../../actions";
import ConfirmDelete from "../../ConfirmDelete";
import { AccessDenied, Flash, adminSkeleton, one } from "../../ui";
import { ProfileBadge } from "../badges";
import AssignmentForm from "./AssignmentForm";
import PasswordHelp from "./PasswordHelp";

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
  const [{ programs, courses }, notes] = await Promise.all([getCatalog(), listNotes()]);

  const p = user.profile;
  const saved = one(sp.saved);
  const groups = programs.map((g) => ({
    id: g.id,
    title: g.title,
    courses: coursesFor(courses, g.id).map((c) => ({
      id: c.id,
      title: c.title,
      price: c.price,
      disabled: c.disabled,
      lessons: c.modules.reduce((n, m) => n + m.lessons.length, 0),
      done: (user.progress[c.id] ?? []).length,
    })),
  }));
  const requested = Object.fromEntries(user.requests.map((r) => [r.courseId, fmtDate(r.at)]));
  // Paid-course enrollments wait for a call from our team before the course is assigned.
  const calls = user.requests
    .map((r) => ({ ...r, course: courses.find((c) => c.id === r.courseId) }))
    .filter((r) => r.course && r.course.price > 0);
  const payments = paymentRows(user, { programs, courses });
  const resume = user.resumeService;
  const stage = resumeStage(user, { courses });
  const completedCourses = courses.filter((c) => user.assignedCourses.includes(c.id) && isCourseComplete(user, c));
  const today = new Date().toISOString().slice(0, 10);

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
        saved={saved === "payment" ? "payment" : saved === "resume" ? "resume upgrade" : saved === "assignments" ? "course assignments" : saved === "notes" ? "PDF notes access" : saved === "profile" ? "learner profile" : saved === "certificate" ? "certificate" : saved === "certificate-revoked" ? "certificate withdrawal" : saved === "verified" ? "verification (verified)" : saved === "rejected" ? "verification (changes requested)" : undefined}
        error={one(sp.error)}
      />

      {calls.length > 0 && (
        <section className="card mt-6 border-l-4 border-l-accent-strong p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900"><IconPhone className="h-5 w-5 text-accent-strong" /> Call before assigning</h2>
          <p className="mt-1 text-sm text-slate-500">This learner enrolled in paid courses. Call them for the telephonic round, share the payment details, then record the payment and assign the course below.</p>
          <ul className="mt-4 divide-y divide-slate-100">
            {calls.map((r) => {
              const phone = r.call?.phone ?? p?.phone;
              return (
                <li key={r.courseId} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy-900">{r.course!.title}</p>
                    <p className="text-xs text-slate-500">
                      {(() => {
                        const f = learnerFee(user, r.course!);
                        return f.promo ? `${formatINR(f.total)} incl. GST after promo ${f.promo.code} (${f.promo.percent}% off ${formatINR(priceWithGst(r.course!.price))})` : `${formatINR(f.total)} incl. GST`;
                      })()} · enrolled {fmtDate(r.at)} · {r.call ? `prefers ${CALL_SLOTS[r.call.slot]}` : "no call time chosen"}
                    </p>
                    {r.call?.note && <p className="mt-1 text-sm text-slate-600">“{r.call.note}”</p>}
                  </div>
                  {phone && (
                    <a href={`tel:+91${phone}`} className="btn shrink-0 bg-navy-900 py-2 text-sm text-white hover:bg-navy-800"><IconPhone className="h-4 w-4" /> +91 {phone}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section id="password" className="card mt-6 scroll-mt-24 px-6 py-4">
        <h2 className="text-sm font-semibold text-navy-900">Can’t sign in?</h2>
        <div className="mt-1"><PasswordHelp userId={user.id} email={user.email} /></div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <section className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-navy-900">Profile</h2>
              {p && <Link href={`/admin/users/${user.id}/profile`} className="text-sm font-semibold text-brand-ink hover:underline">Edit profile</Link>}
            </div>
            {p ? (
              <dl className="mt-3 divide-y divide-slate-100">
                <Row label="Mobile">+91 {p.phone}</Row>
                <Row label="Location">{p.city}, {p.state}</Row>
                <Row label="Qualification">{p.qualification}</Row>
                <Row label="Experience">{p.experienceYears} years</Row>
                <Row label="Role (at sign-up)">{user.role}</Row>
                {user.institution && <Row label="School">{user.institution}</Row>}
                <Row label="Submitted">{fmtDate(p.completedAt)}{p.enteredBy ? ` · entered by admin (${p.enteredBy})` : ""}</Row>
              </dl>
            ) : (
              <div className="mt-3 rounded-lg bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm text-slate-500">This learner hasn’t completed their profile yet.</p>
                <Link href={`/admin/users/${user.id}/profile`} className="btn-primary mt-4 py-2.5 text-sm">Complete profile for learner</Link>
                <p className="mt-2 text-xs text-slate-400">For learners who can’t upload their details or documents themselves.</p>
              </div>
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

      <section id="certificates" className="card mt-6 scroll-mt-24 p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Certificates</h2>
        <p className="mt-1 text-sm text-slate-500">Certificates this learner holds. You can also award one directly — for example after an offline assessment — without the course or the online exam.</p>
        {user.certificates.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {user.certificates.map((c) => (
              <li key={c.credentialId} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900">{c.programTitle}</p>
                  <p className="text-xs text-slate-500">
                    <span className="font-mono">{c.credentialId}</span> · issued {fmtDate(c.issuedAt)} ·{" "}
                    {c.awardedBy ? `awarded by ${c.awardedBy}${c.total ? ` · score ${c.score}/${c.total}` : " · no exam score"}` : `passed the exam · ${c.score}/${c.total}`}
                  </p>
                  {c.awardNote && <p className="mt-0.5 text-xs text-slate-500">Note: {c.awardNote}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <a href={`/verify/${c.credentialId}`} target="_blank" rel="noopener noreferrer" className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-ink hover:bg-sky-50">View</a>
                  <ConfirmDelete action={revokeCertificateAction} id={`${user.id}:${c.credentialId}`} name={c.programTitle} label="Withdraw" question={`Withdraw the ${c.programTitle} certificate (${c.credentialId})? Its verification link will stop working.`} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">No certificates yet.</p>
        )}

        {(() => {
          const available = programs.filter((pr) => !user.certificates.some((c) => c.programId === pr.id));
          if (!available.length) return null;
          return (
            <form action={awardCertificateAction} className="mt-5 space-y-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
              <input type="hidden" name="userId" value={user.id} />
              <p className="text-sm font-semibold text-navy-900">Award a certificate directly</p>
              <div className="grid gap-3 sm:grid-cols-[1fr_110px_110px]">
                <label className="block text-xs font-semibold text-slate-600">
                  Certification program
                  <select name="programId" required defaultValue="" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900">
                    <option value="" disabled>Select…</option>
                    {available.map((pr) => <option key={pr.id} value={pr.id}>{pr.title}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-slate-600">
                  Score <span className="font-normal text-slate-400">(optional)</span>
                  <input name="score" type="number" min={0} step={1} inputMode="numeric" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                </label>
                <label className="block text-xs font-semibold text-slate-600">
                  Out of
                  <input name="total" type="number" min={1} step={1} inputMode="numeric" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                </label>
              </div>
              <label className="block text-xs font-semibold text-slate-600">
                Reason <span className="font-normal text-slate-400">(admins only, e.g. “Passed offline assessment on 2 Nov”)</span>
                <input name="note" maxLength={200} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
              </label>
              <p className="text-xs text-slate-500">Leave the score blank to issue it without a score — the certificate and verification page then say it was awarded by your organisation instead of showing exam marks.</p>
              <label className="flex items-start gap-2 text-sm text-amber-950">
                <input type="checkbox" name="confirm" required className="mt-0.5 h-4 w-4 accent-amber-600" />
                I am issuing this certificate without the learner completing the course or the online exam.
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="notify" defaultChecked className="h-4 w-4 accent-brand" /> Email the learner their certificate
              </label>
              <button type="submit" className="btn bg-navy-900 py-2.5 text-sm text-white hover:bg-navy-800">Issue certificate</button>
            </form>
          );
        })()}
      </section>

      <section id="notes" className="card mt-6 scroll-mt-24 p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-navy-900">PDF notes</h2>
            <p className="mt-1 text-sm text-slate-500">Tick the notes this learner can read in their portal.</p>
          </div>
          <Link href="/admin/notes" className="text-sm font-semibold text-brand-ink hover:underline">Upload or manage notes →</Link>
        </div>
        <PickList
          key={notes.filter((n) => n.assignedTo.includes(user.id)).map((n) => n.id).join(",")}
          action={assignUserNotesAction}
          hidden={{ userId: user.id }}
          name="noteIds"
          noun="note"
          empty="No notes uploaded yet. Upload PDFs under PDF notes, then assign them here."
          selected={notes.filter((n) => n.assignedTo.includes(user.id)).map((n) => n.id)}
          items={notes.map((n) => {
            const course = n.courseId ? courses.find((c) => c.id === n.courseId) : undefined;
            return {
              id: n.id,
              title: n.title,
              sub: `${course ? `${course.title} · ` : ""}${fmtSize(n.file.size)} · uploaded ${fmtDate(n.createdAt)}`,
              tag: course && user.assignedCourses.includes(course.id) ? "Their course" : undefined,
            };
          })}
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section id="payments" className="card scroll-mt-24 p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">Payments</h2>
          <p className="mt-1 text-sm text-slate-500">Record payments for paid courses this learner joined or requested. Marking a payment as paid emails the learner a receipt.</p>
          {payments.length === 0 ? (
            <p className="mt-4 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No paid courses requested or assigned.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {payments.map((r) => (
                <form key={r.course.id} action={savePaymentAction} className="rounded-xl border border-slate-200 p-4">
                  <input type="hidden" name="userId" value={user.id} />
                  <input type="hidden" name="courseId" value={r.course.id} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{r.course.title}</p>
                      <p className="text-xs text-slate-500">{r.program?.title}{r.assigned ? "" : " · requested"}</p>
                      <p className="text-xs text-slate-500">Fee {formatINR(r.amountDue)} incl. GST{r.promo ? ` (promo ${r.promo.code}, ${r.promo.percent}% off)` : ""} · {PAYMENT_LABEL[r.status]}{r.record?.updatedAt ? ` · updated ${fmtDate(r.record.updatedAt)}` : ""}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-slate-600">Status
                      <select name="status" defaultValue={r.status} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                        <option value="pending">Pending</option><option value="paid">Paid</option><option value="waived">Waived</option>
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate-600">Amount received (₹)
                      <input name="amount" type="number" step="0.01" min="0" max="100000" defaultValue={r.record?.amount ?? r.amountDue} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <label className="text-xs font-semibold text-slate-600">Transaction reference
                      <input name="reference" defaultValue={r.record?.reference} minLength={4} maxLength={60} pattern="[A-Za-z0-9_\-\/ .]+" title="Letters, numbers, spaces and - / ." placeholder="UPI / UTR number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <label className="text-xs font-semibold text-slate-600">Payment date
                      <input name="paidAt" type="date" min="2024-01-01" max={today} defaultValue={r.record?.paidAt?.slice(0, 10) ?? today} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                  </div>
                  <button className="btn-primary mt-3 py-2 text-sm">Save payment</button>
                </form>
              ))}
            </div>
          )}
        </section>

        <section id="resume" className="card scroll-mt-24 p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-navy-900">Resume upgrade</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
              {stage === "ready" ? "Delivered" : stage === "in_progress" ? "In progress" : stage === "queued" ? "Ready to start" : "Waiting for course completion"}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {completedCourses.length ? `Completed: ${completedCourses.map((c) => c.title).join(", ")}.` : "The learner hasn’t completed a course yet."}{" "}
            Upload the improved resume and list what you changed. The learner sees both versions side by side, and is emailed when it is delivered.
          </p>
          {p?.cv && (
            <a href={`/admin/documents/${user.id}/cv`} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-4 py-2 text-xs"><IconDownload className="h-4 w-4" /> Original CV ({p.cv.originalName})</a>
          )}
          <form action={saveResumeAction} className="mt-4 space-y-3">
            <input type="hidden" name="userId" value={user.id} />
            <label className="block text-xs font-semibold text-slate-600">Upgraded resume (PDF recommended so the learner can preview it; DOC/DOCX allowed, max 2 MB)
              <input name="file" type="file" accept=".pdf,.doc,.docx" className="mt-1 block w-full text-sm" />
            </label>
            {resume?.file && (
              <p className="text-xs text-slate-500">
                Current file: <a href={`/admin/documents/${user.id}/resume`} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-ink hover:underline">{resume.file.originalName}</a> · {fmtSize(resume.file.size)} — uploading a new file replaces it.
              </p>
            )}
            <label className="block text-xs font-semibold text-slate-600">What we improved <span className="font-normal text-slate-400">(one per line)</span>
              <textarea name="changes" rows={5} defaultValue={resume?.changes.join("\n")} placeholder={"Rewrote the summary around classroom impact\nAdded the AI Tools for Teachers certificate with its credential ID"} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block text-xs font-semibold text-slate-600">Message to the learner <span className="font-normal text-slate-400">(optional)</span>
              <textarea name="message" rows={2} maxLength={600} defaultValue={resume?.message} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <select name="status" defaultValue={resume?.status ?? "in_progress"} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="in_progress">In progress (hidden from learner)</option>
                <option value="delivered">Delivered (visible to learner)</option>
              </select>
              <button className="btn-primary py-2 text-sm">Save resume</button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default function AdminUserPage({ params, searchParams }: P) {
  return <Suspense fallback={adminSkeleton}><UserDetail params={params} searchParams={searchParams} /></Suspense>;
}
