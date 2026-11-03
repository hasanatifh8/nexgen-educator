import { headers } from "next/headers";
import type { Brand } from "./emails";
import { getSettings } from "./settings";

type Mail = { to: string; subject: string; text: string; html: string };

/** “ra***@gmail.com” — enough to trace a delivery in the logs without printing full addresses. */
export const maskEmail = (email: string) => email.replace(/^(.{0,2})[^@]*(@.*)$/, "$1***$2");

/**
 * Sends via Resend when RESEND_API_KEY + EMAIL_FROM are set.
 * Otherwise, in development, prints the email to the server console.
 */
export async function sendMail(mail: Mail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (key && from) {
    // Never throws: a failed email must not undo the registration or admin action that triggered it.
    try {
      // Replies go to the support inbox set in Admin → Site & certificate, not the sending address.
      const { supportEmail } = await getSettings();
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html, ...(supportEmail ? { reply_to: supportEmail } : {}) }),
      });
      if (!res.ok) console.error(`[mailer] Resend failed (${res.status}) for ${maskEmail(mail.to)} “${mail.subject}”: ${await res.text()}`);
      else console.info(`[mailer] Sent “${mail.subject}” to ${maskEmail(mail.to)} (Resend id ${((await res.json().catch(() => ({}))) as { id?: string }).id ?? "?"})`);
    } catch (e) {
      console.error("[mailer] Resend request failed:", e);
    }
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

/** Site address plus signature details for email templates, or null when no site URL is configured. */
export async function emailBrand(): Promise<Brand | null> {
  const base = await appUrl();
  if (!base) return null;
  const { organizationName, supportEmail, supportPhone } = await getSettings();
  return { base, organizationName, supportEmail, supportPhone };
}
