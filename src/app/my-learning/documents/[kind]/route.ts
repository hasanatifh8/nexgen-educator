import { getCurrentUser } from "@/lib/dal";
import { documentResponse } from "@/lib/documentResponse";
import { findUserById } from "@/lib/users";

/** A signed-in learner's own documents: ID, original CV and the resume our team improved. */
export async function GET(req: Request, ctx: RouteContext<"/my-learning/documents/[kind]">) {
  const session = await getCurrentUser();
  if (!session) return new Response("Not found", { status: 404 });
  const { kind } = await ctx.params;
  const user = await findUserById(session.id);
  // The upgraded resume is released to the learner only once our team marks it delivered.
  if (kind === "resume" && user?.resumeService?.status !== "delivered") return new Response("Not found", { status: 404 });
  return documentResponse(user, kind, new URL(req.url).searchParams.has("download"));
}
