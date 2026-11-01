import { getCurrentUser } from "@/lib/dal";
import { documentResponse } from "@/lib/documentResponse";
import { findUserById } from "@/lib/users";

/** Admin-only access to a learner's private documents. */
export async function GET(req: Request, ctx: RouteContext<"/admin/documents/[userId]/[kind]">) {
  const admin = await getCurrentUser();
  if (!admin?.isAdmin) return new Response("Not found", { status: 404 });
  const { userId, kind } = await ctx.params;
  return documentResponse(await findUserById(userId), kind, new URL(req.url).searchParams.has("download"));
}
