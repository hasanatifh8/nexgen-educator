import Link from "next/link";
import { Suspense } from "react";
import { IconCheck, IconDownload, IconFile, IconLock, IconSparkles } from "@/components/Icons";
import { isCourseComplete } from "@/lib/access";
import { fmtDate, resumeStage, type ResumeStage } from "@/lib/learner";
import type { StoredFile } from "@/lib/users";
import { loadLearner } from "../data";
import { PageTitle, Panel, Pill, portalSkeleton } from "../ui";

const STEPS: { stage: ResumeStage; label: string; hint: string }[] = [
  { stage: "locked", label: "Complete a course", hint: "Finish any course assigned to you" },
  { stage: "queued", label: "Queued for our team", hint: "Your CV joins the review queue" },
  { stage: "in_progress", label: "Expert rewrite", hint: "We restructure and strengthen it" },
  { stage: "ready", label: "Ready to download", hint: "Compare and download your new resume" },
];

/** Inline preview for PDFs and images; other formats (Word) can only be downloaded. */
function Preview({ kind, file, label, accent }: { kind: "cv" | "resume"; file?: StoredFile; label: string; accent: string }) {
  const src = `/my-learning/documents/${kind}`;
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className={`flex items-center justify-between gap-3 px-5 py-3 ${accent}`}>
        <p className="text-sm font-bold">{label}</p>
        {file && <a href={`${src}?download`} className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"><IconDownload className="h-4 w-4" /> Download</a>}
      </div>
      {!file ? (
        <div className="grid h-[560px] place-items-center bg-slate-50 p-6 text-center text-sm text-slate-500">Not available yet</div>
      ) : file.mime === "application/pdf" ? (
        <iframe src={`${src}#toolbar=0&view=FitH`} title={label} className="h-[560px] w-full bg-slate-50" />
      ) : file.mime.startsWith("image/") ? (
        // eslint-disable-next-line @next/next/no-img-element -- private, auth-gated document route
        <img src={src} alt={label} className="h-[560px] w-full bg-slate-50 object-contain" />
      ) : (
        <div className="grid h-[560px] place-items-center bg-slate-50 p-6 text-center">
          <div>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-white text-brand-ink ring-1 ring-slate-200"><IconFile className="h-7 w-7" /></span>
            <p className="mt-3 text-sm font-semibold text-navy-900">{file.originalName}</p>
            <p className="mt-1 text-xs text-slate-500">Word documents can’t be previewed in the browser.</p>
            <a href={`${src}?download`} className="btn-secondary mt-4 py-2 text-xs"><IconDownload className="h-4 w-4" /> Download to view</a>
          </div>
        </div>
      )}
      {file && <p className="border-t border-slate-100 px-5 py-2.5 text-xs text-slate-500">{file.originalName} · {fmtDate(file.uploadedAt)}</p>}
    </div>
  );
}

async function Resume() {
  const { record: u, catalog } = await loadLearner("/my-learning/resume");
  const stage = resumeStage(u, catalog);
  const at = STEPS.findIndex((s) => s.stage === stage);
  const service = u.resumeService;
  const firstDone = catalog.courses.find((c) => u.assignedCourses.includes(c.id) && isCourseComplete(u, c));

  return (
    <>
      <PageTitle
        eyebrow="Career services"
        title="Resume upgrade"
        subtitle="When you complete a course, our career team rewrites your CV to highlight your new skills and certifications. Compare the two versions side by side."
      />

      <Panel>
        <ol className="grid gap-4 sm:grid-cols-4">
          {STEPS.map((s, i) => {
            const done = i < at || stage === "ready";
            const current = i === at && stage !== "ready";
            return (
              <li key={s.stage} className="relative">
                <div className={`h-1.5 rounded-full ${done ? "bg-emerald-500" : current ? "bg-gradient-to-r from-brand to-brand-teal" : "bg-slate-200"}`} />
                <div className="mt-3 flex items-start gap-2.5">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${done ? "bg-emerald-500 text-white" : current ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {done ? <IconCheck className="h-4 w-4" /> : i + 1}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${done || current ? "text-navy-900" : "text-slate-500"}`}>{s.label}</p>
                    <p className="text-xs text-slate-500">{s.hint}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-100">
          {stage === "locked" && (
            <p className="flex items-start gap-2"><IconLock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /> Complete any one of your assigned courses to unlock your professional resume upgrade. <Link href="/my-learning/courses" className="font-semibold text-brand-ink hover:underline">Continue learning →</Link></p>
          )}
          {stage === "queued" && <p>Congratulations on completing <span className="font-semibold">{firstDone?.title}</span>! Your CV is in our team’s queue. We will email you as soon as your upgraded resume is ready.</p>}
          {stage === "in_progress" && <p>Our career team is working on your resume{service ? ` (started ${fmtDate(service.updatedAt)})` : ""}. We will email you as soon as it is ready.</p>}
          {stage === "ready" && <p className="flex items-start gap-2"><IconSparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Your upgraded resume is ready{service?.deliveredAt ? ` (delivered ${fmtDate(service.deliveredAt)})` : ""}. Compare it with your original below and download it for your job applications.</p>}
        </div>
      </Panel>

      {stage === "ready" && service && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <Panel title="What we improved">
            {service.message && <p className="mb-4 rounded-xl bg-orange-50 p-4 text-sm text-orange-900 ring-1 ring-orange-100">“{service.message}” <span className="mt-1 block text-xs font-semibold">— NextGen Educator Career Team</span></p>}
            {service.changes.length ? (
              <ul className="space-y-2.5">
                {service.changes.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><IconCheck className="h-3 w-3" /></span>
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Compare both versions below to see the changes.</p>
            )}
          </Panel>
          <Panel title="Your new resume">
            <p className="text-sm text-slate-600">Use it for school applications, promotions and job portals. Mention your certificate’s credential ID so employers can verify it.</p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download from a route handler */}
            <a href="/my-learning/documents/resume?download" className="btn-primary mt-4 w-full"><IconDownload className="h-4 w-4" /> Download new resume</a>
            {u.certificates.length > 0 && <Link href="/my-learning/certificates" className="btn-secondary mt-2 w-full">View my certificates</Link>}
          </Panel>
        </div>
      )}

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-navy-900">Before and after</h2>
          {stage === "ready" ? <Pill tone="green">Upgrade ready</Pill> : <Pill tone="slate">Upgrade pending</Pill>}
        </div>
        {u.profile?.cv ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Preview kind="cv" file={u.profile.cv} label="Original CV — as you uploaded it" accent="bg-slate-100 text-slate-700" />
            <Preview kind="resume" file={stage === "ready" ? service?.file : undefined} label="Upgraded resume — by our team" accent="bg-gradient-to-r from-accent to-amber-500 text-white" />
          </div>
        ) : (
          <Panel><p className="text-sm text-slate-600">Upload your CV in <Link href="/onboarding" className="font-semibold text-brand-ink hover:underline">your profile</Link> so our team can upgrade it.</p></Panel>
        )}
      </div>
    </>
  );
}

export default function ResumePage() {
  return <Suspense fallback={portalSkeleton}><Resume /></Suspense>;
}
