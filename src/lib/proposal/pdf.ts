import type { jsPDF as JsPDF } from "jspdf";
import { qrMatrix } from "../certificate/design";
import { GST_RATE, formatINR } from "../catalog";
import { NEP_2020, NEP_QUOTES, NOT_AFFILIATED, UNESCO_AI_TEACHERS, UNESCO_FINDINGS, cite } from "../research";
import { addressee, type ProposalInput } from "./types";

/**
 * The school proposal PDF: an A4 portrait document drawn entirely as vector graphics (crisp text, small file),
 * personalised for one school. Pure: takes the jsPDF constructor and pre-loaded assets, so it runs in the
 * browser (admin preview and download) and in Node (tests).
 */

// ───────────────────────────── Data ─────────────────────────────

export type ProposalCourse = { title: string; hours: number; lessons: number; price: number; outcomes: string[]; upcoming?: string };
export type ProposalProgram = {
  id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  exam: { questions: number; minutes: number; passPercent: number };
  courses: ProposalCourse[];
};
export type ProposalOrg = { name: string; website: string; websiteLabel: string; phone: string; email: string; cities: string[]; disclaimer: string };
export type ProposalStats = { programs: number; courses: number; hours: number; lessons: number };
export type ProposalDocData = {
  p: ProposalInput & { ref: string };
  /** Every program on offer; the document shows the ones in p.programIds, in this order. */
  programs: ProposalProgram[];
  org: ProposalOrg;
  stats: ProposalStats;
  attemptsPerDay: number;
  /** Online payment (Razorpay) is switched on. */
  onlinePayments?: boolean;
};
export type FontKey = "regular" | "medium" | "semibold" | "bold" | "italic";
export type ProposalAssets = {
  /** Base64 TTF data per weight. */
  fonts: Record<FontKey, string>;
  /** PNG data URLs and their width / height ratios. */
  logoDark: { data: string; ratio: number };
  /** Square app icon (PNG data URL), used in the running header. */
  icon: string;
};

export const programFee = (pr: ProposalProgram) => pr.courses.reduce((s, c) => s + c.price, 0);
export const programHoursTotal = (pr: ProposalProgram) => pr.courses.reduce((s, c) => s + c.hours, 0);
const discounted = (price: number, pct: number) => Math.round(price * (100 - pct)) / 100;

const fmtShortDate = (iso: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }) : iso;

export const fmtLongDate = (iso: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(iso)
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })
    : iso;

// ───────────────────────────── Design tokens ─────────────────────────────

const C = {
  navy950: "#081a30", navy900: "#0f2a4a", navy800: "#163a63", navy700: "#1e4b7e",
  brand: "#0ea5e9", teal: "#06b6d4", tealLight: "#67e8f9", ink: "#0670ab",
  accent: "#f97316", accentStrong: "#c94a0c", gold: "#c9a227",
  s900: "#0f172a", s700: "#334155", s600: "#475569", s500: "#64748b", s400: "#94a3b8", s300: "#cbd5e1", s200: "#e2e8f0", s100: "#f1f5f9", s50: "#f8fafc",
  sky50: "#f0f9ff", sky100: "#e0f2fe", emerald: "#059669", emerald50: "#ecfdf5", white: "#ffffff",
};

const CATEGORY_COLOR: Record<string, string> = {
  "AI Tools for Teachers": C.brand,
  "Assessment Design": "#7c3aed",
  "Classroom Management": C.emerald,
  "Early Years & Primary": "#db2777",
};

const W = 210, H = 297, M = 18, CW = W - 2 * M, TOP = 30, BOTTOM = 276;
const PT = 0.3528; // 1 pt in mm

const rgb = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: string, b: string, t: number) => {
  const [x, y] = [rgb(a), rgb(b)];
  return x.map((v, i) => Math.round(v + (y[i] - v) * t)) as [number, number, number];
};

const FONT: Record<FontKey, [string, string]> = {
  regular: ["Poppins", "normal"],
  medium: ["PoppinsMedium", "normal"],
  semibold: ["PoppinsSemiBold", "normal"],
  bold: ["Poppins", "bold"],
  italic: ["Poppins", "italic"],
};

type TextOpts = { size: number; font?: FontKey; color?: string; lh?: number; align?: "left" | "center" | "right"; space?: number };

// ───────────────────────────── Builder ─────────────────────────────

