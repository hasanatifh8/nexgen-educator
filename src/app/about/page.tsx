import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { ORG, OTHER_OFFICES, PRIMARY_OFFICE, SISTER_PLATFORMS, SITE_URL } from "@/lib/organization";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "About Us",
  description: "About NextGen Educator: an Indian online teacher-training initiative within the Cliccx.com IT & AI Research ecosystem, with offices in Vadodara, Pune, Prayagraj and Mumbai.",
  alternates: { canonical: "/about" },
};


const FOCUS = [
  ["Teacher-led technological enablement", "Practical, classroom-first training that helps educators adopt digital tools on their own terms."],
  ["Instructional AI literacy", "Structured guidance on using generative AI responsibly for planning, assessment and differentiation."],
  ["Modern educational workflows", "Methods and templates that reduce routine workload and leave more time for teaching."],
  ["Institutional empowerment", "Programmes, assessments and verifiable certification that schools can rely on."],
];


const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Corporate background page: deliberately quiet — small type, muted colours, no hero or calls to action. */
export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <JsonLd
          data={[
            { "@context": "https://schema.org", "@type": "AboutPage", url: `${SITE_URL}/about`, name: "About NextGen Educator", about: { "@id": `${SITE_URL}/#organization` } },
            breadcrumbLd([{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }]),
          ]}
        />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-500">About Us</span>
          </nav>

          <header className="mt-4 border-b border-slate-200 pb-6">
            <h1 className="text-lg font-semibold tracking-tight text-slate-700">About NextGen Educator</h1>
            <p className="mt-1 text-xs tracking-wide text-slate-400 uppercase">Organisation and corporate information</p>
          </header>

          {/* 1. Brand overview */}
          <section aria-labelledby="overview" className="border-b border-slate-100 py-6">
            <h2 id="overview" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Overview</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-500">
              <p>
                NextGen Educator is a digital educational initiative dedicated to the professional development of teachers. It provides
                self-paced courses, scenario-based assessments and verifiable certification for educators working across pre-primary,
                primary and secondary education.
              </p>
              <p>
                The initiative’s work is organised around four areas of focus. Each is pursued with an emphasis on practical classroom
                application and on the professional judgement of the teacher.
              </p>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {FOCUS.map(([term, detail]) => (
                <div key={term} className="border-l border-slate-200 pl-3">
                  <dt className="text-xs font-medium text-slate-600">{term}</dt>
                  <dd className="mt-0.5 text-xs leading-relaxed text-slate-500">{detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 2. Organisational ecosystem */}
          <section aria-labelledby="ecosystem" className="border-b border-slate-100 py-6">
            <h2 id="ecosystem" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Organisational ecosystem &amp; research backing</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-500">
              <p>
                NextGen Educator operates as part of the broader technology and educational research ecosystem led by{" "}
                <a href="https://cliccx.com/" {...external} className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-slate-800">
                  Cliccx.com IT &amp; AI Research
                </a>
                .
              </p>
            </div>
            <a href="https://cliccx.com/" {...external} className="mt-4 flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2.5 transition-colors hover:border-slate-200">
              <Image src="/brands/cliccx.png" alt="Cliccx" width={108} height={96} className="h-8 w-auto shrink-0" />
              <span className="min-w-0">
                <span className="block text-xs font-medium text-slate-600">Cliccx.com IT &amp; AI Research</span>
                <span className="block text-xs text-slate-400">cliccx.com</span>
              </span>
            </a>
            <p className="mt-3 flex items-center gap-2 text-xs font-light tracking-wide text-zinc-400">
              <Image src="/brands/young-minds-academy.png" alt="" width={157} height={160} className="h-6 w-auto opacity-60 grayscale" />
              Affiliated foundational entity: Young Minds Academy.
            </p>

            <article aria-labelledby="portfolio" className="mt-5">
              <h3 id="portfolio" className="text-xs font-medium text-slate-600">Sister platforms in the technology portfolio</h3>
              <ul className="mt-2 divide-y divide-slate-100 rounded-md border border-slate-100">
                {SISTER_PLATFORMS.map((p) => (
                  <li key={p.name}>
                    <a href={p.url} {...external} className="group flex items-center gap-4 px-3 py-3 transition-colors hover:bg-slate-50/70">
                      <span className="grid h-10 w-20 shrink-0 place-items-center">
                        <Image src={p.logo.src} alt={`${p.name} logo`} width={p.logo.width} height={p.logo.height} className="max-h-10 w-auto" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-slate-600">{p.name}</span>
                        <span className="block text-xs leading-relaxed text-slate-500">{p.detail}</span>
                      </span>
                      <span className="hidden shrink-0 text-xs text-slate-400 group-hover:text-slate-600 sm:block">Visit ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          {/* 3. Corporate offices */}
          <footer aria-labelledby="office" className="py-6">
            <h2 id="office" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Corporate offices &amp; registered coordinates</h2>

            <div className="mt-3 rounded-md border border-slate-200 px-4 py-3">
              <p className="text-xs font-medium text-slate-600">{PRIMARY_OFFICE.label} · {PRIMARY_OFFICE.city}</p>
              <address className="mt-1 text-xs leading-relaxed text-slate-500 not-italic">
                {PRIMARY_OFFICE.lines.join(", ")}, India
              </address>
            </div>

            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {OTHER_OFFICES.map((o) => (
                <li key={o.city} className={`rounded-md border px-3 py-3 ${o.label === "Registered office" ? "border-slate-200 bg-slate-50/60" : "border-slate-100"}`}>
                  <p className="text-xs font-medium text-slate-600">{o.city}</p>
                  <p className="text-[11px] tracking-wide text-slate-400 uppercase">{o.label}</p>
                  <address className="mt-1.5 text-xs leading-relaxed text-slate-500 not-italic">
                    {o.lines.map((line) => <span key={line} className="block">{line}</span>)}
                  </address>
                </li>
              ))}
            </ul>

            <dl className="mt-4 grid gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-3">
              <div>
                <dt className="font-medium text-slate-600">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${ORG.phone.e164}`} className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">{ORG.phone.label}</a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-600">General inquiries</dt>
                <dd className="mt-1 leading-relaxed">Standard business hours (IST)</dd>
              </div>
            </dl>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}
