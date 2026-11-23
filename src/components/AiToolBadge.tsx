import { SHOW_LOGOS, type AiResource } from "@/lib/aiResources";

/** The tool's logo (unmodified, brand colour) or, where logos aren't used, a neutral text monogram. */
export default function AiToolBadge({ r, size = "md" }: { r: AiResource; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-9 w-9 rounded-lg" : "h-12 w-12 rounded-xl";
  const icon = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  if (SHOW_LOGOS && r.logo) {
    return (
      <span className={`grid shrink-0 place-items-center bg-white ring-1 ring-slate-200 ${box}`}>
        <svg viewBox="0 0 24 24" className={icon} role="img" aria-label={`${r.tool} logo`}>
          <path d={r.logo.path} fill={r.logo.color} />
        </svg>
      </span>
    );
  }
  return (
    <span className={`grid shrink-0 place-items-center bg-slate-100 font-display font-bold text-slate-600 ring-1 ring-slate-200 ${box} ${r.mono.length > 2 ? (size === "sm" ? "text-[10px]" : "text-xs") : size === "sm" ? "text-xs" : "text-base"}`} aria-hidden="true">
      {r.mono}
    </span>
  );
}
