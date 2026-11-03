import { LIMITS, isEmail, nameError } from "@/lib/validation";

export const ROLES = [
  "Classroom Teacher",
  "School Leader / Administrator",
  "Instructional Coach",
  "Student Teacher",
  "Other",
] as const;

/** What the candidate is doing now — not everyone registering is currently employed at a school. */
export const WORK_STATUSES = {
  working: { label: "Working at a school or institution", institution: "School / institution name", optional: false, placeholder: "e.g. Delhi Public School, Lucknow" },
  "not-working": { label: "Not working at the moment", institution: "Last school or institution", optional: true, placeholder: "Leave blank if none" },
  tutor: { label: "Private tutor / freelance", institution: "Where do you tutor?", optional: true, placeholder: "e.g. Home tuitions, coaching centre" },
  student: { label: "Student / in teacher training", institution: "College or university", optional: true, placeholder: "e.g. B.Ed, Allahabad University" },
} as const;
export type WorkStatus = keyof typeof WORK_STATUSES;
export const isWorkStatus = (v: string): v is WorkStatus => v in WORK_STATUSES;

export type RegisterFields = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  workStatus: string;
  institution: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  newsletter: boolean;
};

export type FieldErrors = Partial<Record<keyof RegisterFields, string>>;

export type RegisterState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: FieldErrors;
  /** Echoed back so non-sensitive fields survive a failed submit. */
  values?: Partial<Omit<RegisterFields, "password" | "confirmPassword">>;
  user?: { firstName: string; email: string };
};

export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One letter", test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character", test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

/** Shared by the client (instant feedback) and the server (source of truth). */
export function validateRegistration(f: RegisterFields): FieldErrors {
  const e: FieldErrors = {};
  const first = nameError(f.firstName, "first name", { min: 2 });
  if (first) e.firstName = first;
  const last = nameError(f.lastName, "last name");
  if (last) e.lastName = last;
  if (!isEmail(f.email.trim())) e.email = "Enter a valid email address, like name@example.com.";
  if (!ROLES.includes(f.role as (typeof ROLES)[number])) e.role = "Select your role.";
  if (!isWorkStatus(f.workStatus)) e.workStatus = "Select what you are doing at the moment.";
  else if (!WORK_STATUSES[f.workStatus].optional && f.institution.length < 2) e.institution = "Enter the name of your school or institution.";
  if (f.institution.length > 120) e.institution = "Keep this under 120 characters.";
  const failed = PASSWORD_RULES.filter((r) => !r.test(f.password));
  if (failed.length) e.password = `Password needs: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.`;
  else if (f.password.length > LIMITS.password) e.password = `Keep your password under ${LIMITS.password} characters.`;
  if (f.confirmPassword !== f.password) e.confirmPassword = "Passwords don’t match.";
  if (!f.terms) e.terms = "You must accept the Terms of Service and Privacy Policy.";
  return e;
}

export function readRegisterForm(fd: FormData): RegisterFields {
  const s = (k: string) => String(fd.get(k) ?? "");
  return {
    firstName: s("firstName").trim(),
    lastName: s("lastName").trim(),
    email: s("email").trim(),
    role: s("role"),
    workStatus: s("workStatus"),
    institution: s("institution").trim(),
    password: s("password"),
    confirmPassword: s("confirmPassword"),
    terms: fd.get("terms") === "on",
    newsletter: fd.get("newsletter") === "on",
  };
}
