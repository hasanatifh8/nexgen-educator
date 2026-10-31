"use server";

import { randomBytes, randomInt } from "node:crypto";
import { EXAM_ATTEMPT_POLICY as ATTEMPT_POLICY, examEligibility } from "@/lib/access";
import { getCatalog } from "@/lib/catalogStore";
import { getCurrentUser } from "@/lib/dal";
import { signValue, verifyValue } from "@/lib/sessionToken";
import { finishExamAttempt, startExamAttempt, type EarnedCertificate } from "@/lib/users";

const GRACE_MS = 30_000; // network latency allowance on submit

/**
 * Signed (not encrypted) — the browser can read it, so it holds the display order but never the answers.
 * optionOrder[qid][shown] = original option index.
 */
type Attempt = {
  uid: string;
  programId: string;
  attemptId: string;
  startedAt: number;
  endsAt: number;
  questionIds: string[];
  optionOrder: Record<string, number[]>;
};
export type LearnerQuestion = { id: string; prompt: string; scenario?: string; options: string[] };

export type StartResult =
  | { ok: true; token: string; endsAt: number; questions: LearnerQuestion[]; attemptsLeft: number }
  | { ok: false; error: string; retryAt?: number };

export type SubmitResult =
  | {
      ok: true;
      score: number;
      total: number;
      passPercent: number;
      passed: boolean;
      /** Per-question marks are only revealed on a pass, so a failed attempt can't be used as an answer key. */
      correct?: Record<string, boolean>;
      certificate?: EarnedCertificate;
    }
  | { ok: false; error: string };

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadForUser(programId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Your session expired. Please log in again." } as const;
  const { programs, courses } = await getCatalog();
  const program = programs.find((p) => p.id === programId);
  if (!program) return { error: "This program no longer exists." } as const;
  // Exam opens only for identity-verified learners who finished every course in the program.
  const eligible = examEligibility(user, program.id, courses);
  if (!eligible.ok) {
    return {
      error:
        eligible.reason === "incomplete"
          ? `Finish ${eligible.remaining.map((r) => r.title).join(", ")} before taking this exam.`
          : eligible.reason === "unverified"
            ? "Your identity documents must be verified by our team before you can sit the certification exam."
            : "This exam unlocks after all of the program’s courses are assigned to you and completed.",
    } as const;
  }
  return { user, program } as const;
}

/** Starts a timed attempt. Questions are only revealed here, never in the page HTML. */
export async function startExam(programId: string): Promise<StartResult> {
  const r = await loadForUser(programId);
  if ("error" in r) return { ok: false, error: r.error! };
  const { user, program } = r;
  if (!program.exam.questions.length) return { ok: false, error: "This exam has no questions yet." };
  if (user.certificates.some((c) => c.programId === program.id)) return { ok: false, error: "You’re already certified in this program." };

  const opened = await startExamAttempt(user.id, program.id, ATTEMPT_POLICY);
  if ("error" in opened) {
    if (opened.error === "limit") {
      return {
        ok: false,
        retryAt: opened.retryAt,
        error: `You’ve used all ${ATTEMPT_POLICY.maxAttempts} attempts for the last 24 hours. Review the course material — your next attempt opens later.`,
      };
    }
    return { ok: false, error: "Your session expired. Please log in again." };
  }

  const questions = shuffle(program.exam.questions);
  const optionOrder = Object.fromEntries(questions.map((q) => [q.id, shuffle(q.options.map((_, i) => i))]));
  const startedAt = opened.attempt.startedAt;
  const endsAt = startedAt + program.exam.minutes * 60_000;
  const token = signValue({
    uid: user.id,
    programId,
    attemptId: opened.attempt.id,
    startedAt,
    endsAt,
    questionIds: questions.map((q) => q.id),
    optionOrder,
  } satisfies Attempt);
  return {
    ok: true,
    token,
    endsAt,
    attemptsLeft: opened.attemptsLeft,
    // Strip answers and explanations before sending to the browser.
    questions: questions.map(({ id, prompt, scenario, options }) => ({ id, prompt, scenario, options: optionOrder[id].map((i) => options[i]) })),
  };
}

export async function submitExam(token: string, answers: Record<string, number | null>): Promise<SubmitResult> {
  const attempt = verifyValue<Attempt>(token);
  if (!attempt?.attemptId) return { ok: false, error: "Invalid exam attempt. Please start again." };

  const r = await loadForUser(attempt.programId);
  if ("error" in r) return { ok: false, error: r.error! };
  const { user, program } = r;
  if (attempt.uid !== user.id) return { ok: false, error: "This attempt belongs to a different account." };
  if (Date.now() > attempt.endsAt + GRACE_MS) return { ok: false, error: "Time limit exceeded — this attempt can no longer be submitted." };

  // Grade only the questions that were served in this attempt, mapping shown options back to the originals.
  const served = program.exam.questions.filter((q) => attempt.questionIds.includes(q.id));
  if (!served.length) return { ok: false, error: "This exam changed while you were taking it. Please start again." };

  const original = (qid: string) => {
    const shown = answers[qid];
    return typeof shown === "number" ? attempt.optionOrder[qid]?.[shown] : undefined;
  };
  const correct = Object.fromEntries(served.map((q) => [q.id, original(q.id) === q.answer]));
  const score = Object.values(correct).filter(Boolean).length;
  const total = served.length;
  const passed = (score / total) * 100 >= program.exam.passPercent;

  const closed = await finishExamAttempt(user.id, attempt.attemptId, { score, total, passed }, () => ({
    programId: program.id,
    programTitle: program.title,
    // 8 hex chars ≈ 4 billion IDs per year — hard to guess when checking /verify links.
    credentialId: `NGE-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`,
    holderName: `${user.firstName} ${user.lastName}`,
    score,
    total,
    issuedAt: new Date().toISOString(),
  }));
  if ("error" in closed) {
    return {
      ok: false,
      error: closed.error === "already-submitted" ? "This attempt was already submitted. Start a new attempt to try again." : "Invalid exam attempt. Please start again.",
    };
  }

  return { ok: true, score, total, passPercent: program.exam.passPercent, passed, correct: passed ? correct : undefined, certificate: closed.certificate };
}
