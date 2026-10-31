"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import { IconCheck, IconShield, IconX } from "@/components/Icons";
import { MAX_UPLOAD_BYTES as MAX, MAX_UPLOAD_LABEL } from "@/lib/uploadLimits";
import { saveProfileAction } from "./actions";
import { QUALIFICATIONS, STATES, type ProfileState } from "./constants";

type Existing = {
  phone: string; city: string; state: string; qualification: string; experienceYears: number;
  idType: "aadhaar" | "pan"; idName: string; cvName: string;
} | null;

type Values = { phone: string; city: string; state: string; qualification: string; experienceYears: string; idType: "aadhaar" | "pan"; consent: boolean };
type Errors = Partial<Record<keyof Values | "idDocument" | "cv", string>>;

const ID_TYPES = { mimes: ["image/jpeg", "image/png", "application/pdf"], exts: /\.(jpe?g|png|pdf)$/i, label: "JPG, PNG or PDF" };
const CV_TYPES = { mimes: [] as string[], exts: /\.(pdf|docx?)$/i, label: "PDF, DOC or DOCX" };

/** Mirrors the server rules so problems show instantly — before uploading anything. */
function checkFile(file: File | null, kind: typeof ID_TYPES, required: boolean, label: string) {
  if (!file) return required ? `Please add your ${label}.` : undefined;
  if (/\.(heic|heif)$/i.test(file.name)) return "iPhone HEIC photos aren’t supported — please share/export the photo as JPG first.";
  if (!kind.exts.test(file.name) && !kind.mimes.includes(file.type)) return `${label[0].toUpperCase()}${label.slice(1)} must be ${kind.label}.`;
  if (file.size > MAX) return `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${MAX_UPLOAD_LABEL}. Try a smaller photo or scan.`;
  if (file.size === 0) return "This file is empty.";
}

/**
 * Phone photos are often 3–8 MB. Re-encode large JPG/PNG photos as a JPEG of at most 2000 px on the long side,
 * which keeps ID text sharp and fits the upload limit. Anything else (PDF, failures) is returned unchanged.
 */
async function shrinkImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png)$/.test(file.type) || file.size <= 1024 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    for (const [edge, quality] of [[2000, 0.85], [1600, 0.75], [1280, 0.7]] as const) {
      const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.fillStyle = "#fff"; // transparent PNG areas would otherwise turn black
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
      if (blob && blob.size <= MAX) return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
    }
  } catch {
    // Fall through: the size check will explain the problem.
  }
  return file;
}

const inputCls = (bad?: boolean) =>
  `mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    bad ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-brand focus:ring-sky-100"
  }`;

