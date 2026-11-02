import { getCurrentUser } from "@/lib/dal";
import { getNote, noteResponse } from "@/lib/notes";

/** Admin preview of an uploaded note. */
export async function GET(req: Request, ctx: RouteContext<"/admin/notes/[id]/file">) {
  const admin = await getCurrentUser();
  if (!admin?.isAdmin) return new Response("Not found", { status: 404 });
  const { id } = await ctx.params;
  return noteResponse(await getNote(id), new URL(req.url).searchParams.has("download"));
}
