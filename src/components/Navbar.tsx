"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { IconMenu, IconX } from "./Icons";

const links = [
  { label: "Courses", href: "#courses" },
  { label: "Certifications", href: "#certifications" },
  { label: "Practice Tests", href: "#practice-tests" },
  { label: "For Institutions", href: "#institutions" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-slate-200 bg-white/90 shadow-sm backdrop-blur-lg" : "border-transparent bg-white"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-navy-900"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="#" className="btn text-navy-900 hover:text-brand">Log In</a>
          <a href="#practice-tests" className="btn-primary">Start Free Assessment</a>
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
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3">
            <a href="#" className="btn-secondary">Log In</a>
            <a href="#practice-tests" onClick={() => setOpen(false)} className="btn-primary">Start Free Assessment</a>
          </div>
        </div>
      )}
    </header>
  );
}
