"use client";

import { useActionState, useState } from "react";
import { resetPassword, type ResetState } from "@/app/actions/password";
import { PASSWORD_RULES } from "@/app/register/validation";
import { IconCheck } from "@/components/Icons";
import PasswordInput from "@/components/PasswordInput";

const input =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-sky-100";

export default function ResetForm({ token, email }: { token: string; email: string }) {
  const [state, formAction, pending] = useActionState<ResetState, FormData>(resetPassword, {});
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const allOk = PASSWORD_RULES.every((r) => r.test(password)) && password === confirm;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      {/* Lets password managers update the right saved login. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{state.error}</p>
      )}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-navy-900">New password</label>
        <PasswordInput id="password" name="password" autoComplete="new-password" maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          {PASSWORD_RULES.map((r) => (
            <li key={r.label} className={`flex items-center gap-1.5 text-xs ${r.test(password) ? "text-emerald-600" : "text-slate-400"}`}>
              <IconCheck className="h-3.5 w-3.5" /> {r.label}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-navy-900">Confirm new password</label>
        <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" maxLength={128} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} />
        {confirm && confirm !== password && <p className="mt-1.5 text-xs font-medium text-red-600">Passwords don’t match.</p>}
      </div>
      <button type="submit" disabled={pending || !allOk} className="btn-primary w-full py-3 text-base">
        {pending ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}
