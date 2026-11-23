"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconCheck, IconDownload, IconEye, IconRefresh } from "@/components/Icons";
import { formatINR } from "@/lib/catalog";
import { loadProposalAssets } from "@/lib/proposal/assets";
import { buildProposalPdf, programFee, programHoursTotal, type ProposalOrg, type ProposalProgram, type ProposalStats } from "@/lib/proposal/pdf";
import { BOARDS, DESIGNATIONS, LIMITS, SALUTATIONS, proposalFileName, validateProposal, type ProposalErrors, type ProposalInput } from "@/lib/proposal/types";
import { Field, FormError, inputCls } from "../fields";
import { markProposalDownloadedAction, saveProposalAction } from "./actions";

type Props = {
  initial: ProposalInput;
  saved?: { id: string; ref: string };
  programs: ProposalProgram[];
  org: ProposalOrg;
  stats: ProposalStats;
  attemptsPerDay: number;
  onlinePayments?: boolean;
  /** Start the download as soon as the page opens (the “Download” link on the list). */
  autoDownload?: boolean;
};

const optional = (label: string) => <>{label} <span className="font-normal text-slate-400">(optional)</span></>;

export default function ProposalEditor({ initial, saved, programs, org, stats, attemptsPerDay, onlinePayments = false, autoDownload }: Props) {
  const [form, setForm] = useState<ProposalInput>(initial);
  const [current, setCurrent] = useState(saved);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<ProposalErrors>({});
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState<"save" | "download" | null>(null);
  const [notice, setNotice] = useState<string>();
  const [preview, setPreview] = useState<{ url: string; pages: number } | null>(null);
  const [previewError, setPreviewError] = useState<string>();
  const [rendering, setRendering] = useState(false);
  const urlRef = useRef<string | null>(null);

  const set = <K extends keyof ProposalInput>(key: K, value: ProposalInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
    setNotice(undefined);
    setError(undefined);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const build = useCallback(
    async (values: ProposalInput, ref: string) => {
      const [{ jsPDF }, assets] = await Promise.all([import("jspdf"), loadProposalAssets()]);
      return buildProposalPdf(jsPDF, { p: { ...values, ref }, programs, org, stats, attemptsPerDay, onlinePayments }, assets);
    },
    [programs, org, stats, attemptsPerDay, onlinePayments],
  );

  // Live preview: the real PDF, rebuilt shortly after the admin stops typing.
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setRendering(true);
      try {
        const doc = await build(form, current?.ref ?? "DRAFT");
        if (cancelled) return;
        const url = URL.createObjectURL(doc.output("blob"));
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url;
        setPreview({ url, pages: doc.getNumberOfPages() });
        setPreviewError(undefined);
      } catch (e) {
        if (!cancelled) setPreviewError(e instanceof Error ? e.message : "The preview could not be generated.");
      } finally {
        if (!cancelled) setRendering(false);
      }
    }, 550);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [form, current?.ref, build]);

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  /** Saves when needed; returns the saved id and ref, or null when validation fails. */
  const save = async (): Promise<{ id: string; ref: string } | null> => {
    const clientErrors = validateProposal(form);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setError("Please fix the highlighted fields.");
      document.getElementById(Object.keys(clientErrors)[0])?.focus();
      return null;
    }
    if (current && !dirty) return current;
    const res = await saveProposalAction(current?.id ?? null, form);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      setError(res.error);
      return null;
    }
    setErrors({});
    setError(undefined);
    setDirty(false);
    const next = { id: res.id, ref: res.ref };
    setCurrent(next);
    // Point the address bar at the saved proposal without remounting the editor (Next.js syncs native history).
    if (!current) window.history.replaceState(null, "", `/admin/proposals/${res.id}`);
    return next;
  };

  const onSave = async () => {
    setBusy("save");
    try {
      const s = await save();
      if (s) setNotice(`Saved as ${s.ref}.`);
    } catch {
      setError("Could not save. Check your connection and try again.");
    } finally {
      setBusy(null);
    }
  };

  const onDownload = async () => {
    setBusy("download");
    try {
      const s = await save();
      if (!s) return;
      const doc = await build(form, s.ref);
      doc.save(proposalFileName(form));
      setNotice(`Downloaded ${proposalFileName(form)}. It is saved as ${s.ref}.`);
      markProposalDownloadedAction(s.id).catch(() => {});
    } catch {
      setError("Could not create the PDF. Check your connection and try again.");
    } finally {
      setBusy(null);
    }
  };

  const autoDone = useRef(false);
  useEffect(() => {
    if (autoDownload && !autoDone.current) {
      autoDone.current = true;
      onDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload]);

  const selected = programs.filter((p) => form.programIds.includes(p.id));
  const pkg = selected.reduce((s, p) => s + programFee(p), 0);
  const hours = selected.reduce((s, p) => s + programHoursTotal(p), 0);
  const toggleProgram = (id: string) => set("programIds", form.programIds.includes(id) ? form.programIds.filter((x) => x !== id) : programs.filter((p) => p.id === id || form.programIds.includes(p.id)).map((p) => p.id));

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-6">
        <FormError error={error} />

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">1. Who is it for?</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">These details personalise the cover, the letter and every page header.</p>
          <div className="grid gap-5 sm:grid-cols-[110px_1fr]">
            <Field id="salutation" label="Title">
              <select id="salutation" value={form.salutation} onChange={(e) => set("salutation", e.target.value)} className={inputCls()}>
                {SALUTATIONS.map((s) => <option key={s} value={s}>{s || "None"}</option>)}
              </select>
            </Field>
            <Field id="contactName" label="Principal / manager name" error={errors.contactName}>
              <input id="contactName" value={form.contactName} maxLength={LIMITS.name} onChange={(e) => set("contactName", e.target.value)} placeholder="Meera Iyer" className={inputCls(!!errors.contactName)} />
            </Field>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="designation" label="Designation" error={errors.designation}>
              <input id="designation" list="designations" value={form.designation} maxLength={LIMITS.title} onChange={(e) => set("designation", e.target.value)} className={inputCls(!!errors.designation)} />
              <datalist id="designations">{DESIGNATIONS.map((d) => <option key={d} value={d} />)}</datalist>
            </Field>
            <Field id="board" label={optional("Board")}>
              <select id="board" value={form.board} onChange={(e) => set("board", e.target.value)} className={inputCls()}>
                {BOARDS.map((b) => <option key={b} value={b}>{b || "Not specified"}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-5">
            <Field id="schoolName" label="School name" error={errors.schoolName}>
              <input id="schoolName" value={form.schoolName} maxLength={LIMITS.school} onChange={(e) => set("schoolName", e.target.value)} placeholder="Delhi Public School" className={inputCls(!!errors.schoolName)} />
            </Field>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="city" label="City" error={errors.city}>
              <input id="city" value={form.city} maxLength={LIMITS.city} onChange={(e) => set("city", e.target.value)} placeholder="Vadodara" className={inputCls(!!errors.city)} />
            </Field>
            <Field id="teachers" label={optional("Number of teachers")} hint="Adds a cost estimate to the pricing page.">
              <input id="teachers" type="number" min={0} max={LIMITS.teachers} inputMode="numeric" value={form.teachers || ""} onChange={(e) => set("teachers", Math.max(0, Math.min(LIMITS.teachers, Math.round(Number(e.target.value) || 0))))} placeholder="e.g. 40" className={inputCls()} />
            </Field>
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-900">2. Programmes to propose</h2>
              <p className="mt-1 text-sm text-slate-500">Live from your catalog. Each one gets its own page section with courses, outcomes and fee.</p>
            </div>
            <div className="flex shrink-0 gap-1 text-xs font-semibold">
              <button type="button" onClick={() => set("programIds", programs.map((p) => p.id))} className="rounded-md px-2 py-1 text-brand-ink hover:bg-sky-50">All</button>
              <button type="button" onClick={() => set("programIds", [])} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">None</button>
            </div>
          </div>
          {errors.programIds && <p className="mt-3 text-xs font-medium text-red-600">{errors.programIds}</p>}
          <ul id="programIds" tabIndex={-1} className="mt-4 space-y-2">
            {programs.map((p) => {
              const on = form.programIds.includes(p.id);
              const fee = programFee(p);
              const lessons = p.courses.reduce((n, c) => n + c.lessons, 0);
              return (
                <li key={p.id}>
                  <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${on ? "border-brand bg-sky-50/60" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="checkbox" checked={on} onChange={() => toggleProgram(p.id)} className="mt-1 h-4 w-4 accent-[#0670ab]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-navy-900">{p.title}</span>
                      <span className="block text-xs text-slate-500">
                        {p.category} · {p.level} · {programHoursTotal(p)} hrs{lessons ? ` · ${lessons} lessons` : " · no lessons yet"}
                      </span>
                    </span>
                    <span className={`shrink-0 text-xs font-bold ${fee ? "text-navy-900" : "text-emerald-700"}`}>{fee ? formatINR(fee) : "Free"}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="discountPercent" label={optional("Institutional discount (%)")} hint="Taken off paid course fees. 0 = list prices.">
              <input id="discountPercent" type="number" min={0} max={100} inputMode="numeric" value={form.discountPercent || ""} onChange={(e) => set("discountPercent", Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0))))} placeholder="e.g. 15" className={inputCls()} />
            </Field>
            <div className="self-end rounded-xl bg-slate-50 p-3.5 text-sm ring-1 ring-slate-100">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Package per teacher</p>
              <p className="mt-0.5 font-display text-lg font-bold text-navy-900">
                {pkg ? formatINR(Math.round(pkg * (100 - form.discountPercent)) / 100) : "Free"}
                {pkg > 0 && <span className="ml-1 text-xs font-medium text-slate-500">+ GST · {hours} hrs</span>}
              </p>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">3. Personal message</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">Optional. Shown in a highlighted box in the cover letter — a line about your meeting makes the proposal feel personal.</p>
          <Field id="note" label={optional("Message")} hint={`${form.note.length} / ${LIMITS.note} characters`}>
            <textarea id="note" rows={4} maxLength={LIMITS.note} value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="It was a pleasure meeting you at the principals’ meet last week. As discussed, we have included…" className={inputCls()} />
          </Field>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">4. From you</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">Signs the letter and fills the contact page. Your last proposal’s details are filled in for you.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="preparedBy" label="Your name" error={errors.preparedBy}>
              <input id="preparedBy" value={form.preparedBy} maxLength={LIMITS.name} onChange={(e) => set("preparedBy", e.target.value)} className={inputCls(!!errors.preparedBy)} />
            </Field>
            <Field id="preparedByTitle" label={optional("Your title")}>
              <input id="preparedByTitle" value={form.preparedByTitle} maxLength={LIMITS.title} onChange={(e) => set("preparedByTitle", e.target.value)} placeholder="Partnerships Manager" className={inputCls()} />
            </Field>
            <Field id="preparedPhone" label={optional("Phone")}>
              <input id="preparedPhone" type="tel" value={form.preparedPhone} maxLength={LIMITS.phone} onChange={(e) => set("preparedPhone", e.target.value)} className={inputCls()} />
            </Field>
            <Field id="preparedEmail" label={optional("Email")} error={errors.preparedEmail}>
              <input id="preparedEmail" type="email" value={form.preparedEmail} maxLength={LIMITS.email} onChange={(e) => set("preparedEmail", e.target.value)} className={inputCls(!!errors.preparedEmail)} />
            </Field>
            <Field id="issuedOn" label="Proposal date" error={errors.issuedOn}>
              <input id="issuedOn" type="date" value={form.issuedOn} onChange={(e) => set("issuedOn", e.target.value)} className={inputCls(!!errors.issuedOn)} />
            </Field>
            <Field id="validUntil" label="Valid until" error={errors.validUntil}>
              <input id="validUntil" type="date" value={form.validUntil} onChange={(e) => set("validUntil", e.target.value)} className={inputCls(!!errors.validUntil)} />
            </Field>
          </div>
        </section>

        {/* Actions: sticky on small screens so they are always reachable */}
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white sm:px-5 xl:static">
          {notice && (
            <p role="status" className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
              <IconCheck className="h-4 w-4 shrink-0" /> {notice}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={onDownload} disabled={busy !== null} className="btn-primary flex-1 py-3 disabled:opacity-60">
              <IconDownload className="h-4 w-4" /> {busy === "download" ? "Preparing PDF…" : current && !dirty ? "Download PDF" : "Save & download PDF"}
            </button>
            <button type="button" onClick={onSave} disabled={busy !== null || (!!current && !dirty)} className="btn-secondary py-3 disabled:opacity-60">
              {busy === "save" ? "Saving…" : current && !dirty ? "Saved" : "Save"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {current ? <>Reference <span className="font-mono font-semibold text-navy-900">{current.ref}</span>{dirty && " · unsaved changes"}</> : "A reference number is given when you first save."}
          </p>
        </div>
      </div>

      {/* Live preview of the actual PDF */}
      <aside className="xl:sticky xl:top-24 xl:self-start">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <IconEye className="h-4 w-4 text-brand-ink" /> Live preview
              {preview && <span className="font-normal text-slate-500">· {preview.pages} pages</span>}
              {rendering && <IconRefresh className="h-3.5 w-3.5 animate-spin text-slate-400" aria-label="Updating" />}
            </p>
            {preview && (
              <a href={preview.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-ink hover:underline">Open full screen ↗</a>
            )}
          </div>
          {previewError ? (
            <div className="grid h-[70vh] place-items-center p-8 text-center text-sm text-red-700">{previewError}</div>
          ) : preview ? (
            <iframe key={preview.url} src={`${preview.url}#view=FitH&navpanes=0`} title="Proposal preview" className="h-[75vh] w-full bg-slate-100 xl:h-[calc(100vh-11rem)]" />
          ) : (
            <div className="grid h-[70vh] place-items-center bg-slate-50 text-sm text-slate-500">Building your proposal…</div>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Programme details, prices and outcomes come straight from <Link href="/admin/programs" className="font-semibold text-brand-ink hover:underline">Programs</Link> and{" "}
          <Link href="/admin/courses" className="font-semibold text-brand-ink hover:underline">Courses</Link>, so the document is always up to date.
        </p>
      </aside>
    </div>
  );
}
