"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { inputCls } from "../fields";

export type PickItem = { id: string; title: string; sub?: string; tag?: string };

type Props = {
  action: (fd: FormData) => Promise<void>;
  /** Hidden fields identifying what is being assigned (e.g. the note or learner id). */
  hidden: Record<string, string>;
  /** Form field each selected id is sent as. */
  name: string;
  items: PickItem[];
  selected: string[];
  noun: string;
  empty: string;
  /** One-click selection of a related group, e.g. everyone assigned the linked course. */
  shortcut?: { label: string; ids: string[] };
};

function Save({ dirty }: { dirty: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending || !dirty} className="btn-primary disabled:opacity-50">{pending ? "Saving…" : "Save access"}</button>;
}

/** Searchable checklist for sharing notes: learners for a note, or notes for a learner. */
export default function PickList({ action, hidden, name, items, selected: initial, noun, empty, shortcut }: Props) {
  const [selected, setSelected] = useState(() => new Set(initial));
  const [q, setQ] = useState("");
  const toggle = (id: string, on: boolean) => setSelected((s) => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n; });
  const dirty = selected.size !== initial.length || initial.some((a) => !selected.has(a));
  const needle = q.toLowerCase().trim();
  const shown = items.filter((i) => !needle || `${i.title} ${i.sub ?? ""}`.toLowerCase().includes(needle));
  const allShown = shown.length > 0 && shown.every((i) => selected.has(i.id));

  if (!items.length) return <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">{empty}</p>;

  return (
    <form action={action} className="space-y-4">
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {[...selected].map((id) => <input key={id} type="hidden" name={name} value={id} />)}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {items.length > 6 && (
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${noun}s…`} aria-label={`Search ${noun}s`} className={`${inputCls()} !mt-0 sm:flex-1`} />
        )}
        <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
          <button type="button" onClick={() => shown.forEach((i) => toggle(i.id, !allShown))} className="text-brand-ink hover:underline">
            {allShown ? "Clear" : "Select"} {needle ? "matching" : "all"}
          </button>
          {shortcut && shortcut.ids.length > 0 && (
            <button type="button" onClick={() => shortcut.ids.forEach((id) => toggle(id, true))} className="text-brand-ink hover:underline">{shortcut.label}</button>
          )}
        </div>
      </div>

      <ul className="max-h-[26rem] divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
        {shown.map((i) => (
          <li key={i.id}>
            <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50">
              <input type="checkbox" checked={selected.has(i.id)} onChange={(e) => toggle(i.id, e.target.checked)} className="h-4 w-4 shrink-0 accent-brand" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-navy-900">{i.title}</span>
                {i.sub && <span className="block truncate text-xs text-slate-500">{i.sub}</span>}
              </span>
              {i.tag && <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{i.tag}</span>}
            </label>
          </li>
        ))}
        {!shown.length && <li className="px-4 py-6 text-center text-sm text-slate-500">No {noun}s match “{q}”.</li>}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="notify" defaultChecked className="h-4 w-4 accent-brand" /> Email learners who get new notes
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">{selected.size} selected</span>
          <Save dirty={dirty} />
        </div>
      </div>
    </form>
  );
}
