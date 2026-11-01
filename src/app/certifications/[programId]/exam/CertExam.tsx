"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Certificate from "@/components/Certificate";
import { formatCertDate } from "@/lib/certificate/design";
import CertificateDownload from "@/components/CertificateDownload";
import { ScoreRing } from "@/components/ExamEngine";
import { IconArrowRight, IconCheck, IconRefresh, IconTimer, IconX } from "@/components/Icons";
import type { SiteSettings } from "@/lib/siteSettings";
import type { EarnedCertificate } from "@/lib/users";
import { EXAM_ATTEMPT_POLICY } from "@/lib/access";
import LinkedInAddButton from "@/components/LinkedInAddButton";
import { startExam, submitExam, type LearnerQuestion, type SubmitResult } from "./actions";

type Props = {
  programId: string;
  title: string;
  minutes: number;
  passPercent: number;
  questionCount: number;
  userName: string;
  settings: SiteSettings;
};

type Phase = "intro" | "exam" | "results";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const formatDate = formatCertDate;

export default function CertExam({ programId, title, minutes, passPercent, questionCount, userName, settings }: Props) {
  const certData = (c: EarnedCertificate) => ({
    name: c.holderName ?? userName,
    title: c.programTitle,
    score: c.score,
    total: c.total,
    credentialId: c.credentialId,
    issuedOn: formatDate(c.issuedAt),
  });
  const [phase, setPhase] = useState<Phase>("intro");
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<LearnerQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [current, setCurrent] = useState(0);
  const [endsAt, setEndsAt] = useState(0);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<Extract<SubmitResult, { ok: true }> | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const token = useRef("");
  const submitted = useRef(false);

  const begin = () =>
    startTransition(async () => {
      setError("");
      const r = await startExam(programId);
      if (!r.ok) {
        setAttemptsLeft(r.retryAt ? 0 : attemptsLeft);
        return setError(r.retryAt ? `${r.error} Next attempt: ${new Date(r.retryAt).toLocaleString()}.` : r.error);
      }
      setAttemptsLeft(r.attemptsLeft);
      setConfirming(false);
      token.current = r.token;
      submitted.current = false;
      setQuestions(r.questions);
      setAnswers(Object.fromEntries(r.questions.map((q) => [q.id, null])));
      setCurrent(0);
      setEndsAt(r.endsAt);
      setNow(Date.now());
      setResult(null);
      setPhase("exam");
    });

  const submit = useCallback(
    (latest: Record<string, number | null>) => {
      if (submitted.current) return;
      submitted.current = true;
      startTransition(async () => {
        const r = await submitExam(token.current, latest);
        if (!r.ok) {
          submitted.current = false;
          return setError(r.error);
        }
        setResult(r);
        setPhase("results");
      });
    },
    [],
  );

  // Keep the latest answers reachable from the timer without restarting it.
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (phase !== "exam") return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endsAt) submit(answersRef.current); // auto-submit when time runs out
    }, 250);
    return () => clearInterval(id);
  }, [phase, endsAt, submit]);

  const secondsLeft = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const q = questions[current];
  const answered = Object.values(answers).filter((a) => a !== null).length;
  const lowTime = secondsLeft <= 60;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <span className="truncate text-xs font-semibold text-slate-600">{title} — Certification Exam</span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <IconTimer className="h-4 w-4" /> Timed exam · single attempt
        </span>
      </div>

      {error && (
        <p role="alert" className="mx-6 mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200 sm:mx-8">
          {error}
        </p>
      )}

      {phase === "intro" && (
        <div className="p-6 sm:p-10">
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[[String(questionCount), "Questions"], [`${minutes} min`, "Time limit"], [`${passPercent}%`, "To pass"]].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-slate-50 py-4 ring-1 ring-slate-100">
                <dd className="font-display text-xl font-bold text-navy-900">{v}</dd>
                <dt className="text-xs text-slate-500">{l}</dt>
              </div>
            ))}
          </dl>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            {[
              "The timer starts when you click Start and cannot be paused.",
              "Your exam is submitted automatically when time runs out.",
              "You can move between questions before submitting.",
              `You have up to ${EXAM_ATTEMPT_POLICY.maxAttempts} attempts every 24 hours; each attempt can be submitted once.`,
              "Questions and answer options are shuffled for every attempt.",
              "Pass to receive a QR-verifiable certificate in your name.",
            ].map((t) => (
              <li key={t} className="flex gap-2"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" /> {t}</li>
            ))}
          </ul>
          <button onClick={begin} disabled={pending} className="btn-primary mt-8 w-full py-3.5 text-base">
            {pending ? "Preparing exam…" : <>Start Exam <IconArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      )}

      {phase === "exam" && q && (
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-navy-900">
              Question {current + 1} <span className="font-normal text-slate-500">of {questions.length}</span>
            </p>
            <div
              role="timer"
              aria-label={`Time remaining ${fmt(secondsLeft)}`}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-lg font-bold tabular-nums ring-1 ${
                lowTime ? "animate-pulse bg-orange-50 text-accent-strong ring-orange-200" : "bg-navy-900 text-white ring-navy-900"
              }`}
            >
              <IconTimer className="h-5 w-5" /> {fmt(secondsLeft)}
            </div>
            {/* Screen readers get two calm announcements instead of a ticking clock. */}
            <p aria-live="assertive" className="sr-only">
              {secondsLeft <= 60 ? "One minute remaining." : secondsLeft <= 300 ? "Five minutes remaining." : ""}
            </p>
          </div>

          <div className="mt-5 flex gap-1.5">
            {questions.map((qq, i) => (
              <button
                key={qq.id}
                onClick={() => setCurrent(i)}
                aria-label={`Go to question ${i + 1}${answers[qq.id] !== null ? ", answered" : ""}`}
                aria-current={i === current ? "step" : undefined}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i === current ? "bg-brand" : answers[qq.id] !== null ? "bg-brand-teal/50" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <div key={q.id} className="animate-fade-up">
            {q.scenario && (
              <p className="mt-6 rounded-lg border-l-4 border-brand bg-sky-50/60 px-4 py-3 text-sm text-slate-700">
                <span className="font-semibold text-navy-900">Scenario: </span>{q.scenario}
              </p>
            )}
            <fieldset className="mt-5">
              <legend className="font-display text-lg font-semibold text-navy-900">{q.prompt}</legend>
              <div className="mt-4 space-y-3">
                {q.options.map((opt, i) => {
                  const checked = answers[q.id] === i;
                  return (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                        checked ? "border-brand bg-sky-50 ring-2 ring-sky-100" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={checked}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                        className="mt-0.5 h-4 w-4 accent-brand"
                      />
                      <span className="text-sm text-slate-700">
                        <span className="mr-1 font-semibold text-navy-900">{String.fromCharCode(65 + i)}.</span> {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {confirming && answered < questions.length && (
            <p role="alert" className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
              You have {questions.length - answered} unanswered question{questions.length - answered === 1 ? "" : "s"}. Unanswered questions score zero — go back, or select “Submit anyway”.
            </p>
          )}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button onClick={() => setCurrent((c) => c - 1)} disabled={current === 0} className="btn-secondary">Back</button>
            <span className="hidden text-xs text-slate-500 sm:inline">{answered} of {questions.length} answered</span>
            {current === questions.length - 1 ? (
              <button
                onClick={() => (answered < questions.length && !confirming ? setConfirming(true) : submit(answers))}
                disabled={pending}
                className="btn-primary"
              >
                {pending ? "Submitting…" : confirming ? "Submit anyway" : "Submit Exam"}
              </button>
            ) : (
              <button onClick={() => setCurrent((c) => c + 1)} className="btn bg-navy-900 text-white hover:bg-navy-800">
                Next <IconArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "results" && result && (
        <div className="animate-fade-up p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <ScoreRing score={result.score} total={result.total} passed={result.passed} />
            <div className="text-center sm:text-left">
              <p className={`text-sm font-bold tracking-wide uppercase ${result.passed ? "text-emerald-600" : "text-accent-strong"}`}>
                {result.passed ? "Passed — certified!" : "Not yet passed"}
              </p>
              <h2 className="font-display text-2xl font-bold text-navy-900">
                {result.score} of {result.total} correct
              </h2>
              <p className="mt-1 text-sm text-slate-600">Pass mark: {result.passPercent}%</p>
            </div>
          </div>

          {result.correct ? (
          <>
          <h3 className="mt-8 text-sm font-semibold text-navy-900">Score breakdown</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {questions.map((qq, i) => {
              const ok = result.correct?.[qq.id];
              return (
                <li key={qq.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${ok ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}>
                    {ok ? <IconCheck className="h-4 w-4" /> : <IconX className="h-4 w-4" />}
                  </span>
                  <span className="text-slate-700"><span className="font-semibold text-navy-900">Q{i + 1}.</span> {qq.prompt}</span>
                </li>
              );
            })}
          </ul>
          </>
          ) : (
            <p className="mt-8 rounded-xl bg-slate-50 px-5 py-4 text-sm text-slate-700 ring-1 ring-slate-200">
              To protect the integrity of the credential, individual answers aren’t revealed after an unsuccessful attempt.
              Revisit the lessons and knowledge checks, then try again.
              {attemptsLeft !== null && (
                <span className="mt-1 block font-semibold text-navy-900">
                  {attemptsLeft > 0 ? `${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left in the next 24 hours.` : "No attempts left for the next 24 hours."}
                </span>
              )}
            </p>
          )}

          {result.passed && result.certificate ? (
            <>
              <h3 className="mt-8 text-sm font-semibold text-navy-900">Your certificate</h3>
              <div className="mt-3">
                <Certificate data={certData(result.certificate)} settings={settings} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <CertificateDownload data={certData(result.certificate)} settings={settings} />
                <LinkedInAddButton certificate={result.certificate} settings={settings} />
              </div>
              <Link href="/my-learning/courses#programs" className="mt-3 inline-flex text-sm font-semibold text-brand-ink hover:underline">Back to My Learning</Link>
            </>
          ) : (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button onClick={begin} disabled={pending || attemptsLeft === 0} className="btn-primary">
                <IconRefresh className="h-4 w-4" /> {attemptsLeft === 0 ? "No attempts left today" : "Retake Exam"}
              </button>
              <Link href="/courses" className="btn-secondary">Review courses</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
