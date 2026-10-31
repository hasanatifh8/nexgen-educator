"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBadge, IconBook, IconPencil, IconPhone, IconShield, IconSignal, IconUsers } from "@/components/Icons";

const items = [
  { href: "/admin", label: "Dashboard", icon: IconSignal },
  { href: "/admin/enquiries", label: "Enquiries", icon: IconPhone },
  { href: "/admin/users", label: "Learners", icon: IconUsers },
  { href: "/admin/programs", label: "Programs & Exams", icon: IconBadge },
  { href: "/admin/courses", label: "Courses", icon: IconBook },
  { href: "/admin/settings", label: "Site & certificate", icon: IconPencil },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <p className="flex items-center gap-2 px-3 text-xs font-bold tracking-[0.15em] text-accent-strong uppercase">
        <IconShield className="h-4 w-4" /> Power Admin
      </p>
      <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-white hover:text-navy-900"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          );
        })}
      </nav>
      <Link href="/courses" className="mt-4 hidden px-3 text-xs font-semibold text-brand-ink hover:underline lg:block">
        View live courses page →
      </Link>
    </aside>
  );
}
