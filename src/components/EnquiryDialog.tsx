"use client";

import { startTransition, useActionState, useRef, useState, type FormEvent } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { CALL_TIMES } from "@/lib/enquiryOptions";
import { IconCheck, IconPhone, IconX } from "./Icons";

type Props = { courseId: string; courseTitle: string; source?: "home" | "course-page"; className?: string; label?: string };

const inputCls = (bad?: boolean) =>
  `mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    bad ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-brand focus:ring-sky-100"
  }`;

function EnquiryForm({ courseId, courseTitle, source, onClose }: Omit<Props, "className" | "label"> & { onClose: () => void }) {
  const [state, dispatch, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, {});
  const [v, setV] = useState({ name: "", phone: "", email: "", callTime: CALL_TIMES[0] as string, message: "", consent: true, website: "" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [seen, setSeen] = useState(state);
  if (state !== seen) {
    setSeen(state);
    setErrors(state.fieldErrors ?? {});
  }
  const set = (k: keyof typeof v, val: string | boolean) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (v.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^(\+91)?[6-9]\d{9}$/.test(v.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid 10-digit Indian mobile number.";
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email or leave it blank.";
    if (!v.consent) e.consent = "Please allow us to call you.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const fd = new FormData();
    Object.entries({ ...v, consent: v.consent ? "on" : "", courseId, source: source ?? "home" }).forEach(([k, val]) => fd.set(k, String(val)));
    startTransition(() => dispatch(fd));
  };

  if (state.ok) {
    return (
      <div className="animate-fade-up px-6 py-10 text-center sm:px-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><IconCheck className="h-8 w-8" /></span>
        <h2 className="mt-5 font-display text-2xl font-bold text-navy-900">Thank you{state.firstName ? `, ${state.firstName}` : ""}!</h2>
        <p className="mt-2 text-slate-600">
          We’ve received your enquiry about <span className="font-semibold text-navy-900">{courseTitle}</span>.
        </p>
        <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900 ring-1 ring-sky-100">
          <IconPhone className="h-4 w-4" /> Our representative will call you soon.
        </p>
        <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">Done</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 px-6 pt-2 pb-6 sm:px-8 sm:pb-8">
      {state.error && !Object.values(errors).some(Boolean) && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{state.error}</p>
      )}
      {/* Honeypot for bots — hidden from people and screen readers. */}
      <input type="text" name="website" value={v.website} onChange={(e) => set("website", e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div>
        <label htmlFor="enq-name" className="block text-sm font-semibold text-navy-900">Your name</label>
        <input id="enq-name" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} className={inputCls(!!errors.name)} />
        {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="enq-phone" className="block text-sm font-semibold text-navy-900">Mobile number</label>
          <div className="relative">
            <span className="absolute top-1/2 left-3.5 mt-0.75 -translate-y-1/2 text-sm text-slate-500">+91</span>
            <input id="enq-phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="98765 43210" value={v.phone}
              onChange={(e) => set("phone", e.target.value)} className={`${inputCls(!!errors.phone)} pl-12`} />
          </div>
          {errors.phone && <p className="mt-1 text-xs font-medium text-red-600">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="enq-time" className="block text-sm font-semibold text-navy-900">Best time to call</label>
          <select id="enq-time" value={v.callTime} onChange={(e) => set("callTime", e.target.value)} className={inputCls()}>
            {CALL_TIMES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="enq-email" className="block text-sm font-semibold text-navy-900">Email <span className="font-normal text-slate-400">(optional)</span></label>
        <input id="enq-email" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} className={inputCls(!!errors.email)} />
        {errors.email && <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="enq-msg" className="block text-sm font-semibold text-navy-900">Your question <span className="font-normal text-slate-400">(optional)</span></label>
        <textarea id="enq-msg" rows={3} maxLength={500} value={v.message} onChange={(e) => set("message", e.target.value)}
          placeholder="e.g. Is this course suitable for primary teachers?" className={inputCls(!!errors.message)} />
      </div>
      <label className="flex items-start gap-2.5 text-xs text-slate-600">
        <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand" />
        I agree to be contacted by NextGen Educator by phone, SMS or WhatsApp about this enquiry.
      </label>
      {errors.consent && <p className="-mt-2 text-xs font-medium text-red-600">{errors.consent}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-base">
        {pending ? "Sending…" : "Request a call back"}
      </button>
      <p className="text-center text-xs text-slate-500">No account needed · We usually call within 1 working day</p>
    </form>
  );
}

/** "Enquire" button that opens a short call-back form for a course. */
export default function EnquiryDialog({ courseId, courseTitle, source = "home", className = "btn-secondary w-full", label = "Enquire now" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);

  const show = () => {
    setSession((s) => s + 1); // fresh, empty form every time it opens
    setOpen(true);
    ref.current?.showModal();
  };
  const close = () => ref.current?.close();

  return (
    <>
      <button type="button" onClick={show} className={className}>
        <IconPhone className="h-4 w-4" /> {label}
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && close()}
        aria-labelledby={`enq-title-${courseId}`}
        className="m-auto w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl p-0 shadow-2xl backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 bg-navy-900 px-6 py-5 text-white sm:px-8">
              <div>
                <p className="text-xs font-semibold tracking-wide text-sky-300 uppercase">Course enquiry</p>
                <h2 id={`enq-title-${courseId}`} className="mt-1 font-display text-lg leading-snug font-bold">{courseTitle}</h2>
                <p className="mt-1 text-sm text-slate-300">Leave your details and we’ll call you back.</p>
              </div>
              <button type="button" onClick={close} className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Close">
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <div className="pt-4">
              <EnquiryForm key={session} courseId={courseId} courseTitle={courseTitle} source={source} onClose={close} />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
