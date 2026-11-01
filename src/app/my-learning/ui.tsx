import type { ReactNode } from "react";

export function PageTitle({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-bold tracking-[0.15em] text-accent-strong uppercase">{eyebrow}</p>}
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-navy-900">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-slate-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const TONES = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
} as const;
export type Tone = keyof typeof TONES;

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${TONES[tone]}`}>{children}</span>;
}

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-lg font-semibold text-navy-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
      <p className="font-display font-semibold text-navy-900">{title}</p>
      {children && <div className="mt-1 text-sm text-slate-500">{children}</div>}
    </div>
  );
}

export const portalSkeleton = (
  <div className="space-y-6">
    <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
    <div className="h-48 animate-pulse rounded-2xl bg-white" />
    <div className="h-72 animate-pulse rounded-2xl bg-white" />
  </div>
);
