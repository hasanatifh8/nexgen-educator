import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Branded 1200×630 share card used by WhatsApp, LinkedIn, Facebook and X link previews. */
export const OG_SIZE = { width: 1200, height: 630 };

let logo: Promise<string> | undefined;
const logoDataUrl = () => (logo ??= readFile(join(process.cwd(), "public/logo-512.png")).then((b) => `data:image/png;base64,${b.toString("base64")}`));

export async function ogCard({ eyebrow, title, details }: { eyebrow: string; title: string; details: string[] }) {
  const src = await logoDataUrl();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "linear-gradient(135deg, #0a1f38 0%, #0f2a4a 55%, #0b4f74 100%)", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by ImageResponse, not the browser */}
          <img src={src} width={84} height={84} alt="" style={{ borderRadius: 20 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700, display: "flex" }}>
              NextGen<span style={{ color: "#38bdf8", marginLeft: 10 }}>Educator</span>
            </div>
            <div style={{ fontSize: 20, letterSpacing: 6, color: "#94a3b8" }}>TRAIN. TEST. CERTIFY.</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, color: "#fb923c", textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 70 ? 50 : 62, fontWeight: 700, lineHeight: 1.1, maxWidth: 1050 }}>{title}</div>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {details.map((d) => (
            <div key={d} style={{ display: "flex", fontSize: 24, padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>{d}</div>
          ))}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
