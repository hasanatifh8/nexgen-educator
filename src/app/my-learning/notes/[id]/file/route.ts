import { getCurrentUser } from "@/lib/dal";
import { getNote, noteResponse } from "@/lib/notes";

/** A learner's view of a note: only notes assigned to them (or any note, for admins). */
export async function GET(req: Request, ctx: RouteContext<"/my-learning/notes/[id]/file">) {
  const user = await getCurrentUser();
  if (!user) return new Response("Not found", { status: 404 });
  const { id } = await ctx.params;
  const note = await getNote(id);
  if (!note || !(user.isAdmin || note.assignedTo.includes(user.id))) return new Response("Not found", { status: 404 });
  return noteResponse(note, new URL(req.url).searchParams.has("download"));
}
