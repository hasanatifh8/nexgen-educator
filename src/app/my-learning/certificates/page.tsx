import Link from "next/link";
import { Suspense } from "react";
import CertificateDownload from "@/components/CertificateDownload";
import { IconBadge, IconTimer } from "@/components/Icons";
import LinkedInAddButton from "@/components/LinkedInAddButton";
import { examEligibility } from "@/lib/access";
import { formatCertDate } from "@/lib/certificate/design";
import { loadLearner } from "../data";
import { Empty, PageTitle, Panel, Pill, portalSkeleton } from "../ui";

async function Certificates() {
  const { session: user, catalog, settings } = await loadLearner("/my-learning/certificates");
  const ready = catalog.programs.filter(
    (p) => p.exam.questions.length && !user.certificates.some((c) => c.programId === p.id) && examEligibility(user, p.id, catalog.courses).ok,
  );

  return (
    <>
      <PageTitle
        eyebrow="Achievements"
        title="Certificates"
        subtitle="Every certificate has a public verification page, so schools and employers can confirm it is genuine."
      />
      <div className="space-y-6">
        {ready.length > 0 && (
          <section className="rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 p-6 text-white">
            <p className="font-display text-xl font-bold">You are ready for {ready.length === 1 ? "a certification exam" : `${ready.length} certification exams`}</p>
            <p className="mt-1 text-sm text-emerald-50">You have completed every course in these programs. Pass the exam to earn your certificate.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {ready.map((p) => (
                <Link key={p.id} href={`/certifications/${p.id}/exam`} className="btn bg-white text-emerald-700 hover:bg-emerald-50"><IconTimer className="h-4 w-4" /> {p.title}</Link>
              ))}
            </div>
          </section>
        )}

        {user.certificates.length === 0 ? (
          <Panel>
            <Empty title="No certificates yet">
              Complete all the courses in a program, then pass its exam to earn your first certificate.{" "}
              <Link href="/my-learning/courses#programs" className="font-semibold text-brand-ink hover:underline">See your programs</Link>
            </Empty>
          </Panel>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {user.certificates.map((cert) => (
              <article key={cert.credentialId} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
                <div className="flex items-start gap-4 bg-gradient-to-br from-navy-900 to-navy-700 p-6 text-white">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-amber-300 ring-1 ring-white/20"><IconBadge className="h-6 w-6" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold tracking-wide text-sky-200 uppercase">Certificate of achievement</p>
                    <h2 className="mt-1 font-display text-lg leading-snug font-semibold">{cert.programTitle}</h2>
                  </div>
                  <Pill tone="green">Verified</Pill>
                </div>
                <dl className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 text-center">
                  <div className="p-4"><dt className="text-xs text-slate-500">Score</dt><dd className="mt-0.5 font-display font-bold text-navy-900">{cert.total ? `${Math.round((cert.score / cert.total) * 100)}%` : "Awarded"}</dd></div>
                  <div className="p-4"><dt className="text-xs text-slate-500">Issued</dt><dd className="mt-0.5 font-display font-bold text-navy-900">{formatCertDate(cert.issuedAt)}</dd></div>
                  <div className="p-4"><dt className="text-xs text-slate-500">Credential ID</dt><dd className="mt-0.5 truncate font-mono text-sm font-bold text-navy-900">{cert.credentialId}</dd></div>
                </dl>
                <div className="grid gap-2 p-6 sm:grid-cols-2">
                  <CertificateDownload
                    className="btn-primary w-full"
                    label="Download certificate"
                    settings={settings}
                    data={{ name: cert.holderName ?? `${user.firstName} ${user.lastName}`, title: cert.programTitle, score: cert.score, total: cert.total, credentialId: cert.credentialId, issuedOn: formatCertDate(cert.issuedAt) }}
                  />
                  <LinkedInAddButton certificate={cert} settings={settings} className="btn-secondary w-full" />
                  <Link href={`/verify/${cert.credentialId}`} className="btn-secondary w-full sm:col-span-2">Open public verification page</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function CertificatesPage() {
  return <Suspense fallback={portalSkeleton}><Certificates /></Suspense>;
}
