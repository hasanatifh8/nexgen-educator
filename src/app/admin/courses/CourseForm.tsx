"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LEVELS, priceShort, type CourseSummary } from "@/lib/catalog";
import { saveCourseAction, type FormState } from "../actions";
import { Field, FormError, inputCls } from "../fields";

type ProgramOption = { id: string; title: string; price: number; category: string };

export default function CourseForm({ course, programs }: { course?: CourseSummary; programs: ProgramOption[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCourseAction, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="card mt-6 space-y-5 p-6 sm:p-8">
      <FormError error={state.error} />
      {course && <input type="hidden" name="id" value={course.id} />}

      <Field id="title" label="Course title" error={fe.title}>
        <input id="title" name="title" defaultValue={course?.title} placeholder="e.g. Universal Design for Learning" className={inputCls(!!fe.title)} />
      </Field>

      <Field id="programId" label="Certification program" error={fe.programId} hint="Sets the course’s category and whether it’s free or premium.">
        <select id="programId" name="programId" defaultValue={course?.programId ?? ""} className={inputCls(!!fe.programId)}>
          <option value="" disabled>Select a program…</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} — {priceShort(p.price)} ({p.category})
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="hours" label="Duration (hours)" error={fe.hours}>
          <input id="hours" name="hours" type="number" min="0.5" max="200" step="0.5" defaultValue={course?.hours ?? 4} className={inputCls(!!fe.hours)} />
        </Field>
        <Field id="level" label="Level" error={fe.level}>
          <select id="level" name="level" defaultValue={course?.level ?? ""} className={inputCls(!!fe.level)}>
            <option value="" disabled>Select…</option>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field id="enrolled" label={<>Enrolled label <span className="font-normal text-slate-400">(optional)</span></>} error={fe.enrolled} hint="e.g. 2.4k — blank shows “New”.">
          <input id="enrolled" name="enrolled" defaultValue={course?.enrolled} className={inputCls(!!fe.enrolled)} />
        </Field>
      </div>

      <Field id="blurb" label="Card description" error={fe.blurb} hint="Shown on the course card (10–300 characters).">
        <textarea id="blurb" name="blurb" rows={3} defaultValue={course?.blurb} className={inputCls(!!fe.blurb)} />
      </Field>

      <div className="border-t border-slate-100 pt-5">
        <p className="font-display text-lg font-semibold text-navy-900">Course page</p>
        <p className="text-sm text-slate-500">Shown on the course overview page learners see before starting.</p>
      </div>

      <Field id="overview" label="About this course" error={fe.overview} hint="Supports ## headings, - bullet lists, 1. numbered lists, **bold** and *italic*.">
        <textarea id="overview" name="overview" rows={6} defaultValue={course?.overview} className={`${inputCls(!!fe.overview)} font-mono text-[13px]`} />
      </Field>

      <Field id="outcomes" label="What learners will learn" error={fe.outcomes} hint="One outcome per line (up to 12).">
        <textarea id="outcomes" name="outcomes" rows={4} defaultValue={course?.outcomes.join("\n")} placeholder={"Design a tiered task\nUse flexible grouping"} className={inputCls(!!fe.outcomes)} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="instructorName" label={<>Instructor name <span className="font-normal text-slate-400">(optional)</span></>} error={fe.instructorName}>
          <input id="instructorName" name="instructorName" defaultValue={course?.instructor?.name} className={inputCls(!!fe.instructorName)} />
        </Field>
        <Field id="instructorTitle" label={<>Instructor title <span className="font-normal text-slate-400">(optional)</span></>}>
          <input id="instructorTitle" name="instructorTitle" defaultValue={course?.instructor?.title} placeholder="e.g. Assessment Specialist" className={inputCls()} />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Link href="/admin/courses" className="btn-secondary">Cancel</Link>
        <button type="submit" disabled={pending} className="btn-primary">{pending ? "Saving…" : course ? "Save changes" : "Create & add content →"}</button>
      </div>
    </form>
  );
}
