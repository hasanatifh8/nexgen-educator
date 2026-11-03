"use client";

import { useActionState, useState } from "react";
import { adminPasswordResetAction, type ResetLinkState } from "../../actions";

/** Admin help for learners who can't sign in: emails a fresh reset link and shows it for sharing another way. */
export default function PasswordHelp({ userId, email }: { userId: string; email: string }) {
  const [state, action, pending] = useActionState<ResetLinkState, FormData>(adminPasswordResetAction, {});
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input type="hidden" name="userId" value={userId} />
        <p className="text-sm text-slate-500">Emails a new password-reset link to <span className="font-semibold text-navy-900">{email}</span>. It works for 30 minutes and replaces any earlier link.</p>
        <button type="submit" disabled={pending} className="btn shrink-0 bg-navy-900 py-2.5 text-sm text-white hover:bg-navy-800 disabled:opacity-60">
          {pending ? "Sending…" : "Send password reset"}
        </button>
      </form>
      {state.error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{state.error}</p>}
      {state.link && (
        <div role="status" className="mt-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
          <p className="font-semibold">Reset email sent.</p>
          <p className="mt-1">If it doesn’t arrive (ask them to check spam), share this link directly — for example on WhatsApp. Only share it with the learner.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input readOnly value={state.link} onFocus={(e) => e.currentTarget.select()} aria-label="Password reset link" className="min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-xs text-navy-900" />
            <button
              type="button"
              onClick={async () => { await navigator.clipboard.writeText(state.link!).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="btn shrink-0 border border-emerald-300 bg-white py-2 text-sm text-emerald-800 hover:bg-emerald-100"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
