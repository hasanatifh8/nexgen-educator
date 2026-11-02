"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { CATEGORIES, LEVELS, todayIST, type Category, type ExamQuestion, type Level } from "@/lib/catalog";
import { takeLaunchInterest } from "@/lib/launchInterest";
import { deleteCourse, setCourseDisabled, setCourseLaunch, deleteProgram, getCourse, getProgram, saveCurriculum, saveExam, saveLesson, upsertCourse, upsertProgram, type CurriculumInput } from "@/lib/catalogStore";
import { validateBlocks } from "@/lib/contentValidation";
import { templateById } from "@/lib/lessonTemplates";
import { getCurrentUser } from "@/lib/dal";
import { saveSettings } from "@/lib/settings";
import { normalizeSiteUrl, type SiteSettings } from "@/lib/siteSettings";
import { formatINR } from "@/lib/catalog";
import { isEmail } from "@/lib/validation";
import { fmtDate } from "@/lib/learner";
import { NOTES_OWNER, deleteUpload, saveUpload } from "@/lib/uploads";
import { MAX_NOTE_BYTES, MAX_NOTE_LABEL } from "@/lib/uploadLimits";
import { createNote, deleteNote, getNote, setNoteAssignees, setUserNotes, updateNote } from "@/lib/notes";
import { createPromoCode, deletePromoCode, setPromoActive } from "@/lib/promo";
import { PROMO_CODE_RE, normalizePromoCode } from "@/lib/enrollment";
import { PAYMENT_STATUSES, RESUME_STATUSES, findUserById, listUsers, setAssignedCourses, setPayment, setResumeService, setVerification, type PaymentStatus, type ResumeStatus } from "@/lib/users";
import { getCatalog } from "@/lib/catalogStore";
import { courseApprovedEmail, courseOpenEmail, notesSharedEmail, paymentReceivedEmail, resumeReadyEmail } from "@/lib/emails";
import { emailBrand, sendMail } from "@/lib/mailer";
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

  const e: Record<string, string> = {};
  if (title.length < 3 || title.length > 100) e.title = "Title must be 3–100 characters.";
  if (!CATEGORIES.includes(category)) e.category = "Choose a category.";
  if (!LEVELS.includes(level)) e.level = "Choose a level.";
  if (description.length < 10 || description.length > 300) e.description = "Description must be 10–300 characters.";
  if (Object.keys(e).length) return { error: "Please fix the highlighted fields.", fieldErrors: e };

  const saved = await upsertProgram({ id, title, category, level, description });
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
  const price = str(fd, "pricing") === "free" ? 0 : Number(str(fd, "price"));
  const availability = str(fd, "availability");
  const launchOn = str(fd, "launchOn");

  const e: Record<string, string> = {};
  if (title.length < 3 || title.length > 120) e.title = "Title must be 3–120 characters.";
  if (overview.length > 5000) e.overview = "Keep the overview under 5000 characters.";
  if (outcomes.length > 12 || outcomes.some((o) => o.length > 200)) e.outcomes = "Up to 12 outcomes, 200 characters each.";
  if (instructorName.length > 80 || instructorTitle.length > 80) e.instructorName = "Keep instructor details under 80 characters.";
  if (!instructorName && instructorTitle) e.instructorName = "Add the instructor’s name.";
  if (!(await getProgram(programId))) e.programId = "Choose a certification program.";
  if (!LEVELS.includes(level)) e.level = "Choose a level.";
  if (!Number.isFinite(hours) || hours < 0.5 || hours > 200) e.hours = "Enter a duration from 0.5 to 200 hours.";
  if (str(fd, "pricing") !== "free" && (!Number.isInteger(price) || price < 1 || price > 100000))
    e.price = "Enter a whole-rupee fee from ₹1 to ₹1,00,000 (before GST), or choose Free.";
  if (blurb.length < 10 || blurb.length > 300) e.blurb = "Description must be 10–300 characters.";
  if (enrolled.length > 12) e.enrolled = "Keep this short, e.g. 2.4k.";
  if (availability === "date" && (!/^\d{4}-\d{2}-\d{2}$/.test(launchOn) || Number.isNaN(Date.parse(launchOn)))) e.launchOn = "Choose the date enrollment opens.";
  else if (availability === "date" && launchOn <= todayIST()) e.launchOn = "Choose a date after today, or select “Open now”.";
  if (Object.keys(e).length) return { error: "Please fix the highlighted fields.", fieldErrors: e };
  const launch = availability === "soon" ? {} : availability === "date" ? { on: launchOn } : undefined;

  const saved = await upsertCourse({
    id, title, programId, level, blurb, hours, price, overview, outcomes,
    ...(launch ? { launch } : {}),
    ...(enrolled ? { enrolled } : {}),
    ...(instructorName ? { instructor: { name: instructorName, title: instructorTitle } } : {}),
  });
  if (!saved) return { error: "That course no longer exists." };
  // New courses go straight to the curriculum builder.
  redirect(id ? `/admin/courses?saved=${encodeURIComponent(saved.title)}` : `/admin/courses/${saved.id}/content?created=1`);
}

