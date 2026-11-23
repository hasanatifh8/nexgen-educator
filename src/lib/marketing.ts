import { EXAM_ATTEMPT_POLICY } from "./access";
import type { FinderAnswers } from "./courseFinder";

/**
 * Career-outcome copy for marketing pages, kept in one place so it can be edited without touching layout.
 *
 * Truth-in-advertising rule for this file: every claim must be something the platform does today
 * or a figure you can evidence. Unverified recognition ("recognized by X"), learner counts or pass rates
 * expose the business to misleading-advertising complaints and undermine the credential itself.
 * Put real numbers in PROOF_STATS and real, consented quotes in TESTIMONIALS — sections stay hidden while empty.
 */

export const HERO = {
  eyebrow: "Made for teachers in Indian schools",
  headline: "Schools are changing fast.",
  headlineAccent: "Make sure your career keeps up.",
  lede:
    "AI, smart classrooms and NEP 2020 are changing what schools expect from teachers. Learn the new skills step by step, in simple language, at your own pace. Then earn a certificate that proves it, even if you have never been “good with computers”.",
};

/** Headline value propositions, used in the hero, the certificate showcase and the outcomes section. */
export const OUTCOME_QUOTES = [
  {
    quote: "Walk into your next interview with proof of modern teaching skills, not just experience.",
    context: "Your next interview",
  },
  {
    quote: "Your years of experience are your strength. Add today’s skills to them, and no school can overlook you.",
    context: "Career growth",
  },
  {
    quote: "A certificate any principal can check in seconds, with your score on it.",
    context: "Trusted by design",
  },
] as const;

/** The worries we hear from teachers. Framed as feelings, not statistics, so nothing here needs a source. */
export const TEACHER_WORRIES = [
  { title: "“Interviews now ask about AI and smart classes.”", body: "And you are not sure what to say, because nobody ever trained you on it." },
  { title: "“Younger teachers seem so comfortable with technology.”", body: "You have years of real classroom experience, but the CV doesn’t show anything new." },
  { title: "“I’m worried about my job, salary and promotion.”", body: "Schools are restructuring, and you want to be the teacher they cannot do without." },
  { title: "“I don’t know where to start, and I have no time.”", body: "Between classes, copies and family, a long, complicated course is simply not possible." },
] as const;

/** Reassurance for teachers with little technical confidence. Every line must stay true of the product. */
export const BUILT_FOR_YOU = [
  { title: "Starts from zero", body: "Our beginner courses explain everything in simple English, from what AI is to how to use it safely in class. No technical background needed." },
  { title: "Short lessons that fit your day", body: "Most lessons take 10–15 minutes, so you can learn in a free period or after school, at your own pace." },
  { title: "Works on your phone", body: "No app to install and no laptop needed. Open the website on any smartphone and continue where you stopped." },
  { title: "Many courses are free", body: "Registration is free and many full courses cost nothing. Paid courses are priced for a teacher’s budget, with no surprise charges." },
  { title: "A real person helps you", body: "For paid courses our team calls you before you pay, answers your questions and helps you choose. Nothing is paid on the website." },
  { title: "You can try again", body: `Didn’t pass the exam the first time? Revise the lessons and try again. You get up to ${EXAM_ATTEMPT_POLICY.maxAttempts} attempts a day.` },
] as const;

/** Who the programs are for, so a visitor can recognise themselves. `finder` pre-fills the course finder. */
export const TEACHER_PERSONAS: { title: string; body: string; finder: FinderAnswers }[] = [
  { title: "Pre-primary & primary teachers", body: "Play-based, joyful teaching for Playgroup to Class 5, in line with NEP 2020.", finder: { role: "primary", goal: "early" } },
  { title: "Science & subject teachers", body: "Use AI to plan lessons, make worksheets and explain hard topics in Classes 5–10.", finder: { role: "teacher", goal: "ai" } },
  { title: "English & language teachers", body: "Level reading passages, give feedback faster and build writing skills in Classes 6–12.", finder: { role: "teacher", goal: "ai" } },
  { title: "Teachers new to AI", body: "Never used ChatGPT or Gemini? Begin with a free, friendly introduction made for class teachers.", finder: { goal: "ai", level: "new" } },
];

/** What a hiring committee can actually confirm from one of our credentials — all true of the product today. */
export const HIRING_SIGNALS = [
  { title: "Verified in seconds", body: "Every certificate carries a unique credential ID and QR code that resolves to a live verification page." },
  { title: "Earned, not attended", body: "Credentials are issued only after every course in the program is completed and a timed, scenario-based exam is passed." },
  { title: "Identity-checked holders", body: "Learners submit government ID before certification, so the name on the certificate belongs to the person in the interview." },
  { title: "Shows the score", body: "The verification page shows the exam score and issue date, not just a participation badge." },
] as const;

/** Before / after framing used in the outcomes section. */
export const CV_TRANSFORM = {
  before: { label: "A typical teacher’s CV", lines: ["B.Ed., 8 years’ experience", "“Basic computer knowledge”", "“Good classroom management”"] },
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
