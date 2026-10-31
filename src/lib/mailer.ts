import { headers } from "next/headers";
import { getSettings } from "./settings";

type Mail = { to: string; subject: string; text: string; html: string };

/**
 * Sends via Resend when RESEND_API_KEY + EMAIL_FROM are set.
 * Otherwise, in development, prints the email to the server console.
 */
export async function sendMail(mail: Mail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (key && from) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html }),
    });
    if (!res.ok) console.error(`[mailer] Resend failed (${res.status}): ${await res.text()}`);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`\n──── 📧 Email (dev — not actually sent) ────\nTo: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n────────────────────────────────────────────\n`);
    return;
  }

  console.error("[mailer] No email provider configured (RESEND_API_KEY / EMAIL_FROM). Email not sent.");
}

/**
 * Base URL for links in emails: the admin-configured site URL (Admin → Settings), then APP_URL.
 * Falls back to the request host only in development, since a spoofed Host header must never
 * end up in a production reset link.
 */
export async function appUrl() {
  const { siteUrl } = await getSettings();
  if (siteUrl) return siteUrl;
  if (process.env.NODE_ENV === "production") return null;
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}
