"use server";

import { redirect } from "next/navigation";
import { welcomeEmail } from "@/lib/emails";
import { emailBrand, sendMail } from "@/lib/mailer";
import { safeNextPath } from "@/lib/sessionToken";
import { getPublicCatalog } from "@/lib/catalogStore";
import { MAX_PICKS } from "@/lib/courseFinder";
import { createUser } from "@/lib/users";
import { readRegisterForm, validateRegistration, type RegisterState, type WorkStatus } from "./validation";

export async function register(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const fields = readRegisterForm(formData);
  const values = {
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    role: fields.role,
    workStatus: fields.workStatus,
    institution: fields.institution,
    terms: fields.terms,
    newsletter: fields.newsletter,
  };

  const errors = validateRegistration(fields);
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }

  // Courses picked in the course finder: keep only ones on offer today.
  const wanted = [...new Set(formData.getAll("interest").map(String))].slice(0, MAX_PICKS);
  const { courses } = wanted.length ? await getPublicCatalog() : { courses: [] };
  const interestedCourses = wanted.filter((id) => courses.some((c) => c.id === id && !c.launch));

  const user = await createUser({
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    role: fields.role,
    workStatus: fields.workStatus as WorkStatus,
    institution: fields.institution,
    newsletter: fields.newsletter,
    password: fields.password,
    ...(interestedCourses.length ? { interestedCourses } : {}),
  });

  if (!user) {
    return {
      status: "error",
      message: "An account with this email already exists.",
      errors: { email: "This email is already registered. Try logging in instead." },
      values,
    };
  }

  const brand = await emailBrand();
  if (brand) await sendMail({ to: user.email, ...welcomeEmail(user.firstName, brand) });

  // Confirm the account, then ask the learner to log in; login routes them to profile completion.
  // With picked courses, land on My Learning (after profile completion), where they are waiting.
  const next = safeNextPath(formData.get("next")) ?? (interestedCourses.length ? "/my-learning" : null);
  redirect(`/login?registered=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
}
