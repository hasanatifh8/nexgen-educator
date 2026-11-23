import type { FontKey, ProposalAssets } from "./pdf";

/** Browser-only: fetches the fonts and logos the proposal PDF embeds. Loaded once per page visit. */
let cached: Promise<ProposalAssets> | null = null;

const FONT_FILES: Record<FontKey, string> = {
  regular: "/fonts/poppins/Poppins-Regular.ttf",
  medium: "/fonts/poppins/Poppins-Medium.ttf",
  semibold: "/fonts/poppins/Poppins-SemiBold.ttf",
  bold: "/fonts/poppins/Poppins-Bold.ttf",
  italic: "/fonts/poppins/Poppins-Italic.ttf",
};

async function fetchBytes(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return new Uint8Array(await res.arrayBuffer());
}

function toBase64(bytes: Uint8Array) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export function loadProposalAssets(): Promise<ProposalAssets> {
  cached ??= (async () => {
    const keys = Object.keys(FONT_FILES) as FontKey[];
    const [fonts, logo, icon] = await Promise.all([
      Promise.all(keys.map((k) => fetchBytes(FONT_FILES[k]).then(toBase64))),
      fetchBytes("/email/logo-on-dark.png").then(toBase64),
      fetchBytes("/logo-512.png").then(toBase64),
    ]);
    return {
      fonts: Object.fromEntries(keys.map((k, i) => [k, fonts[i]])) as Record<FontKey, string>,
      logoDark: { data: `data:image/png;base64,${logo}`, ratio: 824 / 160 },
      icon: `data:image/png;base64,${icon}`,
    };
  })().catch((e) => {
    cached = null; // allow a retry
    throw e;
  });
  return cached;
}
