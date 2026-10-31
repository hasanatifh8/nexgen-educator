"use client";

import { verifyUrl, type SiteSettings } from "@/lib/siteSettings";
import type { EarnedCertificate } from "@/lib/users";
import { useEffectiveSettings } from "./Certificate";

/** LinkedIn's public "Add license or certification" link, pre-filled so the credential links back to /verify. */
export function linkedInAddUrl(cert: EarnedCertificate, organizationName: string, siteUrl: string) {
  const issued = new Date(cert.issuedAt);
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: cert.programTitle,
    organizationName,
    issueYear: String(issued.getFullYear()),
    issueMonth: String(issued.getMonth() + 1),
    certId: cert.credentialId,
    ...(siteUrl ? { certUrl: verifyUrl(siteUrl, cert.credentialId) } : {}),
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}

export default function LinkedInAddButton({ certificate, settings, className = "btn-secondary" }: {
  certificate: EarnedCertificate; settings: SiteSettings; className?: string;
}) {
  const s = useEffectiveSettings(settings);
  return (
    <a href={linkedInAddUrl(certificate, s.organizationName, s.siteUrl)} target="_blank" rel="noopener noreferrer" className={className}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
      Add to LinkedIn profile
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
