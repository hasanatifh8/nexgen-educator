"use client";

import { useState } from "react";
import { priceShort } from "@/lib/catalog";
import { useFormStatus } from "react-dom";
import { saveAssignmentsAction } from "../../actions";

type Group = { id: string; title: string; courses: { id: string; title: string; price: number; disabled?: boolean; lessons: number; done: number }[] };

function Save({ dirty }: { dirty: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending || !dirty} className="btn-primary">{pending ? "Saving…" : "Save assignments"}</button>;
}

export default function AssignmentForm({ userId, groups, assigned, requested }: { userId: string; groups: Group[]; assigned: string[]; requested: Record<string, string> }) {
  const [selected, setSelected] = useState(() => new Set(assigned));
  const toggle = (id: string, on: boolean) => setSelected((s) => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n; });
  const dirty = selected.size !== assigned.length || assigned.some((a) => !selected.has(a));

  return (
    <form action={saveAssignmentsAction} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />
      {[...selected].map((id) => <input key={id} type="hidden" name="courses" value={id} />)}

      {groups.map((g) => {
        const all = g.courses.every((c) => selected.has(c.id));
        return (
          <div key={g.id} className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center justify-between gap-3 bg-slate-50 px-4 py-2.5">
              <p className="text-sm font-semibold text-navy-900">
                {g.title}
              </p>
              {g.courses.length > 0 && (
                <button type="button" onClick={() => g.courses.forEach((c) => toggle(c.id, !all))} className="text-xs font-semibold text-brand-ink hover:underline">
                  {all ? "Unassign program" : "Assign whole program"}
                </button>
              )}
            </div>
            <ul className="divide-y divide-slate-100">
              {g.courses.map((c) => (
                <li key={c.id}>
                  <label className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm ${requested[c.id] && !selected.has(c.id) ? "bg-orange-50/60" : ""}`}>
                    <input type="checkbox" checked={selected.has(c.id)} onChange={(e) => toggle(c.id, e.target.checked)} className="h-4 w-4 accent-brand" />
                    <span className="flex-1 text-navy-900">{c.title}{c.disabled && <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-600">Disabled</span>}</span>
                    {c.price === 0
                      ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100">Free</span>
                      : <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-700 ring-1 ring-orange-100">{priceShort(c.price)}</span>}
                    {requested[c.id] && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">Requested {requested[c.id]}</span>}
                    {assigned.includes(c.id) && <span className="text-xs text-slate-500">{c.done}/{c.lessons} lessons</span>}
                  </label>
                </li>
              ))}
              {g.courses.length === 0 && <li className="px-4 py-3 text-xs text-slate-400">No courses in this program yet.</li>}
            </ul>
          </div>
        );
      })}

      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm ${dirty ? "font-semibold text-amber-700" : "text-slate-500"}`}>{dirty ? "Unsaved changes" : `${selected.size} course(s) assigned`}</p>
        <Save dirty={dirty} />
      </div>
    </form>
  );
}
