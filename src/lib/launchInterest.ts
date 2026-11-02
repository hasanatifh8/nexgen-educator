import { getJson, setJson, withLock } from "./store";

/**
 * Learners who tapped “Notify me” on a course that hasn’t opened yet: courseId → user ids.
 * Stored separately from user accounts (Postgres in production, data/launch-interest.json locally).
 */
const KEY = "launch-interest";
type Interest = Record<string, string[]>;

const readAll = async () => (await getJson<Interest>(KEY)) ?? {};

export async function getLaunchInterest() {
  return readAll();
}

/** Adds or removes the learner from a course's waiting list. Returns whether they are now on it. */
export async function toggleLaunchInterest(courseId: string, userId: string) {
  return withLock(KEY, async () => {
    const all = await readAll();
    const list = all[courseId] ?? [];
    const on = !list.includes(userId);
    all[courseId] = on ? [...list, userId] : list.filter((u) => u !== userId);
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
    return list;
  });
}
