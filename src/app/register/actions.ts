"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/dal";
import { createSession } from "@/lib/session";
import { onboardingPath, safeNextPath } from "@/lib/sessionToken";
import { createUser } from "@/lib/users";
import { readRegisterForm, validateRegistration, type RegisterState } from "./validation";

export async function register(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const fields = readRegisterForm(formData);
  const values = {
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    role: fields.role,
    institution: fields.institution,
    terms: fields.terms,
    newsletter: fields.newsletter,
  };

  const errors = validateRegistration(fields);
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }

  const user = await createUser({
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    role: fields.role,
    institution: fields.institution,
    newsletter: fields.newsletter,
    password: fields.password,
  });

  if (!user) {
    return {
      status: "error",
      message: "An account with this email already exists.",
      errors: { email: "This email is already registered. Try logging in instead." },
      values,
    };
  }

  await createSession(user.id);
  const next = safeNextPath(formData.get("next"));
  if (isAdminEmail(user.email)) redirect(next ?? "/admin");
  // Next step for every new learner: complete the profile (ID + CV).
  redirect(onboardingPath(next));
}
