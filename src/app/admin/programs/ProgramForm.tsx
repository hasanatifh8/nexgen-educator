"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CATEGORIES, DEFAULT_PREMIUM_PRICE, GST_RATE, LEVELS, formatINR, gstOn, priceWithGst, type PublicProgram } from "@/lib/catalog";
import { saveProgramAction, type FormState } from "../actions";
import { Field, FormError, inputCls } from "../fields";

export default function ProgramForm({ program }: { program?: PublicProgram }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProgramAction, {});
  const [free, setFree] = useState(program ? program.price === 0 : true);
  const [price, setPrice] = useState(String(program && program.price > 0 ? program.price : DEFAULT_PREMIUM_PRICE));
  const amount = Number(price);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="card mt-6 space-y-5 p-6 sm:p-8">
      <FormError error={state.error} />
      {program && <input type="hidden" name="id" value={program.id} />}

      <Field id="title" label="Program title" error={fe.title}>
        <input id="title" name="title" defaultValue={program?.title} placeholder="e.g. Inclusive Classroom Specialist" className={inputCls(!!fe.title)} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="category" label="Category" error={fe.category} hint="Courses in this program use the same category.">
          <select id="category" name="category" defaultValue={program?.category ?? ""} className={inputCls(!!fe.category)}>
            <option value="" disabled>Select…</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field id="level" label="Level" error={fe.level}>
          <select id="level" name="level" defaultValue={program?.level ?? ""} className={inputCls(!!fe.level)}>
            <option value="" disabled>Select…</option>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-navy-900">Pricing</legend>
        <div className="mt-2 inline-flex rounded-lg bg-slate-100 p-1">
          {[["Free", true], ["Paid", false]].map(([label, val]) => (
            <button
              key={String(label)}
              type="button"
              onClick={() => setFree(val as boolean)}
              aria-pressed={free === val}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${free === val ? "bg-white text-navy-900 shadow-sm" : "text-slate-500"}`}
            >
              {label as string}
            </button>
          ))}
        </div>
        {free ? (
          <input type="hidden" name="price" value="0" />
        ) : (
          <div className="mt-3 max-w-xs">
            <Field
              id="price"
              label="Price in ₹ (before GST)"
              error={fe.price}
              hint={amount > 0 ? `${formatINR(amount)} + ${formatINR(gstOn(amount))} GST (${Math.round(GST_RATE * 100)}%) = ${formatINR(priceWithGst(amount))} total` : undefined}
            >
              <div className="relative">
                <span className="absolute top-1/2 left-3.5 mt-0.75 -translate-y-1/2 text-sm text-slate-500">₹</span>
                <input id="price" name="price" type="number" min="1" max="100000" step="1" value={price} onChange={(e) => setPrice(e.target.value)} className={`${inputCls(!!fe.price)} pl-7`} />
              </div>
            </Field>
          </div>
        )}
      </fieldset>

      <Field id="description" label="Short description" error={fe.description} hint="Shown on the certification card (10–300 characters).">
        <textarea id="description" name="description" rows={3} defaultValue={program?.description} className={inputCls(!!fe.description)} />
      </Field>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Link href="/admin/programs" className="btn-secondary">Cancel</Link>
        <button type="submit" disabled={pending} className="btn-primary">{pending ? "Saving…" : program ? "Save changes" : "Create program"}</button>
      </div>
    </form>
  );
}
