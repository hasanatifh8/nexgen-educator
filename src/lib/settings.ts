import { cache } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "./siteSettings";
import { getJson, setJson } from "./store";

/** Site & certificate settings (Postgres in production, data/settings.json locally — see ./store). */
const KEY = "settings";

/** Values exactly as saved by an admin (no environment fallbacks). */
export async function readStoredSettings(): Promise<SiteSettings> {
  return { ...DEFAULT_SETTINGS, ...(await getJson<Partial<SiteSettings>>(KEY)) };
}

/** Saved settings, with the site URL falling back to the APP_URL environment variable. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const s = await readStoredSettings();
  return { ...s, siteUrl: s.siteUrl || (process.env.APP_URL ?? "").replace(/\/+$/, "") };
});

export async function saveSettings(next: SiteSettings) {
  await setJson(KEY, next);
}
