import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Certificate from "@/components/Certificate";
import { IconAlert, IconCheck, IconShield, IconX } from "@/components/Icons";
import { formatCertDate } from "@/lib/certificate/design";
import { getSettings } from "@/lib/settings";
import { findCertificate } from "@/lib/users";

export const metadata: Metadata = { title: "Certificate verification — NextGen Educator", robots: { index: false } };

type P = PageProps<"/verify/[credentialId]">;
const fmt = formatCertDate;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:justify-between sm:gap-6">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-navy-900 sm:text-right">{children}</dd>
    </div>
  );
}

async function Result({ params }: { params: P["params"] }) {
  await connection();
  const raw = decodeURIComponent((await params).credentialId).trim().toUpperCase().slice(0, 40);
  const settings = await getSettings();

  if (raw.startsWith("SAMPLE-")) {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-600"><IconAlert className="h-7 w-7" /></span>
        <h1 className="mt-5 font-display text-2xl font-bold text-navy-900">Sample certificate</h1>
        <p className="mt-2 text-slate-600">
          <span className="font-mono font-semibold">{raw}</span> comes from our free diagnostic quiz. It’s a preview of our certificate design — not an official credential.
        </p>
        <Link href="/courses" className="btn-primary mt-6">Earn a real certificate</Link>
      </div>
    );
  }

  const found = await findCertificate(raw);
  if (!found) {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600"><IconX className="h-7 w-7" /></span>
        <h1 className="mt-5 font-display text-2xl font-bold text-navy-900">Certificate not found</h1>
        <p className="mt-2 text-slate-600">
          We couldn’t find a certificate with ID <span className="font-mono font-semibold">{raw || "—"}</span>. Check the ID for typos, or contact {settings.organizationName} if you believe this is an error.
        </p>
        <Link href="/verify" className="btn-secondary mt-6">Try another ID</Link>
      </div>
    );
  }

  const { cert, holderName } = found;
  const issuedOn = fmt(cert.issuedAt);
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 p-6 text-center text-white sm:flex-row sm:text-left">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/20"><IconCheck className="h-8 w-8" /></span>
        <div>
          <h1 className="font-display text-2xl font-bold">Verified certificate</h1>
          <p className="text-emerald-50">This credential was issued by {settings.organizationName} and is valid.</p>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Certificate data={{ name: holderName, title: cert.programTitle, score: cert.score, total: cert.total, credentialId: cert.credentialId, issuedOn }} settings={settings} />
        <section className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900"><IconShield className="h-5 w-5 text-brand-ink" /> Credential details</h2>
          <dl className="mt-3 divide-y divide-slate-100">
            <Row label="Awarded to">{holderName}</Row>
            <Row label="Program">{cert.programTitle}</Row>
            {cert.total ? (
              <Row label="Score">{cert.score}/{cert.total} ({Math.round((cert.score / cert.total) * 100)}%)</Row>
            ) : (
              <Row label="Assessment">Awarded directly by {settings.organizationName}</Row>
            )}
            <Row label="Issued on">{issuedOn}</Row>
            <Row label="Credential ID"><span className="font-mono">{cert.credentialId}</span></Row>
            <Row label="Issued by">{settings.organizationName}</Row>
          </dl>
        </section>
      </div>
    </div>
  );
}

export default function VerifyPage({ params }: P) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-12 sm:py-16">
        <Suspense fallback={<div className="mx-auto h-96 max-w-5xl animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />}>
          <Result params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
