import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { getCatalog } from "@/lib/catalogStore";
import { requireUser } from "@/lib/dal";
import { getSettings } from "@/lib/settings";
import { findUserById } from "@/lib/users";

/** Everything a portal page needs: the session, the full learner record, the catalog and site settings. */
export const loadLearner = cache(async (path: string) => {
  await connection();
  const session = await requireUser(path);
  const record = await findUserById(session.id);
  if (!record) redirect(`/login?next=${encodeURIComponent(path)}`);
  const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
  return { session, record, catalog, settings };
});
