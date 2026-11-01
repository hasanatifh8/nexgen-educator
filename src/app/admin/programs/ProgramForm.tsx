"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CATEGORIES, LEVELS, type PublicProgram } from "@/lib/catalog";
import { saveProgramAction, type FormState } from "../actions";
import { Field, FormError, inputCls } from "../fields";

export default function ProgramForm({ program }: { program?: PublicProgram }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProgramAction, {});
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

      <p className="rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-100">
        Fees are set on each course (Admin → Courses → Edit). This program’s price is the total of its courses’ fees.
      </p>

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
