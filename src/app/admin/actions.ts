"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { CATEGORIES, LEVELS, type Category, type ExamQuestion, type Level } from "@/lib/catalog";
import { deleteCourse, deleteProgram, getCourse, getProgram, saveCurriculum, saveExam, saveLesson, upsertCourse, upsertProgram, type CurriculumInput } from "@/lib/catalogStore";
import { validateBlocks } from "@/lib/contentValidation";
import { templateById } from "@/lib/lessonTemplates";
import { getCurrentUser } from "@/lib/dal";
import { saveSettings } from "@/lib/settings";
import { normalizeSiteUrl, type SiteSettings } from "@/lib/siteSettings";
import { formatINR } from "@/lib/catalog";
import { fmtDate } from "@/lib/learner";
import { deleteUpload, saveUpload } from "@/lib/uploads";
import { PAYMENT_STATUSES, RESUME_STATUSES, findUserById, setAssignedCourses, setPayment, setResumeService, setVerification, type PaymentStatus, type ResumeStatus } from "@/lib/users";
import { getCatalog } from "@/lib/catalogStore";
import { courseApprovedEmail, paymentReceivedEmail, resumeReadyEmail } from "@/lib/emails";
import { appUrl, sendMail } from "@/lib/mailer";
import { ENQUIRY_STATUSES, updateEnquiry, type EnquiryStatus } from "@/lib/enquiries";

export type FormState = { error?: string; fieldErrors?: Record<string, string> };

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) throw new Error("Not authorized");
  return user;
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

// --- Programs ----------------------------------------------------------------

export async function saveProgramAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const id = str(fd, "id") || undefined;
  const title = str(fd, "title");
  const category = str(fd, "category") as Category;
  const level = str(fd, "level") as Level;
  const description = str(fd, "description");
  const price = Number(str(fd, "price"));

  const e: Record<string, string> = {};
  if (title.length < 3 || title.length > 100) e.title = "Title must be 3–100 characters.";
  if (!CATEGORIES.includes(category)) e.category = "Choose a category.";
  if (!LEVELS.includes(level)) e.level = "Choose a level.";
  if (!Number.isFinite(price) || price < 0 || price > 100000 || Math.round(price * 100) !== price * 100)
    e.price = "Enter a price in rupees from 0 to 1,00,000 (0 = free), before GST.";
  if (description.length < 10 || description.length > 300) e.description = "Description must be 10–300 characters.";
  if (Object.keys(e).length) return { error: "Please fix the highlighted fields.", fieldErrors: e };

  const saved = await upsertProgram({ id, title, category, level, price, description });
  if (!saved) return { error: "That program no longer exists." };
  redirect(`/admin/programs?saved=${encodeURIComponent(saved.title)}`);
}

export async function deleteProgramAction(fd: FormData) {
  await assertAdmin();
  const r = await deleteProgram(str(fd, "id"));
  redirect(r.error ? `/admin/programs?error=${encodeURIComponent(r.error)}` : "/admin/programs?deleted=1");
}

// --- Courses -----------------------------------------------------------------

export async function saveCourseAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const id = str(fd, "id") || undefined;
  const title = str(fd, "title");
  const programId = str(fd, "programId");
  const level = str(fd, "level") as Level;
  const blurb = str(fd, "blurb");
  const enrolled = str(fd, "enrolled");
  const hours = Number(str(fd, "hours"));
  const overview = String(fd.get("overview") ?? "").trim();
  const outcomes = String(fd.get("outcomes") ?? "").split("\n").map((l) => l.replace(/^[-*•]\s*/, "").trim()).filter(Boolean);
  const instructorName = str(fd, "instructorName");
  const instructorTitle = str(fd, "instructorTitle");

  const e: Record<string, string> = {};
  if (title.length < 3 || title.length > 120) e.title = "Title must be 3–120 characters.";
  if (overview.length > 5000) e.overview = "Keep the overview under 5000 characters.";
  if (outcomes.length > 12 || outcomes.some((o) => o.length > 200)) e.outcomes = "Up to 12 outcomes, 200 characters each.";
  if (instructorName.length > 80 || instructorTitle.length > 80) e.instructorName = "Keep instructor details under 80 characters.";
  if (!instructorName && instructorTitle) e.instructorName = "Add the instructor’s name.";
  if (!(await getProgram(programId))) e.programId = "Choose a certification program.";
  if (!LEVELS.includes(level)) e.level = "Choose a level.";
  if (!Number.isFinite(hours) || hours < 0.5 || hours > 200) e.hours = "Enter a duration from 0.5 to 200 hours.";
  if (blurb.length < 10 || blurb.length > 300) e.blurb = "Description must be 10–300 characters.";
  if (enrolled.length > 12) e.enrolled = "Keep this short, e.g. 2.4k.";
  if (Object.keys(e).length) return { error: "Please fix the highlighted fields.", fieldErrors: e };

  const saved = await upsertCourse({
    id, title, programId, level, blurb, hours, overview, outcomes,
    ...(enrolled ? { enrolled } : {}),
    ...(instructorName ? { instructor: { name: instructorName, title: instructorTitle } } : {}),
  });
  if (!saved) return { error: "That course no longer exists." };
  // New courses go straight to the curriculum builder.
  redirect(id ? `/admin/courses?saved=${encodeURIComponent(saved.title)}` : `/admin/courses/${saved.id}/content?created=1`);
}

