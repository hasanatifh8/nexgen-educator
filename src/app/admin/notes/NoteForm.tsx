"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { IconFile } from "@/components/Icons";
import { MAX_NOTE_BYTES, MAX_NOTE_LABEL } from "@/lib/uploadLimits";
import { Field, inputCls } from "../fields";

type Props = {
  action: (fd: FormData) => Promise<void>;
  courses: { id: string; title: string }[];
  note?: { id: string; title: string; description?: string; courseId?: string; fileName: string };
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Uploading…" : label}</button>;
}

/** Upload new notes, or edit a note's details and optionally replace its PDF. */
export default function NoteForm({ action, courses, note }: Props) {
  const [fileError, setFileError] = useState<string>();
  const [picked, setPicked] = useState<string>();

  return (
    <form
      action={action}
      // Check size and type here: Vercel rejects oversized requests before our server can explain why.
      onSubmit={(e) => {
        const f = (e.currentTarget.elements.namedItem("file") as HTMLInputElement).files?.[0];
        const err = !f ? (note ? undefined : "Choose a PDF to upload.") : !/\.pdf$/i.test(f.name) ? "Only PDF files can be uploaded." : f.size > MAX_NOTE_BYTES ? `The PDF must be ${MAX_NOTE_LABEL} or smaller (this one is ${(f.size / 1024 / 1024).toFixed(1)} MB).` : undefined;
        setFileError(err);
        if (err) e.preventDefault();
      }}
      className="space-y-5"
    >
      {note && <input type="hidden" name="id" value={note.id} />}
      <Field id="title" label="Title">
        <input id="title" name="title" required minLength={3} maxLength={120} defaultValue={note?.title} placeholder="e.g. Module 2 summary — Prompt patterns" className={inputCls()} />
      </Field>
      <Field id="description" label={<>Description <span className="font-normal text-slate-400">(optional)</span></>} hint="Shown to learners under the title.">
        <textarea id="description" name="description" rows={2} maxLength={500} defaultValue={note?.description} className={inputCls()} />
      </Field>
      <Field id="courseId" label={<>Related course <span className="font-normal text-slate-400">(optional)</span></>}>
        <select id="courseId" name="courseId" defaultValue={note?.courseId ?? ""} className={inputCls()}>
          <option value="">Not linked to a course</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </Field>
      <Field id="file" label={note ? "Replace PDF (optional)" : "PDF file"} error={fileError} hint={`PDF only, up to ${MAX_NOTE_LABEL}.`}>
        <label htmlFor="file" className={`mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-4 text-sm transition hover:border-brand hover:bg-sky-50/50 ${fileError ? "border-red-400" : "border-slate-300"}`}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600"><IconFile className="h-5 w-5" /></span>
          <span className="min-w-0">
            <span className="block truncate font-semibold text-navy-900">{picked ?? (note ? `Current: ${note.fileName}` : "Choose a PDF")}</span>
            <span className="text-xs text-slate-500">{picked ? "Ready to upload" : "Click to browse"}</span>
          </span>
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(e) => {
            setPicked(e.target.files?.[0]?.name);
            setFileError(undefined);
          }}
        />
      </Field>
      <Submit label={note ? "Save changes" : "Upload notes"} />
    </form>
  );
}
