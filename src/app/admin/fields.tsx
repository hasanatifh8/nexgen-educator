"use client";

import type { ReactNode } from "react";

export const inputCls = (invalid?: boolean) =>
  `mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    invalid ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-brand focus:ring-sky-100"
  }`;

export function Field({ id, label, error, hint, children }: { id: string; label: ReactNode; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">{label}</label>
      {children}
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function FormError({ error }: { error?: string }) {
  return error ? <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p> : null;
}