export async function deleteCourseAction(fd: FormData) {
  await assertAdmin();
  await deleteCourse(str(fd, "id"));
  redirect("/admin/courses?deleted=1");
}

// --- Course content ----------------------------------------------------------

export async function saveCurriculumAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const courseId = str(fd, "courseId");
  let raw: unknown;
  try {
    raw = JSON.parse(str(fd, "modules"));
  } catch {
    return { error: "Could not read the curriculum." };
  }
  if (!Array.isArray(raw) || raw.length > 40) return { error: "A course can have up to 40 modules." };

  const modules: CurriculumInput = [];
  for (const [mi, m] of raw.entries()) {
    const title = String(m?.title ?? "").trim();
    if (!title || title.length > 120) return { error: `Module ${mi + 1}: title must be 1–120 characters.` };
    if (!Array.isArray(m.lessons) || m.lessons.length > 60) return { error: `Module ${mi + 1}: up to 60 lessons.` };
    const lessons: CurriculumInput[number]["lessons"] = [];
    for (const [li, l] of m.lessons.entries()) {
      const lt = String(l?.title ?? "").trim();
      const minutes = Number(l?.minutes);
      if (!lt || lt.length > 140) return { error: `Module ${mi + 1}, lesson ${li + 1}: title must be 1–140 characters.` };
      if (!Number.isInteger(minutes) || minutes < 1 || minutes > 600) return { error: `“${lt}”: duration must be 1–600 minutes.` };
      lessons.push({
        id: typeof l.id === "string" ? l.id : undefined,
        title: lt,
        minutes,
        // Template blocks are generated on the server, never trusted from the client.
        template: typeof l.template === "string" ? templateById(l.template).blocks() : undefined,
      });
    }
    modules.push({ id: typeof m.id === "string" ? m.id : undefined, title, lessons });
  }

  const saved = await saveCurriculum(courseId, modules);
  if (!saved) return { error: "That course no longer exists." };
  redirect(`/admin/courses/${courseId}/content?saved=1`);
}

export async function saveLessonAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const courseId = str(fd, "courseId");
  const lessonId = str(fd, "lessonId");
  const title = str(fd, "title");
  const minutes = Number(str(fd, "minutes"));
  if (!title || title.length > 140) return { error: "Lesson title must be 1–140 characters." };
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 600) return { error: "Duration must be 1–600 minutes." };

  let raw: unknown;
  try {
    raw = JSON.parse(String(fd.get("blocks") ?? "[]"));
  } catch {
    return { error: "Could not read the lesson content." };
  }
  const result = validateBlocks(raw);
  if ("error" in result) return { error: result.error };

  if (!(await getCourse(courseId))) return { error: "That course no longer exists." };
  const saved = await saveLesson(courseId, lessonId, { title, minutes, blocks: result.blocks });
  if (!saved) return { error: "That lesson no longer exists." };
  redirect(`/admin/courses/${courseId}/content?saved=${encodeURIComponent(saved.title)}`);
}

// --- Exams -------------------------------------------------------------------

