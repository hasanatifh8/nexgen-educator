/**
 * Published research we cite on the site and in school proposals.
 *
 * Rules (UNESCO’s name and logo policy: https://www.unesco.org/en/logo-patronage):
 * - Cite publications by title, year and link, exactly as published. Quotes must be verbatim.
 * - Never use the UNESCO logo, and never say or imply that UNESCO endorses, approves, certifies,
 *   partners with or is affiliated with NextGen Educator, or that our courses are “aligned with” its
 *   framework unless a documented mapping exists. That needs UNESCO’s prior written authorisation.
 */

export type Source = { publisher: string; title: string; year: number; url: string };

export const UNESCO_AI_TEACHERS: Source = {
  publisher: "UNESCO",
  title: "AI competency framework for teachers",
  year: 2024,
  url: "https://www.unesco.org/en/articles/ai-competency-framework-teachers",
};

export const NEP_2020: Source = {
  publisher: "Ministry of Education, Government of India",
  title: "National Education Policy 2020",
  year: 2020,
  url: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
};

/** Verbatim from NEP 2020 (teacher CPD, and the same expectation for school leaders). */
export const NEP_QUOTES = {
  teachers: "Each teacher will be expected to participate in at least 50 hours of CPD opportunities every year",
  leaders: "Such leaders will also be expected to participate in 50 hours or more of CPD modules per year",
} as const;

/** Verbatim from the publication page of UNESCO_AI_TEACHERS. */
export const UNESCO_FINDINGS = {
  gap: "few countries have defined these competencies or developed national programmes to train teachers in AI, leaving many educators without proper guidance",
  scope: "15 competencies across five dimensions",
  dimensions: ["Human-centred mindset", "Ethics of AI", "AI foundations and applications", "AI pedagogy", "AI for professional learning"],
  levels: ["Acquire", "Deepen", "Create"],
} as const;

export const NOT_AFFILIATED =
  "NextGen Educator is an independent organisation. It is not affiliated with, endorsed by or a partner of UNESCO. Publications are cited for information only.";

export const cite = (s: Source) => `${s.publisher}, ${s.title} (${s.year})`;
