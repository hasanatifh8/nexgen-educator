import { createHash, randomBytes, randomUUID, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (pw: string, salt: string, keylen: number) => Promise<Buffer>;

/**
 * Minimal file-backed user store for local development.
 * Swap for a real database before deploying (serverless hosts have read-only filesystems).
 */
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  institution: string;
  newsletter: boolean;
  passwordHash: string;
  createdAt: string;
  plan: "free" | "pro";
  /** Program ids the user has bought. */
  purchases: string[];
  /** Sessions issued before this (epoch ms) are rejected — set when the password changes. */
  sessionsValidAfter?: number;
  /** sha256 of the outstanding password-reset token; the raw token only lives in the emailed link. */
  resetTokenHash?: string;
  resetTokenExpires?: number;
  certificates: EarnedCertificate[];
  /** courseId → completed lesson ids */
  progress: Record<string, string[]>;
  profile?: LearnerProfile;
  /** Admin review of the uploaded identity document. */
  verification: { status: "pending" | "verified" | "rejected"; note?: string; reviewedAt?: string };
  /** Course ids an admin has assigned — the only courses whose material this learner can open. */
  assignedCourses: string[];
  /** Courses the learner asked an admin to assign. */
  requests: { courseId: string; at: string }[];
  /** Every certification-exam attempt; each attempt can be submitted once. */
  examAttempts: ExamAttempt[];
};

export type ExamAttempt = {
  id: string;
  programId: string;
  startedAt: number;
  submittedAt?: number;
  score?: number;
  total?: number;
  passed?: boolean;
};

export type StoredFile = { stored: string; originalName: string; mime: string; size: number; uploadedAt: string };

export type LearnerProfile = {
  phone: string;
  city: string;
  state: string;
  qualification: string;
  experienceYears: number;
  idType: "aadhaar" | "pan";
  idDocument: StoredFile;
  cv: StoredFile;
  consentAt: string;
  completedAt: string;
};

export type EarnedCertificate = {
  programId: string;
  programTitle: string;
  credentialId: string;
  score: number;
  total: number;
  issuedAt: string;
  /** Name printed on the certificate, frozen at issue time. */
  holderName?: string;
};

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = JSON.parse(await readFile(USERS_FILE, "utf8")) as Partial<StoredUser>[];
    // Backfill fields added after early accounts were created.
    return raw.map(
      (u) =>
        ({
          plan: "free",
          purchases: [],
          certificates: [],
          progress: {},
          verification: { status: "pending" },
          assignedCourses: [],
          requests: [],
          examAttempts: [],
          ...u,
        }) as StoredUser,
    );
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

/** Write to a temp file and rename, so a crash mid-write can never leave a truncated users.json. */
async function writeUsers(users: StoredUser[]) {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${USERS_FILE}.${randomBytes(6).toString("hex")}.tmp`;
  await writeFile(tmp, JSON.stringify(users, null, 2));
  await rename(tmp, USERS_FILE);
}

/**
 * Serialises read-modify-write cycles within this server process. Without it, two concurrent requests
 * (e.g. a lesson completion and a certificate issue) both read the old file and the last write wins.
 */
let writeQueue: Promise<unknown> = Promise.resolve();
function withUsersLock<T>(fn: (users: StoredUser[]) => Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => fn(await readUsers()));
  writeQueue = run.catch(() => undefined);
  return run;
}

export async function listUsers() {
  return readUsers();
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((u) => u.email === email.toLowerCase());
}

export async function findUserById(id: string) {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${key.toString("hex")}`;
}

async function passwordMatches(password: string, stored: string) {
  const [, salt, hex] = stored.split(":");
  const expected = Buffer.from(hex, "hex");
  const actual = await scrypt(password, salt, expected.length);
  return timingSafeEqual(expected, actual);
}

// Hash of a random value, used so unknown emails take as long as wrong passwords.
const DUMMY_HASH = hashPassword(randomBytes(16).toString("hex"));

export async function verifyCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  const ok = await passwordMatches(password, user?.passwordHash ?? (await DUMMY_HASH));
  return user && ok ? user : null;
}

export async function createUser(
  input: Omit<StoredUser, "id" | "passwordHash" | "createdAt" | "plan" | "purchases" | "certificates" | "progress" | "verification" | "assignedCourses" | "requests" | "profile" | "examAttempts"> & { password: string },
) {
  const { password, ...rest } = input;
  const passwordHash = await hashPassword(password);
  return withUsersLock(async (users) => {
    const email = input.email.toLowerCase();
    if (users.some((u) => u.email === email)) return null;

    const user: StoredUser = {
      ...rest,
      email,
      id: randomUUID(),
      passwordHash,
      createdAt: new Date().toISOString(),
      plan: "free",
      purchases: [],
      certificates: [],
      progress: {},
      verification: { status: "pending" },
      assignedCourses: [],
      requests: [],
      examAttempts: [],
    };
    await writeUsers([...users, user]);
    return user;
  });
}

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Creates a one-time reset token for the account, replacing any earlier one. Returns null if no such account. */
export async function createPasswordResetToken(email: string) {
  return withUsersLock(async (users) => {
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) return null;
    const token = randomBytes(32).toString("base64url");
    user.resetTokenHash = sha256(token);
    user.resetTokenExpires = Date.now() + RESET_TOKEN_TTL_MS;
    await writeUsers(users);
    return { token, user };
  });
}

