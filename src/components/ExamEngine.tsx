"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/siteSettings";
import Certificate from "./Certificate";
import { formatCertDate } from "@/lib/certificate/design";
import CertificateDownload from "./CertificateDownload";
import { IconArrowRight, IconBadge, IconCheck, IconRefresh, IconShield, IconTimer, IconX } from "./Icons";

const EXAM_SECONDS = 5 * 60;
const PASS_MARK = 2;
const EXAM_TITLE = "Modern Pedagogy Diagnostic";

type Question = { prompt: string; scenario?: string; options: string[]; answer: number; explanation: string; topic: string };

const QUESTIONS: Question[] = [
  {
    topic: "Differentiated Instruction",
    scenario: "Your Grade 7 class has students reading two grade levels apart on the same science text.",
    prompt: "Which strategy best supports all learners while keeping the same learning objective?",
    options: [
      "Assign the advanced readers extra homework to keep them busy",
      "Provide tiered texts on the same concept with shared discussion questions",
      "Read the text aloud to everyone and skip the independent reading",
      "Group students by ability for the entire term",
    ],
    answer: 1,
    explanation: "Tiered texts let every student access the same concept at an appropriate level, while shared questions keep the class learning together.",
  },
  {
    topic: "AI in the Classroom",
    scenario: "A student submits an essay you suspect was largely written by a generative AI tool.",
    prompt: "What is the most pedagogically sound first step?",
    options: [
      "Run it through an AI detector and assign a zero if flagged",
      "Ignore it — AI use is inevitable",
      "Hold a short conference asking the student to explain their reasoning and drafting process",
      "Ban all devices from your classroom",
    ],
    answer: 2,
    explanation: "AI detectors are unreliable. A conversation about process surfaces understanding and opens a dialogue about appropriate AI use.",
  },
  {
    topic: "Assessment Design",
    prompt: "Which rubric criterion is best aligned to an active-learning objective of “students can justify a claim with evidence”?",
    options: [
      "Essay is at least 500 words long",
      "Uses neat handwriting and correct formatting",
      "Submitted on time",
      "Links each claim to specific, relevant evidence and explains the connection",
    ],
    answer: 3,
    explanation: "Strong criteria measure the target skill directly. Length, neatness, and punctuality don't show the ability to justify claims.",
  },
];

