const IST = "Asia/Kolkata";

/** e.g. "31 Oct 2026, 10:42 am" in Indian Standard Time. */
export const formatIST = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: IST, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

export function timeAgo(iso: string, now: number) {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

/** Request time for "x min ago" labels — server components render once per request (after connection()). */
export const requestTime = () => Date.now();
