/**
 * School proposals: personalised PDF documents an admin prepares for a principal or school manager.
 * Types, defaults and validation shared by the admin editor (browser) and the server action. Client-safe.
 */

export const SALUTATIONS = ["", "Dr.", "Mr.", "Ms.", "Mrs.", "Fr.", "Sr.", "Prof."] as const;
export const DESIGNATIONS = ["Principal", "Vice Principal", "Director", "Manager", "Chairperson", "Trustee", "Academic Coordinator", "Head of School"] as const;
export const BOARDS = ["", "CBSE", "ICSE / ISC", "State Board", "IB", "Cambridge (CAIE)", "Multiple boards"] as const;

/** What the admin types in the editor. */
export type ProposalInput = {
  salutation: string;
  contactName: string;
  designation: string;
  schoolName: string;
  city: string;
  board: string;
  /** Approximate number of teachers to train; 0 = not given (no cost estimate is shown). */
  teachers: number;
  programIds: string[];
  /** Institutional discount on paid course fees, 0–100. */
  discountPercent: number;
  /** Optional personal paragraph in the cover letter. */
  note: string;
  preparedBy: string;
  preparedByTitle: string;
  preparedPhone: string;
  preparedEmail: string;
  /** YYYY-MM-DD */
  issuedOn: string;
  /** YYYY-MM-DD */
  validUntil: string;
};

/** A saved proposal. */
export type Proposal = ProposalInput & {
  id: string;
  /** Human reference printed on the document, e.g. NGE/PR/2026/0007. */
  ref: string;
  createdAt: string;
  updatedAt: string;
  /** Last time the PDF was downloaded from the admin portal. */
  downloadedAt?: string;
};

export const LIMITS = { name: 80, school: 120, city: 60, note: 700, title: 80, phone: 30, email: 120, teachers: 5000 } as const;

const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export type ProposalErrors = Partial<Record<keyof ProposalInput, string>>;

/** Trims and bounds every field. Unknown program ids are dropped against `knownProgramIds`. */
export function cleanProposal(raw: Partial<ProposalInput>, knownProgramIds: string[]): ProposalInput {
  const s = (v: unknown, max: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  const n = (v: unknown) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);
  const known = new Set(knownProgramIds);
  return {
    salutation: (SALUTATIONS as readonly string[]).includes(String(raw.salutation)) ? String(raw.salutation) : "",
    contactName: s(raw.contactName, LIMITS.name),
    designation: s(raw.designation, LIMITS.title),
    schoolName: s(raw.schoolName, LIMITS.school),
    city: s(raw.city, LIMITS.city),
    board: (BOARDS as readonly string[]).includes(String(raw.board)) ? String(raw.board) : "",
    teachers: Math.min(LIMITS.teachers, Math.max(0, n(raw.teachers))),
    programIds: [...new Set((raw.programIds ?? []).map(String))].filter((id) => known.has(id)),
    discountPercent: Math.min(100, Math.max(0, n(raw.discountPercent))),
    // Keep the admin's paragraph breaks in the personal note.
    note: String(raw.note ?? "").replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, LIMITS.note),
    preparedBy: s(raw.preparedBy, LIMITS.name),
    preparedByTitle: s(raw.preparedByTitle, LIMITS.title),
    preparedPhone: s(raw.preparedPhone, LIMITS.phone),
    preparedEmail: s(raw.preparedEmail, LIMITS.email),
    issuedOn: s(raw.issuedOn, 10),
    validUntil: s(raw.validUntil, 10),
  };
}

export function validateProposal(p: ProposalInput): ProposalErrors {
  const e: ProposalErrors = {};
  if (p.contactName.length < 2) e.contactName = "Enter the principal’s or manager’s name.";
  if (p.designation.length < 2) e.designation = "Enter a designation, e.g. Principal.";
  if (p.schoolName.length < 3) e.schoolName = "Enter the school’s name.";
  if (p.city.length < 2) e.city = "Enter the city.";
  if (!p.programIds.length) e.programIds = "Choose at least one program.";
  if (p.preparedBy.length < 2) e.preparedBy = "Enter your name.";
  if (p.preparedEmail && !isEmail(p.preparedEmail)) e.preparedEmail = "Enter a valid email or leave it blank.";
  if (!isDate(p.issuedOn)) e.issuedOn = "Choose a date.";
  if (!isDate(p.validUntil)) e.validUntil = "Choose a date.";
  else if (isDate(p.issuedOn) && p.validUntil < p.issuedOn) e.validUntil = "Must be on or after the proposal date.";
  return e;
}

/** “Dr. Meera Iyer” — salutation only when chosen. */
export const addressee = (p: Pick<ProposalInput, "salutation" | "contactName">) => [p.salutation, p.contactName].filter(Boolean).join(" ");

/** Safe file name: “NextGen-Educator-Proposal-Delhi-Public-School.pdf”. */
export const proposalFileName = (p: Pick<ProposalInput, "schoolName">) =>
  `NextGen-Educator-Proposal-${p.schoolName.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "School"}.pdf`;

const addDays = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);

export function blankProposal(today: string, sender: Pick<ProposalInput, "preparedBy" | "preparedByTitle" | "preparedPhone" | "preparedEmail">, programIds: string[]): ProposalInput {
  return {
    salutation: "",
    contactName: "",
    designation: "Principal",
    schoolName: "",
    city: "",
    board: "",
    teachers: 0,
    programIds,
    discountPercent: 0,
    note: "",
    ...sender,
    issuedOn: today,
    validUntil: addDays(today, 30),
  };
}
