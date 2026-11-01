"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBadge, IconBook, IconFile, IconHome, IconUser, IconWallet } from "@/components/Icons";

export const PORTAL_LINKS = [
  { href: "/my-learning", label: "Overview", icon: IconHome },
  { href: "/my-learning/courses", label: "My courses", icon: IconBook },
  { href: "/my-learning/certificates", label: "Certificates", icon: IconBadge },
  { href: "/my-learning/resume", label: "Resume upgrade", icon: IconFile },
  { href: "/my-learning/payments", label: "Payments", icon: IconWallet },
  { href: "/my-learning/profile", label: "My profile", icon: IconUser },
];

export default function PortalNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Learner portal" className="flex gap-1 overflow-x-auto lg:flex-col">
      {PORTAL_LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/my-learning" ? pathname === href : pathname.startsWith(href);
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
