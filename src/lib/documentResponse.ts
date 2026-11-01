import { readUpload } from "./uploads";
import type { StoredUser } from "./users";

export const DOCUMENT_KINDS = ["id", "cv", "resume"] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

const pick = (user: StoredUser, kind: string) =>
  kind === "id" ? user.profile?.idDocument : kind === "cv" ? user.profile?.cv : kind === "resume" ? user.resumeService?.file : undefined;

/** Streams one of a learner's private documents. Callers must have authorised the viewer first. */
export async function documentResponse(user: StoredUser | undefined, kind: string, download = false) {
  const file = user ? pick(user, kind) : undefined;
  const data = user && file ? await readUpload(user.id, file) : null;
  if (!user || !file || !data) return new Response("Not found", { status: 404 });

  const inline = !download && (file.mime.startsWith("image/") || file.mime === "application/pdf");
  const label = kind === "resume" ? "resume-enhanced" : kind;
  const name = `${user.firstName}-${user.lastName}-${label}.${file.stored.split(".").pop()}`.replace(/[^\w.-]/g, "_");
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(data.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      // Uploaded files can never run scripts, even if a malicious PDF/image slipped through.
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      "Referrer-Policy": "no-referrer",
    },
  });
}
