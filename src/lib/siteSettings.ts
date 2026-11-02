/** Admin-editable site settings that are safe to send to the browser (no secrets). */
export type SiteSettings = {
  /** Public base URL, e.g. https://nextgeneducator.in — used in QR codes and emailed links. */
  siteUrl: string;
  organizationName: string;
  signatoryName: string;
  signatoryTitle: string;
  /** Second signature on certificates (optional). */
  secondSignatoryName: string;
  secondSignatoryTitle: string;
  /** Small print at the bottom of every certificate. */
  certificateNote: string;
  /** Shown in the signature of every email the site sends; replies go to supportEmail. */
  supportEmail: string;
  supportPhone: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteUrl: "",
  organizationName: "NextGen Educator",
  signatoryName: "A. Morgan",
  signatoryTitle: "Director of Certification",
  secondSignatoryName: "",
  secondSignatoryTitle: "",
  certificateNote: "This credential certifies completion of professional development and does not replace a government-issued teaching licence.",
  supportEmail: "",
  supportPhone: "",
};

/** Normalises a base URL: https/http only, no trailing slash. Returns null when invalid. */
export function normalizeSiteUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return "";
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (u.search || u.hash || u.username || u.password) return null;
    return `${u.origin}${u.pathname.replace(/\/+$/, "")}`;
  } catch {
    return null;
  }
}

export const verifyUrl = (siteUrl: string, credentialId: string) => `${siteUrl.replace(/\/+$/, "")}/verify/${encodeURIComponent(credentialId)}`;