export async function saveExamAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const programId = str(fd, "programId");
  const minutes = Number(str(fd, "minutes"));
  const passPercent = Number(str(fd, "passPercent"));

  let raw: unknown;
  try {
    raw = JSON.parse(str(fd, "questions"));
  } catch {
    return { error: "Could not read the questions. Please try again." };
  }
  if (!Array.isArray(raw)) return { error: "Could not read the questions." };

  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 300) return { error: "Time limit must be 1–300 minutes." };
  if (!Number.isInteger(passPercent) || passPercent < 1 || passPercent > 100) return { error: "Pass mark must be 1–100%." };
  if (raw.length > 200) return { error: "An exam can have at most 200 questions." };

  const questions: ExamQuestion[] = [];
  for (const [i, item] of raw.entries()) {
    const n = `Question ${i + 1}`;
    const r = item as Partial<ExamQuestion>;
    const prompt = String(r.prompt ?? "").trim();
    const scenario = String(r.scenario ?? "").trim();
    const explanation = String(r.explanation ?? "").trim();
    const options = Array.isArray(r.options) ? r.options.map((o) => String(o).trim()) : [];
    if (prompt.length < 5 || prompt.length > 500) return { error: `${n}: the question must be 5–500 characters.` };
    if (scenario.length > 600) return { error: `${n}: the scenario must be under 600 characters.` };
    if (options.length < 2 || options.length > 6) return { error: `${n}: add 2–6 answer options.` };
    if (options.some((o) => !o || o.length > 300)) return { error: `${n}: every option needs text (max 300 characters).` };
    if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) return { error: `${n}: options must be different.` };
    if (!Number.isInteger(r.answer) || r.answer! < 0 || r.answer! >= options.length) return { error: `${n}: mark the correct answer.` };
    if (explanation.length > 500) return { error: `${n}: the explanation must be under 500 characters.` };
    const id = typeof r.id === "string" && /^[\w-]{1,40}$/.test(r.id) ? r.id : `q-${randomBytes(4).toString("hex")}`;
    questions.push({ id, prompt, options, answer: r.answer!, ...(scenario ? { scenario } : {}), ...(explanation ? { explanation } : {}) });
  }
  if (new Set(questions.map((q) => q.id)).size !== questions.length) return { error: "Duplicate question IDs — please reload and try again." };

  const saved = await saveExam(programId, { minutes, passPercent, questions });
  if (!saved) return { error: "That program no longer exists." };
  redirect(`/admin/programs?saved=${encodeURIComponent(`${saved.title} exam`)}`);
}

// --- Learners ------------------------------------------------------------------

export async function saveAssignmentsAction(fd: FormData) {
  await assertAdmin();
  const userId = str(fd, "userId");
  const before = await findUserById(userId);
  if (!before) redirect("/admin/users");
  const { courses } = await getCatalog();
  const valid = new Set(courses.map((c) => c.id));
  const chosen = fd.getAll("courses").map(String).filter((id) => valid.has(id));
  await setAssignedCourses(userId, chosen);

  // Tell the learner about newly approved courses only, not ones they already had.
  const added = courses.filter((c) => chosen.includes(c.id) && !before.assignedCourses.includes(c.id));
  const base = await appUrl();
  if (added.length && base) {
    await sendMail({ to: before.email, ...courseApprovedEmail(before.firstName, base, added) });
  }
  redirect(`/admin/users/${userId}?saved=assignments`);
}

export async function reviewProfileAction(fd: FormData) {
  await assertAdmin();
  const userId = str(fd, "userId");
  const decision = str(fd, "decision");
  const note = str(fd, "note").slice(0, 300);
  const user = await findUserById(userId);
  if (!user?.profile) redirect(`/admin/users/${userId}`);
  if (decision !== "verified" && decision !== "rejected") redirect(`/admin/users/${userId}`);
  if (decision === "rejected" && !note) redirect(`/admin/users/${userId}?error=${encodeURIComponent("Add a note telling the learner what to fix.")}`);
  await setVerification(userId, decision, note || undefined);
  redirect(`/admin/users/${userId}?saved=${decision}`);
}

export async function savePaymentAction(fd: FormData) {
  await assertAdmin();
  const userId = str(fd, "userId");
  const programId = str(fd, "programId");
  const status = str(fd, "status") as PaymentStatus;
  const back = (error?: string) => redirect(`/admin/users/${userId}${error ? `?error=${encodeURIComponent(error)}` : "?saved=payment"}#payments`);
  const [user, program] = await Promise.all([findUserById(userId), getProgram(programId)]);
  if (!user || !program) redirect("/admin/users");
  if (!PAYMENT_STATUSES.includes(status)) back("Choose a payment status.");

  const amountRaw = str(fd, "amount");
  const amount = amountRaw ? Number(amountRaw) : undefined;
  const reference = str(fd, "reference").slice(0, 60) || undefined;
  const paidOn = str(fd, "paidAt");
  if (amount !== undefined && (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000)) back("Enter the amount received in rupees.");
  if (paidOn && !/^\d{4}-\d{2}-\d{2}$/.test(paidOn)) back("Enter a valid payment date.");

  const paid = status === "paid";
  const paidAt = paid ? (paidOn ? new Date(`${paidOn}T12:00:00Z`) : new Date()).toISOString() : undefined;
  await setPayment(userId, programId, { status, ...(paid ? { amount, reference, paidAt } : {}), updatedAt: new Date().toISOString() });

  // Receipt email only when the payment is newly confirmed.
  const base = await appUrl();
  if (paid && user.payments?.[programId]?.status !== "paid" && base) {
    await sendMail({
      to: user.email,
      ...paymentReceivedEmail(user.firstName, base, { programTitle: program.title, amount: formatINR(amount ?? 0), reference, date: fmtDate(paidAt!) }),
    });
  }
  back();
}

