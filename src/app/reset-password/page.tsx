import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { LogoMark } from "@/components/Logo";
import { findUserByResetToken } from "@/lib/users";
import ResetForm from "./ResetForm";

export const metadata: Metadata = { title: "Reset password — NextGen Educator" };

async function ResetContent({ searchParams }: { searchParams: PageProps<"/reset-password">["searchParams"] }) {
  const { token } = await searchParams;
  await connection(); // token expiry check reads the clock
  const user = typeof token === "string" ? await findUserByResetToken(token) : undefined;

  if (!user || typeof token !== "string") {
    return (
      <>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy-900">Link expired</h1>
        <p className="mt-2 text-slate-600">This password reset link is invalid, has already been used, or has expired.</p>
        <Link href="/forgot-password" className="btn-primary mt-8 w-full py-3">Request a new link</Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy-900">Set a new password</h1>
      <p className="mt-2 text-slate-600">
        For <span className="font-semibold text-navy-900">{user.email}</span>. You’ll be signed out on all other devices.
      </p>
      <div className="mt-8">
        <ResetForm token={token} email={user.email} />
      </div>
    </>
  );
}

export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-16 sm:py-24">
        <section className="card mx-auto max-w-md p-6 sm:p-10">
          <LogoMark className="h-11 w-11" />
          <Suspense fallback={<div className="mt-5 h-80 animate-pulse rounded-xl bg-slate-100" />}>
            <ResetContent searchParams={searchParams} />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
