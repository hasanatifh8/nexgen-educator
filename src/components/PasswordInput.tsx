"use client";

import { useState, type InputHTMLAttributes } from "react";
import { IconEye, IconEyeOff } from "./Icons";

/** A password field with its own show/hide eye button. Accepts the same props as an <input>. */
export default function PasswordInput({ className = "", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className={`${className} pr-12`} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        aria-controls={props.id}
        className="absolute top-1/2 right-1 mt-0.75 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition-colors hover:text-navy-900 focus-visible:text-navy-900"
      >
        {show ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
      </button>
    </div>
  );
}
