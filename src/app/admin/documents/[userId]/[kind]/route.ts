import { getCurrentUser } from "@/lib/dal";
import { readUpload } from "@/lib/uploads";
import { findUserById } from "@/lib/users";

/** Admin-only access to a learner's private documents. */
export async function GET(_req: Request, ctx: RouteContext<"/admin/documents/[userId]/[kind]">) {
  const admin = await getCurrentUser();
  if (!admin?.isAdmin) return new Response("Not found", { status: 404 });

  const { userId, kind } = await ctx.params;
  const user = await findUserById(userId);
  const file = kind === "id" ? user?.profile?.idDocument : kind === "cv" ? user?.profile?.cv : undefined;
  const data = user && file ? await readUpload(user.id, file) : null;
  if (!user || !file || !data) return new Response("Not found", { status: 404 });

  const inline = file.mime.startsWith("image/") || file.mime === "application/pdf";
  const name = `${user.firstName}-${user.lastName}-${kind}.${file.stored.split(".").pop()}`.replace(/[^\w.-]/g, "_");
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
