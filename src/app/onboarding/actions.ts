"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { safeNextPath } from "@/lib/sessionToken";
import { deleteUpload, saveUpload } from "@/lib/uploads";
import { findUserById, saveProfile } from "@/lib/users";
import { placeError } from "@/lib/validation";
import { QUALIFICATIONS, STATES, type ProfileState } from "./constants";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const fileOf = (fd: FormData, k: string) => {
  const f = fd.get(k);
  return f instanceof File && f.size > 0 ? f : null;
};

export async function saveProfileAction(_prev: ProfileState, fd: FormData): Promise<ProfileState> {
  const session = await getCurrentUser();
  if (!session) redirect("/login?next=/onboarding");
  const user = await findUserById(session.id);
  if (!user) redirect("/login?next=/onboarding");
  const existing = user.profile;

  const phone = str(fd, "phone").replace(/[\s-]/g, "");
  const city = str(fd, "city");
  const state = str(fd, "state");
  const qualification = str(fd, "qualification");
  const experienceYears = Number(str(fd, "experienceYears"));
  const idType = str(fd, "idType");
  const consent = fd.get("consent") === "on";

  const e: Record<string, string> = {};
  if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
  const cityErr = placeError(city, "city");
  if (cityErr) e.city = cityErr;
  if (!STATES.includes(state as (typeof STATES)[number])) e.state = "Select your state.";
  if (!QUALIFICATIONS.includes(qualification as (typeof QUALIFICATIONS)[number])) e.qualification = "Select your highest qualification.";
  if (!Number.isInteger(experienceYears) || experienceYears < 0 || experienceYears > 50) e.experienceYears = "Enter years of experience (0–50).";
  if (idType !== "aadhaar" && idType !== "pan") e.idType = "Choose Aadhaar or PAN.";
  if (!consent) e.consent = "Please consent to document verification.";

  const idFile = fileOf(fd, "idDocument");
  const cvFile = fileOf(fd, "cv");
  // On re-submission, existing files are kept unless replaced — but switching ID type needs a new document.
  const needId = !existing || idType !== existing.idType;
  if (needId && !idFile) e.idDocument = `Upload a photo or scan of your ${idType === "pan" ? "PAN card" : "masked Aadhaar"}.`;
  if (!existing && !cvFile) e.cv = "Upload your CV.";
  if (Object.keys(e).length) return { error: "Please fix the highlighted fields.", fieldErrors: e };

  let idDocument = existing?.idDocument;
  let cv = existing?.cv;
  if (idFile) {
    const r = await saveUpload(user.id, "id", idFile, ["jpg", "png", "pdf"], "ID document");
    if ("error" in r) return { error: r.error, fieldErrors: { idDocument: r.error } };
    idDocument = r.file;
  }
  if (cvFile) {
    const r = await saveUpload(user.id, "cv", cvFile, ["pdf", "doc", "docx"], "CV");
    if ("error" in r) {
      if (idFile && idDocument) await deleteUpload(user.id, idDocument); // don't leave an orphaned new ID file
      return { error: r.error, fieldErrors: { cv: r.error } };
    }
    cv = r.file;
  }

  const now = new Date().toISOString();
  await saveProfile(user.id, {
    phone: phone.replace(/^\+91/, ""),
    city,
    state,
    qualification,
    experienceYears,
    idType: idType as "aadhaar" | "pan",
    idDocument: idDocument!,
    cv: cv!,
    consentAt: now,
    completedAt: now,
  });
  // Remove replaced files only after the new profile is saved.
  if (idFile && existing?.idDocument) await deleteUpload(user.id, existing.idDocument);
  if (cvFile && existing?.cv) await deleteUpload(user.id, existing.cv);

  redirect(safeNextPath(fd.get("next")) ?? "/my-learning?profile=1");
}
