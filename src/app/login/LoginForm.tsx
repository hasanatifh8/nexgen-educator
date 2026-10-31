"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import { IconArrowRight } from "@/components/Icons";

const input =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-sky-100";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const justReset = params.get("reset") === "1";

  return (
    <>
      {justReset && !state.error && (
        <p role="status" className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
          Password updated. Log in with your new password.
        </p>
      )}
      {next && !justReset && !state.error && (
        <p className="mb-5 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-sky-100">
          Please log in or create a free account to access courses and certifications.
        </p>
      )}
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={next} />
        {state.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
            {state.error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-navy-900">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.email} placeholder="you@school.edu" className={input} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-semibold text-navy-900">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-brand-ink hover:underline">Forgot password?</Link>
          </div>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-base">
          {pending ? "Signing in…" : <>Log In <IconArrowRight className="h-4 w-4" /></>}
        </button>
        <p className="text-center text-sm text-slate-600">
          New to NextGen Educator?{" "}
          <Link href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="font-semibold text-brand-ink hover:underline">
            Create a free account
          </Link>
        </p>
      </form>
    </>
  );
}