function Field({ id, label, error, hint, children }: { id: string; label: ReactNode; error?: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div data-field={id}>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">{label}</label>
      {children}
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function FileDrop({ id, label, hint, accept, file, current, error, onFile }: {
  id: string; label: string; hint: string; accept: string; file: File | null; current?: string; error?: string; onFile: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };
  return (
    <div data-field={id}>
      <p className="text-sm font-semibold text-navy-900">{label}</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`mt-1.5 rounded-xl border-2 border-dashed transition-colors focus-within:ring-4 focus-within:ring-sky-100 ${
          over ? "border-brand bg-sky-50" : error ? "border-red-300 bg-red-50/40" : file ? "border-emerald-300 bg-emerald-50/50" : "border-slate-300 hover:border-brand hover:bg-sky-50/40"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => { onFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
        />
        {file ? (
          <div className="flex items-center gap-3 px-4 py-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white"><IconCheck className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-navy-900">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB · ready to upload</p>
            </div>
            <button type="button" onClick={() => inputRef.current?.click()} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-ink hover:bg-white">Change</button>
            <button type="button" onClick={() => onFile(null)} className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-red-500" aria-label={`Remove ${label}`}>
              <IconX className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label htmlFor={id} className="flex cursor-pointer flex-col items-center justify-center px-4 py-7 text-center">
            <span className="text-sm font-semibold text-brand-ink">Click to choose a file <span className="font-normal text-slate-500">or drag it here</span></span>
            <span className="mt-1 text-xs text-slate-500">{hint}</span>
            {current && <span className="mt-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">Current: {current} — leave empty to keep it</span>}
          </label>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export default function ProfileForm({ existing, next }: { existing: Existing; next: string }) {
  const [state, dispatch, pending] = useActionState<ProfileState, FormData>(saveProfileAction, {});
  const [v, setV] = useState<Values>({
    phone: existing?.phone ?? "",
    city: existing?.city ?? "",
    state: existing?.state ?? "",
    qualification: existing?.qualification ?? "",
    experienceYears: String(existing?.experienceYears ?? ""),
    idType: existing?.idType ?? "aadhaar",
    consent: false,
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [seen, setSeen] = useState(state);
  const formRef = useRef<HTMLFormElement>(null);
  // Until hydration finishes, a click would do a plain page reload; keep the button disabled until then.
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- flips once after hydration
  useEffect(() => setReady(true), []);

  // Show server-side errors when a new action result arrives.
  if (state !== seen) {
    setSeen(state);
    setErrors((state.fieldErrors ?? {}) as Errors);
  }

  const keepId = existing && existing.idType === v.idType ? existing.idName : undefined;
  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    const phone = v.phone.replace(/[\s-]/g, "");
    if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid 10-digit Indian mobile number (starting 6–9).";
    if (v.city.trim().length < 2) e.city = "Enter your city.";
    if (!v.state) e.state = "Select your state.";
    if (!v.qualification) e.qualification = "Select your highest qualification.";
    const exp = Number(v.experienceYears);
    if (v.experienceYears === "" || !Number.isInteger(exp) || exp < 0 || exp > 50) e.experienceYears = "Enter whole years from 0 to 50.";
    e.idDocument = checkFile(idFile, ID_TYPES, !keepId, v.idType === "pan" ? "PAN card photo" : "masked Aadhaar photo");
    e.cv = checkFile(cvFile, CV_TYPES, !existing, "CV");
    if (!v.consent) e.consent = "Please tick the consent box to continue.";
    return Object.fromEntries(Object.entries(e).filter(([, m]) => m)) as Errors;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      formRef.current?.querySelector(`[data-field="${first}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // Build the payload ourselves (instead of <form action>) so React never resets the form —
    // nothing the user typed or picked is lost if the server sends back an error.
    const fd = new FormData();
    fd.set("next", next);
    fd.set("phone", v.phone);
    fd.set("city", v.city);
    fd.set("state", v.state);
    fd.set("qualification", v.qualification);
    fd.set("experienceYears", v.experienceYears);
    fd.set("idType", v.idType);
    fd.set("consent", "on");
    if (idFile) fd.set("idDocument", idFile);
    if (cvFile) fd.set("cv", cvFile);
    startTransition(() => dispatch(fd));
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {(state.error || errorCount > 0) && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {errorCount > 0 ? `Please fix ${errorCount} highlighted field${errorCount > 1 ? "s" : ""} below.` : state.error}
        </p>
      )}

      <fieldset className="space-y-5">
        <legend className="flex items-center gap-3 font-display text-lg font-semibold text-navy-900">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-900 text-xs text-white">1</span> About you
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="phone" label="Mobile number" error={errors.phone}>
            <div className="relative">
              <span className="absolute top-1/2 left-3.5 mt-0.75 -translate-y-1/2 text-sm text-slate-500">+91</span>
              <input id="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="98765 43210" value={v.phone}
                onChange={(e) => set("phone", e.target.value)} className={`${inputCls(!!errors.phone)} pl-12`} />
            </div>
          </Field>
          <Field id="experienceYears" label="Teaching experience (years)" error={errors.experienceYears}>
            <input id="experienceYears" type="number" min={0} max={50} placeholder="e.g. 3" value={v.experienceYears}
              onChange={(e) => set("experienceYears", e.target.value)} className={inputCls(!!errors.experienceYears)} />
          </Field>
          <Field id="city" label="City" error={errors.city}>
            <input id="city" autoComplete="address-level2" value={v.city} onChange={(e) => set("city", e.target.value)} className={inputCls(!!errors.city)} />
          </Field>
          <Field id="state" label="State / UT" error={errors.state}>
            <select id="state" value={v.state} onChange={(e) => set("state", e.target.value)} className={inputCls(!!errors.state)}>
              <option value="" disabled>Select…</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field id="qualification" label="Highest qualification" error={errors.qualification}>
          <select id="qualification" value={v.qualification} onChange={(e) => set("qualification", e.target.value)} className={inputCls(!!errors.qualification)}>
            <option value="" disabled>Select…</option>
            {QUALIFICATIONS.map((q) => <option key={q}>{q}</option>)}
          </select>
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="flex items-center gap-3 font-display text-lg font-semibold text-navy-900">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-900 text-xs text-white">2</span> Identity document
        </legend>
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="ID type">
          {([["aadhaar", "Aadhaar card", "Upload the masked Aadhaar"], ["pan", "PAN card", "Front side of your PAN card"]] as const).map(([val, t, d]) => (
            <label key={val} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${v.idType === val ? "border-brand bg-sky-50 ring-2 ring-sky-100" : "border-slate-200 hover:border-slate-300"}`}>
              <input type="radio" name="idType" value={val} checked={v.idType === val}
                onChange={() => { set("idType", val); setIdFile(null); setErrors((e) => ({ ...e, idDocument: undefined })); }} className="mt-0.5 h-4 w-4 accent-brand" />
              <span><span className="block text-sm font-semibold text-navy-900">{t}</span><span className="text-xs text-slate-500">{d}</span></span>
            </label>
          ))}
        </div>
        {v.idType === "aadhaar" && (
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
            <span className="font-semibold">Please upload a masked Aadhaar</span> (only the last 4 digits visible). You can download one from the official
            UIDAI myAadhaar portal. We never need your full Aadhaar number.
          </p>
        )}
        <FileDrop
          id="idDocument"
          label={v.idType === "pan" ? "PAN card photo" : "Masked Aadhaar photo"}
          hint={`JPG, PNG or PDF · max ${MAX_UPLOAD_LABEL} (large photos are resized automatically) · all text clearly readable`}
          accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
          file={idFile}
          current={keepId}
          error={errors.idDocument}
          onFile={async (picked) => {
            const f = picked ? await shrinkImage(picked) : null;
            setIdFile(f);
            setErrors((e) => ({ ...e, idDocument: f ? checkFile(f, ID_TYPES, false, "ID document") : undefined }));
          }}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="flex items-center gap-3 font-display text-lg font-semibold text-navy-900">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-900 text-xs text-white">3</span> Your CV
        </legend>
        <FileDrop
          id="cv"
          label="CV / résumé"
          hint={`PDF, DOC or DOCX · max ${MAX_UPLOAD_LABEL}`}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          file={cvFile}
          current={existing?.cvName}
          error={errors.cv}
          onFile={(f) => { setCvFile(f); setErrors((e) => ({ ...e, cv: f ? checkFile(f, CV_TYPES, false, "CV") : undefined })); }}
        />
      </fieldset>

      <div data-field="consent" className={`rounded-xl p-4 ring-1 ${errors.consent ? "bg-red-50/60 ring-red-200" : "bg-slate-50 ring-slate-200"}`}>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand" />
          <span>
            I consent to NextGen Educator storing my ID document and CV <span className="font-semibold">only to verify my identity and
            eligibility</span> for courses and certification. Documents are visible only to authorised administrators.
          </span>
        </label>
        {errors.consent && <p className="mt-2 pl-7 text-xs font-medium text-red-600">{errors.consent}</p>}
      </div>

      <button type="submit" disabled={pending || !ready} className="btn-primary w-full py-3.5 text-base">
        {!ready ? "Loading…" : pending ? "Uploading securely… please keep this page open" : existing ? "Update & resubmit profile" : "Submit profile for review"}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500"><IconShield className="h-4 w-4" /> Files are stored privately and never shown publicly.</p>
    </form>
  );
}
