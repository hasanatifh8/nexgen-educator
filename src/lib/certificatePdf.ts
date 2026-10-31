import { PAGE, QR_BOX, artworkSvg, certificateLayout, qrMatrix, type CertificateData } from "./certificate/design";
import type { SiteSettings } from "./siteSettings";

export type { CertificateData } from "./certificate/design";

const hex = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** Rasterises the decorative artwork in the browser (≈210 dpi) for use as the PDF background. */
async function artworkJpeg(): Promise<string> {
  const W = 2480, H = Math.round((W * PAGE.h) / PAGE.w);
  const img = new Image();
  img.decoding = "async";
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(artworkSvg({ width: W, height: H }))}`;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, W, H);
  return canvas.toDataURL("image/jpeg", 0.92);
}

/**
 * Builds the certificate PDF: artwork as background, then real (selectable) text and a vector QR
 * code that links to the public verification page. `settings.siteUrl` must already be resolved.
 */
export async function downloadCertificatePdf(d: CertificateData, settings: SiteSettings) {
  const [{ jsPDF }, bg] = await Promise.all([import("jspdf"), artworkJpeg()]);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  const layout = certificateLayout(d, settings);

  doc.addImage(bg, "JPEG", 0, 0, PAGE.w, PAGE.h, undefined, "FAST");

  for (const l of layout.lines) {
    doc.setDrawColor(...hex(l.color));
    doc.setLineWidth(l.width);
    doc.line(l.x1, l.y, l.x2, l.y);
  }

  for (const t of layout.text) {
    doc.setFont(t.font === "serif" ? "times" : "helvetica", t.style);
    let size = t.size;
    // Names and titles shrink until they truly fit (real font metrics).
    const maxWidth = t.text === d.name ? 200 : t.text === d.title ? 220 : t.text === settings.certificateNote ? 250 : Infinity;
    doc.setFontSize(size);
    while (size > 8 && doc.getTextWidth(t.text) > maxWidth) doc.setFontSize((size -= 0.5));
    const spacing = t.spacing ?? 0;
    doc.setCharSpace(spacing);
    const width = doc.getTextWidth(t.text) + spacing * Math.max(0, t.text.length - 1);
    const x = t.align === "center" ? t.x - width / 2 : t.align === "right" ? t.x - width : t.x;
    doc.setTextColor(...hex(t.color));
    doc.text(t.text, x, t.y);
  }
  doc.setCharSpace(0);

  // QR code: white tile + vector modules (scans reliably at any zoom or print size).
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(201, 162, 39);
  doc.setLineWidth(0.3);
  doc.roundedRect(QR_BOX.x - 1, QR_BOX.y - 1, QR_BOX.size + 2, QR_BOX.size + 2, 1.5, 1.5, "FD");
  if (layout.url) {
    const { n, dark } = qrMatrix(layout.url);
    const cell = QR_BOX.size / (n + 4);
    doc.setFillColor(15, 42, 74);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (dark(r, c)) doc.rect(QR_BOX.x + (c + 2) * cell, QR_BOX.y + (r + 2) * cell, cell + 0.02, cell + 0.02, "F");
    doc.link(QR_BOX.x, QR_BOX.y, QR_BOX.size, QR_BOX.size, { url: layout.url });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.2);
    doc.setTextColor(100, 116, 139);
    const label = layout.urlLabel.length > 48 ? `${layout.urlLabel.slice(0, 46)}…` : layout.urlLabel;
    doc.text(label, QR_BOX.x + QR_BOX.size / 2 - doc.getTextWidth(label) / 2, QR_BOX.y + QR_BOX.size + 8.6);
  }

  if (layout.sample) {
    const GState = (doc as unknown as { GState: new (o: { opacity: number }) => unknown }).GState;
    doc.saveGraphicsState();
    doc.setGState(new GState({ opacity: 0.08 }) as never);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(125);
    doc.setTextColor(220, 38, 38);
    doc.text("SAMPLE", PAGE.w / 2, PAGE.h / 2 + 18, { align: "center", angle: 18 });
    doc.restoreGraphicsState();
  }

  doc.setProperties({ title: `${d.title} — ${d.name}`, subject: `Certificate ${d.credentialId}`, author: settings.organizationName, creator: settings.organizationName });
  doc.save(`${settings.organizationName.replace(/[^\w]+/g, "-")}-Certificate-${d.credentialId}.pdf`);
}
