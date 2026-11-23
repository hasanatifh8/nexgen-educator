/**
 * The 30-second course finder: questions, the matching logic and shareable links that pre-fill answers
 * (e.g. /find-my-course?role=primary&goal=early). Client-safe.
 */
import type { Category, CourseOutline, Level } from "./catalog";

export const FINDER_PATH = "/find-my-course";

export const FINDER_ROLES = {
  teacher: "Classroom teacher",
  primary: "Preschool / primary teacher",
  leader: "School leader",
  coach: "Instructional coach",
  student: "Student teacher",
} as const;
export type FinderRole = keyof typeof FINDER_ROLES;

export const FINDER_GOALS = {
  ai: { label: "Use AI in my teaching", category: "AI Tools for Teachers", hint: "Plan faster, differentiate smarter" },
  assessment: { label: "Design better assessments", category: "Assessment Design", hint: "Rubrics, questions, feedback" },
  classroom: { label: "Run a calmer classroom", category: "Classroom Management", hint: "Routines, behavior, inclusion" },
  early: { label: "Teach young children (playgroup–Class 5)", category: "Early Years & Primary", hint: "Play, phonics, hands-on maths" },
  unsure: { label: "Not sure yet", category: null, hint: "Show me the best starting points" },
} as const satisfies Record<string, { label: string; category: Category | null; hint: string }>;
export type FinderGoal = keyof typeof FINDER_GOALS;

export const FINDER_LEVELS = {
  new: { label: "I’m new to this", level: "Beginner" },
  basics: { label: "I know the basics", level: "Intermediate" },
  experienced: { label: "I’m experienced", level: "Advanced" },
} as const satisfies Record<string, { label: string; level: Level }>;
export type FinderLevel = keyof typeof FINDER_LEVELS;

export type FinderAnswers = { role?: FinderRole; goal?: FinderGoal; level?: FinderLevel };

const pick = <T extends string>(obj: Record<T, unknown>, v: unknown): T | undefined =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(obj, v) ? (v as T) : undefined;

/** Reads pre-filled answers from search params; unknown values are ignored. */
export function parseFinderAnswers(sp: Record<string, string | string[] | undefined>): FinderAnswers {
  const one = (k: string) => (typeof sp[k] === "string" ? sp[k] : undefined);
  return { role: pick(FINDER_ROLES, one("role")), goal: pick(FINDER_GOALS, one("goal")), level: pick(FINDER_LEVELS, one("level")) };
}

export function finderHref(a: FinderAnswers = {}) {
  const q = new URLSearchParams(Object.entries(a).filter(([, v]) => v) as [string, string][]).toString();
  return q ? `${FINDER_PATH}?${q}` : FINDER_PATH;
}

const RANK: Record<Level, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export type Recommendation<C> = { c: C; score: number; reasons: string[] };

/** Top three courses people can join today for these answers. */
export function recommendCourses<C extends Pick<CourseOutline, "category" | "level" | "price" | "lessonCount" | "launch">>(
  courses: C[],
  a: Required<FinderAnswers>,
): Recommendation<C>[] {
  const goal = FINDER_GOALS[a.goal];
  const level = FINDER_LEVELS[a.level].level;
  return courses
    .filter((c) => !c.launch)
    .map((c) => {
      const reasons: string[] = [];
      let score = 0;
      if (!goal.category || c.category === goal.category) {
        score += 4;
        if (goal.category) reasons.push("Matches your goal");
      }
      const gap = Math.abs(RANK[c.level] - RANK[level]);
      score += gap === 0 ? 3 : gap === 1 ? 1 : -1;
      if (gap === 0) reasons.push("Right level for you");
      if (c.price === 0) {
        score += a.role === "student" || !goal.category ? 1.5 : 0.5;
        reasons.push("Free");
      }
      if (a.role === "leader" && c.category === "Assessment Design") score += 1;
      if (a.role === "primary" && c.category === "Early Years & Primary") {
        score += 2;
        reasons.push("Made for early-years teachers");
      }
      if (a.role === "coach" && c.level !== "Beginner") score += 0.5;
      if (c.lessonCount > 0) score += 0.5;
      return { c, score, reasons };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, 3);
}

/** Courses picked in the finder travel to the register page as ?courses=a,b,c. */
export const MAX_PICKS = 3;
export const parsePickedIds = (raw: unknown): string[] =>
  [...new Set(String(typeof raw === "string" ? raw : "").split(",").map((s) => s.trim()).filter((s) => /^[a-z0-9-]{1,80}$/.test(s)))].slice(0, MAX_PICKS);
