import Link from "next/link";
import { razorpayEnabled } from "@/lib/razorpay";
import { IconArrowRight, IconCheck } from "../Icons";

/** Closing call to action: one clear next step. */
export default function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden bg-navy-900 py-20 text-white lg:py-24">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -bottom-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 id="final-cta-title" className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          Your students learn something new every day. <span className="text-brand-teal">So can you.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
          A year from now you’ll wish you had started today. Begin with one free lesson and see how simple it is.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-primary px-7 py-3.5 text-base">
            Start learning free <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/courses" className="btn-ghost-dark px-7 py-3.5 text-base">See all courses</Link>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
          {["Free registration", razorpayEnabled() ? "Secure UPI & card payments" : "No payment on the website", "Learn on your phone"].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <IconCheck className="h-4 w-4 text-brand-teal" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
