"use client";

import { useEffect, useState } from "react";
import type { Block } from "@/lib/catalog";
import { videoEmbedUrl } from "@/lib/lessonTemplates";
import { IconAlert, IconArrowRight, IconCheck, IconImage, IconInfo, IconLightbulb, IconLink, IconPencil, IconPlay, IconX } from "../Icons";
import RichText from "./RichText";

const CALLOUT = {
  tip: { icon: IconLightbulb, box: "border-sky-200 bg-sky-50/70", iconBox: "bg-brand text-white", title: "text-sky-900" },
  note: { icon: IconInfo, box: "border-slate-200 bg-slate-50", iconBox: "bg-navy-900 text-white", title: "text-navy-900" },
  warning: { icon: IconAlert, box: "border-orange-200 bg-orange-50/70", iconBox: "bg-accent text-white", title: "text-orange-900" },
} as const;

function Quiz({ block }: { block: Extract<Block, { type: "quiz" }> }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const right = picked === block.answer;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <p className="text-xs font-bold tracking-[0.15em] text-brand-ink uppercase">Knowledge check</p>
      <p className="mt-2 font-display text-lg font-semibold text-navy-900">{block.question || "Untitled question"}</p>
      <div className="mt-4 space-y-2.5">
        {block.options.map((opt, i) => {
          const state = !checked ? (picked === i ? "picked" : "idle") : i === block.answer ? "correct" : picked === i ? "wrong" : "idle";
          return (
            <button
              key={i}
              type="button"
              disabled={checked}
              onClick={() => setPicked(i)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                state === "picked" ? "border-brand bg-sky-50 ring-2 ring-sky-100"
                : state === "correct" ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : state === "wrong" ? "border-red-300 bg-red-50 text-red-900"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                state === "correct" ? "bg-emerald-600 text-white" : state === "wrong" ? "bg-red-500 text-white" : "bg-slate-100 text-navy-900"
              }`}>
                {state === "correct" ? <IconCheck className="h-3.5 w-3.5" /> : state === "wrong" ? <IconX className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
              </span>
              {opt || <span className="text-slate-400">Empty option</span>}
            </button>
          );
        })}
      </div>
      {checked ? (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${right ? "bg-emerald-50 text-emerald-900" : "bg-orange-50 text-orange-900"}`}>
          <p className="font-semibold">{right ? "Correct!" : "Not quite."}</p>
          {block.explanation && <p className="mt-1">{block.explanation}</p>}
          {!right && (
            <button type="button" onClick={() => { setChecked(false); setPicked(null); }} className="mt-2 text-xs font-semibold underline">Try again</button>
          )}
        </div>
      ) : (
        <button type="button" disabled={picked === null} onClick={() => setChecked(true)} className="btn mt-4 bg-navy-900 text-white hover:bg-navy-800">
          Check answer
        </button>
      )}
    </div>
  );
}

function Reflection({ block, storageKey }: { block: Extract<Block, { type: "reflection" }>; storageKey?: string }) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!storageKey) return;
    const v = localStorage.getItem(storageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from browser storage
    if (v) setValue(v);
  }, [storageKey]);
  return (
    <div className="rounded-2xl border border-dashed border-brand/40 bg-gradient-to-br from-sky-50/80 to-cyan-50/40 p-6">
      <p className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-brand-ink uppercase"><IconPencil className="h-4 w-4" /> Reflect</p>
      <p className="mt-2 font-display text-lg font-semibold text-navy-900">{block.prompt || "Reflection prompt"}</p>
      <textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false); }}
        onBlur={() => { if (storageKey) { localStorage.setItem(storageKey, value); setSaved(true); } }}
        rows={3}
        placeholder="Jot down your thoughts — only you can see this."
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:border-brand focus:ring-4 focus:ring-sky-100"
      />
      <p className="mt-1 h-4 text-xs text-slate-500">{saved ? "Saved on this device." : ""}</p>
    </div>
  );
}

export function BlockView({ block, storagePrefix }: { block: Block; storagePrefix?: string }) {
  switch (block.type) {
    case "text":
      return block.body ? <RichText text={block.body} /> : <p className="text-sm text-slate-400 italic">Empty text block</p>;

    case "video": {
      const src = block.url ? videoEmbedUrl(block.url) : null;
      return (
        <figure>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-900 shadow-card">
            {src ? (
              <iframe src={src} title={block.caption || "Lesson video"} className="absolute inset-0 h-full w-full" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            ) : block.url ? (
              <a href={block.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 grid place-items-center text-white">
                <span className="flex items-center gap-2 text-sm font-semibold"><IconPlay className="h-6 w-6" /> Open video</span>
              </a>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-slate-400"><span className="flex items-center gap-2 text-sm"><IconPlay className="h-6 w-6" /> Video coming soon</span></div>
            )}
          </div>
          {block.caption && <figcaption className="mt-2 text-center text-sm text-slate-500">{block.caption}</figcaption>}
        </figure>
      );
    }

    case "image":
      return (
        <figure>
          {block.url ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-provided external URLs of unknown hosts
            <img src={block.url} alt={block.alt} loading="lazy" className="w-full rounded-2xl border border-slate-200 object-cover shadow-card" />
          ) : (
            <div className="grid aspect-video place-items-center rounded-2xl bg-slate-100 text-slate-400"><IconImage className="h-8 w-8" /></div>
          )}
          {block.caption && <figcaption className="mt-2 text-center text-sm text-slate-500">{block.caption}</figcaption>}
        </figure>
      );

    case "callout": {
      const c = CALLOUT[block.tone];
      return (
        <aside className={`flex gap-4 rounded-2xl border p-5 ${c.box}`}>
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.iconBox}`}><c.icon className="h-5 w-5" /></span>
          <div className="min-w-0">
            {block.title && <p className={`font-semibold ${c.title}`}>{block.title}</p>}
            <RichText text={block.body} className="mt-1 !text-[0.95rem]" />
          </div>
        </aside>
      );
    }

    case "keyPoints":
      return (
        <div className="rounded-2xl bg-navy-900 p-6 text-white">
          <p className="font-display text-lg font-semibold">{block.title}</p>
          <ul className="mt-4 space-y-3">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-[0.95rem] text-slate-200">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-teal/20 text-brand-teal"><IconCheck className="h-3.5 w-3.5" /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "scenario":
      return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-accent to-amber-400" />
          <p className="text-xs font-bold tracking-[0.15em] text-accent-strong uppercase">Classroom scenario</p>
          {block.title && <p className="mt-1 font-display text-lg font-semibold text-navy-900">{block.title}</p>}
          <RichText text={block.body} className="mt-2 !text-[0.95rem]" />
        </div>
      );

    case "quiz":
      return <Quiz block={block} />;

    case "reflection":
      return <Reflection block={block} storageKey={storagePrefix ? `${storagePrefix}:${block.id}` : undefined} />;

    case "resource":
      return (
        <a href={block.url || "#"} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-brand-ink ring-1 ring-sky-100"><IconLink className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-navy-900">{block.title || "Resource"}</span>
            {block.description && <span className="block text-sm text-slate-500">{block.description}</span>}
          </span>
          <IconArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-ink" />
        </a>
      );
  }
}

export default function LessonContent({ blocks, storagePrefix }: { blocks: Block[]; storagePrefix?: string }) {
  if (!blocks.length) return <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">This lesson has no content yet.</p>;
  return (
    <div className="space-y-8">
      {blocks.map((b) => <BlockView key={b.id} block={b} storagePrefix={storagePrefix} />)}
    </div>
  );
}