export async function saveResumeAction(fd: FormData) {
  await assertAdmin();
  const userId = str(fd, "userId");
  const status = str(fd, "status") as ResumeStatus;
  const back = (error?: string) => redirect(`/admin/users/${userId}${error ? `?error=${encodeURIComponent(error)}` : "?saved=resume"}#resume`);
  const user = await findUserById(userId);
  if (!user) redirect("/admin/users");
  if (!RESUME_STATUSES.includes(status)) back("Choose a resume status.");

  const changes = String(fd.get("changes") ?? "").split("\n").map((l) => l.replace(/^[-*•]\s*/, "").trim()).filter(Boolean);
  const message = str(fd, "message").slice(0, 600) || undefined;
  if (changes.length > 20 || changes.some((c) => c.length > 200)) back("List up to 20 improvements, 200 characters each.");

  const prev = user.resumeService;
  const upload = fd.get("file");
  let file = prev?.file;
  if (upload instanceof File && upload.size > 0) {
    const r = await saveUpload(user.id, "resume", upload, ["pdf", "doc", "docx"], "resume");
    if ("error" in r) back(r.error);
    else file = r.file;
  }
  if (status === "delivered" && !file) back("Upload the upgraded resume before marking it delivered.");

  const now = new Date().toISOString();
  const newFile = file !== prev?.file;
  await setResumeService(userId, {
    status,
    file,
    changes,
    message,
    updatedAt: now,
    ...(status === "delivered" ? { deliveredAt: prev?.status === "delivered" && !newFile ? prev.deliveredAt : now } : {}),
  });
  if (newFile && prev?.file) await deleteUpload(user.id, prev.file);

  // Tell the learner when the resume is first delivered, or when a delivered resume is replaced.
  const base = await appUrl();
  if (status === "delivered" && (prev?.status !== "delivered" || newFile) && base) {
    await sendMail({ to: user.email, ...resumeReadyEmail(user.firstName, base) });
  }
  back();
}

// --- Enquiries -----------------------------------------------------------------

export async function updateEnquiryAction(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id");
  const status = str(fd, "status") as EnquiryStatus;
  const back = str(fd, "back");
  if (!ENQUIRY_STATUSES.includes(status)) redirect("/admin/enquiries");
  await updateEnquiry(id, { status, adminNote: str(fd, "note").slice(0, 300) || undefined });
  redirect(back.startsWith("/admin/enquiries") ? back : "/admin/enquiries");
}

// --- Site settings ---------------------------------------------------------------

export type SettingsState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function saveSettingsAction(_prev: SettingsState, fd: FormData): Promise<SettingsState> {
  await assertAdmin();
  const siteUrl = normalizeSiteUrl(str(fd, "siteUrl"));
  const next: SiteSettings = {
    siteUrl: siteUrl ?? "",
    organizationName: str(fd, "organizationName"),
    signatoryName: str(fd, "signatoryName"),
    signatoryTitle: str(fd, "signatoryTitle"),
    secondSignatoryName: str(fd, "secondSignatoryName"),
    secondSignatoryTitle: str(fd, "secondSignatoryTitle"),
    certificateNote: str(fd, "certificateNote"),
  };
  const e: Record<string, string> = {};
  if (siteUrl === null) e.siteUrl = "Enter a full address like https://www.yourdomain.com (no ?query or #hash).";
  if (next.organizationName.length < 2 || next.organizationName.length > 60) e.organizationName = "2–60 characters.";
  if (next.signatoryName.length < 2 || next.signatoryName.length > 40) e.signatoryName = "2–40 characters.";
  if (next.signatoryTitle.length < 2 || next.signatoryTitle.length > 50) e.signatoryTitle = "2–50 characters.";
  if (next.secondSignatoryName.length > 40) e.secondSignatoryName = "Up to 40 characters.";
  if (next.secondSignatoryName && (next.secondSignatoryTitle.length < 2 || next.secondSignatoryTitle.length > 50)) e.secondSignatoryTitle = "Add a title (2–50 characters).";
  if (next.certificateNote.length > 160) e.certificateNote = "Keep it under 160 characters so it fits on one line.";
  if (Object.keys(e).length) return { error: "Please fix the highlighted fields.", fieldErrors: e };
  if (!next.secondSignatoryName) next.secondSignatoryTitle = "";
  await saveSettings(next);
  return { ok: true };
}
