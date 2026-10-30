import { mockQrMatrix } from "./mockQr";

export type CertificateData = {
  name: string;
  title: string;
  score: number;
  total: number;
  credentialId: string;
  issuedOn: string;
};

/** Builds and downloads a landscape A4 mock certificate. Loaded lazily on the client. */
export async function downloadCertificatePdf(d: CertificateData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210;

  // Frame
  doc.setFillColor(15, 42, 74);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 10, W - 20, H - 20, 4, 4, "F");
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 15, W - 30, H - 30, 3, 3, "S");
  doc.setFillColor(249, 115, 22);
  doc.rect(15, 15, 60, 2.5, "F");

  // Brand
  doc.setTextColor(15, 42, 74);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("NextGen Educator", 28, 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("TRAIN.  TEST.  CERTIFY.", 28, 39);

  doc.setFontSize(9);
  doc.setTextColor(220, 38, 38);
  doc.text("SAMPLE / MOCK CERTIFICATE", W - 28, 34, { align: "right" });

  // Body
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(11);
  doc.text("THIS CERTIFIES THAT", W / 2, 68, { align: "center" });

  doc.setTextColor(15, 42, 74);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text(d.name, W / 2, 86, { align: "center" });
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(W / 2 - 70, 92, W / 2 + 70, 92);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text("has successfully completed the", W / 2, 104, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(14, 165, 233);
  doc.text(d.title, W / 2, 116, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  const pct = Math.round((d.score / d.total) * 100);
  doc.text(`Score: ${d.score}/${d.total} (${pct}%)   ·   Issued: ${d.issuedOn}`, W / 2, 128, { align: "center" });

  // Footer: signature, ID, QR
  doc.setDrawColor(148, 163, 184);
  doc.line(30, 168, 95, 168);
  doc.setFontSize(9);
  doc.text("Director of Certification", 30, 174);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.setTextColor(15, 42, 74);
  doc.text("A. Morgan", 32, 164);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Credential ID: ${d.credentialId}`, W / 2, 168, { align: "center" });
  doc.text(`Verify at nextgeneducator.example/verify/${d.credentialId}`, W / 2, 174, { align: "center" });

  const qr = mockQrMatrix(d.credentialId);
  const cell = 1.6, qx = W - 30 - qr.length * cell, qy = 140;
  doc.setFillColor(15, 42, 74);
  qr.forEach((row, r) => row.forEach((on, c) => on && doc.rect(qx + c * cell, qy + r * cell, cell, cell, "F")));
  doc.setFontSize(7);
  doc.text("Scan to verify", qx + (qr.length * cell) / 2, qy + qr.length * cell + 5, { align: "center" });

  doc.save(`NextGen-Educator-Certificate-${d.credentialId}.pdf`);
}
