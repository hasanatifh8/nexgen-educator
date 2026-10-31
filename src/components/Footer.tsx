"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import Logo from "./Logo";

const columns = [
  { title: "Platform", links: [["Courses", "/courses"], ["How it works", "/#how-it-works"], ["Practice Tests", "/#practice-tests"], ["FAQ", "/#faq"]] },
  { title: "Solutions", links: [["Create Account", "/register"], ["For Institutions", "/#institutions"], ["Verify a Certificate", "/verify"], ["Partner Program", "#"]] },
  { title: "Company", links: [["About Us", "#"], ["Careers", "#"], ["Blog", "#"], ["Contact", "#"]] },
];

const noopSubscribe = () => () => {};

export default function Footer() {
  // Static fallback during prerender; real year on the client.
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => 2026);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "error");
  };

  return (
    <footer className="bg-navy-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr_1.6fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Practical professional development, rigorous assessment, and verifiable credentials for the modern educator.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {col.links.map(([label, href]) => (
                    <li key={label}><Link href={href} className="transition-colors hover:text-brand">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">The Educator’s Brief</h3>
            <p className="mt-2 text-sm">Weekly classroom-ready strategies, AI tools, and new certification launches. No spam.</p>
            {status === "done" ? (
              <p role="status" className="mt-4 rounded-lg bg-emerald-600/10 px-4 py-3 text-sm font-medium text-emerald-400 ring-1 ring-emerald-500/30">
                You’re subscribed! Check your inbox to confirm.
              </p>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-4">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    placeholder="you@school.edu"
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "newsletter-error" : undefined}
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
                  />
                  <button type="submit" className="btn-primary">Subscribe</button>
                </div>
                {status === "error" && (
                  <p id="newsletter-error" className="mt-2 text-xs text-orange-400">Please enter a valid email address.</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-400">Accreditation disclaimer:</span> NextGen Educator certificates are
            professional development credentials. They do not replace government-issued teaching licenses or state/national
            certification requirements. Recognition of credentials and continuing education credits varies by institution and
            jurisdiction — please confirm with your school or licensing authority.
          </p>
          <div className="mt-6 flex flex-col gap-4 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} NextGen Educator. All rights reserved.</p>
            <ul className="flex flex-wrap gap-6">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Cookie Settings</a></li>
              <li><a href="#" className="hover:text-white">Accessibility</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
