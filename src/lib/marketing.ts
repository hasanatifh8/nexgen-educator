/**
 * Career-outcome copy for marketing pages, kept in one place so it can be edited without touching layout.
 *
 * Truth-in-advertising rule for this file: every claim must be something the platform does today
 * or a figure you can evidence. Unverified recognition ("recognized by X"), learner counts or pass rates
 * expose the business to misleading-advertising complaints and undermine the credential itself.
 * Put real numbers in PROOF_STATS and real, consented quotes in TESTIMONIALS — sections stay hidden while empty.
 */

export const HERO = {
  eyebrow: "Professional teaching credentials · QR-verifiable",
  headline: "Bridge the pedagogical gap.",
  headlineAccent: "Go from applicant to top-choice educator.",
  lede:
    "Earn verifiable credentials that demonstrate modern teaching mastery to school hiring committees — built on classroom-tested practice in AI-assisted teaching, assessment design and classroom management.",
};

/** Headline value propositions — positioned in the hero, the certificate showcase and the outcomes band. */
export const OUTCOME_QUOTES = [
  {
    quote: "Strengthen your CV with classroom-tested credentials built for the standards premier schools hire against.",
    context: "Resume strength",
  },
  {
    quote: "Bridge the pedagogical gap — transform your resume from applicant to top-choice educator.",
    context: "Career advancement",
  },
  {
    quote: "Earn verifiable credentials that demonstrate modern teaching mastery to school hiring committees.",
    context: "Hiring credibility",
  },
] as const;

/** What a hiring committee can actually confirm from one of our credentials — all true of the product today. */
export const HIRING_SIGNALS = [
  { title: "Verified in seconds", body: "Every certificate carries a unique credential ID and QR code that resolves to a live verification page." },
  { title: "Earned, not attended", body: "Credentials are issued only after every course in the program is completed and a timed, scenario-based exam is passed." },
  { title: "Identity-checked holders", body: "Learners submit government ID before certification, so the name on the certificate belongs to the person in the interview." },
  { title: "Shows the score", body: "The verification page shows the exam score and issue date, not just a participation badge." },
] as const;

/** Before / after framing used in the outcomes section. */
export const CV_TRANSFORM = {
  before: { label: "Typical applicant CV", lines: ["B.Ed., 4 years’ experience", "“Familiar with educational technology”", "“Strong classroom management”"] },
  after: {
    label: "With NextGen credentials",
    lines: ["Certified AI-Ready Educator — Credential NGE-2026-…", "Rubric Design Certificate — 90% exam score", "Each line links to a live, QR-verified record"],
  },
};

/**
 * Social proof. Leave empty until you can evidence the figure (analytics export, issued-credential count).
 * Example: { value: "1,240", label: "Credentials issued" }
 */
export const PROOF_STATS: { value: string; label: string }[] = [];

/** Real learner or school quotes, with written permission. Example: { quote, name: "Priya S.", role: "Primary Teacher, Pune" } */
export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [];

/** Named partner institutions — only with a signed agreement or written permission to display. */
export const PARTNERS: string[] = [];
