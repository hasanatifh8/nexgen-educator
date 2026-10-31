import Link from "next/link";
import type { ReactNode } from "react";

export default function PageHeader({ crumb, title, children }: { crumb: string; title: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{crumb}</span>
        </nav>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="bg-slate-50 py-14 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
        ))}
      </div>
    </div>
  );
}
