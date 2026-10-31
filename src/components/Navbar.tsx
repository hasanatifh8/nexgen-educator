"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/actions/auth";
import Logo from "./Logo";
import { IconLogout, IconMenu, IconShield, IconX } from "./Icons";

const links = [
  { label: "Courses", href: "/courses" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Practice Tests", href: "/#practice-tests" },
  { label: "For Institutions", href: "/#institutions" },
];

export type NavUser = { firstName: string; lastName: string; plan: "free" | "pro"; isAdmin?: boolean } | null;

function Avatar({ user }: { user: NonNullable<NavUser> }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-teal text-sm font-bold text-white">
      {user.firstName[0]}{user.lastName[0]}
    </span>
  );
}

type NavbarProps = { user: NavUser; loading?: boolean };

export default function Navbar(props: NavbarProps) {
  return <NavbarView {...props} pathname={usePathname()} />;
}

/** URL-free variant, so the loading placeholder can render outside any Suspense boundary. */
export function NavbarView({ user, loading = false, pathname }: NavbarProps & { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Signed-in learners also get their dashboard in the menu.
  const menu = user && !user.isAdmin ? [{ label: "My Learning", href: "/my-learning" }, ...links] : links;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-slate-200 bg-white/90 shadow-sm backdrop-blur-lg" : "border-transparent bg-white"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {menu.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50 hover:text-navy-900 ${
                  pathname === l.href ? "bg-sky-50 text-brand-ink" : "text-slate-600"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden min-w-[250px] items-center justify-end gap-3 lg:flex">
          {loading ? (
            <span className="h-9 w-40 animate-pulse rounded-lg bg-slate-100" />
          ) : user ? (
            <>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className={`btn px-3 ${pathname.startsWith("/admin") ? "bg-orange-50 text-accent-strong" : "text-accent-strong hover:bg-orange-50"}`}
                >
                  <IconShield className="h-4 w-4" /> Admin
                </Link>
              )}
              <Link href={user.isAdmin ? "/admin" : "/my-learning"} title="My Learning" className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 hover:bg-slate-50">
                <Avatar user={user} />
                <span className="text-sm leading-tight">
                  <span className="block font-semibold text-navy-900">{user.firstName}</span>
                  <span className="text-xs font-semibold text-brand-ink">{user.isAdmin ? "Administrator" : "My Learning"}</span>
                </span>
              </Link>
              <form action={logout}>
                <button type="submit" className="btn-secondary px-3" aria-label="Log out">
                  <IconLogout className="h-4 w-4" /> <span className="hidden xl:inline">Log out</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn px-3 text-navy-900 hover:text-brand-ink">Log In</Link>
              <Link href="/register" className="btn-secondary">Register</Link>
              <Link href="/#practice-tests" className="btn-primary hidden xl:inline-flex">Start Free Assessment</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-navy-900 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="animate-fade-up border-t border-slate-100 bg-white px-4 pb-6 pt-2 shadow-lg lg:hidden">
          {user && (
            <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-4">
              <Avatar user={user} />
              <div className="text-sm">
                <p className="font-semibold text-navy-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-500">{user.isAdmin ? "Administrator" : "Learner"}</p>
              </div>
            </div>
          )}
          <ul className="flex flex-col">
            {menu.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium hover:bg-slate-50 ${
                    pathname === l.href ? "text-brand-ink" : "text-slate-700"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3">
            {user && !user.isAdmin && (
              <Link href="/my-learning" onClick={() => setOpen(false)} className="btn-primary">My Learning</Link>
            )}
            {user?.isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)} className="btn bg-orange-50 text-accent-strong">
                <IconShield className="h-4 w-4" /> Admin Portal
              </Link>
            )}
            {user ? (
              <form action={logout}>
                <button type="submit" className="btn-secondary w-full"><IconLogout className="h-4 w-4" /> Log out</button>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary">Log In</Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn bg-navy-900 text-white hover:bg-navy-800">Register</Link>
                </div>
                <Link href="/#practice-tests" onClick={() => setOpen(false)} className="btn-primary">Start Free Assessment</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
