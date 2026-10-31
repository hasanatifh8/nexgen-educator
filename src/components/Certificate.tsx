"use client";

import { useMemo, useSyncExternalStore } from "react";
import { PAGE, QR_BOX, artworkSvg, certificateLayout, qrPath, type CertificateData } from "@/lib/certificate/design";
import type { SiteSettings } from "@/lib/siteSettings";

const PT = 0.3528;
const FONTS = {
  sans: "Helvetica, Arial, var(--font-inter), sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
};

let artworkUri: string | null = null;
const artwork = () => (artworkUri ??= `data:image/svg+xml;charset=utf-8,${encodeURIComponent(artworkSvg())}`);

const noop = () => () => {};
/** Falls back to the current site origin when no site URL is configured yet (Admin → Settings). */
export function useEffectiveSettings(settings: SiteSettings): SiteSettings {
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => "");
  return useMemo(() => ({ ...settings, siteUrl: settings.siteUrl || origin }), [settings, origin]);
}

export default function Certificate({ data, settings, className = "" }: { data: CertificateData; settings: SiteSettings; className?: string }) {
  const s = useEffectiveSettings(settings);
  const layout = useMemo(() => certificateLayout(data, s), [data, s]);
  const qr = useMemo(() => (layout.url ? qrPath(layout.url, QR_BOX.x, QR_BOX.y, QR_BOX.size) : ""), [layout.url]);

  return (
    <svg viewBox={`0 0 ${PAGE.w} ${PAGE.h}`} className={`block h-auto w-full rounded-xl shadow-2xl shadow-navy-900/25 ${className}`} role="img"
      aria-label={`Certificate of achievement for ${data.name}, ${data.title}`}>
      <image href={artwork()} x="0" y="0" width={PAGE.w} height={PAGE.h} />
      {layout.lines.map((l, i) => <line key={i} x1={l.x1} x2={l.x2} y1={l.y} y2={l.y} stroke={l.color} strokeWidth={l.width} />)}
      {layout.text.map((t, i) => (
        <text
          key={i}
          x={t.x}
          y={t.y}
          fontSize={t.size * PT}
          fontFamily={FONTS[t.font]}
          fontWeight={t.style.includes("bold") ? 700 : 400}
          fontStyle={t.style.includes("italic") ? "italic" : "normal"}
          letterSpacing={t.spacing}
          fill={t.color}
          textAnchor={t.align === "center" ? "middle" : t.align === "right" ? "end" : "start"}
        >
          {t.text}
        </text>
      ))}
      <rect x={QR_BOX.x - 1} y={QR_BOX.y - 1} width={QR_BOX.size + 2} height={QR_BOX.size + 2} rx="1.5" fill="#fff" stroke="#c9a227" strokeWidth="0.3" />
      {qr ? (
        <path d={qr} fill="#0f2a4a" shapeRendering="crispEdges" />
      ) : (
        <text x={QR_BOX.x + QR_BOX.size / 2} y={QR_BOX.y + QR_BOX.size / 2} fontSize="2.4" textAnchor="middle" fill="#64748b" fontFamily={FONTS.sans}>QR appears here</text>
      )}
      {layout.urlLabel && (
        <text x={QR_BOX.x + QR_BOX.size / 2} y={QR_BOX.y + QR_BOX.size + 8.6} fontSize={5.2 * PT} textAnchor="middle" fill="#64748b" fontFamily={FONTS.sans}>
          {layout.urlLabel.length > 48 ? `${layout.urlLabel.slice(0, 46)}…` : layout.urlLabel}
        </text>
      )}
      {layout.sample && (
        <text x={PAGE.w / 2} y={PAGE.h / 2 + 12} fontSize="44" fontWeight={800} textAnchor="middle" fill="#dc2626" opacity="0.08"
          transform={`rotate(-18 ${PAGE.w / 2} ${PAGE.h / 2})`} fontFamily={FONTS.sans} letterSpacing="6">SAMPLE</text>
      )}
    </svg>
  );
}
