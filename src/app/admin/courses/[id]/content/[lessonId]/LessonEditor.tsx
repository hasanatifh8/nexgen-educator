"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { IconCheck, IconX } from "@/components/Icons";
import LessonContent from "@/components/learn/LessonContent";
import type { Block, BlockType } from "@/lib/catalog";
import { BLOCK_TYPES, uid, videoEmbedUrl } from "@/lib/lessonTemplates";
import { saveLessonAction, type FormState } from "../../../../actions";
import { Field, FormError, inputCls } from "../../../../fields";

type Props = { courseId: string; lessonId: string; initial: { title: string; minutes: number; blocks: Block[] } };

const TONES = [
  { id: "tip", label: "Tip", cls: "bg-sky-50 text-sky-800 ring-sky-200" },
  { id: "note", label: "Note", cls: "bg-slate-100 text-navy-900 ring-slate-300" },
  { id: "warning", label: "Warning", cls: "bg-orange-50 text-orange-800 ring-orange-200" },
] as const;

function BlockFields({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const set = (patch: Record<string, unknown>) => onChange({ ...block, ...patch } as Block);
  const id = (k: string) => `${block.id}-${k}`;

  switch (block.type) {
    case "text":
      return (
        <Field id={id("body")} label="Text" hint="## Heading · ### Subheading · - bullet · 1. numbered · **bold** · *italic* · blank line = new paragraph">
          <textarea id={id("body")} rows={8} value={block.body} onChange={(e) => set({ body: e.target.value })} className={`${inputCls()} font-mono text-[13px] leading-relaxed`} />
        </Field>
      );
    case "video": {
      const ok = block.url ? !!videoEmbedUrl(block.url) : null;
      return (
        <div className="space-y-4">
          <Field id={id("url")} label="Video link" hint={ok === null ? "Paste a YouTube or Vimeo link." : ok ? "✓ Will play inside the lesson." : "Not a YouTube/Vimeo link — learners will get an “Open video” button."}>
            <input id={id("url")} value={block.url} onChange={(e) => set({ url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" className={inputCls(ok === false)} />
          </Field>
          <Field id={id("caption")} label="Caption (optional)">
            <input id={id("caption")} value={block.caption ?? ""} onChange={(e) => set({ caption: e.target.value })} className={inputCls()} />
          </Field>
        </div>
      );
    }
    case "image":
      return (
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <div className="space-y-4">
            <Field id={id("url")} label="Image link (https://…)">
              <input id={id("url")} value={block.url} onChange={(e) => set({ url: e.target.value })} className={inputCls()} />
            </Field>
            <Field id={id("alt")} label="Alt text" hint="Describe the image for screen-reader users.">
              <input id={id("alt")} value={block.alt} onChange={(e) => set({ alt: e.target.value })} className={inputCls()} />
            </Field>
            <Field id={id("caption")} label="Caption (optional)">
              <input id={id("caption")} value={block.caption ?? ""} onChange={(e) => set({ caption: e.target.value })} className={inputCls()} />
            </Field>
          </div>
          {block.url && (
            // eslint-disable-next-line @next/next/no-img-element -- preview of an admin-provided URL
            <img src={block.url} alt="" className="h-32 w-full rounded-lg border border-slate-200 object-cover" />
          )}
        </div>
      );
    case "callout":
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button key={t.id} type="button" onClick={() => set({ tone: t.id })} aria-pressed={block.tone === t.id}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${block.tone === t.id ? t.cls : "bg-white text-slate-500 ring-slate-200"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <Field id={id("title")} label="Title">
            <input id={id("title")} value={block.title} onChange={(e) => set({ title: e.target.value })} className={inputCls()} />
          </Field>
          <Field id={id("body")} label="Text">
            <textarea id={id("body")} rows={3} value={block.body} onChange={(e) => set({ body: e.target.value })} className={inputCls()} />
          </Field>
        </div>
      );
    case "keyPoints":
      return (
        <div className="space-y-4">
          <Field id={id("title")} label="Heading">
            <input id={id("title")} value={block.title} onChange={(e) => set({ title: e.target.value })} className={inputCls()} />
          </Field>
          <div>
            <p className="text-sm font-semibold text-navy-900">Points</p>
            <ul className="mt-2 space-y-2">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <IconCheck className="h-4 w-4 shrink-0 text-brand-ink" />
                  <input value={item} onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? e.target.value : x)) })} aria-label={`Point ${i + 1}`} className={`${inputCls()} !mt-0`} />
                  <button type="button" disabled={block.items.length <= 1} onClick={() => set({ items: block.items.filter((_, j) => j !== i) })} className="rounded p-1 text-slate-400 hover:text-red-500 disabled:opacity-30" aria-label="Remove point">
                    <IconX className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => set({ items: [...block.items, ""] })} className="mt-2 text-xs font-semibold text-brand-ink hover:underline">+ Add point</button>
          </div>
        </div>
      );
    case "scenario":
      return (
        <div className="space-y-4">
          <Field id={id("title")} label="Title">
            <input id={id("title")} value={block.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. The silent screen" className={inputCls()} />
          </Field>
          <Field id={id("body")} label="Scenario">
            <textarea id={id("body")} rows={4} value={block.body} onChange={(e) => set({ body: e.target.value })} placeholder="Describe the classroom situation…" className={inputCls()} />
          </Field>
        </div>
      );
    case "quiz":
      return (
        <div className="space-y-4">
          <Field id={id("question")} label="Question">
            <textarea id={id("question")} rows={2} value={block.question} onChange={(e) => set({ question: e.target.value })} className={inputCls()} />
          </Field>
          <div>
            <p className="text-sm font-semibold text-navy-900">Options <span className="font-normal text-slate-500">— select the correct one</span></p>
            <ul className="mt-2 space-y-2">
              {block.options.map((opt, i) => (
                <li key={i} className={`flex items-center gap-3 rounded-lg border p-2 pl-3 ${block.answer === i ? "border-emerald-300 bg-emerald-50/60" : "border-slate-200"}`}>
                  <input type="radio" checked={block.answer === i} onChange={() => set({ answer: i })} name={`${block.id}-answer`} className="h-4 w-4 accent-emerald-600" aria-label={`Option ${i + 1} correct`} />
                  <input value={opt} onChange={(e) => set({ options: block.options.map((o, j) => (j === i ? e.target.value : o)) })} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="min-w-0 flex-1 rounded-md bg-transparent px-2 py-1.5 text-sm text-navy-900 outline-none focus:bg-white focus:ring-2 focus:ring-sky-100" />
                  <button type="button" disabled={block.options.length <= 2}
                    onClick={() => set({ options: block.options.filter((_, j) => j !== i), answer: block.answer === i ? 0 : block.answer > i ? block.answer - 1 : block.answer })}
                    className="rounded p-1 text-slate-400 hover:text-red-500 disabled:opacity-30" aria-label="Remove option">
                    <IconX className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            {block.options.length < 6 && <button type="button" onClick={() => set({ options: [...block.options, ""] })} className="mt-2 text-xs font-semibold text-brand-ink hover:underline">+ Add option</button>}
          </div>
          <Field id={id("explanation")} label="Feedback shown after answering (optional)">
            <textarea id={id("explanation")} rows={2} value={block.explanation} onChange={(e) => set({ explanation: e.target.value })} className={inputCls()} />
          </Field>
        </div>
      );
    case "reflection":
      return (
        <Field id={id("prompt")} label="Reflection prompt" hint="Learners’ answers are saved privately on their own device.">
          <textarea id={id("prompt")} rows={2} value={block.prompt} onChange={(e) => set({ prompt: e.target.value })} className={inputCls()} />
        </Field>
      );
    case "resource":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={id("title")} label="Title">
              <input id={id("title")} value={block.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Rubric template (PDF)" className={inputCls()} />
            </Field>
            <Field id={id("url")} label="Link (https://…)">
              <input id={id("url")} value={block.url} onChange={(e) => set({ url: e.target.value })} className={inputCls()} />
            </Field>
          </div>
          <Field id={id("description")} label="Description (optional)">
            <input id={id("description")} value={block.description ?? ""} onChange={(e) => set({ description: e.target.value })} className={inputCls()} />
          </Field>
        </div>
      );
  }
}

function AddBlockMenu({ onAdd, onClose }: { onAdd: (t: BlockType) => void; onClose?: () => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {(Object.keys(BLOCK_TYPES) as BlockType[]).map((t) => (
        <button key={t} type="button" onClick={() => { onAdd(t); onClose?.(); }}
          className="rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-brand hover:bg-sky-50/50">
          <span className="block text-sm font-semibold text-navy-900">{BLOCK_TYPES[t].label}</span>
          <span className="block text-xs text-slate-500">{BLOCK_TYPES[t].description}</span>
        </button>
      ))}
    </div>
  );
}

export default function LessonEditor({ courseId, lessonId, initial }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveLessonAction, {});
  const [title, setTitle] = useState(initial.title);
  const [minutes, setMinutes] = useState(initial.minutes);
  const [blocks, setBlocks] = useState<Block[]>(initial.blocks);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [insertAt, setInsertAt] = useState<number | null>(null);

  const dirty = JSON.stringify({ title, minutes, blocks }) !== JSON.stringify(initial);
  const update = (i: number, b: Block) => setBlocks((bs) => bs.map((x, j) => (j === i ? b : x)));
  const insert = (i: number, t: BlockType) => setBlocks((bs) => [...bs.slice(0, i), BLOCK_TYPES[t].create(), ...bs.slice(i)]);
  const move = (i: number, d: -1 | 1) => setBlocks((bs) => { const n = [...bs]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });

  return (
    <form action={action} className="mt-6 space-y-6">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />

      <div className="card grid gap-5 p-6 sm:grid-cols-[1fr_160px] sm:p-8">
        <Field id="title" label="Lesson title">
          <input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls()} />
        </Field>
        <Field id="minutes" label="Duration (min)">
          <input id="minutes" name="minutes" type="number" min={1} max={600} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className={inputCls()} />
        </Field>
      </div>

      <div className="inline-flex rounded-lg bg-white p-1 ring-1 ring-slate-200" role="tablist">
        {(["edit", "preview"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize ${tab === t ? "bg-navy-900 text-white" : "text-slate-600 hover:text-navy-900"}`}>
            {t === "preview" ? "Learner preview" : "Edit blocks"}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div className="card p-6 sm:p-10">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900">{title || "Untitled lesson"}</h1>
            <p className="mt-2 text-sm text-slate-500">{minutes} min</p>
            <div className="mt-8"><LessonContent blocks={blocks} /></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((b, i) => (
            <div key={b.id}>
              <section className="card overflow-hidden">
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                  <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">{i + 1}</span>
                  <span className="flex-1 text-sm font-semibold text-navy-900">{BLOCK_TYPES[b.type].label}</span>
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-white disabled:opacity-30" aria-label="Move up">↑</button>
                  <button type="button" disabled={i === blocks.length - 1} onClick={() => move(i, 1)} className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-white disabled:opacity-30" aria-label="Move down">↓</button>
                  <button type="button" onClick={() => setBlocks((bs) => [...bs.slice(0, i + 1), { ...structuredClone(b), id: uid() }, ...bs.slice(i + 1)])} className="rounded px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white">Duplicate</button>
                  <button type="button" onClick={() => setBlocks((bs) => bs.filter((_, j) => j !== i))} className="rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button>
                </div>
                <div className="p-5">
                  <BlockFields block={b} onChange={(nb) => update(i, nb)} />
                </div>
              </section>
              {insertAt === i + 1 ? (
                <div className="mt-3 rounded-2xl bg-slate-100 p-3">
                  <AddBlockMenu onAdd={(t) => insert(i + 1, t)} onClose={() => setInsertAt(null)} />
                  <button type="button" onClick={() => setInsertAt(null)} className="mt-2 text-xs font-semibold text-slate-500">Cancel</button>
                </div>
              ) : (
                i < blocks.length - 1 && (
                  <div className="flex justify-center py-1">
                    <button type="button" onClick={() => setInsertAt(i + 1)} className="rounded-full px-3 py-0.5 text-xs font-semibold text-slate-400 hover:bg-white hover:text-brand-ink">+ Insert block here</button>
                  </div>
                )
              )}
            </div>
          ))}

          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-4">
            <p className="mb-3 text-sm font-semibold text-navy-900">Add a block</p>
            <AddBlockMenu onAdd={(t) => insert(blocks.length, t)} />
          </div>
        </div>
      )}

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <FormError error={state.error} />
          {!state.error && <span className={dirty ? "font-semibold text-amber-700" : "text-slate-500"}>{dirty ? "Unsaved changes" : `${blocks.length} blocks`}</span>}
        </div>
        <div className="flex shrink-0 gap-3">
          <Link href={`/admin/courses/${courseId}/content`} onClick={(e) => dirty && !confirm("Discard unsaved changes?") && e.preventDefault()} className="btn-secondary">Back</Link>
          <button type="submit" disabled={pending || !dirty} className="btn-primary">{pending ? "Saving…" : "Save lesson"}</button>
        </div>
      </div>
    </form>
  );
}
