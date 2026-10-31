"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { IconCheck, IconX } from "@/components/Icons";
import type { Exam, ExamQuestion } from "@/lib/catalog";
import { saveExamAction, type FormState } from "../../../actions";
import { Field, FormError, inputCls } from "../../../fields";

type Draft = ExamQuestion & { key: string; showScenario: boolean };

let seq = 0;
const newKey = () => `k${Date.now().toString(36)}${(seq++).toString(36)}`;
const blank = (): Draft => ({ key: newKey(), id: "", prompt: "", options: ["", "", "", ""], answer: 0, explanation: "", scenario: "", showScenario: false });

export default function ExamBuilder({ programId, exam }: { programId: string; exam: Exam }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveExamAction, {});
  const [minutes, setMinutes] = useState(exam.minutes);
  const [passPercent, setPassPercent] = useState(exam.passPercent);
  const [questions, setQuestions] = useState<Draft[]>(() =>
    exam.questions.map((q) => ({ ...q, key: newKey(), scenario: q.scenario ?? "", explanation: q.explanation ?? "", showScenario: !!q.scenario })),
  );

  const update = (key: string, patch: Partial<Draft>) => setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...patch } : q)));
  const move = (i: number, d: -1 | 1) =>
    setQuestions((qs) => {
      const next = [...qs];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  const payload = JSON.stringify(
    questions.map(({ id, prompt, options, answer, explanation, scenario, showScenario }) => ({
      ...(id ? { id } : {}),
      prompt,
      options,
      answer,
      explanation,
      scenario: showScenario ? scenario : "",
    })),
  );
  const incomplete = questions.filter((q) => !q.prompt.trim() || q.options.some((o) => !o.trim())).length;

  return (
    <form action={action} className="mt-6 space-y-6">
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="questions" value={payload} />

      <div className="card grid gap-5 p-6 sm:grid-cols-3 sm:p-8">
        <Field id="minutes" label="Time limit (minutes)">
          <input id="minutes" name="minutes" type="number" min={1} max={300} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className={inputCls()} />
        </Field>
        <Field id="passPercent" label="Pass mark (%)">
          <input id="passPercent" name="passPercent" type="number" min={1} max={100} value={passPercent} onChange={(e) => setPassPercent(Number(e.target.value))} className={inputCls()} />
        </Field>
        <div className="rounded-xl bg-slate-50 p-4 text-sm ring-1 ring-slate-100">
          <p className="font-semibold text-navy-900">{questions.length} question{questions.length === 1 ? "" : "s"}</p>
          <p className="mt-1 text-slate-500">
            Pass = {questions.length ? Math.ceil((passPercent / 100) * questions.length) : 0} correct of {questions.length}
          </p>
        </div>
      </div>

      {questions.map((q, i) => (
        <fieldset key={q.key} className="card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <legend className="font-display text-lg font-semibold text-navy-900">Question {i + 1}</legend>
            <div className="flex items-center gap-1">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up">↑</button>
              <button type="button" disabled={i === questions.length - 1} onClick={() => move(i, 1)} className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down">↓</button>
              <button type="button" onClick={() => setQuestions((qs) => qs.filter((x) => x.key !== q.key))} className="rounded-md px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {q.showScenario ? (
              <Field id={`${q.key}-scenario`} label={<>Scenario <span className="font-normal text-slate-400">(optional context shown above the question)</span></>}>
                <textarea id={`${q.key}-scenario`} rows={2} value={q.scenario} onChange={(e) => update(q.key, { scenario: e.target.value })} className={inputCls()} />
              </Field>
            ) : (
              <button type="button" onClick={() => update(q.key, { showScenario: true })} className="text-xs font-semibold text-brand-ink hover:underline">+ Add scenario</button>
            )}

            <Field id={`${q.key}-prompt`} label="Question">
              <textarea id={`${q.key}-prompt`} rows={2} value={q.prompt} onChange={(e) => update(q.key, { prompt: e.target.value })} placeholder="e.g. Which strategy best supports…" className={inputCls()} />
            </Field>

            <div>
              <p className="text-sm font-semibold text-navy-900">Options <span className="font-normal text-slate-500">— select the correct answer</span></p>
              <ul className="mt-2 space-y-2">
                {q.options.map((opt, oi) => (
                  <li key={oi} className={`flex items-center gap-3 rounded-lg border p-2 pl-3 ${q.answer === oi ? "border-emerald-300 bg-emerald-50/60" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name={`${q.key}-answer`}
                      checked={q.answer === oi}
                      onChange={() => update(q.key, { answer: oi })}
                      className="h-4 w-4 accent-emerald-600"
                      aria-label={`Mark option ${String.fromCharCode(65 + oi)} correct`}
                    />
                    <span className="w-4 text-sm font-semibold text-navy-900">{String.fromCharCode(65 + oi)}</span>
                    <input
                      value={opt}
                      onChange={(e) => update(q.key, { options: q.options.map((o, j) => (j === oi ? e.target.value : o)) })}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      className="min-w-0 flex-1 rounded-md bg-transparent px-2 py-1.5 text-sm text-navy-900 outline-none focus:bg-white focus:ring-2 focus:ring-sky-100"
                    />
                    {q.answer === oi && <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700"><IconCheck className="h-3.5 w-3.5" /> Correct</span>}
                    <button
                      type="button"
                      disabled={q.options.length <= 2}
                      onClick={() =>
                        update(q.key, {
                          options: q.options.filter((_, j) => j !== oi),
                          answer: q.answer === oi ? 0 : q.answer > oi ? q.answer - 1 : q.answer,
                        })
                      }
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                      aria-label="Remove option"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              {q.options.length < 6 && (
                <button type="button" onClick={() => update(q.key, { options: [...q.options, ""] })} className="mt-2 text-xs font-semibold text-brand-ink hover:underline">+ Add option</button>
              )}
            </div>

            <Field id={`${q.key}-explanation`} label={<>Explanation <span className="font-normal text-slate-400">(optional, for your answer key)</span></>}>
              <textarea id={`${q.key}-explanation`} rows={2} value={q.explanation} onChange={(e) => update(q.key, { explanation: e.target.value })} className={inputCls()} />
            </Field>
          </div>
        </fieldset>
      ))}

      <button type="button" onClick={() => setQuestions((qs) => [...qs, blank()])} className="w-full rounded-2xl border-2 border-dashed border-slate-300 py-5 text-sm font-semibold text-slate-600 transition-colors hover:border-brand hover:text-brand-ink">
        + Add question
      </button>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <FormError error={state.error} />
          {!state.error && (incomplete ? <span className="text-amber-700">{incomplete} question(s) still need text.</span> : <span className="text-slate-500">Learners never see correct answers or explanations.</span>)}
        </div>
        <div className="flex shrink-0 gap-3">
          <Link href="/admin/programs" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={pending} className="btn-primary">{pending ? "Saving…" : "Save exam"}</button>
        </div>
      </div>
    </form>
  );
}
