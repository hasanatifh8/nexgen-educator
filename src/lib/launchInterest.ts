import { getJson, setJson, withLock } from "./store";

/**
 * Learners who tapped “Notify me” on a course that hasn’t opened yet: courseId → entries.
 * Stored separately from user accounts (Postgres in production, data/launch-interest.json locally).
 * Early entries were bare user ids; newer ones also record when the learner joined the list.
 */
const KEY = "launch-interest";
type Entry = { userId: string; at?: string };
type Stored = Record<string, (string | Entry)[]>;

const toEntry = (e: string | Entry): Entry => (typeof e === "string" ? { userId: e } : e);
const readAll = async (): Promise<Record<string, Entry[]>> =>
  Object.fromEntries(Object.entries((await getJson<Stored>(KEY)) ?? {}).map(([k, v]) => [k, v.map(toEntry)]));

/** courseId → user ids on its waiting list. */
export async function getLaunchInterest(): Promise<Record<string, string[]>> {
  return Object.fromEntries(Object.entries(await readAll()).map(([k, v]) => [k, v.map((e) => e.userId)]));
}

/** One course's waiting list, oldest first, with when each learner joined (if known). */
export async function getWaitlist(courseId: string): Promise<Entry[]> {
  return (await readAll())[courseId] ?? [];
}

/** Adds or removes the learner from a course's waiting list. Returns whether they are now on it. */
export async function toggleLaunchInterest(courseId: string, userId: string) {
  return withLock(KEY, async () => {
    const all = await readAll();
    const list = all[courseId] ?? [];
    const on = !list.some((e) => e.userId === userId);
    all[courseId] = on ? [...list, { userId, at: new Date().toISOString() }] : list.filter((e) => e.userId !== userId);
    if (!all[courseId].length) delete all[courseId];
    await setJson(KEY, all);
    return on;
  });
}

/** Empties a course's waiting list and returns who was on it (after they have been emailed). */
export async function takeLaunchInterest(courseId: string) {
  return withLock(KEY, async () => {
    const all = await readAll();
    const list = all[courseId] ?? [];
    delete all[courseId];
    await setJson(KEY, all);
    return list.map((e) => e.userId);
  });
}
