import { PROMO_CODE_RE, normalizePromoCode, type AppliedPromo } from "./enrollment";
import { getJson, setJson, withLock } from "./store";

/**
 * Promo codes created by admins, e.g. JACK50 = 50% off a paid course fee. Stored as one document
 * (Postgres in production, data/promo-codes.json locally — see ./store), separate from user accounts.
 */
const KEY = "promo-codes";

export type PromoCode = {
  code: string;
  percent: number;
  active: boolean;
  /** Last day the code works (YYYY-MM-DD, India time); none = no expiry. */
  expiresOn?: string;
  /** Maximum number of enrollments that can use it; none = unlimited. */
  maxUses?: number;
  /** Enrollments that have used it. */
  uses: number;
  /** Who or what the code is for, e.g. “Jack’s referrals”. Admin-only. */
  note?: string;
  createdAt: string;
};

async function readAll(): Promise<PromoCode[]> {
  return (await getJson<PromoCode[]>(KEY)) ?? [];
}

export async function listPromoCodes() {
  return (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Today in India, as YYYY-MM-DD, so a code “valid until 31 Dec” works all of 31 Dec IST. */
const todayIST = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

export type PromoCheck = { ok: true; promo: AppliedPromo } | { ok: false; error: string };

/** Checks a code a learner typed. Does not count a use — see recordPromoUse. */
export async function checkPromoCode(raw: string): Promise<PromoCheck> {
  const code = normalizePromoCode(raw);
  if (!code) return { ok: false, error: "Enter a promo code." };
  const promo = PROMO_CODE_RE.test(code) ? (await readAll()).find((p) => p.code === code) : undefined;
  if (!promo || !promo.active) return { ok: false, error: "This promo code is not valid." };
  if (promo.expiresOn && promo.expiresOn < todayIST()) return { ok: false, error: "This promo code has expired." };
  if (promo.maxUses && promo.uses >= promo.maxUses) return { ok: false, error: "This promo code has reached its usage limit." };
  return { ok: true, promo: { code: promo.code, percent: promo.percent } };
}

/** Returns an error message, or null once the code is saved. */
export async function createPromoCode(input: Pick<PromoCode, "code" | "percent" | "expiresOn" | "maxUses" | "note">): Promise<string | null> {
  return withLock(KEY, async () => {
    const list = await readAll();
    if (list.some((p) => p.code === input.code)) return "A promo code with this name already exists.";
    await setJson(KEY, [...list, { ...input, active: true, uses: 0, createdAt: new Date().toISOString() }]);
    return null;
  });
}

export async function setPromoActive(code: string, active: boolean) {
  await withLock(KEY, async () => {
    const list = await readAll();
    const p = list.find((x) => x.code === code);
    if (p) {
      p.active = active;
      await setJson(KEY, list);
    }
  });
}

export async function deletePromoCode(code: string) {
  await withLock(KEY, async () => {
    await setJson(KEY, (await readAll()).filter((p) => p.code !== code));
  });
}

/** Counts one enrollment against a code. Returns false if it became invalid in the meantime. */
export async function recordPromoUse(code: string) {
  return withLock(KEY, async () => {
    const list = await readAll();
    const p = list.find((x) => x.code === code);
    if (!p || !p.active || (p.expiresOn && p.expiresOn < todayIST()) || (p.maxUses && p.uses >= p.maxUses)) return false;
    p.uses += 1;
    await setJson(KEY, list);
    return true;
  });
}
