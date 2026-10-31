import Link from "next/link";
import type { ReactNode } from "react";
import { IconCheck, IconLock } from "@/components/Icons";

export function AccessDenied() {
  return (
    <div className="card p-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500"><IconLock className="h-7 w-7" /></span>
      <h1 className="mt-5 font-display text-2xl font-bold text-navy-900">Admins only</h1>
      <p className="mt-2 text-slate-600">Your account doesn’t have access to the admin portal.</p>
      <Link href="/" className="btn-secondary mt-6">Back to home</Link>
    </div>
  );
}

export function AdminTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Flash({ saved, deleted, error }: { saved?: string; deleted?: boolean; error?: string }) {
  if (error) return <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p>;
  if (!saved && !deleted) return null;
  return (
    <p role="status" className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
      <IconCheck className="h-4 w-4" /> {saved ? `Saved “${saved}”. Changes are live.` : "Deleted."}
    </p>
  );
}

export const adminSkeleton = <div className="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />;

export const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
