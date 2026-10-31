import Link from "next/link";

type LogoProps = { light?: boolean; className?: string };

/** Graduation cap fused with a digital circuit motif. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ng-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="#0f2a4a" />
      {/* cap */}
      <path d="M20 9 5 15.5 20 22l15-6.5L20 9Z" fill="url(#ng-grad)" />
      <path d="M11 18.5v5.5c0 2.2 4 4 9 4s9-1.8 9-4v-5.5L20 22l-9-3.5Z" fill="#fff" opacity=".92" />
      {/* circuit tassel */}
      <path d="M33 16v6h-3v5" stroke="#f97316" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30" cy="28.5" r="1.8" fill="#f97316" />
      <circle cx="16" cy="25" r="1" fill="#0ea5e9" />
      <circle cx="20" cy="26" r="1" fill="#0ea5e9" />
      <circle cx="24" cy="25" r="1" fill="#0ea5e9" />
    </svg>
  );
}

export default function Logo({ light = false, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label="NextGen Educator home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-bold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
          NextGen <span className="text-brand">Educator</span>
        </span>
        <span className={`mt-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase ${light ? "text-slate-400" : "text-slate-500"}`}>
          Train. Test. Certify.
        </span>
      </span>
    </Link>
  );
}
