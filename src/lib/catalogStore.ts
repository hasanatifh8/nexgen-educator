import { randomBytes } from "node:crypto";
import { cache } from "react";
import { SEED_CATALOG, type Block, type Catalog, type Course, type Exam, type Module, type Program } from "./catalog";
import { EMPTY_CONTENT, SEED_CONTENT } from "./seedContent";
import { INTRO_AI_COURSE, INTRO_AI_PROGRAM } from "./seed/introAiCourse";
import { JOYFUL_COURSE, JOYFUL_PROGRAM } from "./seed/joyfulEarlyYears";
import { SCIENCE_COURSE, SCIENCE_PROGRAM } from "./seed/scienceAiEducators";
import { getJson, setJson, withLock } from "./store";

/** Programs and courses, stored as one document (Postgres in production, data/catalog.json locally — see ./store). */
const CATALOG_KEY = "catalog";

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

/**
 * Fees are set per course. Catalogs saved before that only priced programs, so a course without a fee
 * inherits its program's old price. A program's price is always the total of its courses' fees.
 */
function withPricing(programs: Program[], courses: (Partial<Course> & Pick<Course, "id" | "programId">)[]): Catalog {
  const priced = courses.map((c) => withContent({ ...c, price: c.price ?? programs.find((p) => p.id === c.programId)?.price ?? 0 }));
  return {
    programs: programs.map((p) => ({ ...p, price: priced.filter((c) => c.programId === p.id && !c.disabled).reduce((n, c) => n + c.price, 0) })),
    courses: priced,
  };
}

/**
 * Courses shipped in code after the site went live. Each pack is added to the stored catalog exactly once
 * (recorded under PACKS_KEY), so deploying makes it appear on the live site, while later admin edits —
 * including deleting it — are never undone. Only the catalog changes; user accounts are not touched.
 */
const PACKS_KEY = "catalog-packs";
const PACKS: { id: string; programs: Program[]; courses: Course[] }[] = [
  { id: "joyful-early-years-2026-11", programs: [JOYFUL_PROGRAM], courses: [JOYFUL_COURSE] },
  { id: "science-educators-2026-11", programs: [SCIENCE_PROGRAM], courses: [SCIENCE_COURSE] },
];

/** Once a server instance has seen every pack installed, it stops checking. */
let packsInstalled = false;

async function installPacks(raw: Catalog): Promise<Catalog> {
  if (packsInstalled) return raw;
  const installed = (await getJson<string[]>(PACKS_KEY)) ?? [];
  if (PACKS.every((p) => installed.includes(p.id))) {
    packsInstalled = true;
    return raw;
  }
  return withLock(PACKS_KEY, async () => {
    const done = (await getJson<string[]>(PACKS_KEY)) ?? [];
    const catalog = (await getJson<Catalog>(CATALOG_KEY)) ?? raw;
    for (const pack of PACKS.filter((p) => !done.includes(p.id))) {
      for (const p of pack.programs) if (!catalog.programs.some((x) => x.id === p.id)) catalog.programs.push(structuredClone(p));
      for (const c of pack.courses) if (!catalog.courses.some((x) => x.id === c.id)) catalog.courses.push(structuredClone(c));
      done.push(pack.id);
    }
    await setJson(CATALOG_KEY, catalog);
    await setJson(PACKS_KEY, done);
    packsInstalled = true;
    return catalog;
  });
}

async function readCatalog(): Promise<Catalog> {
  const raw = await getJson<Catalog>(CATALOG_KEY);
  if (raw) {
    const catalog = await installPacks(raw);
    return withPricing(catalog.programs, catalog.courses);
  }
  // The free intro course leads the catalog as the featured starting point.
  const seeded = withPricing(
    [structuredClone(INTRO_AI_PROGRAM), ...structuredClone(SEED_CATALOG.programs), ...PACKS.flatMap((p) => structuredClone(p.programs))],
    [structuredClone(INTRO_AI_COURSE), ...structuredClone(SEED_CATALOG.courses), ...PACKS.flatMap((p) => structuredClone(p.courses))],
  );
  await writeCatalog(seeded);
  await setJson(PACKS_KEY, PACKS.map((p) => p.id));
  return seeded;
}

async function writeCatalog(catalog: Catalog) {
  await setJson(CATALOG_KEY, catalog);
}

/** Memoized per request. */
export const getCatalog = cache(readCatalog);

/**
 * What the public site shows: disabled courses removed, and programs with no course on offer hidden.
 * Memoized per request.
 */
export const getPublicCatalog = cache(async (): Promise<Catalog> => {
  const { programs, courses } = await getCatalog();
  const offered = courses.filter((c) => !c.disabled);
  return { programs: programs.filter((p) => offered.some((c) => c.programId === p.id)), courses: offered };
});

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

export async function upsertProgram(input: Omit<Program, "id" | "exam" | "price"> & { id?: string }) {
  const catalog = await readCatalog();
  const existing = input.id ? catalog.programs.find((p) => p.id === input.id) : undefined;
  if (input.id && !existing) return null;

  if (existing) {
    Object.assign(existing, { ...input, id: existing.id });
    // Keep course categories in sync with their program.
    catalog.courses.forEach((c) => c.programId === existing.id && (c.category = existing.category));
  } else {
    const id = slugId(input.title, new Set(catalog.programs.map((p) => p.id)));
    catalog.programs.push({ ...input, id, price: 0, exam: { minutes: 15, passPercent: 70, questions: [] } });
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

export async function setCourseDisabled(id: string, disabled: boolean) {
  const catalog = await readCatalog();
  const course = catalog.courses.find((c) => c.id === id);
  if (!course) return null;
  if (disabled) course.disabled = true;
  else delete course.disabled;
  await writeCatalog(catalog);
  return course;
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
