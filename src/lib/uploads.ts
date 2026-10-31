import { randomBytes } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredFile } from "./users";

/**
 * Private document storage for local development: files live under data/uploads (git-ignored,
 * never in /public) and are only served through the admin-only document route.
 * Swap for private object storage (e.g. S3 with encryption) before deploying.
 */
const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

type Kind = { ext: string; mime: string };
const KINDS: Record<string, Kind> = {
  jpg: { ext: "jpg", mime: "image/jpeg" },
  png: { ext: "png", mime: "image/png" },
  pdf: { ext: "pdf", mime: "application/pdf" },
  doc: { ext: "doc", mime: "application/msword" },
  docx: { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
};

/** Identify a file by its leading bytes — never trust the browser-supplied type or extension. */
function sniff(buf: Buffer, name: string): Kind | null {
  const starts = (...bytes: number[]) => bytes.every((b, i) => buf[i] === b);
  if (starts(0xff, 0xd8, 0xff)) return KINDS.jpg;
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return KINDS.png;
  if (starts(0x25, 0x50, 0x44, 0x46, 0x2d)) return KINDS.pdf; // %PDF-
  if (starts(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1)) return KINDS.doc;
  // .docx is a zip; require the extension too so arbitrary zips aren't accepted.
  if (starts(0x50, 0x4b, 0x03, 0x04) && /\.docx$/i.test(name) && buf.includes("word/")) return KINDS.docx;
  return null;
}

export type UploadResult = { file: StoredFile } | { error: string };

export async function saveUpload(userId: string, prefix: string, file: File | null, allowed: (keyof typeof KINDS)[], label: string): Promise<UploadResult> {
  if (!file || file.size === 0) return { error: `Upload your ${label}.` };
  if (file.size > MAX_UPLOAD_BYTES) return { error: `${label[0].toUpperCase()}${label.slice(1)} must be 5 MB or smaller.` };

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf, file.name);
  if (!kind || !allowed.includes(kind.ext as keyof typeof KINDS)) {
    return { error: `${label[0].toUpperCase()}${label.slice(1)} must be ${allowed.map((a) => a.toUpperCase()).join(", ")}.` };
  }

  const dir = path.join(UPLOAD_DIR, userId);
  await mkdir(dir, { recursive: true });
  const stored = `${prefix}-${randomBytes(12).toString("hex")}.${kind.ext}`;
  await writeFile(path.join(dir, stored), buf, { mode: 0o600 });
  return {
    file: {
      stored,
      originalName: file.name.replace(/[^\w.\- ]/g, "_").slice(0, 120) || `${prefix}.${kind.ext}`,
      mime: kind.mime,
      size: buf.length,
      uploadedAt: new Date().toISOString(),
    },
  };
}

const SAFE_NAME = /^[a-z]+-[a-f0-9]{24}\.(jpg|png|pdf|doc|docx)$/;
const SAFE_USER = /^[a-f0-9-]{36}$/;

export async function readUpload(userId: string, file: StoredFile) {
  if (!SAFE_USER.test(userId) || !SAFE_NAME.test(file.stored)) return null;
  try {
    return await readFile(path.join(UPLOAD_DIR, userId, file.stored));
  } catch {
    return null;
  }
}

export async function deleteUpload(userId: string, file?: StoredFile) {
  if (!file || !SAFE_USER.test(userId) || !SAFE_NAME.test(file.stored)) return;
  await rm(path.join(UPLOAD_DIR, userId, file.stored), { force: true });
}
