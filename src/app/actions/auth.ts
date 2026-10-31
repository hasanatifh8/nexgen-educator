"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { onboardingPath, safeNextPath } from "@/lib/sessionToken";
import { isAdminEmail } from "@/lib/dal";
import { clear, clientIp, hit } from "@/lib/rateLimit";
import { verifyCredentials } from "@/lib/users";

export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", email };

  // 5 tries per account and 20 per IP every 15 minutes slows password guessing to a crawl.
  const accountKey = `login:${email.toLowerCase()}`;
  const ip = await clientIp();
  const byAccount = hit(accountKey, 5, 15 * 60_000);
  const byIp = hit(`login-ip:${ip}`, 20, 15 * 60_000);
  if (!byAccount.ok || !byIp.ok) {
    const minutes = Math.ceil(Math.max(byAccount.retryAfterMs, byIp.retryAfterMs) / 60_000);
    return { error: `Too many sign-in attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}, or reset your password.`, email };
  }

  const user = await verifyCredentials(email, password);
  if (!user) return { error: "Incorrect email or password.", email };
  clear(accountKey);

  await createSession(user.id);
  const next = safeNextPath(formData.get("next"));
  if (isAdminEmail(user.email)) redirect(next ?? "/admin");
  // Learners finish their profile before anything else.
  if (!user.profile?.completedAt) redirect(onboardingPath(next));
  redirect(next ?? "/my-learning");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
