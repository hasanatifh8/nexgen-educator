"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import Certificate from "@/components/Certificate";
import { IconCheck } from "@/components/Icons";
import { normalizeSiteUrl, verifyUrl, type SiteSettings } from "@/lib/siteSettings";
import { saveSettingsAction, type SettingsState } from "../actions";
import { Field, inputCls } from "../fields";

const SAMPLE = { name: "Priya Sharma", title: "Certified AI-Ready Educator", score: 18, total: 20, credentialId: "NGE-2026-1A2B3C4D", issuedOn: "31 October 2026" };

export default function SettingsForm({ initial, envFallback }: { initial: SiteSettings; envFallback: string }) {
  const [state, dispatch, pending] = useActionState<SettingsState, FormData>(saveSettingsAction, {});
  const [v, setV] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [seen, setSeen] = useState(state);
  if (state !== seen) {
    setSeen(state);
    if (state.ok) setSaved(v);
  }
  const fe = state.ok ? {} : (state.fieldErrors ?? {});
  const dirty = JSON.stringify(v) !== JSON.stringify(saved);
  const set = (k: keyof SiteSettings) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const urlCheck = normalizeSiteUrl(v.siteUrl);
  const effectiveUrl = (urlCheck || envFallback || "").replace(/\/+$/, "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(v).forEach(([k, val]) => fd.set(k, val));
    startTransition(() => dispatch(fd));
  };

  return (
    <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_1.2fr]">
      <form onSubmit={onSubmit} className="space-y-6">
        <section className="card space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">Website</h2>
          <Field
            id="siteUrl"
            label="Public website address"
            error={fe.siteUrl ?? (urlCheck === null ? "Enter a full address like https://www.yourdomain.com" : undefined)}
            hint={effectiveUrl ? `QR codes will open ${verifyUrl(effectiveUrl, "NGE-…")}` : "Used in certificate QR codes and email links. Until set, the current browser address is used."}
          >
            <input id="siteUrl" type="url" inputMode="url" placeholder="https://www.nextgeneducator.in" value={v.siteUrl} onChange={set("siteUrl")} className={inputCls(!!fe.siteUrl || urlCheck === null)} />
          </Field>
          {!v.siteUrl && envFallback && <p className="-mt-3 text-xs text-slate-500">Currently using APP_URL from the server environment: {envFallback}</p>}
          <Field id="organizationName" label="Organisation name" error={fe.organizationName}>
            <input id="organizationName" value={v.organizationName} onChange={set("organizationName")} className={inputCls(!!fe.organizationName)} />
          </Field>
        </section>

        <section className="card space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">Certificate signatures</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="signatoryName" label="Signatory name" error={fe.signatoryName}>
              <input id="signatoryName" value={v.signatoryName} onChange={set("signatoryName")} className={inputCls(!!fe.signatoryName)} />
            </Field>
            <Field id="signatoryTitle" label="Signatory title" error={fe.signatoryTitle}>
              <input id="signatoryTitle" value={v.signatoryTitle} onChange={set("signatoryTitle")} className={inputCls(!!fe.signatoryTitle)} />
            </Field>
            <Field id="secondSignatoryName" label={<>Second signatory <span className="font-normal text-slate-400">(optional)</span></>} error={fe.secondSignatoryName}>
              <input id="secondSignatoryName" value={v.secondSignatoryName} onChange={set("secondSignatoryName")} className={inputCls(!!fe.secondSignatoryName)} />
            </Field>
            <Field id="secondSignatoryTitle" label="Second signatory title" error={fe.secondSignatoryTitle}>
              <input id="secondSignatoryTitle" value={v.secondSignatoryTitle} disabled={!v.secondSignatoryName} onChange={set("secondSignatoryTitle")} className={`${inputCls(!!fe.secondSignatoryTitle)} disabled:bg-slate-50`} />
            </Field>
          </div>
          <Field id="certificateNote" label="Footer note" error={fe.certificateNote} hint={`${v.certificateNote.length}/160 · printed in small text at the bottom of every certificate`}>
            <textarea id="certificateNote" rows={2} maxLength={200} value={v.certificateNote} onChange={set("certificateNote")} className={inputCls(!!fe.certificateNote)} />
          </Field>
        </section>

        <section className="card space-y-5 p-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-navy-900">Email signature</h2>
            <p className="mt-1 text-sm text-slate-500">Shown at the bottom of every email the website sends (welcome, course approval, receipts, password reset). Learners’ replies go to the support email.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="supportEmail" label={<>Support email <span className="font-normal text-slate-400">(recommended)</span></>} error={fe.supportEmail} hint="An inbox your team reads, e.g. support@nextgeneducator.in">
              <input id="supportEmail" type="email" inputMode="email" maxLength={254} placeholder="support@nextgeneducator.in" value={v.supportEmail} onChange={set("supportEmail")} className={inputCls(!!fe.supportEmail)} />
            </Field>
            <Field id="supportPhone" label={<>Support phone / WhatsApp <span className="font-normal text-slate-400">(optional)</span></>} error={fe.supportPhone}>
              <input id="supportPhone" type="tel" inputMode="tel" maxLength={20} placeholder="+91 98765 43210" value={v.supportPhone} onChange={set("supportPhone")} className={inputCls(!!fe.supportPhone)} />
            </Field>
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <p className="text-sm">
            {state.error && !state.ok ? <span className="font-medium text-red-600">{state.error}</span>
              : dirty ? <span className="font-semibold text-amber-700">Unsaved changes</span>
              : state.ok ? <span className="flex items-center gap-1.5 font-semibold text-emerald-700"><IconCheck className="h-4 w-4" /> Saved — new certificates use these details</span>
              : <span className="text-slate-500">Changes apply to all certificates, including ones already issued.</span>}
          </p>
          <button type="submit" disabled={pending || !dirty || urlCheck === null} className="btn-primary shrink-0">{pending ? "Saving…" : "Save settings"}</button>
        </div>
      </form>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <p className="mb-3 text-sm font-semibold text-navy-900">Live preview</p>
        <Certificate data={SAMPLE} settings={{ ...v, siteUrl: effectiveUrl }} />
        <p className="mt-3 text-xs text-slate-500">
          The QR code is real — scan it with your phone to test. Preview uses sample data.
        </p>
      </div>
    </div>
  );
}
