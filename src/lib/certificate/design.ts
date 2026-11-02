import QRCode from "qrcode";
import { verifyUrl, type SiteSettings } from "../siteSettings";

/**
 * Single source of truth for the certificate design, shared by the on-screen preview (inline SVG)
 * and the PDF (artwork rasterised as background + crisp vector text and QR on top).
 * All coordinates are millimetres on an A4 landscape page (297 × 210).
 */
export const PAGE = { w: 297, h: 210 };
const C = { navy: "#0f2a4a", navy2: "#1e4b7e", sky: "#0ea5e9", teal: "#06b6d4", orange: "#f97316", gold: "#c9a227", gold2: "#e9c46a", ink: "#334155", muted: "#64748b" };
export const COLORS = C;
const PT = 0.3528; // 1pt in mm

export type CertificateData = {
  name: string;
  title: string;
  score: number;
  total: number;
  credentialId: string;
  issuedOn: string;
  /** Watermark as a sample (home-page diagnostic). */
  sample?: boolean;
};

// ---------------------------------------------------------------------------------------------
// Artwork (static decoration, no text from users)
// ---------------------------------------------------------------------------------------------

const f = (n: number) => +n.toFixed(2);

/** Spirograph-style guilloche rosette — the classic security-print look, at very low opacity. */
function guilloche(cx: number, cy: number, R: number, r: number, d: number, color: string, opacity: number, width = 0.18) {
  const pts: string[] = [];
  const steps = 1400;
  const turns = r / gcd(Math.round(R), Math.round(r));
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
    const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    pts.push(`${f(cx + x)},${f(cy + y)}`);
  }
  return `<polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}"/>`;
}
function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

/** Interlaced sine waves for the top and bottom bands. */
function waves(x0: number, x1: number, y: number, amp: number, color: string, opacity: number) {
  let out = "";
  for (let k = 0; k < 4; k++) {
    const pts: string[] = [];
    for (let x = x0; x <= x1; x += 0.6) pts.push(`${f(x)},${f(y + amp * Math.sin((x / 4.2) + k * (Math.PI / 2)))}`);
    out += `<polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="0.16" opacity="${opacity}"/>`;
  }
  return out;
}

/** Circuit-trace corner ornament (matches the logo's digital motif). */
function corner(x: number, y: number, sx: 1 | -1, sy: 1 | -1) {
  const p = (dx: number, dy: number) => `${f(x + dx * sx)},${f(y + dy * sy)}`;
  return `
  <g stroke="${C.teal}" stroke-width="0.45" fill="none" opacity="0.55" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="${p(0, 14)} ${p(0, 0)} ${p(14, 0)}"/>
    <polyline points="${p(4, 22)} ${p(4, 4)} ${p(22, 4)}"/>
    <polyline points="${p(8, 9)} ${p(16, 9)} ${p(16, 15)}"/>
    <polyline points="${p(9, 8)} ${p(9, 16)}"/>
  </g>
  <g fill="${C.orange}" opacity="0.8"><circle cx="${f(x + 16 * sx)}" cy="${f(y + 15 * sy)}" r="0.9"/></g>
  <g fill="${C.teal}" opacity="0.7"><circle cx="${f(x + 22 * sx)}" cy="${f(y + 4 * sy)}" r="0.8"/><circle cx="${f(x + 4 * sx)}" cy="${f(y + 22 * sy)}" r="0.8"/><circle cx="${f(x + 9 * sx)}" cy="${f(y + 16 * sy)}" r="0.7"/></g>`;
}

/** Graduation cap + circuit tassel (same mark as the site logo), drawn in a 40×40 box. */
const capMark = (fill: string, accent: string) => `
  <path d="M20 9 5 15.5 20 22l15-6.5L20 9Z" fill="${fill}"/>
  <path d="M11 18.5v5.5c0 2.2 4 4 9 4s9-1.8 9-4v-5.5L20 22l-9-3.5Z" fill="${fill}"/>
  <path d="M33 16v6h-3v5" stroke="${accent}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="30" cy="28.5" r="1.8" fill="${accent}"/>`;

/** Gold award seal with ribbons, centred on (cx, cy). */
function seal(cx: number, cy: number) {
  const spikes = 32, R = 15.5, r = 13.6;
  const star = Array.from({ length: spikes * 2 }, (_, i) => {
    const a = (i * Math.PI) / spikes - Math.PI / 2;
    const rad = i % 2 ? r : R;
    return `${f(cx + rad * Math.cos(a))},${f(cy + rad * Math.sin(a))}`;
  }).join(" ");
  return `
  <g>
    <path d="M${f(cx - 7)} ${f(cy + 10)} l-5 17 l5 -3 l3 5 l4 -17 z" fill="${C.navy}"/>
    <path d="M${f(cx + 7)} ${f(cy + 10)} l5 17 l-5 -3 l-3 5 l-4 -17 z" fill="${C.orange}"/>
    <polygon points="${star}" fill="url(#sealGold)" stroke="#a6841c" stroke-width="0.3"/>
    <circle cx="${cx}" cy="${cy}" r="11.2" fill="none" stroke="#fff" stroke-width="0.5" opacity="0.9"/>
    <circle cx="${cx}" cy="${cy}" r="10" fill="url(#sealInner)"/>
    <circle cx="${cx}" cy="${cy}" r="8.6" fill="none" stroke="${C.gold2}" stroke-width="0.25" stroke-dasharray="0.6 0.6"/>
    <g transform="translate(${f(cx - 7)} ${f(cy - 7.6)}) scale(0.35)">${capMark("#ffffff", C.gold2)}</g>
  </g>`;
}

