"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { IconPencil, IconX } from "@/components/Icons";
import { LESSON_TEMPLATES, templateById, uid } from "@/lib/lessonTemplates";
import { saveCurriculumAction, type FormState } from "../../../actions";
import { FormError } from "../../../fields";

type LessonDraft = { key: string; id?: string; title: string; minutes: number; template?: string; blockCount?: number };
type ModuleDraft = { key: string; id?: string; title: string; lessons: LessonDraft[] };
export type CurriculumData = { id: string; title: string; lessons: { id: string; title: string; minutes: number; blockCount: number }[] }[];

const swap = <T,>(arr: T[], i: number, j: number) => {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export default function CurriculumBuilder({ courseId, initial }: { courseId: string; initial: CurriculumData }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCurriculumAction, {});
  const [modules, setModules] = useState<ModuleDraft[]>(() =>
    initial.map((m) => ({ key: m.id, id: m.id, title: m.title, lessons: m.lessons.map((l) => ({ key: l.id, ...l })) })),
  );
  const [templateFor, setTemplateFor] = useState<Record<string, string>>({});

  const payload = useMemo(
    () => JSON.stringify(modules.map((m) => ({ id: m.id, title: m.title, lessons: m.lessons.map(({ id, title, minutes, template }) => ({ id, title, minutes, template })) }))),
    [modules],
  );
  const initialPayload = useMemo(
    () => JSON.stringify(initial.map((m) => ({ id: m.id, title: m.title, lessons: m.lessons.map(({ id, title, minutes }) => ({ id, title, minutes })) }))),
    [initial],
  );
  const dirty = payload !== initialPayload;

  const setModule = (key: string, patch: Partial<ModuleDraft>) => setModules((ms) => ms.map((m) => (m.key === key ? { ...m, ...patch } : m)));
  const setLesson = (mKey: string, lKey: string, patch: Partial<LessonDraft>) =>
    setModules((ms) => ms.map((m) => (m.key === mKey ? { ...m, lessons: m.lessons.map((l) => (l.key === lKey ? { ...l, ...patch } : l)) } : m)));

  const addLesson = (mKey: string) => {
    const t = templateById(templateFor[mKey] ?? "concept");
    setModules((ms) =>
      ms.map((m) => (m.key === mKey ? { ...m, lessons: [...m.lessons, { key: uid("l"), title: `New ${t.name.toLowerCase()}`, minutes: t.minutes, template: t.id }] } : m)),
    );
  };

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="modules" value={payload} />

      {modules.length === 0 && (
        <div className="card p-10 text-center">
          <p className="font-display text-lg font-semibold text-navy-900">No modules yet</p>
          <p className="mt-1 text-sm text-slate-500">Modules group lessons into sections, e.g. “Foundations” and “In practice”.</p>
        </div>
      )}

      {modules.map((m, mi) => (
        <section key={m.key} className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-900 font-display text-sm font-bold text-white">{mi + 1}</span>
            <input
              value={m.title}
              onChange={(e) => setModule(m.key, { title: e.target.value })}
              placeholder="Module title"
              aria-label={`Module ${mi + 1} title`}
              className="min-w-0 flex-1 rounded-md bg-transparent px-2 py-1.5 font-semibold text-navy-900 outline-none focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
            <div className="flex shrink-0 items-center">
              <button type="button" disabled={mi === 0} onClick={() => setModules((ms) => swap(ms, mi, mi - 1))} className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-white disabled:opacity-30" aria-label="Move module up">↑</button>
              <button type="button" disabled={mi === modules.length - 1} onClick={() => setModules((ms) => swap(ms, mi, mi + 1))} className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-white disabled:opacity-30" aria-label="Move module down">↓</button>
              <button
                type="button"
                onClick={() => (m.lessons.length === 0 || confirm(`Delete “${m.title}” and its ${m.lessons.length} lesson(s)?`)) && setModules((ms) => ms.filter((x) => x.key !== m.key))}
                className="ml-1 rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>

          <ol className="divide-y divide-slate-100">
            {m.lessons.map((l, li) => (
              <li key={l.key} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:px-5">
                <span className="w-6 shrink-0 text-center text-xs font-semibold text-slate-400">{li + 1}</span>
                <input
                  value={l.title}
                  onChange={(e) => setLesson(m.key, l.key, { title: e.target.value })}
                  placeholder="Lesson title"
                  aria-label="Lesson title"
                  className="min-w-0 flex-1 rounded-md border border-transparent px-2 py-1.5 text-sm text-navy-900 outline-none hover:border-slate-200 focus:border-brand focus:ring-2 focus:ring-sky-100"
                />
                <label className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={l.minutes}
                    onChange={(e) => setLesson(m.key, l.key, { minutes: Number(e.target.value) })}
                    className="w-16 rounded-md border border-slate-200 px-2 py-1 text-right text-sm text-navy-900 outline-none focus:border-brand"
                    aria-label="Minutes"
                  />
                  min
                </label>
                <span className="w-40 shrink-0 text-right">
                  {l.id ? (
                    <Link
                      href={`/admin/courses/${courseId}/content/${l.id}`}
                      onClick={(e) => dirty && !confirm("You have unsaved curriculum changes. Leave without saving?") && e.preventDefault()}
                      className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-brand-ink hover:bg-sky-100"
                    >
                      <IconPencil className="h-3.5 w-3.5" /> Edit content · {l.blockCount ?? 0}
                    </Link>
                  ) : (
                    <span className="rounded-md bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">New · {templateById(l.template ?? "blank").name}</span>
                  )}
                </span>
                <span className="flex shrink-0 items-center">
                  <button type="button" disabled={li === 0} onClick={() => setModule(m.key, { lessons: swap(m.lessons, li, li - 1) })} className="rounded px-1.5 py-1 text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30" aria-label="Move lesson up">↑</button>
                  <button type="button" disabled={li === m.lessons.length - 1} onClick={() => setModule(m.key, { lessons: swap(m.lessons, li, li + 1) })} className="rounded px-1.5 py-1 text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30" aria-label="Move lesson down">↓</button>
                  <button
                    type="button"
                    onClick={() => (!l.blockCount || confirm(`Delete lesson “${l.title}” and its content?`)) && setModule(m.key, { lessons: m.lessons.filter((x) => x.key !== l.key) })}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete lesson"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-3 sm:px-5">
            <select
              value={templateFor[m.key] ?? "concept"}
              onChange={(e) => setTemplateFor((t) => ({ ...t, [m.key]: e.target.value }))}
              aria-label="Lesson template"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand"
            >
              {LESSON_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.description}</option>)}
            </select>
            <button type="button" onClick={() => addLesson(m.key)} className="btn-secondary py-2">+ Add lesson</button>
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={() => setModules((ms) => [...ms, { key: uid("m"), title: `Module ${ms.length + 1}`, lessons: [] }])}
        className="w-full rounded-2xl border-2 border-dashed border-slate-300 py-5 text-sm font-semibold text-slate-600 transition-colors hover:border-brand hover:text-brand-ink"
      >
        + Add module
      </button>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <FormError error={state.error} />
          {!state.error && (
            <span className={dirty ? "font-semibold text-amber-700" : "text-slate-500"}>
              {dirty ? "Unsaved changes" : `${modules.length} modules · ${totalLessons} lessons`} — new lessons get their template content when you save.
            </span>
          )}
        </div>
        <button type="submit" disabled={pending || !dirty} className="btn-primary shrink-0">{pending ? "Saving…" : "Save curriculum"}</button>
      </div>
    </form>
  );
}
