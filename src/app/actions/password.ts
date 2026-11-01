"use server";

import { redirect } from "next/navigation";
import { PASSWORD_RULES } from "@/app/register/validation";
import { passwordResetEmail } from "@/lib/emails";
import { appUrl, sendMail } from "@/lib/mailer";
import { clientIp, hit } from "@/lib/rateLimit";
import { createPasswordResetToken, resetPasswordWithToken } from "@/lib/users";

export type ForgotState = { sent?: boolean; email?: string; error?: string };

export async function requestPasswordReset(_prev: ForgotState, formData: FormData): Promise<ForgotState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address.", email };
  // Stops reset-email flooding of one inbox; the response stays identical so accounts can't be probed.
  if (!hit(`reset:${email.toLowerCase()}`, 3, 60 * 60_000).ok || !hit(`reset-ip:${await clientIp()}`, 10, 60 * 60_000).ok) {
    return { sent: true, email };
  }

  const result = await createPasswordResetToken(email);
  const base = await appUrl();
  if (result && base) {
    const link = `${base}/reset-password?token=${result.token}`;
    await sendMail({ to: result.user.email, ...passwordResetEmail(result.user.firstName, link) });
  } else if (result) {
    console.error("[password-reset] APP_URL is not set; cannot build a reset link.");
  }

  // Same response whether or not the account exists, so emails can't be probed.
  return { sent: true, email };
}

export type ResetState = { error?: string };

export async function resetPassword(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const failed = PASSWORD_RULES.filter((r) => !r.test(password));
  if (failed.length) return { error: `Password needs: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.` };
  if (password !== confirm) return { error: "Passwords don’t match." };

  const user = await resetPasswordWithToken(token, password);
  if (!user) return { error: "This reset link is invalid or has expired. Please request a new one." };

  redirect("/login?reset=1");
}
