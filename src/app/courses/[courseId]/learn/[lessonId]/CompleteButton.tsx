"use client";

import { useFormStatus } from "react-dom";
import { IconCheck } from "@/components/Icons";

export default function CompleteButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full px-6 py-3 sm:w-auto">
      <IconCheck className="h-4 w-4" /> {pending ? "Saving…" : label}
    </button>
  );
}
