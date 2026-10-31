import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import AdminNav from "./AdminNav";

export const metadata: Metadata = { title: "Admin Portal — NextGen Educator" };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-12">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-white/60 lg:h-56" />}>
            <AdminNav />
          </Suspense>
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </>
  );
}
