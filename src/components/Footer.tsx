"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Logo from "./Logo";

const columns = [
  { title: "Platform", links: [["Courses", "/courses"], ["How it works", "/#how-it-works"], ["Practice Tests", "/#practice-tests"], ["FAQ", "/#faq"]] },
  { title: "Solutions", links: [["Create Account", "/register"], ["For Institutions", "/#institutions"], ["Verify a Certificate", "/verify"], ["Partner Program", "#"]] },
  { title: "Company", links: [["About Us", "/about"], ["Careers", "#"], ["Blog", "#"], ["Contact", "#"]] },
];

const noopSubscribe = () => () => {};

export default function Footer() {
  // Static fallback during prerender; real year on the client.
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => 2026);

  return (
    <footer className="bg-navy-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
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
                <ul className="mt-3 text-sm sm:mt-4 sm:space-y-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}><Link href={href} className="inline-flex min-h-10 items-center transition-colors hover:text-brand sm:min-h-0">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
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
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              <li><a href="#" className="inline-flex min-h-10 items-center hover:text-white sm:min-h-0">Privacy Policy</a></li>
              <li><a href="#" className="inline-flex min-h-10 items-center hover:text-white sm:min-h-0">Terms of Service</a></li>
              <li><a href="#" className="inline-flex min-h-10 items-center hover:text-white sm:min-h-0">Cookie Settings</a></li>
              <li><a href="#" className="inline-flex min-h-10 items-center hover:text-white sm:min-h-0">Accessibility</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
