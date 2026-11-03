import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { LogoMark } from "@/components/Logo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to access your courses, practice tests, and certifications.",
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-16 sm:py-24">
        <section className="card mx-auto max-w-md p-6 sm:p-10">
          <LogoMark className="h-11 w-11" />
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy-900">Welcome back</h1>
          <p className="mt-2 text-slate-600">Log in to continue learning and certifying.</p>
          <div className="mt-8">
            <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-slate-100" />}>
              <LoginForm />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
