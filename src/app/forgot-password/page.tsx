import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { LogoMark } from "@/components/Logo";
import ForgotForm from "./ForgotForm";

export const metadata: Metadata = { title: "Forgot password — NextGen Educator" };

export default function ForgotPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-16 sm:py-24">
        <section className="card mx-auto max-w-md p-6 sm:p-10">
          <LogoMark className="h-11 w-11" />
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy-900">Forgot your password?</h1>
          <p className="mt-2 text-slate-600">Enter the email you registered with and we’ll send you a reset link.</p>
          <div className="mt-8">
            <ForgotForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
