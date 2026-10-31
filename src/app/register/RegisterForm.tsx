"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState, type FormEvent, type ReactNode } from "react";
import { IconArrowRight, IconCheck } from "@/components/Icons";
import { register } from "./actions";
import { PASSWORD_RULES, ROLES, readRegisterForm, validateRegistration, type FieldErrors, type RegisterState } from "./validation";

const initialState: RegisterState = { status: "idle" };

const inputBase =
  "mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:ring-4";
const inputClass = (invalid: boolean) =>
  `${inputBase} ${invalid ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-brand focus:ring-sky-100"}`;

function Field({ id, label, error, hint, children }: { id: string; label: ReactNode; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">{label}</label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [seenState, setSeenState] = useState(state);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const next = useSearchParams().get("next") ?? "";

  // Adopt server-side errors whenever a new action result arrives.
  if (state !== seenState) {
    setSeenState(state);
    setErrors(state.errors ?? {});
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const errs = validateRegistration(readRegisterForm(new FormData(e.currentTarget)));
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      e.preventDefault();
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  };

  const clearError = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as keyof FieldErrors;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  if (state.status === "success" && state.user) {
    return (
      <div className="animate-fade-up text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <IconCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-bold text-navy-900">Welcome aboard, {state.user.firstName}!</h2>
        <p className="mt-2 text-slate-600">
          Your account has been created for <span className="font-semibold text-navy-900">{state.user.email}</span>.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/my-learning" className="btn-primary py-3">Go to My Learning</Link>
          <Link href="/courses" className="btn-secondary py-3">Browse Courses</Link>
        </div>
      </div>
    );
  }

  const v = state.values ?? {};
  const aria = (name: keyof FieldErrors) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form action={formAction} onSubmit={onSubmit} onInput={clearError} noValidate className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <input id="firstName" name="firstName" autoComplete="given-name" defaultValue={v.firstName} className={inputClass(!!errors.firstName)} {...aria("firstName")} />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <input id="lastName" name="lastName" autoComplete="family-name" defaultValue={v.lastName} className={inputClass(!!errors.lastName)} {...aria("lastName")} />
        </Field>
      </div>

      <Field id="email" label="Work email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" defaultValue={v.email} className={inputClass(!!errors.email)} {...aria("email")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="role" label="I am a…" error={errors.role}>
          <select id="role" name="role" defaultValue={v.role ?? ""} className={inputClass(!!errors.role)} {...aria("role")}>
            <option value="" disabled>Select your role</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field id="institution" label={<>School / institution <span className="font-normal text-slate-400">(optional)</span></>} error={errors.institution}>
          <input id="institution" name="institution" autoComplete="organization" defaultValue={v.institution} className={inputClass(!!errors.institution)} {...aria("institution")} />
        </Field>
      </div>

      <Field id="password" label="Password" error={errors.password}>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass(!!errors.password)} pr-16`}
            {...aria("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute top-1/2 right-2 mt-0.75 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-slate-500 hover:text-navy-900"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </Field>
      <ul className="-mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        {PASSWORD_RULES.map((r) => {
          const ok = r.test(password);
          return (
            <li key={r.label} className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-emerald-600" : "text-slate-400"}`}>
              <IconCheck className="h-3.5 w-3.5" /> {r.label}
            </li>
          );
        })}
      </ul>

      <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass(!!errors.confirmPassword)}
          {...aria("confirmPassword")}
        />
      </Field>

      <div className="space-y-3 pt-1">
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" name="terms" defaultChecked={v.terms} className="mt-0.5 h-4 w-4 accent-brand" {...aria("terms")} />
          <span>
            I agree to the <a href="#" className="font-semibold text-brand-ink hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="font-semibold text-brand-ink hover:underline">Privacy Policy</a>.
          </span>
        </label>
        {errors.terms && <p id="terms-error" className="-mt-1 pl-7 text-xs font-medium text-red-600">{errors.terms}</p>}
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" name="newsletter" defaultChecked={v.newsletter ?? true} className="mt-0.5 h-4 w-4 accent-brand" />
          <span>Send me The Educator’s Brief — weekly teaching strategies and new certifications.</span>
        </label>
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-base">
        {pending ? "Creating your account…" : <>Create Account <IconArrowRight className="h-4 w-4" /></>}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-semibold text-brand-ink hover:underline">Log in</Link>
      </p>
    </form>
  );
}