/** Decorative background as a standalone SVG string (no user data inside). */
export function artworkSvg({ width, height }: { width?: number; height?: number } = {}) {
  const { w, h } = PAGE;
  const size = width && height ? `width="${width}" height="${height}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ${size}>
  <defs>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.navy}"/><stop offset="1" stop-color="${C.navy2}"/></linearGradient>
    <radialGradient id="paper" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f1f7fc"/></radialGradient>
    <linearGradient id="sealGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4d97a"/><stop offset="0.5" stop-color="${C.gold}"/><stop offset="1" stop-color="#9c7a12"/></linearGradient>
    <radialGradient id="sealInner" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="${C.navy2}"/><stop offset="1" stop-color="${C.navy}"/></radialGradient>
    <linearGradient id="accent" x1="0" x2="1"><stop offset="0" stop-color="${C.orange}"/><stop offset="1" stop-color="${C.gold2}"/></linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#frame)"/>
  <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="2.5" fill="url(#paper)"/>
  <rect x="9" y="9" width="${w - 18}" height="${h - 18}" rx="1.5" fill="none" stroke="${C.gold}" stroke-width="0.7"/>
  <rect x="11" y="11" width="${w - 22}" height="${h - 22}" rx="1" fill="none" stroke="${C.gold}" stroke-width="0.22"/>
  ${waves(30, w - 30, 15.2, 1.6, C.teal, 0.35)}
  ${waves(30, w - 30, h - 15.2, 1.6, C.teal, 0.35)}
  <g>
    ${guilloche(w / 2, 108, 62, 23, 30, C.sky, 0.09)}
    ${guilloche(w / 2, 108, 46, 17, 22, C.teal, 0.08)}
  </g>
  <g transform="translate(${f(w / 2 - 34)} 70) scale(1.7)" opacity="0.045">${capMark(C.navy, C.navy)}</g>
  ${corner(11, 11, 1, 1)}${corner(w - 11, 11, -1, 1)}${corner(11, h - 11, 1, -1)}${corner(w - 11, h - 11, -1, -1)}
  <rect x="${w / 2 - 22}" y="22" width="44" height="0.9" rx="0.45" fill="url(#accent)"/>
  <g transform="translate(22 19.5) scale(0.32)">
    <rect width="40" height="40" rx="10" fill="${C.navy}"/>
    <path d="M20 9 5 15.5 20 22l15-6.5L20 9Z" fill="${C.teal}"/>
    <path d="M11 18.5v5.5c0 2.2 4 4 9 4s9-1.8 9-4v-5.5L20 22l-9-3.5Z" fill="#fff" opacity=".92"/>
    <path d="M33 16v6h-3v5" stroke="${C.orange}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="30" cy="28.5" r="1.8" fill="${C.orange}"/>
  </g>
  ${seal(w / 2, 158)}
</svg>`;
}

// ---------------------------------------------------------------------------------------------
// Text layout (shared by preview and PDF)
// ---------------------------------------------------------------------------------------------

export type TextItem = {
  text: string;
  x: number;
  y: number;
  /** Font size in points. */
  size: number;
  font: "sans" | "serif";
  style: "normal" | "bold" | "italic" | "bolditalic";
  color: string;
  align: "left" | "center" | "right";
  /** Extra letter spacing in mm. */
  spacing?: number;
};
export type Line = { x1: number; x2: number; y: number; color: string; width: number };

/** Rough width estimate (mm) so long names/titles shrink to fit in both renderers. */
const estWidth = (text: string, sizePt: number, font: "sans" | "serif") => text.length * sizePt * PT * (font === "serif" ? 0.5 : 0.53);
export function fitSize(text: string, maxPt: number, minPt: number, maxWidth: number, font: "sans" | "serif") {
  let s = maxPt;
  while (s > minPt && estWidth(text, s, font) > maxWidth) s -= 0.5;
  return s;
}

export const QR_BOX = { x: 238, y: 139, size: 30 };

