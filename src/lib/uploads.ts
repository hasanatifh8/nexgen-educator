import { randomBytes } from "node:crypto";
import { deleteFile, getFile, putFile } from "./store";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from "./uploadLimits";
import type { StoredFile } from "./users";

/**
 * Private document storage (ID proofs, CVs): Postgres in production, data/uploads locally (git-ignored,
 * never in /public). Files are only ever served through the admin-only document route.
 */
export { MAX_UPLOAD_BYTES };
const fileKey = (userId: string, stored: string) => `${userId}/${stored}`;

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

export async function saveUpload(
  userId: string,
  prefix: string,
  file: File | null,
  allowed: (keyof typeof KINDS)[],
  label: string,
  limit: { bytes: number; label: string } = { bytes: MAX_UPLOAD_BYTES, label: MAX_UPLOAD_LABEL },
): Promise<UploadResult> {
  if (!file || file.size === 0) return { error: `Upload your ${label}.` };
  if (file.size > limit.bytes) return { error: `${label[0].toUpperCase()}${label.slice(1)} must be ${limit.label} or smaller.` };

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf, file.name);
  if (!kind || !allowed.includes(kind.ext as keyof typeof KINDS)) {
    return { error: `${label[0].toUpperCase()}${label.slice(1)} must be ${allowed.map((a) => a.toUpperCase()).join(", ")}.` };
  }

  const stored = `${prefix}-${randomBytes(12).toString("hex")}.${kind.ext}`;
  await putFile(fileKey(userId, stored), buf, kind.mime);
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
/** Shared files that belong to no single learner (PDF notes) are stored under this owner instead of a user id. */
export const NOTES_OWNER = "notes";
const safeOwner = (owner: string) => owner === NOTES_OWNER || SAFE_USER.test(owner);

export async function readUpload(userId: string, file: StoredFile) {
  if (!safeOwner(userId) || !SAFE_NAME.test(file.stored)) return null;
  return getFile(fileKey(userId, file.stored));
}

export async function deleteUpload(userId: string, file?: StoredFile) {
  if (!file || !safeOwner(userId) || !SAFE_NAME.test(file.stored)) return;
  await deleteFile(fileKey(userId, file.stored));
}
