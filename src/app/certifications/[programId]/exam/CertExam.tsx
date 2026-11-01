"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Certificate from "@/components/Certificate";
import { formatCertDate } from "@/lib/certificate/design";
import CertificateDownload from "@/components/CertificateDownload";
import { ScoreRing } from "@/components/ExamEngine";
import { IconArrowRight, IconCheck, IconGrid, IconRefresh, IconTimer, IconX } from "@/components/Icons";
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

  const [showGrid, setShowGrid] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const go = (i: number) => {
    setCurrent(Math.max(0, Math.min(questions.length - 1, i)));
    scrollRef.current?.scrollTo({ top: 0 });
  };
  const requestSubmit = () => (answered < questions.length && !confirming ? setConfirming(true) : submit(answers));

  // Bring the result card into view when the exam closes, instead of leaving the learner at the page banner.
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phase === "results") cardRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [phase]);

  // While the exam is open: lock the page behind it and warn before an accidental refresh or back-swipe.
  useEffect(() => {
    if (phase !== "exam") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("beforeunload", warn);
    };
  }, [phase]);

  return (
    <div ref={cardRef} className="card scroll-mt-24 overflow-hidden">
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

      {phase === "exam" && q && typeof document !== "undefined" &&
        createPortal(
          // Full-screen exam mode: no site header, hero or footer, so nothing can be tapped by accident.
          <div role="dialog" aria-modal="true" aria-label={`${title} certification exam`} className="fixed inset-0 z-50 flex flex-col bg-slate-50">
            <header className="shrink-0 border-b border-slate-200 bg-white">
              <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-500">{title}</p>
                  <p className="text-sm font-semibold text-navy-900">
                    Question {current + 1} <span className="font-normal text-slate-500">of {questions.length}</span>
                  </p>
                </div>
                <div
                  role="timer"
                  aria-label={`Time remaining ${fmt(secondsLeft)}`}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-base font-bold tabular-nums ring-1 sm:text-lg ${
                    lowTime ? "animate-pulse bg-orange-50 text-accent-strong ring-orange-200" : "bg-navy-900 text-white ring-navy-900"
                  }`}
                >
                  <IconTimer className="h-5 w-5" /> {fmt(secondsLeft)}
                </div>
                <button
                  type="button"
                  onClick={() => setShowGrid(true)}
                  className="flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-navy-900 ring-1 ring-slate-200 hover:bg-slate-50"
                  aria-haspopup="dialog"
                >
                  <IconGrid className="h-5 w-5" /> <span className="hidden sm:inline">Questions</span>
                </button>
                {/* Screen readers get two calm announcements instead of a ticking clock. */}
                <p aria-live="assertive" className="sr-only">
                  {secondsLeft <= 60 ? "One minute remaining." : secondsLeft <= 300 ? "Five minutes remaining." : ""}
                </p>
              </div>
              <div className="h-1.5 bg-slate-100" aria-hidden="true">
                <div className="h-1.5 bg-gradient-to-r from-brand to-brand-teal transition-all" style={{ width: `${(answered / questions.length) * 100}%` }} />
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
              <div key={q.id} className="animate-fade-up mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
                {q.scenario && (
                  <p className="mb-5 rounded-xl border-l-4 border-brand bg-sky-50 px-4 py-3 text-[15px] leading-relaxed text-slate-700">
                    <span className="font-semibold text-navy-900">Scenario: </span>{q.scenario}
                  </p>
                )}
                <fieldset>
                  <legend className="font-display text-lg leading-snug font-semibold text-navy-900 sm:text-xl">{q.prompt}</legend>
                  <div className="mt-5 space-y-3">
                    {q.options.map((opt, i) => {
                      const checked = answers[q.id] === i;
                      return (
                        <label
                          key={i}
                          className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 transition-all active:scale-[0.99] ${
                            checked ? "border-brand bg-sky-50 ring-2 ring-sky-100" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input type="radio" name={q.id} checked={checked} onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))} className="sr-only" />
                          <span
                            aria-hidden="true"
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${checked ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="pt-0.5 text-[15px] leading-relaxed text-slate-800">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p>}
                {confirming && answered < questions.length && (
                  <p role="alert" className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
                    You have {questions.length - answered} unanswered question{questions.length - answered === 1 ? "" : "s"}. Unanswered questions score zero — go back, or select “Submit anyway”.
                  </p>
                )}
              </div>
            </div>

            <footer className="shrink-0 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
              <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
                <button onClick={() => go(current - 1)} disabled={current === 0} className="btn-secondary h-12 px-5">Back</button>
                <p className="flex-1 text-center text-xs font-semibold text-slate-500">{answered}/{questions.length} answered</p>
                {current === questions.length - 1 ? (
                  <button onClick={requestSubmit} disabled={pending} className="btn-primary h-12 px-5">
                    {pending ? "Submitting…" : confirming ? "Submit anyway" : "Submit"}
                  </button>
                ) : (
                  <button onClick={() => go(current + 1)} className="btn h-12 bg-navy-900 px-6 text-white hover:bg-navy-800">
                    Next <IconArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </footer>

            {showGrid && (
              <div className="fixed inset-0 z-10 flex items-end bg-navy-950/50 sm:items-center sm:justify-center" onClick={() => setShowGrid(false)}>
                <div
                  role="dialog"
                  aria-label="All questions"
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-semibold text-navy-900">Questions</p>
                    <button type="button" onClick={() => setShowGrid(false)} className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close">
                      <IconX className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{answered} answered · {questions.length - answered} left. Tap a number to jump to it.</p>
                  <div className="mt-4 grid grid-cols-5 gap-2.5">
                    {questions.map((qq, i) => {
                      const done = answers[qq.id] !== null;
                      return (
                        <button
                          key={qq.id}
                          onClick={() => { go(i); setShowGrid(false); }}
                          aria-label={`Question ${i + 1}${done ? ", answered" : ", not answered"}`}
                          aria-current={i === current ? "step" : undefined}
                          className={`h-12 rounded-xl text-sm font-bold transition-colors ${
                            i === current ? "bg-navy-900 text-white" : done ? "bg-sky-100 text-brand-ink ring-1 ring-sky-200" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-sky-100 ring-1 ring-sky-200" /> Answered</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-100" /> Not answered</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-navy-900" /> Current</span>
                  </div>
                  <button onClick={() => { setShowGrid(false); go(questions.length - 1); requestSubmit(); }} disabled={pending} className="btn-primary mt-5 h-12 w-full">
                    Review and submit exam
                  </button>
                </div>
              </div>
            )}
          </div>,
          document.body,
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
