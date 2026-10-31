import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { IconShield } from "@/components/Icons";

export const metadata: Metadata = { title: "Verify a certificate — NextGen Educator", robots: { index: false } };

async function lookup(fd: FormData) {
  "use server";
  const id = String(fd.get("id") ?? "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 40);
  redirect(id ? `/verify/${id}` : "/verify");
}

export default function VerifySearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-16 sm:py-24">
        <section className="card mx-auto max-w-lg p-8 text-center sm:p-10">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-900 text-white"><IconShield className="h-7 w-7" /></span>
          <h1 className="mt-5 font-display text-3xl font-bold text-navy-900">Verify a certificate</h1>
          <p className="mt-2 text-slate-600">Scan the QR code on a certificate, or enter its credential ID below.</p>
          <form action={lookup} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="id" className="sr-only">Credential ID</label>
            <input id="id" name="id" required placeholder="NGE-2026-1A2B3C4D" className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-center font-mono text-sm uppercase outline-none focus:border-brand focus:ring-4 focus:ring-sky-100 sm:text-left" />
            <button className="btn-primary">Verify</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
