"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBadge, IconBook, IconFile, IconHome, IconNotes, IconUser, IconWallet } from "@/components/Icons";

export const PORTAL_LINKS = [
  { href: "/my-learning", label: "Overview", short: "Home", icon: IconHome },
  { href: "/my-learning/courses", label: "My courses", short: "Courses", icon: IconBook },
  { href: "/my-learning/notes", label: "My notes", short: "Notes", icon: IconNotes },
  { href: "/my-learning/certificates", label: "Certificates", short: "Certs", icon: IconBadge },
  { href: "/my-learning/resume", label: "Resume upgrade", short: "Resume", icon: IconFile },
  { href: "/my-learning/payments", label: "Payments", short: "Payments", icon: IconWallet },
  { href: "/my-learning/profile", label: "My profile", short: "Profile", icon: IconUser },
];

const isActive = (pathname: string, href: string) => (href === "/my-learning" ? pathname === href : pathname.startsWith(href));

/** Phones: an app-style tab bar fixed to the bottom of the screen, within thumb reach. */
export function PortalTabBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Learner portal" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-7">
        {PORTAL_LINKS.map(({ href, short, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 px-0.5 text-[10px] leading-none font-semibold tracking-tight min-[380px]:text-[11px] ${active ? "text-brand-ink" : "text-slate-500"}`}
              >
                <span className={`grid h-7 w-10 place-items-center rounded-full transition-colors ${active ? "bg-sky-100" : ""}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="max-w-full">{short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function PortalNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Learner portal sections" className="hidden flex-col gap-1 lg:flex">
      {PORTAL_LINKS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              active ? "bg-white text-navy-900 shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