type Phase = "intro" | "exam" | "results";

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Sample IDs start with SAMPLE- so the verification page can explain they aren't real credentials. */
const sampleId = () => `SAMPLE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function ExamEngine({ settings = DEFAULT_SETTINGS }: { settings?: SiteSettings }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const [endAt, setEndAt] = useState(0);
  const [now, setNow] = useState(0);
  const [credentialId, setCredentialId] = useState("");
  const [issuedOn, setIssuedOn] = useState("");
  const [timedOut, setTimedOut] = useState(false);

  const submit = useCallback((auto = false) => {
    setNow(Date.now());
    setTimedOut(auto);
    setCredentialId(sampleId());
    setIssuedOn(formatCertDate(new Date()));
    setPhase("results");
  }, []);

  // Deadline-based timer: stays accurate even if the tab is throttled in the background.
  useEffect(() => {
    if (phase !== "exam") return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endAt) submit(true);
    }, 250);
    return () => clearInterval(id);
  }, [phase, endAt, submit]);

  const secondsLeft = Math.max(0, Math.ceil((endAt - now) / 1000));

  const score = useMemo(() => answers.reduce<number>((n, a, i) => n + (a === QUESTIONS[i].answer ? 1 : 0), 0), [answers]);
  const passed = score >= PASS_MARK;

  const start = () => {
    setAnswers(QUESTIONS.map(() => null));
    setCurrent(0);
    const t = Date.now();
    setNow(t);
    setEndAt(t + EXAM_SECONDS * 1000);
    setTimedOut(false);
    setPhase("exam");
  };

  const choose = (opt: number) => setAnswers((prev) => prev.map((a, i) => (i === current ? opt : a)));

  const q = QUESTIONS[current];
  const isLast = current === QUESTIONS.length - 1;
  const answeredCount = answers.filter((a) => a !== null).length;
  const lowTime = secondsLeft <= 60;
  const displayName = name.trim() || "Guest Educator";
  const certData = {
    name: displayName,
    title: passed ? EXAM_TITLE : "Diagnostic Participation",
    score,
    total: QUESTIONS.length,
    credentialId,
    issuedOn,
    sample: true,
  };

  return (
    <section id="practice-tests" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div className="lg:pt-6">
          <span className="eyebrow">Try the exam engine</span>
          <h2 className="section-title mt-4">Take a 3-question diagnostic — free</h2>
          <p className="mt-4 text-lg text-slate-600">
            Experience the same timed, scenario-based format used in our certification exams. Get an instant score breakdown and a
            sample certificate.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              [IconTimer, "Live 5-minute countdown", "Auto-submits when time runs out."],
              [IconShield, "Secure exam environment", "Full exams use browser lockdown & identity checks."],
              [IconBadge, "Instant credential", "Downloadable PDF with a unique verification code."],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof IconTimer;
              return (
                <li key={title as string} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-50 text-brand-ink ring-1 ring-sky-100">
                    <I className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{title as string}</p>
                    <p className="text-sm text-slate-600">{body as string}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 hidden text-xs font-medium text-slate-500 sm:inline">exam.nextgeneducator — {EXAM_TITLE}</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <IconShield className="h-4 w-4" /> Practice mode
            </span>
          </div>

          {phase === "intro" && (
            <div className="animate-fade-up p-6 sm:p-10">
              <h3 className="font-display text-2xl font-bold text-navy-900">{EXAM_TITLE}</h3>
              <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[["3", "Questions"], ["5:00", "Time limit"], [`${PASS_MARK}/3`, "To pass"]].map(([v, l]) => (
                  <div key={l} className="rounded-xl bg-slate-50 py-4 ring-1 ring-slate-100">
                    <dd className="font-display text-xl font-bold text-navy-900">{v}</dd>
                    <dt className="text-xs text-slate-500">{l}</dt>
                  </div>
                ))}
              </dl>
              <label htmlFor="exam-name" className="mt-8 block text-sm font-semibold text-navy-900">
                Name for your certificate
              </label>
              <input
                id="exam-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="e.g. Priya Sharma"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-navy-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-sky-100"
              />
              <button onClick={start} className="btn-primary mt-6 w-full py-3.5 text-base">
                Start Diagnostic <IconArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">The timer starts as soon as you begin.</p>
            </div>
          )}

          {phase === "exam" && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    Question {current + 1} <span className="font-normal text-slate-500">of {QUESTIONS.length}</span>
                  </p>
                  <p className="text-xs text-slate-500">{q.topic}</p>
                </div>
                <div
                  role="timer"
                  aria-live={lowTime ? "assertive" : "off"}
                  aria-label={`Time remaining ${formatTime(secondsLeft)}`}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-lg font-bold tabular-nums ring-1 transition-colors ${
                    lowTime ? "animate-pulse bg-orange-50 text-accent-strong ring-orange-200" : "bg-navy-900 text-white ring-navy-900"
                  }`}
                >
                  <IconTimer className="h-5 w-5" /> {formatTime(secondsLeft)}
                </div>
              </div>

              {/* Tracker */}
              <div className="mt-5 flex gap-2" aria-hidden="true">
                {QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    tabIndex={-1}
                    onClick={() => setCurrent(i)}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      i === current ? "bg-brand" : answers[i] !== null ? "bg-brand-teal/50" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <div key={current} className="animate-fade-up">
                {q.scenario && (
                  <p className="mt-6 rounded-lg border-l-4 border-brand bg-sky-50/60 px-4 py-3 text-sm text-slate-700">
                    <span className="font-semibold text-navy-900">Scenario: </span>{q.scenario}
                  </p>
                )}
                <fieldset className="mt-5">
                  <legend className="font-display text-lg font-semibold text-navy-900">{q.prompt}</legend>
                  <div className="mt-4 space-y-3">
                    {q.options.map((opt, i) => {
                      const checked = answers[current] === i;
                      return (
                        <label
                          key={i}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                            checked ? "border-brand bg-sky-50 ring-2 ring-sky-100" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${current}`}
                            checked={checked}
                            onChange={() => choose(i)}
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

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
                <button onClick={() => setCurrent((c) => c - 1)} disabled={current === 0} className="btn-secondary">
                  Back
                </button>
                <span className="hidden text-xs text-slate-500 sm:inline">{answeredCount} of {QUESTIONS.length} answered</span>
                {isLast ? (
                  <button onClick={() => submit()} disabled={answers[current] === null} className="btn-primary">
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrent((c) => c + 1)}
                    disabled={answers[current] === null}
                    className="btn bg-navy-900 text-white hover:bg-navy-800"
                  >
                    Next <IconArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {phase === "results" && (
            <div className="animate-fade-up p-6 sm:p-8">
              {timedOut && (
                <p className="mb-5 rounded-lg bg-orange-50 px-4 py-2.5 text-sm font-medium text-accent-dark ring-1 ring-orange-200">
                  Time’s up — your exam was submitted automatically.
                </p>
              )}
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <ScoreRing score={score} total={QUESTIONS.length} passed={passed} />
                <div className="text-center sm:text-left">
                  <p className={`text-sm font-bold tracking-wide uppercase ${passed ? "text-emerald-600" : "text-accent-strong"}`}>
                    {passed ? "Passed" : "Not yet passed"}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-navy-900">
                    {passed ? "Great work, " : "Good effort, "}{displayName.split(" ")[0]}!
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {score} of {QUESTIONS.length} correct · Time used {formatTime(EXAM_SECONDS - secondsLeft)}
                  </p>
                </div>
              </div>

              <h4 className="mt-8 text-sm font-semibold text-navy-900">Score breakdown</h4>
              <ul className="mt-3 space-y-3">
                {QUESTIONS.map((qq, i) => {
                  const ok = answers[i] === qq.answer;
                  return (
                    <li key={i} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start gap-3">
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${ok ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}>
                          {ok ? <IconCheck className="h-4 w-4" /> : <IconX className="h-4 w-4" />}
                        </span>
                        <div className="text-sm">
                          <p className="font-semibold text-navy-900">Q{i + 1}. {qq.topic}</p>
                          {!ok && (
                            <p className="mt-1 text-slate-600">
                              {answers[i] === null ? "Not answered. " : `Your answer: ${String.fromCharCode(65 + answers[i]!)}. `}
                              Correct: <span className="font-medium text-navy-900">{String.fromCharCode(65 + qq.answer)}</span>
                            </p>
                          )}
                          <p className="mt-1 text-slate-500">{qq.explanation}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <h4 className="mt-8 text-sm font-semibold text-navy-900">Certificate preview</h4>
              <div className="mt-3">
                <Certificate data={certData} settings={settings} />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <CertificateDownload data={certData} settings={settings} className="btn-primary w-full" />
                </div>
                <button onClick={start} className="btn-secondary flex-1">
                  <IconRefresh className="h-4 w-4" /> Retake Diagnostic
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ScoreRing({ score, total, passed }: { score: number; total: number; passed: boolean }) {
  const pct = score / total;
  const r = 42, c = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} strokeWidth="9" className="fill-none stroke-slate-100" />
        <circle
          cx="50" cy="50" r={r} strokeWidth="9" strokeLinecap="round"
          className={`fill-none transition-[stroke-dashoffset] duration-1000 ${passed ? "stroke-emerald-500" : "stroke-accent"}`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <span className="font-display text-2xl font-bold text-navy-900">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}