/** Course list: open an upcoming course for enrollment right away. */
export async function openCourseNowAction(fd: FormData) {
  await assertAdmin();
  const course = await setCourseLaunch(str(fd, "id"), null);
  if (!course) redirect("/admin/courses");
  redirect(`/admin/courses?opened=${encodeURIComponent(course.title)}`);
}

/** Emails everyone who tapped “Notify me” once a course is open, then clears its waiting list. */
export async function emailWaitingListAction(fd: FormData) {
  await assertAdmin();
  const course = await getCourse(str(fd, "id"));
  if (!course || course.launch || course.disabled) redirect("/admin/courses");
  const brand = await emailBrand();
  if (!brand) redirect(`/admin/courses?error=${encodeURIComponent("Set the site address in Site & certificate before sending emails.")}`);
  const ids = await takeLaunchInterest(course.id);
  let sent = 0;
  for (const id of ids) {
    const u = await findUserById(id);
    if (!u || u.assignedCourses.includes(course.id)) continue;
    await sendMail({ to: u.email, ...courseOpenEmail(u.firstName, brand, { id: course.id, title: course.title, paid: course.price > 0 }) });
    sent++;
  }
  redirect(`/admin/courses?notified=${sent}&course=${encodeURIComponent(course.title)}`);
}

export async function setCourseDisabledAction(fd: FormData) {
  await assertAdmin();
  const disable = str(fd, "disabled") === "1";
  const course = await setCourseDisabled(str(fd, "id"), disable);
  if (!course) redirect("/admin/courses");
  redirect(`/admin/courses?${disable ? "disabled" : "enabled"}=${encodeURIComponent(course.title)}`);
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
  const brand = await emailBrand();
  if (added.length && brand) {
    await sendMail({ to: before.email, ...courseApprovedEmail(before.firstName, brand, added) });
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
  const courseId = str(fd, "courseId");
  const status = str(fd, "status") as PaymentStatus;
  const back = (error?: string) => redirect(`/admin/users/${userId}${error ? `?error=${encodeURIComponent(error)}` : "?saved=payment"}#payments`);
  const [user, course] = await Promise.all([findUserById(userId), getCourse(courseId)]);
  if (!user || !course) redirect("/admin/users");
  if (!PAYMENT_STATUSES.includes(status)) back("Choose a payment status.");

  const amountRaw = str(fd, "amount");
  const amount = amountRaw ? Number(amountRaw) : undefined;
  const reference = str(fd, "reference").slice(0, 60) || undefined;
  const paidOn = str(fd, "paidAt");
  const paid = status === "paid";
  if (paid && (amount === undefined || !Number.isFinite(amount) || amount <= 0 || amount > 100_000 || Math.round(amount * 100) !== amount * 100))
    back("Enter the amount received in rupees (up to ₹1,00,000, at most 2 decimals).");
  if (paid && reference && !/^[\w\-/ .]{4,60}$/.test(reference)) back("The transaction reference can only contain letters, numbers, spaces and - / . (4–60 characters).");
  if (paid && paidOn) {
    const d = new Date(`${paidOn}T12:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(paidOn) || Number.isNaN(d.getTime())) back("Enter a valid payment date.");
    if (d.getTime() > Date.now() + 24 * 60 * 60 * 1000) back("The payment date can’t be in the future.");
    if (d.getUTCFullYear() < 2024) back("Check the payment date — it looks too old.");
  }

  const paidAt = paid ? (paidOn ? new Date(`${paidOn}T12:00:00Z`) : new Date()).toISOString() : undefined;
  await setPayment(userId, courseId, { status, ...(paid ? { amount, reference, paidAt } : {}), updatedAt: new Date().toISOString() });

  // Receipt email only when the payment is newly confirmed.
  const brand = await emailBrand();
  const previous = user.payments?.[courseId] ?? user.payments?.[course.programId];
  if (paid && previous?.status !== "paid" && brand) {
    await sendMail({
      to: user.email,
      ...paymentReceivedEmail(user.firstName, brand, { courseTitle: course.title, amount: formatINR(amount ?? 0), reference, date: fmtDate(paidAt!) }),
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
  const brand = await emailBrand();
  if (status === "delivered" && (prev?.status !== "delivered" || newFile) && brand) {
    await sendMail({ to: user.email, ...resumeReadyEmail(user.firstName, brand) });
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
    supportEmail: str(fd, "supportEmail").toLowerCase(),
    supportPhone: str(fd, "supportPhone"),
  };
  const e: Record<string, string> = {};
  if (siteUrl === null) e.siteUrl = "Enter a full address like https://www.yourdomain.com (no ?query or #hash).";
  if (next.organizationName.length < 2 || next.organizationName.length > 60) e.organizationName = "2–60 characters.";
  if (next.signatoryName.length < 2 || next.signatoryName.length > 40) e.signatoryName = "2–40 characters.";
  if (next.signatoryTitle.length < 2 || next.signatoryTitle.length > 50) e.signatoryTitle = "2–50 characters.";
  if (next.secondSignatoryName.length > 40) e.secondSignatoryName = "Up to 40 characters.";
  if (next.secondSignatoryName && (next.secondSignatoryTitle.length < 2 || next.secondSignatoryTitle.length > 50)) e.secondSignatoryTitle = "Add a title (2–50 characters).";
  if (next.supportEmail && !isEmail(next.supportEmail)) e.supportEmail = "Enter a valid email address, or leave it blank.";
  if (next.supportPhone && !/^\+?[\d\s-]{8,20}$/.test(next.supportPhone)) e.supportPhone = "Enter a phone number using digits, spaces, + or - (8–20 characters).";
  if (next.certificateNote.length > 160) e.certificateNote = "Keep it under 160 characters so it fits on one line.";
  if (Object.keys(e).length) return { error: "Please fix the highlighted fields.", fieldErrors: e };
  if (!next.secondSignatoryName) next.secondSignatoryTitle = "";
  await saveSettings(next);
  return { ok: true };
}

// --- PDF notes -------------------------------------------------------------------

const NOTE_LIMIT = { bytes: MAX_NOTE_BYTES, label: MAX_NOTE_LABEL };

async function noteDetails(fd: FormData, back: (error: string) => never) {
  const title = str(fd, "title");
  const description = str(fd, "description") || undefined;
  const courseId = str(fd, "courseId") || undefined;
  if (title.length < 3 || title.length > 120) back("Give the notes a title of 3–120 characters.");
  if (description && description.length > 500) back("Keep the description under 500 characters.");
  if (courseId && !(await getCourse(courseId))) back("Choose a course from the list, or leave it blank.");
  return { title, description, courseId };
}

/** Emails each learner once, listing the notes newly shared with them. */
async function emailNewNotes(byUser: Map<string, { title: string }[]>) {
  const brand = await emailBrand();
  if (!brand) return;
  for (const [userId, notes] of byUser) {
    const user = await findUserById(userId);
    if (user && notes.length) await sendMail({ to: user.email, ...notesSharedEmail(user.firstName, brand, notes) });
  }
}

export async function createNoteAction(fd: FormData) {
  await assertAdmin();
  const back = (error: string): never => redirect(`/admin/notes?error=${encodeURIComponent(error)}`);
  const details = await noteDetails(fd, back);
  const upload = fd.get("file");
  const r = await saveUpload(NOTES_OWNER, "note", upload instanceof File ? upload : null, ["pdf"], "PDF", NOTE_LIMIT);
  if ("error" in r) back(r.error);
  else {
    const note = await createNote({ ...details, file: r.file });
    redirect(`/admin/notes/${note.id}?saved=new`);
  }
}

export async function updateNoteAction(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id");
  const back = (error: string): never => redirect(`/admin/notes/${id}?error=${encodeURIComponent(error)}`);
  if (!(await getNote(id))) redirect("/admin/notes");
  const details = await noteDetails(fd, back);
  const upload = fd.get("file");
  let file;
  if (upload instanceof File && upload.size > 0) {
    const r = await saveUpload(NOTES_OWNER, "note", upload, ["pdf"], "PDF", NOTE_LIMIT);
    if ("error" in r) back(r.error);
    else file = r.file;
  }
  await updateNote(id, { ...details, file });
  redirect(`/admin/notes/${id}?saved=details`);
}

export async function deleteNoteAction(fd: FormData) {
  await assertAdmin();
  await deleteNote(str(fd, "id"));
  redirect("/admin/notes?deleted=1");
}

/** From a note's page: choose which learners can open it. */
export async function assignNoteAction(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id");
  const learners = new Set((await listUsers()).map((u) => u.id));
  const ids = fd.getAll("userIds").map(String).filter((u) => learners.has(u));
  const r = await setNoteAssignees(id, ids);
  if (!r) redirect("/admin/notes");
  if (fd.get("notify") === "on") await emailNewNotes(new Map(r.added.map((u) => [u, [{ title: r.note.title }]])));
  redirect(`/admin/notes/${id}?saved=assigned`);
}

/** From a learner's page: choose which notes they can open. */
export async function assignUserNotesAction(fd: FormData) {
  await assertAdmin();
  const userId = str(fd, "userId");
  if (!(await findUserById(userId))) redirect("/admin/users");
  const added = await setUserNotes(userId, fd.getAll("noteIds").map(String));
  if (fd.get("notify") === "on") await emailNewNotes(new Map([[userId, added.map((n) => ({ title: n.title }))]]));
  redirect(`/admin/users/${userId}?saved=notes#notes`);
}

// --- Promo codes -----------------------------------------------------------------

export async function createPromoAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const code = normalizePromoCode(str(fd, "code"));
  const percent = Number(str(fd, "percent"));
  const expiresOn = str(fd, "expiresOn") || undefined;
  const maxUsesRaw = str(fd, "maxUses");
  const maxUses = maxUsesRaw ? Number(maxUsesRaw) : undefined;
  const note = str(fd, "note").slice(0, 120) || undefined;

  const e: Record<string, string> = {};
  if (!PROMO_CODE_RE.test(code)) e.code = "Use 3–20 letters, digits, dashes or underscores, e.g. JACK50.";
  if (!Number.isInteger(percent) || percent < 1 || percent > 100) e.percent = "Enter a whole number from 1 to 100.";
  if (expiresOn && (!/^\d{4}-\d{2}-\d{2}$/.test(expiresOn) || Number.isNaN(Date.parse(expiresOn)))) e.expiresOn = "Choose a valid date.";
  if (maxUses !== undefined && (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 100000)) e.maxUses = "Enter a whole number of 1 or more, or leave it blank.";
  if (Object.keys(e).length) return { error: "Please fix the highlighted fields.", fieldErrors: e };

  const error = await createPromoCode({ code, percent, expiresOn, maxUses, note });
  if (error) return { error, fieldErrors: { code: error } };
  redirect(`/admin/promo-codes?saved=${encodeURIComponent(code)}`);
}

export async function setPromoActiveAction(fd: FormData) {
  await assertAdmin();
  const code = str(fd, "code");
  const active = str(fd, "active") === "1";
  await setPromoActive(code, active);
  redirect(`/admin/promo-codes?${active ? "enabled" : "paused"}=${encodeURIComponent(code)}`);
}

export async function deletePromoAction(fd: FormData) {
  await assertAdmin();
  await deletePromoCode(str(fd, "id"));
  redirect("/admin/promo-codes?deleted=1");
}
