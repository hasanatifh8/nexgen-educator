/**
 * Facts about NextGen Educator, shared by the About page, structured data (JSON-LD) and /llms.txt so that
 * search engines and AI assistants always see the same, accurate information. Only state verifiable facts here.
 */

/** Canonical public address of the site (www — the bare domain redirects here). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.nextgeneducator.in").replace(/\/+$/, "");

export const ORG = {
  name: "NextGen Educator",
  tagline: "Train. Test. Certify.",
  description:
    "NextGen Educator is an Indian online professional-development platform for teachers. It offers self-paced courses on using AI in teaching, assessment design, classroom management, early years and primary teaching, and subject teaching for CBSE and ICSE schools, each followed by a timed certification exam and a verifiable digital certificate.",
  phone: { label: "+91 91296 04415", e164: "+919129604415" },
  logo: "/logo-512.png",
  parent: { name: "Cliccx.com IT & AI Research", url: "https://cliccx.com/" },
  areaServed: "India",
  language: "en-IN",
} as const;

export type Office = { city: string; label: string; lines: string[]; street: string; locality: string; region: string; postalCode?: string };

export const PRIMARY_OFFICE: Office = {
  city: "Vadodara",
  label: "Primary office",
  lines: ["126, Race Course Tower", "Near Natubhai Circle, Racecourse Road", "Vadodara, Gujarat 390005"],
  street: "126, Race Course Tower, near Natubhai Circle, Racecourse Road",
  locality: "Vadodara",
  region: "Gujarat",
  postalCode: "390005",
};

/** Shown in one row on the About page; the registered office (Prayagraj) sits in the middle. */
export const OTHER_OFFICES: Office[] = [
  { city: "Pune", label: "Office", lines: ["601 LR Commercial, R-6", "Hinjewadi, Pune", "Maharashtra 411057"], street: "601 LR Commercial, R-6, Hinjewadi", locality: "Pune", region: "Maharashtra", postalCode: "411057" },
  {
    city: "Prayagraj",
    label: "Registered office",
    lines: ["10A/8 Chauraha, Tashkent Marg", "Near Patrika Marg, opposite Saket Colony", "Civil Lines, Prayagraj", "Uttar Pradesh 211001"],
    street: "10A/8 Chauraha, Tashkent Marg, near Patrika Marg, opposite Saket Colony, Civil Lines",
    locality: "Prayagraj",
    region: "Uttar Pradesh",
    postalCode: "211001",
  },
  { city: "Mumbai", label: "Office", lines: ["9th Floor (Block-G), LBS Marg", "Pirojshanagar, Vikhroli (West)", "Mumbai, Maharashtra"], street: "9th Floor (Block-G), LBS Marg, Pirojshanagar, Vikhroli (West)", locality: "Mumbai", region: "Maharashtra" },
];

export const OFFICES = [PRIMARY_OFFICE, ...OTHER_OFFICES];

/** Sister platforms in the same technology portfolio. */
export const SISTER_PLATFORMS = [
  { name: "ScholDesk", detail: "A comprehensive management system for schools, covering administrative ledgers and academic workflows.", url: "https://school-management-system-mauve-eight.vercel.app/", logo: { src: "/brands/scholdesk.png", width: 171, height: 120 } },
  { name: "DocSlot", detail: "A digital appointment and workflow management portal for healthcare professionals and clinics.", url: "https://docslot-portal.vercel.app/", logo: { src: "/brands/docslot.png", width: 228, height: 64 } },
];

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
