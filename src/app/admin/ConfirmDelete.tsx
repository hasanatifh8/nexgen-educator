"use client";

import { useFormStatus } from "react-dom";

function Button({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
      {pending ? "Deleting…" : label}
    </button>
  );
}

export default function ConfirmDelete({ action, id, name }: { action: (fd: FormData) => Promise<void>; id: string; name: string }) {
  return (
    <form action={action} onSubmit={(e) => !confirm(`Delete “${name}”? This cannot be undone.`) && e.preventDefault()}>
      <input type="hidden" name="id" value={id} />
      <Button label="Delete" />
    </form>
  );
}
