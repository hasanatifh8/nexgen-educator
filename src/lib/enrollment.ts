/** Paid-course enrollment without a payment gateway: the learner picks when our representative should call. */

export const CALL_SLOTS = { morning: "Morning (10 am – 1 pm)", afternoon: "Afternoon (1 pm – 4 pm)", evening: "Evening (4 pm – 7 pm)" } as const;
export type CallSlot = keyof typeof CALL_SLOTS;
/** When and where our representative should call before a paid course is assigned (set at checkout). */
export type CallPreference = { phone: string; slot: CallSlot; note?: string };

/** A promo code applied at checkout, saved with the learner so the discounted fee survives assignment. */
export type AppliedPromo = { code: string; percent: number };

/** Codes are case-insensitive and stored upper-case: letters, digits, dashes and underscores. */
export const normalizePromoCode = (v: string) => v.trim().toUpperCase().replace(/\s+/g, "");
export const PROMO_CODE_RE = /^[A-Z0-9_-]{3,20}$/;

/** Course fee before GST after a percentage discount, rounded to whole rupees. */
export const discountedFee = (price: number, percent = 0) => Math.max(0, Math.round((price * (100 - percent)) / 100));
