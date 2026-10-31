import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "./siteSettings";

/** File-backed settings for local development. */
const FILE = path.join(process.cwd(), "data", "settings.json");

/** Values exactly as saved by an admin (no environment fallbacks). */
export async function readStoredSettings(): Promise<SiteSettings> {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(await readFile(FILE, "utf8")) };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return { ...DEFAULT_SETTINGS };
    throw e;
  }
}

/** Saved settings, with the site URL falling back to the APP_URL environment variable. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const s = await readStoredSettings();
  return { ...s, siteUrl: s.siteUrl || (process.env.APP_URL ?? "").replace(/\/+$/, "") };
});

export async function saveSettings(next: SiteSettings) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(next, null, 2));
}
