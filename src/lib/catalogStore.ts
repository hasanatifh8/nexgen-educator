import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { SEED_CATALOG, type Block, type Catalog, type Course, type Exam, type Module, type Program } from "./catalog";
import { EMPTY_CONTENT, SEED_CONTENT } from "./seedContent";
import { INTRO_AI_COURSE, INTRO_AI_PROGRAM } from "./seed/introAiCourse";

/** File-backed catalog for local development. Swap for a database before deploying. */
const CATALOG_FILE = path.join(process.cwd(), "data", "catalog.json");

/** Fills in course-content fields for seed data and for catalog files written before content existed. */
function withContent(c: Partial<Course> & Pick<Course, "id">): Course {
  const seed = SEED_CONTENT[c.id] ?? EMPTY_CONTENT;
  return {
    ...c,
    overview: c.overview ?? seed.overview,
    outcomes: c.outcomes ?? seed.outcomes,
    instructor: c.instructor ?? seed.instructor,
    modules: c.modules ?? structuredClone(seed.modules),
  } as Course;
}

async function readCatalog(): Promise<Catalog> {
  try {
    const raw = JSON.parse(await readFile(CATALOG_FILE, "utf8")) as Catalog;
    return { programs: raw.programs, courses: raw.courses.map(withContent) };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    // The free intro course leads the catalog as the featured starting point.
    const seeded: Catalog = {
      programs: [structuredClone(INTRO_AI_PROGRAM), ...structuredClone(SEED_CATALOG.programs)],
      courses: [structuredClone(INTRO_AI_COURSE), ...SEED_CATALOG.courses.map(withContent)],
    };
    await writeCatalog(seeded);
    return seeded;
  }
}

async function writeCatalog(catalog: Catalog) {
  await mkdir(path.dirname(CATALOG_FILE), { recursive: true });
  await writeFile(CATALOG_FILE, JSON.stringify(catalog, null, 2));
}

/** Memoized per request. */
export const getCatalog = cache(readCatalog);

export async function getProgram(id: string) {
  return (await getCatalog()).programs.find((p) => p.id === id);
}

export async function getCourse(id: string) {
  return (await getCatalog()).courses.find((c) => c.id === id);
}

export function slugId(title: string, taken: Set<string>) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "item";
  return taken.has(base) ? `${base}-${randomBytes(2).toString("hex")}` : base;
}

// --- Mutations (always read fresh, never the request-memoized copy) ----------

export async function upsertProgram(input: Omit<Program, "id" | "exam"> & { id?: string }) {
  const catalog = await readCatalog();
  const existing = input.id ? catalog.programs.find((p) => p.id === input.id) : undefined;
  if (input.id && !existing) return null;

  if (existing) {
    Object.assign(existing, { ...input, id: existing.id });
    // Keep course categories in sync with their program.
    catalog.courses.forEach((c) => c.programId === existing.id && (c.category = existing.category));
  } else {
    const id = slugId(input.title, new Set(catalog.programs.map((p) => p.id)));
    catalog.programs.push({ ...input, id, exam: { minutes: 15, passPercent: 70, questions: [] } });
  }
  await writeCatalog(catalog);
  return existing ?? catalog.programs.at(-1)!;
}

export async function deleteProgram(id: string) {
  const catalog = await readCatalog();
  if (catalog.courses.some((c) => c.programId === id)) return { error: "Move or delete this program’s courses first." };
  catalog.programs = catalog.programs.filter((p) => p.id !== id);
  await writeCatalog(catalog);
  return {};
}

type CourseInput = Omit<Course, "id" | "category" | "modules"> & { id?: string };

export async function upsertCourse(input: CourseInput) {
  const catalog = await readCatalog();
  const program = catalog.programs.find((p) => p.id === input.programId);
  if (!program) return null;
  const existing = input.id ? catalog.courses.find((c) => c.id === input.id) : undefined;
  if (input.id && !existing) return null;

  if (existing) {
    // Course details never touch the curriculum.
    Object.assign(existing, { ...input, id: existing.id, category: program.category, modules: existing.modules });
    if (!input.instructor) delete existing.instructor;
    if (!input.enrolled) delete existing.enrolled;
  } else {
    const id = slugId(input.title, new Set(catalog.courses.map((c) => c.id)));
    catalog.courses.push({ ...input, id, category: program.category, modules: [] });
  }
  await writeCatalog(catalog);
  return existing ?? catalog.courses.at(-1)!;
}

export async function deleteCourse(id: string) {
  const catalog = await readCatalog();
  catalog.courses = catalog.courses.filter((c) => c.id !== id);
  await writeCatalog(catalog);
}

export async function saveExam(programId: string, exam: Exam) {
  const catalog = await readCatalog();
  const program = catalog.programs.find((p) => p.id === programId);
  if (!program) return null;
  program.exam = exam;
  await writeCatalog(catalog);
  return program;
}

export type CurriculumInput = {
  id?: string;
  title: string;
  lessons: { id?: string; title: string; minutes: number; template?: Block[] }[];
}[];

/**
 * Saves module/lesson structure. Existing lessons (matched by id) keep their content;
 * new lessons start with the blocks of the template they were created from.
 */
export async function saveCurriculum(courseId: string, input: CurriculumInput) {
  const catalog = await readCatalog();
  const course = catalog.courses.find((c) => c.id === courseId);
  if (!course) return null;
  const oldLessons = new Map(course.modules.flatMap((m) => m.lessons).map((l) => [l.id, l]));
  const usedLessonIds = new Set<string>();
  const usedModuleIds = new Set<string>();
  const newId = (prefix: string, used: Set<string>) => {
    let id;
    do id = `${prefix}-${randomBytes(3).toString("hex")}`;
    while (used.has(id));
    return id;
  };

  course.modules = input.map((m): Module => {
    const moduleId = m.id && !usedModuleIds.has(m.id) ? m.id : newId("m", usedModuleIds);
    usedModuleIds.add(moduleId);
    return {
      id: moduleId,
      title: m.title,
      lessons: m.lessons.map((l) => {
        const prev = l.id ? oldLessons.get(l.id) : undefined;
        const id = prev && !usedLessonIds.has(prev.id) ? prev.id : newId("l", usedLessonIds);
        usedLessonIds.add(id);
        return { id, title: l.title, minutes: l.minutes, blocks: prev?.blocks ?? l.template ?? [] };
      }),
    };
  });
  await writeCatalog(catalog);
  return course;
}

export async function saveLesson(courseId: string, lessonId: string, patch: { title: string; minutes: number; blocks: Block[] }) {
  const catalog = await readCatalog();
  const course = catalog.courses.find((c) => c.id === courseId);
  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  if (!course || !lesson) return null;
  Object.assign(lesson, patch);
  await writeCatalog(catalog);
  return lesson;
}
