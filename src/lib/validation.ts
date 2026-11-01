/** Field rules shared by browser-side checks (instant feedback) and server actions (the source of truth). */

export const LIMITS = { email: 254, password: 128, name: 50, fullName: 80, city: 60 } as const;

/** One @, no spaces, and a domain ending in a real-looking TLD (rejects "a@b.c" and "name@site"). */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-zA-Z]{2,}$/;
/** Letters in any script (Hindi, Tamil, …), plus spaces, dots, apostrophes and hyphens between them. */
const NAME_RE = /^\p{L}[\p{L}\p{M} .'-]*$/u;
const PLACE_RE = /^\p{L}[\p{L}\p{M} .'()-]*$/u;

export const isEmail = (v: string) => v.length <= LIMITS.email && EMAIL_RE.test(v);

/** Returns an error message, or undefined when the name is valid. */
export function nameError(v: string, label: string, { min = 1, max = LIMITS.name as number } = {}) {
  const s = v.trim();
  if (s.length < min) return `Enter your ${label}.`;
  if (s.length > max) return `Keep your ${label} under ${max} characters.`;
  if (!NAME_RE.test(s)) return `Your ${label} can only contain letters, spaces, dots, apostrophes and hyphens.`;
}

export function placeError(v: string, label: string) {
  const s = v.trim();
  if (s.length < 2) return `Enter your ${label}.`;
  if (s.length > LIMITS.city) return `Keep your ${label} under ${LIMITS.city} characters.`;
  if (!PLACE_RE.test(s)) return `Enter a valid ${label} (letters only).`;
}