export function buildProposalPdf(JsPDFCtor: typeof JsPDF, data: ProposalDocData, assets: ProposalAssets): JsPDF {
  const doc = new JsPDFCtor({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const files: Record<FontKey, string> = { regular: "Poppins-Regular.ttf", medium: "Poppins-Medium.ttf", semibold: "Poppins-SemiBold.ttf", bold: "Poppins-Bold.ttf", italic: "Poppins-Italic.ttf" };
  for (const k of Object.keys(files) as FontKey[]) {
    doc.addFileToVFS(files[k], assets.fonts[k]);
    doc.addFont(files[k], FONT[k][0], FONT[k][1]);
  }

  const { p, org, stats } = data;
  const selected = data.programs.filter((pr) => p.programIds.includes(pr.id));
  // Placeholders keep the live preview readable while the admin is still typing.
  const school = p.schoolName || "[School name]";
  const person = addressee(p) || "[Principal’s name]";
  const designation = p.designation || "Principal";
  const city = p.city || "[City]";
  const boardText = p.board && p.board !== "Multiple boards" ? p.board : "";
  const selHours = selected.reduce((s, pr) => s + programHoursTotal(pr), 0);
  const discount = p.discountPercent;

  // ── primitives ──
  const GState = (doc as unknown as { GState: new (o: Record<string, number>) => unknown }).GState;
  const alpha = (o: number, fn: () => void) => {
    doc.saveGraphicsState();
    doc.setGState(new GState({ opacity: o, "stroke-opacity": o }) as never);
    fn();
    doc.restoreGraphicsState();
  };
  const fill = (h: string) => doc.setFillColor(...rgb(h));
  const stroke = (h: string) => doc.setDrawColor(...rgb(h));
  const setFont = (o: TextOpts) => {
    doc.setFont(...FONT[o.font ?? "regular"]);
    doc.setFontSize(o.size);
  };
  const lineH = (o: TextOpts) => o.size * PT * (o.lh ?? 1.5);
  const wrap = (text: string, w: number, o: TextOpts): string[] => {
    setFont(o);
    doc.setCharSpace(0);
    return doc.splitTextToSize(text, w) as string[];
  };
  const textWidth = (text: string, o: TextOpts) => {
    setFont(o);
    return doc.getTextWidth(text) + (o.space ?? 0) * Math.max(0, text.length - 1);
  };
  /** One line; `y` is the top of the line box. */
  const line = (text: string, x: number, y: number, o: TextOpts) => {
    setFont(o);
    doc.setTextColor(...rgb(o.color ?? C.s700));
    doc.setCharSpace(o.space ?? 0);
    const w = textWidth(text, o);
    const tx = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
    const L = lineH(o);
    doc.text(text, tx, y + (L + o.size * PT * 0.7) / 2);
    doc.setCharSpace(0);
  };
  /** Wrapped paragraph; returns its height. With draw=false it only measures. */
  const para = (text: string, x: number, y: number, w: number, o: TextOpts, draw = true) => {
    const ls = wrap(text, w, o);
    if (draw) ls.forEach((l, i) => line(l, o.align === "center" ? x + w / 2 : o.align === "right" ? x + w : x, y + i * lineH(o), o));
    return ls.length * lineH(o);
  };
  const grad = (x: number, y: number, w: number, h: number, c1: string, c2: string, dir: "v" | "h" = "v", steps = 140) => {
    for (let i = 0; i < steps; i++) {
      doc.setFillColor(...mix(c1, c2, i / (steps - 1)));
      if (dir === "v") doc.rect(x, y + (h * i) / steps, w, h / steps + 0.25, "F");
      else doc.rect(x + (w * i) / steps, y, w / steps + 0.25, h, "F");
    }
  };
  /** Runs `fn` clipped to a rounded rectangle. */
  const clipRound = (x: number, y: number, w: number, h: number, r: number, fn: () => void) => {
    doc.saveGraphicsState();
    doc.roundedRect(x, y, w, h, r, r, null as unknown as string);
    doc.clip();
    doc.discardPath();
    fn();
    doc.restoreGraphicsState();
  };
  const check = (cx: number, cy: number, r: number, bg: string = C.teal, fg: string = C.white) => {
    fill(bg);
    doc.circle(cx, cy, r, "F");
    stroke(fg);
    doc.setLineWidth(r * 0.3);
    doc.setLineCap("round");
    doc.setLineJoin("round");
    doc.lines([[r * 0.32, r * 0.34], [r * 0.62, -r * 0.72]], cx - r * 0.46, cy + 0.02 * r, [1, 1], "S", false);
  };
  const pill = (text: string, x: number, y: number, o: TextOpts & { bg: string; pad?: number; h?: number }, alignRight = false) => {
    const pad = o.pad ?? 2.6, h = o.h ?? 5.2;
    const w = textWidth(text, o) + pad * 2;
    const px = alignRight ? x - w : x;
    fill(o.bg);
    doc.roundedRect(px, y, w, h, h / 2, h / 2, "F");
    line(text, px + pad, y + (h - lineH({ ...o, lh: 1.2 })) / 2, { ...o, lh: 1.2 });
    return w;
  };
  const gridLines = (x: number, y: number, w: number, h: number, step: number, color: string, o: number) =>
    alpha(o, () => {
      stroke(color);
      doc.setLineWidth(0.15);
      for (let gx = x; gx <= x + w; gx += step) doc.line(gx, y, gx, y + h);
      for (let gy = y; gy <= y + h; gy += step) doc.line(x, gy, x + w, gy);
    });

  // ── flow ──
  let y = TOP;
  const newPage = () => {
    doc.addPage();
    y = TOP;
  };
  const ensure = (h: number) => {
    if (y + h > BOTTOM) newPage();
  };

  const EYEBROW: TextOpts = { size: 7.6, font: "semibold", color: C.ink, space: 0.55, lh: 1.3 };
  const H2: TextOpts = { size: 21, font: "bold", color: C.navy900, lh: 1.18 };
  const LEDE: TextOpts = { size: 10.2, color: C.s600, lh: 1.6 };
  const BODY: TextOpts = { size: 9.4, color: C.s600, lh: 1.55 };

  /** Eyebrow + title + optional lede, kept together with `keep` mm of what follows. */
  const sectionHead = (eyebrow: string, title: string, lede?: string, keep = 40) => {
    const th = para(title, M, 0, CW * 0.9, H2, false);
    const lh = lede ? para(lede, M, 0, CW * 0.88, LEDE, false) + 3 : 0;
    ensure(9 + th + lh + keep);
    fill(C.teal);
    doc.roundedRect(M, y + 1.3, 7, 1.3, 0.65, 0.65, "F");
    line(eyebrow.toUpperCase(), M + 9.5, y, EYEBROW);
    y += 7.5;
    y += para(title, M, y, CW * 0.9, H2) + 3;
    if (lede) y += para(lede, M, y, CW * 0.88, LEDE) + 3;
    y += 3;
  };

  /** Checklist with teal ticks; returns height. */
  const checklist = (items: string[], x: number, yy: number, w: number, o: TextOpts = BODY, draw = true, tick: string = C.teal) => {
    let h = 0;
    for (const it of items) {
      const ih = para(it, x + 6.5, yy + h, w - 6.5, o, false);
      if (draw) {
        check(x + 2.1, yy + h + lineH(o) / 2, 1.9, tick);
        para(it, x + 6.5, yy + h, w - 6.5, o);
      }
      h += ih + 2;
    }
    return h - 2;
  };

  // ═════════════════════════ 1. Cover ═════════════════════════
  grad(0, 0, W, H, C.navy900, C.navy950, "v");
  gridLines(0, 0, W, H, 12, C.white, 0.045);
  alpha(0.22, () => { fill(C.brand); doc.circle(182, 58, 74, "F"); });
  alpha(0.16, () => { fill(C.teal); doc.circle(214, 128, 50, "F"); });
  alpha(0.1, () => { fill(C.accent); doc.circle(-6, 262, 58, "F"); });
  alpha(0.08, () => { fill(C.white); doc.circle(150, 22, 20, "F"); });

  doc.addImage(assets.logoDark.data, "PNG", M, 18, 60, 60 / assets.logoDark.ratio, undefined, "FAST");
  line("PROPOSAL", W - M, 18.5, { size: 7.5, font: "semibold", color: C.tealLight, space: 0.8, align: "right", lh: 1.3 });
  line(p.ref, W - M, 23.5, { size: 8.5, font: "medium", color: C.white, align: "right", lh: 1.3 });
  line(fmtLongDate(p.issuedOn), W - M, 28.5, { size: 8, color: C.s300, align: "right", lh: 1.3 });

  let cy = 84;
  fill(C.accent);
  doc.roundedRect(M, cy + 1.2, 9, 1.5, 0.75, 0.75, "F");
  line("TEACHER UPSKILLING & CERTIFICATION", M + 12, cy, { size: 8.4, font: "semibold", color: C.tealLight, space: 0.75, lh: 1.3 });
  cy += 10;
  const titleSize = school.length > 46 ? 27 : school.length > 28 ? 31 : 35;
  const T1: TextOpts = { size: titleSize, font: "bold", color: C.white, lh: 1.08 };
  cy += para("Future-ready teachers for", M, cy, CW, T1);
  const schoolLines = wrap(school, CW - 4, T1).slice(0, 3);
  schoolLines.forEach((l, i) => line(l, M, cy + i * lineH(T1), { ...T1, color: C.tealLight }));
  cy += schoolLines.length * lineH(T1) + 6;
  cy += para(
    "A practical, self-paced programme that helps your teachers master AI-assisted teaching and modern classroom practice — with an online exam and a QR-verifiable certificate for every teacher who qualifies.",
    M, cy, CW * 0.82, { size: 11, color: C.s300, lh: 1.6 },
  );
  // Programme chips: what is inside, at a glance
  // Skipped when a very long school name leaves no room.
  if (selected.length && cy < 170) {
    cy += 7;
    line(selected.length === 1 ? "PROGRAMME INSIDE" : "PROGRAMMES INSIDE", M, cy, { size: 7, font: "semibold", color: C.s400, space: 0.6, lh: 1.3 });
    cy += 6;
    const CH: TextOpts = { size: 8, font: "medium", color: C.white };
    const chip = (label: string, x: number, r: number, w: number, dot?: string) => {
      alpha(0.12, () => { fill(C.white); doc.roundedRect(x, cy + r * 8, w, 6, 3, 3, "F"); });
      if (dot) { fill(dot); doc.circle(x + 3, cy + r * 8 + 3, 0.9, "F"); }
      line(label, x + (dot ? 5 : 3.5), cy + r * 8 + 0.9, { ...CH, lh: 1.3 });
    };
    // At most two rows; whatever does not fit becomes “+N more”.
    let chx = M, row = 0;
    for (let i = 0; i < selected.length; i++) {
      const label = selected[i].title.length > 52 ? `${selected[i].title.slice(0, 50)}…` : selected[i].title;
      const w = textWidth(label, CH) + 7;
      const moreW = 20;
      const reserve = i < selected.length - 1 && row === 1 ? moreW + 2.5 : 0;
      if (chx + w + reserve > W - M) {
        if (row === 1) { chip(`+${selected.length - i} more`, chx, row, moreW); break; }
        row = 1;
        chx = M;
      }
      chip(label, chx, row, w, CATEGORY_COLOR[selected[i].category] ?? C.brand);
      chx += w + 2.5;
    }
    cy += (row + 1) * 8;
  }

  // "Prepared for" card
  const cardH = 40;
  const cardY = Math.min(Math.max(cy + 9, 186), 202);
  alpha(0.07, () => { fill(C.white); doc.roundedRect(M, cardY, CW, cardH, 4, 4, "F"); });
  alpha(0.18, () => { stroke(C.white); doc.setLineWidth(0.3); doc.roundedRect(M, cardY, CW, cardH, 4, 4, "S"); });
  const colW = CW / 2 - 12;
  line("PREPARED EXCLUSIVELY FOR", M + 8, cardY + 7, { size: 7, font: "semibold", color: C.tealLight, space: 0.6, lh: 1.3 });
  line(wrap(person, colW, { size: 14, font: "semibold" })[0], M + 8, cardY + 12.5, { size: 14, font: "semibold", color: C.white, lh: 1.3 });
  para(`${designation}, ${school}`, M + 8, cardY + 20.5, colW, { size: 9, color: C.s300, lh: 1.45 });
  line([city, p.board].filter(Boolean).join("  ·  "), M + 8, cardY + 31, { size: 8.5, font: "medium", color: C.s400, lh: 1.3 });
  alpha(0.2, () => { stroke(C.white); doc.setLineWidth(0.25); doc.line(W / 2 + 2, cardY + 7, W / 2 + 2, cardY + cardH - 7); });
  const rx = W / 2 + 10;
  line("PREPARED BY", rx, cardY + 7, { size: 7, font: "semibold", color: C.tealLight, space: 0.6, lh: 1.3 });
  line(wrap(p.preparedBy || org.name, colW, { size: 14, font: "semibold" })[0], rx, cardY + 12.5, { size: 14, font: "semibold", color: C.white, lh: 1.3 });
  para([p.preparedByTitle, org.name].filter(Boolean).join(", "), rx, cardY + 20.5, colW, { size: 9, color: C.s300, lh: 1.45 });
  line([p.preparedPhone, org.websiteLabel].filter(Boolean).join("  ·  "), rx, cardY + 31, { size: 8.5, font: "medium", color: C.s400, lh: 1.3 });

  // Key figures
  const statY = Math.max(240, cardY + cardH + 7);
  const coverStats: [string, string][] = [
    [String(selected.length), selected.length === 1 ? "Certification programme proposed" : "Certification programmes proposed"],
    [`${selHours} hrs`, "Of guided, self-paced learning"],
    ["QR", "Verifiable certificate for every teacher"],
  ];
  coverStats.forEach(([v, l], i) => {
    const sx = M + (CW / 3) * i;
    if (i) alpha(0.2, () => { stroke(C.white); doc.setLineWidth(0.25); doc.line(sx, statY + 1, sx, statY + 17); });
    const px = sx + (i ? 7 : 0);
    line(v, px, statY, { size: 22, font: "bold", color: C.white, lh: 1.1 });
    para(l, px, statY + 10, CW / 3 - 12, { size: 8, color: C.s300, lh: 1.35 });
  });
  alpha(0.15, () => { stroke(C.white); doc.setLineWidth(0.25); doc.line(M, 271, W - M, 271); });
  line(`Confidential — prepared for ${wrap(school, CW - 62, { size: 7.5 })[0]}${wrap(school, CW - 62, { size: 7.5 }).length > 1 ? "…" : ""}`, M, 275, { size: 7.5, color: C.s400, lh: 1.3 });
  line(`Valid until ${fmtLongDate(p.validUntil)}`, W - M, 275, { size: 7.5, color: C.s400, align: "right", lh: 1.3 });

  // ═════════════════════════ 2. Cover letter ═════════════════════════
  newPage();
  const LETTER: TextOpts = { size: 10, color: C.s700, lh: 1.62 };
  line("To,", M, y, { size: 10, color: C.s500, lh: 1.4 });
  y += 5.6;
  line(person, M, y, { size: 11, font: "semibold", color: C.navy900, lh: 1.4 });
  y += 6;
  for (const l of [designation, school, city]) {
    y += para(l, M, y, CW * 0.55, { size: 10, color: C.s600, lh: 1.45 });
  }
  line(fmtLongDate(p.issuedOn), W - M, TOP, { size: 10, font: "medium", color: C.navy900, align: "right", lh: 1.4 });
  line(`Ref: ${p.ref}`, W - M, TOP + 5.6, { size: 8.5, color: C.s500, align: "right", lh: 1.4 });

  y += 7;
  y += para(`Subject: Proposal for teacher upskilling and certification at ${school}`, M, y, CW, { size: 10.5, font: "semibold", color: C.navy900, lh: 1.5 }) + 5;
  y += para(`Dear ${person},`, M, y, CW, LETTER) + 3;

  const teacherPhrase = p.teachers > 0 ? `its ${p.teachers} teachers` : "its teachers";
  const letter = [
    "Thank you for your time and interest in NextGen Educator. Teaching in India is changing faster than ever. NEP 2020 asks every teacher to complete at least 50 hours of continuous professional development each year, AI tools are already in our students’ hands, and parents increasingly judge a school by how modern its classrooms feel.",
    "At the same time, many experienced teachers tell us they feel left behind by technology and are unsure where to begin. They are a school’s greatest strength — they simply need a clear, practical and respectful path forward.",
    `This proposal sets out how NextGen Educator can help ${school} train ${teacherPhrase} through short, self-paced online courses written for Indian classrooms${boardText ? ` and ${boardText} schools` : ""}. Each programme ends with an online exam and a QR-verifiable certificate. Teachers learn on their phones, at their own pace and in simple language, without disturbing the school timetable.`,
  ];
  for (const t of letter) y += para(t, M, y, CW, LETTER) + 3;

  if (p.note) {
    const nh = para(p.note, M + 9, 0, CW - 16, { ...LETTER, color: C.navy900 }, false);
    fill(C.sky50);
    doc.roundedRect(M, y, CW, nh + 10, 3, 3, "F");
    fill(C.brand);
    doc.roundedRect(M, y, 1.6, nh + 10, 0.8, 0.8, "F");
    para(p.note, M + 9, y + 5, CW - 16, { ...LETTER, color: C.navy900 });
    y += nh + 10 + 4;
  }
  y += para("I would be glad to walk you through the programmes on a short call and to answer any questions from you or your academic team.", M, y, CW, LETTER) + 6;
  line("Warm regards,", M, y, LETTER);
  y += 9;
  line(p.preparedBy || org.name, M, y, { size: 11.5, font: "semibold", color: C.navy900, lh: 1.4 });
  y += 5.8;
  line([p.preparedByTitle, org.name].filter(Boolean).join(", "), M, y, { size: 9.5, color: C.s600, lh: 1.4 });
  y += 5.2;
  const contactLine = [p.preparedPhone, p.preparedEmail].filter(Boolean).join("   ·   ");
  if (contactLine) line(contactLine, M, y, { size: 9.5, font: "medium", color: C.ink, lh: 1.4 });
  y += 12;

  // At a glance
  const glance: [string, string][] = [
    ["Programmes", String(selected.length)],
    ["Learning hours", `${selHours} hrs`],
    ["Teachers", p.teachers > 0 ? String(p.teachers) : "Whole staff"],
    ["Valid until", fmtShortDate(p.validUntil)],
  ];
  ensure(26);
  const gw = CW / 4;
  fill(C.s50);
  doc.roundedRect(M, y, CW, 22, 3, 3, "F");
  stroke(C.s200);
  doc.setLineWidth(0.25);
  doc.roundedRect(M, y, CW, 22, 3, 3, "S");
  glance.forEach(([k, v], i) => {
    const gx = M + gw * i + 6;
    if (i) { stroke(C.s200); doc.line(M + gw * i, y + 5, M + gw * i, y + 17); }
    line(k.toUpperCase(), gx, y + 5, { size: 6.8, font: "semibold", color: C.s500, space: 0.45, lh: 1.3 });
    line(wrap(v, gw - 10, { size: 11.5, font: "bold" })[0], gx, y + 10.5, { size: 11.5, font: "bold", color: C.navy900, lh: 1.3 });
  });
  y += 22;

  // ═════════════════════════ 3. Why now ═════════════════════════
  newPage();
  sectionHead(
    "Why now",
    "Schools are changing. Teachers need support to keep up.",
    "Every principal we speak to faces the same four pressures. Each one comes back to the confidence and skills of the teachers in front of the class.",
  );
  const why: [string, string][] = [
    ["NEP 2020 makes professional development essential", "“Each teacher will be expected to participate in at least 50 hours of CPD opportunities every year” — and school leaders too. Schools need a simple, trackable way to make those hours count."],
    ["AI is already in your students’ hands", "Students use ChatGPT, Gemini and other AI tools. Yet UNESCO notes that few countries have national programmes to train teachers in AI, leaving many without guidance."],
    ["Assessment is moving towards competencies", "Boards increasingly test application and reasoning, not memory. Teachers need practical skills in competency-based questions, rubrics and feedback."],
    ["Parents expect modern classrooms", "Families compare schools on teaching quality and use of technology. Certified, confident teachers are a visible sign of a forward-looking school."],
  ];
  {
    const gap = 5, cw2 = (CW - gap) / 2, pad = 6;
    const TT: TextOpts = { size: 11.2, font: "semibold", color: C.navy900, lh: 1.3 };
    const heights = why.map(([t, b]) => 13 + para(t, 0, 0, cw2 - pad * 2, TT, false) + 2.5 + para(b, 0, 0, cw2 - pad * 2, BODY, false) + pad);
    for (let row = 0; row < 2; row++) {
      const rh = Math.max(heights[row * 2], heights[row * 2 + 1]);
      ensure(rh);
      for (let col = 0; col < 2; col++) {
        const [t, b] = why[row * 2 + col];
        const x = M + col * (cw2 + gap);
        fill(C.s50);
        doc.roundedRect(x, y, cw2, rh, 3.5, 3.5, "F");
        stroke(C.s200);
        doc.setLineWidth(0.25);
        doc.roundedRect(x, y, cw2, rh, 3.5, 3.5, "S");
        line(`0${row * 2 + col + 1}`, x + pad, y + pad - 0.5, { size: 15, font: "bold", color: C.brand, lh: 1.1 });
        let yy = y + 13;
        yy += para(t, x + pad, yy, cw2 - pad * 2, TT) + 2.5;
        para(b, x + pad, yy, cw2 - pad * 2, BODY);
      }
      y += rh + gap;
    }
  }
  // Quote banner
  {
    const Q: TextOpts = { size: 14.5, font: "semibold", color: C.white, lh: 1.42 };
    const quote = "“Your teachers are your school’s greatest asset. Investing in their skills is investing in every child, in every classroom, every day.”";
    const qh = para(quote, 0, 0, CW - 30, Q, false) + 17;
    ensure(qh + 4);
    y += 2;
    clipRound(M, y, CW, qh, 4, () => {
      grad(M, y, CW, qh, C.navy800, C.navy950, "h");
      alpha(0.25, () => { fill(C.teal); doc.circle(M + CW - 8, y + 4, 26, "F"); });
    });
    line("“", M + 8, y + 4.5, { size: 40, font: "bold", color: C.teal, lh: 1 });
    para(quote.slice(1), M + 20, y + 8.5, CW - 30, Q);
    y += qh + 7;
  }
  // Teacher's side, in three columns
  {
    const items: [string, string][] = [
      ["Starts from zero", "Many experienced teachers worry about technology. Courses begin with the basics, in simple English."],
      ["Fits the timetable", "10–15 minute lessons on any smartphone, in free periods or at home."],
      ["Builds pride", "A certificate teachers are proud to show lifts confidence across the staff room."],
    ];
    const gap = 4.5, w3 = (CW - gap * 2) / 3;
    const TT: TextOpts = { size: 9.6, font: "semibold", color: C.navy900, lh: 1.3 };
    const S: TextOpts = { size: 8.4, color: C.s600, lh: 1.5 };
    const ih = Math.max(...items.map(([t, b]) => para(t, 0, 0, w3 - 7, TT, false) + 1.5 + para(b, 0, 0, w3, S, false)));
    ensure(ih + 9);
    line("THE TEACHER’S SIDE OF THE STORY", M, y, { ...EYEBROW, color: C.accentStrong });
    y += 7;
    items.forEach(([t, b], i) => {
      const x = M + i * (w3 + gap);
      check(x + 2.1, y + lineH(TT) / 2, 1.9, C.accent);
      const th = para(t, x + 6.5, y, w3 - 7, TT) + 1.5;
      para(b, x, y + th, w3, S);
    });
    y += ih + 4;
  }

  // ═════════════════════════ 4. Our approach ═════════════════════════
  newPage();
  sectionHead(
    "How NextGen Educator works",
    "Train. Test. Certify. One simple platform.",
    "Everything your teachers need — learning, assessment and a trusted certificate — in one place, with a real person to help at every step.",
    90,
  );
  {
    const pillars: { n: string; title: string; sub: string; color: string; items: string[] }[] = [
      { n: "01", title: "Train", sub: "Practical, self-paced courses", color: C.brand, items: ["Short lessons with examples from Indian classrooms", "Ready-to-use AI prompts and classroom activities", "Works on any smartphone — no app or laptop needed"] },
      { n: "02", title: "Test", sub: "Fair, rigorous online exams", color: C.teal, items: ["Timed, auto-graded certification exam", "Scenario questions, shuffled on every attempt", `Up to ${data.attemptsPerDay} attempts a day, so no one is left behind`] },
      { n: "03", title: "Certify", sub: "Certificates anyone can verify", color: C.accent, items: ["Issued the moment a teacher passes", "Unique credential ID and QR code", "Added to CV and LinkedIn in one click"] },
    ];
    const gap = 4.5, pw = (CW - gap * 2) / 3, pad = 5.5;
    const S: TextOpts = { size: 8.6, color: C.s600, lh: 1.5 };
    const ph = Math.max(...pillars.map((pl) => 23 + checklist(pl.items, 0, 0, pw - pad * 2, S, false) + pad));
    ensure(ph);
    pillars.forEach((pl, i) => {
      const x = M + i * (pw + gap);
      fill(C.white);
      stroke(C.s200);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, pw, ph, 3.5, 3.5, "FD");
      clipRound(x, y, pw, ph, 3.5, () => { fill(pl.color); doc.rect(x, y, pw, 2.2, "F"); });
      line(pl.n, x + pw - pad, y + 6, { size: 13, font: "bold", color: C.s200, align: "right", lh: 1.1 });
      line(pl.title, x + pad, y + 7, { size: 16, font: "bold", color: C.navy900, lh: 1.15 });
      line(pl.sub, x + pad, y + 15, { size: 8.6, font: "semibold", color: pl.color === C.accent ? C.accentStrong : C.ink, lh: 1.3 });
      checklist(pl.items, x + pad, y + 23, pw - pad * 2, S, true, pl.color);
    });
    y += ph + 8;
  }
  {
    const easy: [string, string][] = [
      ["Starts from zero", "Beginner courses explain everything in simple English."],
      ["Fits a teacher’s day", "Most lessons take 10–15 minutes; progress is saved."],
      ["Any smartphone", "No app to install and no laptop needed."],
      ["A real person helps", "Our team answers calls and helps anyone who gets stuck."],
      ["Fair retakes", "Teachers can revise and try the exam again."],
      ["Indian context", "Examples, boards and classrooms teachers recognise."],
    ];
    const gap = 4, cw3 = (CW - gap * 2) / 3;
    const TT: TextOpts = { size: 9.2, font: "semibold", color: C.navy900, lh: 1.35 };
    const S: TextOpts = { size: 8.2, color: C.s600, lh: 1.45 };
    const ch = Math.max(...easy.map(([t, b]) => para(t, 0, 0, cw3 - 16, TT, false) + para(b, 0, 0, cw3 - 16, S, false))) + 10;
    ensure(10 + ch * 2 + gap);
    line("DESIGNED FOR TEACHERS WHO ARE NEW TO TECHNOLOGY", M, y, EYEBROW);
    y += 7;
    easy.forEach(([t, b], i) => {
      const x = M + (i % 3) * (cw3 + gap), yy = y + Math.floor(i / 3) * (ch + gap);
      fill(C.sky50);
      doc.roundedRect(x, yy, cw3, ch, 3, 3, "F");
      check(x + 6, yy + 7.2, 2.2, C.brand);
      const th = para(t, x + 11, yy + 5, cw3 - 16, TT);
      para(b, x + 11, yy + 5 + th, cw3 - 16, S);
    });
    y += ch * 2 + gap + 8;
  }
  {
    const figs: [string, string][] = [
      [String(stats.programs), "Certification programmes"],
      [String(stats.courses), "Courses on offer"],
      [`${stats.hours}+`, "Hours of learning"],
      ...(stats.lessons > 0 ? [[String(stats.lessons), "Lessons, with activities"] as [string, string]] : []),
    ];
    ensure(28);
    clipRound(M, y, CW, 26, 4, () => grad(M, y, CW, 26, C.navy900, C.navy700, "h"));
    const fw = CW / figs.length;
    figs.forEach(([v, l], i) => {
      const cx = M + fw * i + fw / 2;
      line(v, cx, y + 4.5, { size: 19, font: "bold", color: C.white, align: "center", lh: 1.1 });
      line(l, cx, y + 15.5, { size: 8, color: C.s300, align: "center", lh: 1.3 });
    });
    y += 26;
  }

  // ═════════════════════════ 5. Programmes ═════════════════════════
  newPage();
  sectionHead(
    `Programmes proposed for ${school}`,
    selected.length === 1 ? "The programme we recommend" : "The programmes we recommend",
    "Each programme is a complete path: self-paced courses, a certification exam and a verifiable certificate. Teachers can take one programme or several.",
    70,
  );
  const programCard = (pr: ProposalProgram, yy: number, draw: boolean) => {
    const color = CATEGORY_COLOR[pr.category] ?? C.brand;
    const x = M, w = CW, pad = 7, iw = w - pad * 2 - 3;
    const ix = x + 3 + pad;
    let h = pad;
    // header
    if (draw) {
      line(pr.category.toUpperCase(), ix, yy + h, { size: 7.2, font: "semibold", color, space: 0.5, lh: 1.3 });
      pill(pr.level, x + w - pad, yy + h - 0.6, { size: 7.2, font: "semibold", color: C.s600, bg: C.s100 }, true);
    }
    h += 6;
    const TT: TextOpts = { size: 14, font: "bold", color: C.navy900, lh: 1.22 };
    h += para(pr.title, ix, yy + h, iw - 25, TT, draw) + 1.5;
    h += para(pr.description, ix, yy + h, iw, { ...BODY, size: 9 }, draw) + 4;
    // courses
    if (draw) line(pr.courses.length === 1 ? "COURSE" : `${pr.courses.length} COURSES`, ix, yy + h, { size: 6.8, font: "semibold", color: C.s500, space: 0.5, lh: 1.3 });
    h += 5.5;
    for (const c of pr.courses) {
      const meta = [`${c.hours} hrs`, c.lessons ? `${c.lessons} lessons` : "", c.upcoming ?? ""].filter(Boolean).join("  ·  ");
      const metaW = textWidth(meta, { size: 8, font: "medium" }) + 4;
      const CT: TextOpts = { size: 9.2, font: "medium", color: C.navy900, lh: 1.4 };
      const chh = para(c.title, ix + 4.5, yy + h, iw - metaW - 6, CT, false);
      if (draw) {
        fill(color);
        doc.roundedRect(ix, yy + h + 1.6, 1.8, 1.8, 0.4, 0.4, "F");
        para(c.title, ix + 4.5, yy + h, iw - metaW - 6, CT);
        line(meta, x + w - pad, yy + h, { size: 8, font: "medium", color: C.s500, align: "right", lh: 1.75 });
      }
      h += chh + 1.6;
    }
    // outcomes
    const outcomes = pr.courses.flatMap((c) => c.outcomes).slice(0, 4);
    if (outcomes.length) {
      h += 3;
      if (draw) line("TEACHERS WILL BE ABLE TO", ix, yy + h, { size: 6.8, font: "semibold", color: C.s500, space: 0.5, lh: 1.3 });
      h += 6;
      const half = (iw - 6) / 2;
      const O: TextOpts = { size: 8.4, color: C.s700, lh: 1.45 };
      for (let i = 0; i < outcomes.length; i += 2) {
        const pair = outcomes.slice(i, i + 2);
        const rh = Math.max(...pair.map((o) => checklist([o], 0, 0, half, O, false)));
        if (draw) pair.forEach((o, j) => checklist([o], ix + j * (half + 6), yy + h, half, O, true, color));
        h += rh + 2.2;
      }
    }
    // footer band
    h += 3;
    const fh = 13;
    if (draw) {
      fill(C.s50);
      doc.rect(x + 3, yy + h, w - 3, fh, "F");
      line(`Certification exam: ${pr.exam.questions} questions  ·  ${pr.exam.minutes} min  ·  pass mark ${pr.exam.passPercent}%`, ix, yy + h + 4, { size: 8, font: "medium", color: C.s600, lh: 1.4 });
      const fee = programFee(pr);
      if (fee === 0) {
        pill("Free for every teacher", x + w - pad, yy + h + 3.6, { size: 8, font: "semibold", color: C.emerald, bg: C.emerald50, h: 5.8 }, true);
      } else {
        const now = discount > 0 ? discounted(fee, discount) : fee;
        const label = `${formatINR(now)} + GST per teacher`;
        line(label, x + w - pad, yy + h + 3.4, { size: 10, font: "bold", color: C.navy900, align: "right", lh: 1.4 });
        if (discount > 0) {
          const lw = textWidth(label, { size: 10, font: "bold" });
          const old = formatINR(fee);
          const ow = textWidth(old, { size: 8.5, font: "medium" });
          const ox = x + w - pad - lw - 3;
          line(old, ox, yy + h + 3.9, { size: 8.5, font: "medium", color: C.s400, align: "right", lh: 1.4 });
          stroke(C.s400);
          doc.setLineWidth(0.3);
          doc.line(ox - ow, yy + h + 6.2, ox, yy + h + 6.2);
        }
      }
    }
    h += fh;
    if (draw) {
      stroke(C.s200);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, yy, w, h, 3.5, 3.5, "S");
      clipRound(x, yy, w, h, 3.5, () => { fill(color); doc.rect(x, yy, 3, h, "F"); });
    }
    return h;
  };
  for (const pr of selected) {
    // Clip the band first, then draw the content over a white card.
    const h = programCard(pr, 0, false);
    ensure(h);
    fill(C.white);
    doc.roundedRect(M, y, CW, h, 3.5, 3.5, "F");
    programCard(pr, y, true);
    y += h + 6;
  }

  // ═════════════════════════ 6. Rollout ═════════════════════════
  newPage();
  sectionHead(
    `Rollout plan for ${school}`,
    "Live in days, not months — with no disruption to your timetable",
    "A suggested plan. We adapt it to your academic calendar, exams and staff meetings.",
    60,
  );
  {
    const steps: [string, string, string][] = [
      ["Orientation call", "Week 1", "A short call with you and your coordinators to agree the programmes, the timeline and the list of teachers."],
      ["Teacher registration", "Week 1", "Teachers register free in under a minute and complete a one-time profile with ID proof, so every certificate is trustworthy. Our team helps anyone who gets stuck."],
      ["Self-paced learning", "Weeks 2–6", "Teachers learn in short lessons during free periods or at home. There is no fixed class time and progress is saved automatically."],
      ["Certification exam", "When ready", "When every lesson is complete, teachers take a timed online exam. Those who pass receive their certificate instantly."],
      ["Completion summary", "End of programme", "We share a list of certified teachers with their credential IDs — ready for your records, inspections, website and parent communication."],
    ];
    const TT: TextOpts = { size: 11, font: "semibold", color: C.navy900, lh: 1.3 };
    const tx = M + 16, tw = CW - 16;
    const hs = steps.map(([, , b]) => lineH(TT) + 1.2 + para(b, 0, 0, tw, BODY, false));
    const total = hs.reduce((a, b) => a + b + 5.5, 0);
    ensure(total);
    const y0 = y;
    stroke(C.s200);
    doc.setLineWidth(0.6);
    doc.line(M + 5.5, y0 + 5, M + 5.5, y0 + total - hs[hs.length - 1] - 1);
    steps.forEach(([t, when, b], i) => {
      fill(i === steps.length - 1 ? C.accent : C.navy900);
      doc.circle(M + 5.5, y + 4.5, 5, "F");
      line(String(i + 1), M + 5.5, y + 1.6, { size: 10, font: "bold", color: C.white, align: "center", lh: 1.2 });
      line(t, tx, y, TT);
      pill(when, tx + textWidth(t, TT) + 3, y + 0.4, { size: 7.2, font: "semibold", color: C.ink, bg: C.sky100, h: 4.8 });
      para(b, tx, y + lineH(TT) + 1.2, tw, BODY);
      y += hs[i] + 5.5;
    });
    y += 2;
  }
  {
    const gains: { title: string; color: string; items: string[] }[] = [
      { title: "What your school gains", color: C.brand, items: ["Meaningful CPD hours in line with NEP 2020", "Clear evidence of staff training for audits, inspections and annual reports", "A visible mark of quality to share with parents", "Teachers who use AI confidently and responsibly", "No disruption to the timetable"] },
      { title: "What your teachers gain", color: C.accent, items: ["Practical skills they can use in class the very next day", "Hours saved on planning, worksheets and question papers with AI", "A certificate for their CV and LinkedIn profile", "Confidence with technology, starting from zero", "Learning at their own pace, on their own phone"] },
    ];
    const gap = 5, gw2 = (CW - gap) / 2, pad = 6;
    const S: TextOpts = { size: 8.8, color: C.s700, lh: 1.5 };
    const gh = Math.max(...gains.map((g) => 14 + checklist(g.items, 0, 0, gw2 - pad * 2, S, false) + pad));
    ensure(gh);
    gains.forEach((g, i) => {
      const x = M + i * (gw2 + gap);
      fill(i ? "#fff7ed" : C.sky50);
      doc.roundedRect(x, y, gw2, gh, 3.5, 3.5, "F");
      line(g.title, x + pad, y + pad - 0.5, { size: 11.5, font: "bold", color: C.navy900, lh: 1.3 });
      checklist(g.items, x + pad, y + 14, gw2 - pad * 2, S, true, g.color);
    });
    y += gh + 8;
  }

  // ═════════════════════════ 7. Verifiable certificate ═════════════════════════
  {
    const blockH = 78;
    ensure(blockH + 30);
    sectionHead("Trust", "Every certificate can be verified in seconds", undefined, blockH);
    // Mini certificate
    const cx = M, cyy = y, cw4 = 92, ch4 = 66;
    fill(C.white);
    doc.roundedRect(cx, cyy, cw4, ch4, 2, 2, "F");
    stroke(C.gold);
    doc.setLineWidth(0.8);
    doc.rect(cx + 2.5, cyy + 2.5, cw4 - 5, ch4 - 5, "S");
    doc.setLineWidth(0.25);
    doc.rect(cx + 4, cyy + 4, cw4 - 8, ch4 - 8, "S");
    stroke(C.s200);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, cyy, cw4, ch4, 2, 2, "S");
    const mid = cx + cw4 / 2 - 8;
    line("CERTIFICATE", mid, cyy + 9, { size: 10, font: "bold", color: C.navy900, align: "center", space: 1.2, lh: 1.2 });
    line("OF ACHIEVEMENT", mid, cyy + 14, { size: 5.2, font: "semibold", color: C.gold, align: "center", space: 0.9, lh: 1.2 });
    line("This is proudly presented to", mid, cyy + 20, { size: 5.5, color: C.s500, align: "center", lh: 1.2 });
    line("Priya Sharma", mid, cyy + 24.5, { size: 13, font: "italic", color: C.navy900, align: "center", lh: 1.2 });
    stroke(C.gold);
    doc.setLineWidth(0.3);
    doc.line(mid - 22, cyy + 32, mid + 22, cyy + 32);
    line(selected[0]?.title ?? "Certified AI-Ready Educator", mid, cyy + 34, { size: 6.2, font: "semibold", color: C.ink, align: "center", lh: 1.2 });
    line("Score 92%  ·  Credential ID SAMPLE-2026-48A1", mid, cyy + 38.5, { size: 4.8, color: C.s500, align: "center", lh: 1.2 });
    // seal
    fill(C.gold);
    doc.circle(mid, cyy + 50, 5.5, "F");
    fill("#e9c46a");
    doc.circle(mid, cyy + 50, 3.8, "F");
    line("SAMPLE", mid, cyy + 59, { size: 4.6, font: "semibold", color: C.s400, align: "center", space: 0.6, lh: 1.2 });
    // Real QR to the verification page
    const verify = `${org.website}/verify`;
    const qs = 20, qx = cx + cw4 - qs - 7, qy = cyy + ch4 - qs - 9;
    const { n, dark } = qrMatrix(verify);
    const cell = qs / (n + 2);
    fill(C.navy900);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (dark(r, c)) doc.rect(qx + (c + 1) * cell, qy + (r + 1) * cell, cell + 0.03, cell + 0.03, "F");
    doc.link(qx, qy, qs, qs, { url: verify });
    line("Scan to verify", qx + qs / 2, qy + qs + 0.6, { size: 4.6, font: "medium", color: C.s500, align: "center", lh: 1.2 });

    const bx = M + cw4 + 9, bw = CW - cw4 - 9;
    const items = [
      "A unique credential ID and QR code on every certificate",
      "The QR opens a live verification page — no login needed",
      "Shows the teacher’s name, programme, exam score and date",
      "Identity checked before any certificate is issued",
      "One click to add it to LinkedIn and a digital CV",
    ];
    let by = cyy + 1;
    by += para("A NextGen Educator certificate is earned, not attended. Anyone — you, a parent, an inspector or another school — can confirm it is genuine.", bx, by, bw, { ...BODY, color: C.s700 }) + 4;
    checklist(items, bx, by, bw, { size: 8.8, color: C.s700, lh: 1.45 });
    y = cyy + ch4 + 6;
    para(`Try it: scan the QR code above or visit ${org.websiteLabel}/verify`, M, y, CW, { size: 7.8, font: "medium", color: C.s500, lh: 1.4 });
    y += 8;
  }

  // ═════════════════════════ 8. Investment ═════════════════════════
  newPage();
  sectionHead(
    "Investment",
    "Simple, transparent pricing",
    "Fees are per teacher and one-time — no subscription and no hidden charges. Free programmes cost nothing at all.",
    60,
  );
  {
    const cols = discount > 0 ? [0, 98, 118, 146] : [0, 108, 132, 174];
    const head = discount > 0 ? ["Programme", "Hours", "Standard fee", `Your fee (−${discount}%)`] : ["Programme", "Hours", "Fee per teacher", ""];
    const TH: TextOpts = { size: 7.6, font: "semibold", color: C.white, lh: 1.3 };
    const TD: TextOpts = { size: 9, color: C.s700, lh: 1.4 };
    clipRound(M, y, CW, 9, 2.5, () => grad(M, y, CW, 9, C.navy900, C.navy800, "h"));
    head.forEach((h2, i) => { if (h2) line(h2, i === 0 ? M + 5 : M + (cols[i + 1] ?? CW) - 5, y + 2.6, { ...TH, align: i === 0 ? "left" : "right" }); });
    y += 9;
    let pkg = 0;
    selected.forEach((pr, i) => {
      const fee = programFee(pr);
      pkg += fee;
      const nameH = para(pr.title, 0, 0, cols[1] - 10, { ...TD, font: "medium" }, false);
      const sub = `${pr.courses.length} course${pr.courses.length === 1 ? "" : "s"} + certification exam`;
      const rh = nameH + 4.8 + 6;
      ensure(rh + 40);
      if (i % 2) { fill(C.s50); doc.rect(M, y, CW, rh, "F"); }
      para(pr.title, M + 5, y + 3, cols[1] - 10, { ...TD, font: "medium", color: C.navy900 });
      line(sub, M + 5, y + 3 + nameH, { size: 7.4, color: C.s500, lh: 1.4 });
      line(`${programHoursTotal(pr)}`, M + cols[2] - 5, y + 3, { ...TD, align: "right" });
      const feeTxt = fee ? formatINR(fee) : "Free";
      if (discount > 0) {
        line(feeTxt, M + cols[3] - 5, y + 3, { ...TD, align: "right", color: fee ? C.s500 : C.emerald });
        line(fee ? formatINR(discounted(fee, discount)) : "Free", M + CW - 5, y + 3, { ...TD, font: "semibold", align: "right", color: fee ? C.navy900 : C.emerald });
      } else {
        line(feeTxt, M + CW - 5, y + 3, { ...TD, font: "semibold", align: "right", color: fee ? C.navy900 : C.emerald });
      }
      stroke(C.s200);
      doc.setLineWidth(0.2);
      doc.line(M, y + rh, M + CW, y + rh);
      y += rh;
    });
    // package row
    fill(C.sky50);
    doc.rect(M, y, CW, 10, "F");
    const gstPct = Math.round(GST_RATE * 100);
    line("Complete package, per teacher", M + 5, y + 2.8, { size: 9.4, font: "semibold", color: C.navy900, lh: 1.4 });
    if (pkg) line(`+ ${gstPct}% GST`, M + 5 + textWidth("Complete package, per teacher", { size: 9.4, font: "semibold" }) + 2.5, y + 3.1, { size: 7.8, color: C.s500, lh: 1.4 });
    const pkgNow = discount > 0 ? discounted(pkg, discount) : pkg;
    line(pkg ? formatINR(pkgNow) : "Free", M + CW - 5, y + 2.6, { size: 10.5, font: "bold", color: pkg ? C.navy900 : C.emerald, align: "right", lh: 1.4 });
    if (discount > 0 && pkg) line(formatINR(pkg), M + cols[3] - 5, y + 2.8, { size: 9, color: C.s400, align: "right", lh: 1.4 });
    y += 10 + 7;

    if (p.teachers > 0 && pkg > 0) {
      const sub0 = pkg * p.teachers;
      const disc = sub0 - pkgNow * p.teachers;
      const sub1 = pkgNow * p.teachers;
      const gst = Math.round(sub1 * GST_RATE * 100) / 100;
      const rows: [string, string, boolean?][] = [
        [`Package fee × ${p.teachers} teachers`, formatINR(sub0)],
        ...(discount > 0 ? ([[`Institutional discount (${discount}%)`, `− ${formatINR(disc)}`]] as [string, string][]) : []),
        ...(discount > 0 ? ([["Amount after discount", formatINR(sub1)]] as [string, string][]) : []),
        [`GST (${Math.round(GST_RATE * 100)}%)`, formatINR(gst)],
      ];
      const eh = 16 + rows.length * 7 + 16;
      ensure(eh + 10);
      const ex = M + CW * 0.36, ew = CW * 0.64;
      para(`Estimate for ${school}`, M, y + 2, CW * 0.32, { size: 12.5, font: "bold", color: C.navy900, lh: 1.3 });
      para("Based on every teacher taking the complete package. You can also choose different programmes for different teachers — we will tailor the final quote together.", M, y + 14, CW * 0.32, { size: 8.2, color: C.s500, lh: 1.5 });
      fill(C.white);
      stroke(C.s200);
      doc.setLineWidth(0.3);
      doc.roundedRect(ex, y, ew, eh, 3.5, 3.5, "FD");
      let ey = y + 7;
      line(`${p.teachers} TEACHERS`, ex + 7, ey, { size: 7, font: "semibold", color: C.ink, space: 0.5, lh: 1.3 });
      ey += 8;
      for (const [k, v] of rows) {
        line(k, ex + 7, ey, { size: 8.8, color: C.s600, lh: 1.4 });
        line(v, ex + ew - 7, ey, { size: 8.8, font: "medium", color: v.startsWith("−") ? C.emerald : C.navy900, align: "right", lh: 1.4 });
        ey += 7;
      }
      stroke(C.s200);
      doc.line(ex + 7, ey + 0.5, ex + ew - 7, ey + 0.5);
      ey += 3.5;
      line("Estimated total", ex + 7, ey + 1, { size: 10, font: "semibold", color: C.navy900, lh: 1.4 });
      line(formatINR(sub1 + gst), ex + ew - 7, ey - 0.5, { size: 15, font: "bold", color: C.accentStrong, align: "right", lh: 1.3 });
      y += eh + 8;
    } else if (discount > 0) {
      ensure(16);
      fill(C.emerald50);
      doc.roundedRect(M, y, CW, 13, 3, 3, "F");
      para(`A ${discount}% institutional discount on every paid course applies to all teachers of ${school}.`, M + 6, y + 3.5, CW - 12, { size: 9.4, font: "semibold", color: C.emerald, lh: 1.4 });
      y += 13 + 7;
    }

    const notes = [
      data.onlinePayments
        ? "Teachers can pay securely online by UPI, card or netbanking, or the school can pay for all its teachers together — our representative shares the details after you confirm the list."
        : "No payment is taken on the website. After you confirm the list of teachers, our representative calls you and shares the payment details.",
      "Every course includes all lessons, activities and AI prompts, the certification exam and the verifiable certificate.",
      `This proposal is valid until ${fmtLongDate(p.validUntil)}.`,
    ];
    const nh = checklist(notes, 0, 0, CW, { size: 8.6, color: C.s600, lh: 1.5 }, false);
    ensure(nh + 4);
    y += checklist(notes, M, y, CW, { size: 8.6, color: C.s600, lh: 1.5 }, true, C.emerald) + 4;
  }

  // ═════════════════════════ 9. Next steps & contact ═════════════════════════
  newPage();
  sectionHead("Next steps", "Let’s build future-ready classrooms together", "Getting started takes three simple steps.", 50);
  {
    const steps: [string, string][] = [
      ["Tell us what you think", "Call or message us with your questions or the programmes you would like to begin with."],
      ["Share your list of teachers", "Names, phone numbers and the programme for each teacher — a simple sheet is enough."],
      ["We onboard your staff", "We help every teacher register, unlock their courses and start learning right away."],
    ];
    const gap = 4.5, sw = (CW - gap * 2) / 3, pad = 6;
    const TT: TextOpts = { size: 10.5, font: "semibold", color: C.navy900, lh: 1.3 };
    const S: TextOpts = { size: 8.6, color: C.s600, lh: 1.5 };
    const sh = Math.max(...steps.map(([t, b]) => 17 + para(t, 0, 0, sw - pad * 2, TT, false) + 2 + para(b, 0, 0, sw - pad * 2, S, false) + pad));
    steps.forEach(([t, b], i) => {
      const x = M + i * (sw + gap);
      fill(C.s50);
      doc.roundedRect(x, y, sw, sh, 3.5, 3.5, "F");
      fill(i === 2 ? C.accent : C.navy900);
      doc.circle(x + pad + 4, y + pad + 4, 4.2, "F");
      line(String(i + 1), x + pad + 4, y + pad + 1.6, { size: 9.5, font: "bold", color: C.white, align: "center", lh: 1.2 });
      const th = para(t, x + pad, y + 17, sw - pad * 2, TT) + 2;
      para(b, x + pad, y + 17 + th, sw - pad * 2, S);
    });
    y += sh + 10;
  }
  {
    // Contact card
    const ch5 = 62;
    ensure(ch5);
    clipRound(M, y, CW, ch5, 5, () => {
      grad(M, y, CW, ch5, C.navy900, C.navy950, "h");
      gridLines(M, y, CW, ch5, 9, C.white, 0.05);
      alpha(0.25, () => { fill(C.brand); doc.circle(M + CW - 6, y + 2, 34, "F"); });
      alpha(0.15, () => { fill(C.teal); doc.circle(M + CW - 34, y + ch5 + 6, 22, "F"); });
    });
    const lx = M + 9;
    line("YOUR CONTACT", lx, y + 8, { size: 7.2, font: "semibold", color: C.tealLight, space: 0.6, lh: 1.3 });
    line(p.preparedBy || org.name, lx, y + 13.5, { size: 17, font: "bold", color: C.white, lh: 1.25 });
    line([p.preparedByTitle, org.name].filter(Boolean).join(", "), lx, y + 22.5, { size: 9.5, color: C.s300, lh: 1.4 });
    let ly = y + 32;
    const rows: [string, string][] = [
      ["Phone", p.preparedPhone || org.phone],
      ...(p.preparedEmail || org.email ? ([["Email", p.preparedEmail || org.email]] as [string, string][]) : []),
      ["Website", org.websiteLabel],
    ];
    for (const [k, v] of rows) {
      line(k.toUpperCase(), lx, ly, { size: 6.8, font: "semibold", color: C.s400, space: 0.5, lh: 1.4 });
      line(v, lx + 20, ly - 0.4, { size: 10, font: "semibold", color: C.white, lh: 1.4 });
      ly += 7;
    }
    const rx2 = M + CW * 0.6;
    line("NEXTGEN EDUCATOR", rx2, y + 8, { size: 7.2, font: "semibold", color: C.tealLight, space: 0.6, lh: 1.3 });
    para(`Helpline: ${org.phone}`, rx2, y + 14, CW * 0.36, { size: 9.2, font: "medium", color: C.white, lh: 1.5 });
    para(`Offices in ${org.cities.join(", ").replace(/, ([^,]*)$/, " and $1")}`, rx2, y + 21, CW * 0.36, { size: 8.6, color: C.s300, lh: 1.5 });
    if (org.websiteLabel) doc.link(lx + 20, y + 32 + 7 * (rows.length - 1) - 1, 60, 6, { url: org.website });
    y += ch5 + 10;
  }
  {
    ensure(30);
    const q = `Thank you for considering NextGen Educator for ${school}. We look forward to supporting your teachers — and through them, every one of your students.`;
    y += para(q, M, y, CW, { size: 11.5, font: "italic", color: C.navy900, lh: 1.55 }) + 10;
    stroke(C.s200);
    doc.setLineWidth(0.25);
    doc.line(M, y, W - M, y);
    y += 4;
    // Sources for every claim quoted in this document
    const SRC: TextOpts = { size: 7.2, color: C.s500, lh: 1.5 };
    const sources = [
      `${cite(NEP_2020)}, para 5.15 and 5.16: “${NEP_QUOTES.teachers}”; “${NEP_QUOTES.leaders}”. ${NEP_2020.url}`,
      `${cite(UNESCO_AI_TEACHERS)}: “${UNESCO_FINDINGS.gap}”; the framework sets out ${UNESCO_FINDINGS.scope}. ${UNESCO_AI_TEACHERS.url}`,
    ];
    line("SOURCES", M, y, { size: 6.8, font: "semibold", color: C.s500, space: 0.5, lh: 1.4 });
    y += 4.5;
    sources.forEach((src, i) => {
      line(`${i + 1}.`, M, y, SRC);
      y += para(src, M + 4, y, CW - 4, SRC) + 1;
    });
    y += 2;
    para(`${org.disclaimer} ${NOT_AFFILIATED}`, M, y, CW, { size: 7, color: C.s400, lh: 1.5 });
  }

  // ── Running header & footer on inner pages ──
  const pages = doc.getNumberOfPages();
  for (let i = 2; i <= pages; i++) {
    doc.setPage(i);
    doc.addImage(assets.icon, "PNG", M, 9.2, 7, 7, undefined, "FAST");
    line("NextGen", M + 9, 10.1, { size: 9.5, font: "bold", color: C.navy900, lh: 1.3 });
    line("Educator", M + 9 + textWidth("NextGen ", { size: 9.5, font: "bold" }), 10.1, { size: 9.5, font: "bold", color: C.brand, lh: 1.3 });
    line(`Proposal for ${wrap(school, 100, { size: 7.8, font: "medium" })[0]}`, W - M, 10.6, { size: 7.8, font: "medium", color: C.s500, align: "right", lh: 1.3 });
    stroke(C.s200);
    doc.setLineWidth(0.25);
    doc.line(M, 19.5, W - M, 19.5);
    doc.line(M, 284, W - M, 284);
    line(`${org.websiteLabel}  ·  ${org.phone}`, M, 285.5, { size: 7.2, color: C.s400, lh: 1.4 });
    line(`${p.ref}  ·  Page ${i} of ${pages}`, W - M, 285.5, { size: 7.2, color: C.s400, align: "right", lh: 1.4 });
  }

  doc.setProperties({
    title: `${org.name} — Proposal for ${school}`,
    subject: `Teacher upskilling and certification proposal (${p.ref})`,
    author: p.preparedBy || org.name,
    creator: org.name,
    keywords: "teacher training, NEP 2020, AI for teachers, certification",
  });
  return doc;
}
