/**
 * Per-file upload limit, shared by the profile form and the server. Kept at 2 MB so an ID proof plus a CV fit
 * in one request under Vercel's 4.5 MB function body limit. Photos are shrunk in the browser before upload.
 */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = "2 MB";

/** PDF notes are uploaded one at a time by admins, so they can use most of Vercel's 4.5 MB request limit. */
export const MAX_NOTE_BYTES = 4 * 1024 * 1024;
export const MAX_NOTE_LABEL = "4 MB";