export async function findUserByResetToken(token: string) {
  if (!token) return undefined;
  const hash = sha256(token);
  const users = await readUsers();
  return users.find((u) => u.resetTokenHash === hash && (u.resetTokenExpires ?? 0) > Date.now());
}

/** Consumes the token, sets the new password, and signs out every existing session. */
export async function resetPasswordWithToken(token: string, newPassword: string) {
  const hash = sha256(token);
  const passwordHash = await hashPassword(newPassword);
  return withUsersLock(async (users) => {
    const user = users.find((u) => u.resetTokenHash === hash && (u.resetTokenExpires ?? 0) > Date.now());
    if (!user) return null;
    user.passwordHash = passwordHash;
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    user.sessionsValidAfter = Date.now();
    await writeUsers(users);
    return user;
  });
}


/**
 * Opens a certification-exam attempt, unless the learner has used up their attempts in the rolling window.
 * Returns the attempt, or the time the next attempt becomes available.
 */
export async function startExamAttempt(userId: string, programId: string, policy: { maxAttempts: number; windowMs: number }) {
  return withUsersLock(async (users) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return { error: "no-user" as const };
      const now = Date.now();
      const recent = user.examAttempts
        .filter((a) => a.programId === programId && a.startedAt > now - policy.windowMs)
        .sort((a, b) => a.startedAt - b.startedAt);
      if (recent.length >= policy.maxAttempts) {
        return { error: "limit" as const, retryAt: recent[recent.length - policy.maxAttempts].startedAt + policy.windowMs };
      }
      const attempt: ExamAttempt = { id: randomBytes(12).toString("hex"), programId, startedAt: now };
      user.examAttempts.push(attempt);
      await writeUsers(users);
      return { attempt, attemptsLeft: policy.maxAttempts - recent.length - 1 };
  });
}

/**
 * Closes an attempt exactly once and, on a pass, issues the certificate in the same write.
 * Keeps one certificate per program (the first one earned).
 */
export async function finishExamAttempt(
  userId: string,
  attemptId: string,
  result: { score: number; total: number; passed: boolean },
  makeCertificate: () => EarnedCertificate,
) {
  return withUsersLock(async (users) => {
      const user = users.find((u) => u.id === userId);
      const attempt = user?.examAttempts.find((a) => a.id === attemptId);
      if (!user || !attempt) return { error: "unknown" as const };
      if (attempt.submittedAt) return { error: "already-submitted" as const };
      Object.assign(attempt, result, { submittedAt: Date.now() });
      let certificate: EarnedCertificate | undefined;
      if (result.passed) {
        certificate = user.certificates.find((c) => c.programId === attempt.programId);
        if (!certificate) {
          certificate = makeCertificate();
          user.certificates.push(certificate);
        }
      }
      await writeUsers(users);
      return { certificate };
  });
}

export async function markLessonComplete(userId: string, courseId: string, lessonId: string) {
  return withUsersLock(async (users) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return null;
      const done = (user.progress[courseId] ??= []);
      if (!done.includes(lessonId)) {
        done.push(lessonId);
        await writeUsers(users);
      }
      return done;
  });
}

async function updateUser(userId: string, fn: (u: StoredUser) => void) {
  return withUsersLock(async (users) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return null;
      fn(user);
      await writeUsers(users);
      return user;
  });
}

/** Saves a (re)submitted profile; any re-submission goes back to pending review. */
export async function saveProfile(userId: string, profile: LearnerProfile) {
  return updateUser(userId, (u) => {
    u.profile = profile;
    u.verification = { status: "pending" };
  });
}

export async function setVerification(userId: string, status: "verified" | "rejected", note?: string) {
  return updateUser(userId, (u) => {
    u.verification = { status, ...(note ? { note } : {}), reviewedAt: new Date().toISOString() };
  });
}

/** Replaces the learner's assigned courses and clears requests that were granted. */
export async function setAssignedCourses(userId: string, courseIds: string[]) {
  return updateUser(userId, (u) => {
    u.assignedCourses = [...new Set(courseIds)];
    u.requests = u.requests.filter((r) => !u.assignedCourses.includes(r.courseId));
  });
}

export async function requestCourse(userId: string, courseId: string) {
  return updateUser(userId, (u) => {
    if (!u.assignedCourses.includes(courseId) && !u.requests.some((r) => r.courseId === courseId)) {
      u.requests.push({ courseId, at: new Date().toISOString() });
    }
  });
}

/** Public verification lookup: finds a certificate by its credential ID (case-insensitive). */
export async function findCertificate(credentialId: string) {
  const id = credentialId.trim().toUpperCase();
  for (const u of await readUsers()) {
    const cert = u.certificates.find((c) => c.credentialId.toUpperCase() === id);
    if (cert) return { cert, holderName: cert.holderName ?? `${u.firstName} ${u.lastName}` };
  }
  return null;
}
