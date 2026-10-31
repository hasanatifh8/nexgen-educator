import type { StoredUser } from "@/lib/users";

export function ProfileBadge({ user }: { user: StoredUser }) {
  if (!user.profile) return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">Profile incomplete</span>;
  const v = user.verification.status;
  const cls = v === "verified" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : v === "rejected" ? "bg-red-50 text-red-700 ring-red-200" : "bg-amber-50 text-amber-700 ring-amber-200";
  const label = v === "verified" ? "Verified" : v === "rejected" ? "Needs changes" : "Awaiting review";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${cls}`}>{label}</span>;
}
