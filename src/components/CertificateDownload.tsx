"use client";

import { useState } from "react";
import type { CertificateData } from "@/lib/certificate/design";
import type { SiteSettings } from "@/lib/siteSettings";
import { useEffectiveSettings } from "./Certificate";
import { IconDownload } from "./Icons";

export default function CertificateDownload({ data, settings, className = "btn-primary", label = "Download PDF Certificate" }: {
  data: CertificateData; settings: SiteSettings; className?: string; label?: string;
}) {
  const s = useEffectiveSettings(settings);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setFailed(false);
          try {
            const { downloadCertificatePdf } = await import("@/lib/certificatePdf");
            await downloadCertificatePdf(data, s);
          } catch (e) {
            console.error(e);
            setFailed(true);
          } finally {
            setBusy(false);
          }
        }}
      >
        <IconDownload className="h-4 w-4" /> {busy ? "Preparing PDF…" : label}
      </button>
      {failed && <p className="mt-1 text-xs font-medium text-red-600">Couldn’t create the PDF. Please try again.</p>}
    </>
  );
}
