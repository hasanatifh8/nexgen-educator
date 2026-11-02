"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { submitProfile } from "@/lib/profileSubmission";
import { safeNextPath } from "@/lib/sessionToken";
import { findUserById } from "@/lib/users";
import type { ProfileState } from "./constants";

export async function saveProfileAction(_prev: ProfileState, fd: FormData): Promise<ProfileState> {
  const session = await getCurrentUser();
  if (!session) redirect("/login?next=/onboarding");
  const user = await findUserById(session.id);
  if (!user) redirect("/login?next=/onboarding");

  const errors = await submitProfile(user, fd);
  if (errors) return errors;
  redirect(safeNextPath(fd.get("next")) ?? "/my-learning?profile=1");
}