export function certificateLayout(d: CertificateData, s: SiteSettings) {
  const { w } = PAGE;
  const cx = w / 2;
  const pct = d.total ? Math.round((d.score / d.total) * 100) : 0;
  const two = !!s.secondSignatoryName.trim();
  const text: TextItem[] = [
    { text: s.organizationName || "NextGen Educator", x: 37, y: 25, size: 13, font: "sans", style: "bold", color: C.navy, align: "left" },
    { text: "TRAIN · TEST · CERTIFY", x: 37, y: 29.5, size: 6.5, font: "sans", style: "bold", color: C.muted, align: "left", spacing: 0.6 },
    { text: "CREDENTIAL ID", x: w - 37, y: 24, size: 6.5, font: "sans", style: "bold", color: C.muted, align: "right", spacing: 0.5 },
    { text: d.credentialId, x: w - 37, y: 29, size: 10, font: "sans", style: "bold", color: C.navy, align: "right" },
    { text: "CERTIFICATE", x: cx, y: 48, size: 34, font: "serif", style: "bold", color: C.navy, align: "center", spacing: 3 },
    { text: "OF ACHIEVEMENT", x: cx, y: 57, size: 11, font: "sans", style: "bold", color: C.teal, align: "center", spacing: 2.4 },
    { text: "This is proudly presented to", x: cx, y: 72, size: 11, font: "sans", style: "normal", color: C.muted, align: "center" },
    { text: d.name, x: cx, y: 89, size: fitSize(d.name, 34, 18, 200, "serif"), font: "serif", style: "bolditalic", color: C.navy, align: "center" },
    { text: "for successfully completing the certification program", x: cx, y: 104, size: 11, font: "sans", style: "normal", color: C.ink, align: "center" },
    { text: d.title, x: cx, y: 115, size: fitSize(d.title, 19, 12, 220, "sans"), font: "sans", style: "bold", color: C.sky, align: "center" },
    { text: d.total ? `Score ${d.score}/${d.total} (${pct}%)   ·   Issued ${d.issuedOn}` : `Issued ${d.issuedOn}`, x: cx, y: 125, size: 10, font: "sans", style: "normal", color: C.ink, align: "center" },
    // Signatures
    { text: s.signatoryName, x: 62, y: 158, size: 17, font: "serif", style: "italic", color: C.navy, align: "center" },
    { text: s.signatoryName, x: 62, y: 168, size: 9, font: "sans", style: "bold", color: C.navy, align: "center" },
    { text: s.signatoryTitle, x: 62, y: 172.5, size: 8, font: "sans", style: "normal", color: C.muted, align: "center" },
    ...(two
      ? ([
          { text: s.secondSignatoryName, x: 198, y: 158, size: 17, font: "serif", style: "italic", color: C.navy, align: "center" },
          { text: s.secondSignatoryName, x: 198, y: 168, size: 9, font: "sans", style: "bold", color: C.navy, align: "center" },
          { text: s.secondSignatoryTitle, x: 198, y: 172.5, size: 8, font: "sans", style: "normal", color: C.muted, align: "center" },
        ] as TextItem[])
      : []),
    // QR caption
    { text: "SCAN TO VERIFY", x: QR_BOX.x + QR_BOX.size / 2, y: QR_BOX.y + QR_BOX.size + 5, size: 6.5, font: "sans", style: "bold", color: C.navy, align: "center", spacing: 0.5 },
    ...(s.certificateNote ? [{ text: s.certificateNote, x: cx, y: 191, size: 6.5, font: "sans" as const, style: "normal" as const, color: C.muted, align: "center" as const }] : []),
  ];
  const lines: Line[] = [
    { x1: cx - 60, x2: cx + 60, y: 94, color: C.gold, width: 0.35 },
    { x1: 32, x2: 92, y: 162.5, color: C.ink, width: 0.25 },
    ...(two ? [{ x1: 168, x2: 228, y: 162.5, color: C.ink, width: 0.25 }] : []),
  ];
  const url = s.siteUrl ? verifyUrl(s.siteUrl, d.credentialId) : "";
  return { text, lines, url, urlLabel: url.replace(/^https?:\/\//, ""), sample: !!d.sample };
}

// ---------------------------------------------------------------------------------------------
// QR code
// ---------------------------------------------------------------------------------------------

/** Real, scannable QR matrix (error correction M). */
export function qrMatrix(text: string) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const dark = (r: number, c: number) => !!qr.modules.get(r, c);
  return { n, dark };
}

/** Compact SVG path for the QR modules inside a box (with a 2-module quiet zone). */
export function qrPath(text: string, x: number, y: number, size: number) {
  const { n, dark } = qrMatrix(text);
  const cell = size / (n + 4);
  let d = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (dark(r, c)) d += `M${f(x + (c + 2) * cell)} ${f(y + (r + 2) * cell)}h${f(cell)}v${f(cell)}h-${f(cell)}z`;
  return d;
}

/** Issue date as printed on certificates, e.g. "31 October 2026" (IST). */
export const formatCertDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" });
