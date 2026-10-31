"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ForgotState } from "@/app/actions/password";
import { IconArrowRight, IconCheck } from "@/components/Icons";

export default function ForgotForm() {
  const [state, formAction, pending] = useActionState<ForgotState, FormData>(requestPasswordReset, {});

  if (state.sent) {
    return (
      <div className="animate-fade-up text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <IconCheck className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-xl font-bold text-navy-900">Check your inbox</h2>
        <p className="mt-2 text-sm text-slate-600">
          If an account exists for <span className="font-semibold text-navy-900">{state.email}</span>, we’ve sent a link to reset
          your password. It expires in 30 minutes.
        </p>
        {process.env.NODE_ENV !== "production" && (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-left text-xs text-amber-800 ring-1 ring-amber-200">
            <span className="font-semibold">Dev mode:</span> no email service is configured, so the reset link is printed in the
            terminal running <code>npm run dev</code>.
          </p>
        )}
        <Link href="/login" className="btn-secondary mt-6 w-full">Back to log in</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{state.error}</p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-navy-900">Email</label>
        <input
          id="email" name="email" type="email" autoComplete="email" required defaultValue={state.email} placeholder="you@school.edu"
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-sky-100"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-base">
        {pending ? "Sending…" : <>Send reset link <IconArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="text-center text-sm text-slate-600">
        Remembered it? <Link href="/login" className="font-semibold text-brand-ink hover:underline">Back to log in</Link>
      </p>
    </form>
  );
}
