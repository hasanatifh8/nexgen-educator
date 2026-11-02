"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { checkPromoAction, confirmEnrollmentAction, type CheckoutState } from "@/app/courses/actions";
import { IconArrowRight, IconBadge, IconBook, IconCheck, IconClock, IconPencil, IconPhone, IconShield, IconSignal, IconUser, IconWallet } from "@/components/Icons";
import { GST_RATE, formatINR, gstOn, priceWithGst, type Category, type Level } from "@/lib/catalog";
import { CATEGORY_ACCENT } from "@/lib/styles";
import { CALL_SLOTS, discountedFee, type AppliedPromo, type CallPreference, type CallSlot } from "@/lib/enrollment";

type Props = {
  editing: boolean;
  learner: {
    name: string;
    email: string;
    phone: string;
    location: string;
    qualification: string;
    experienceYears: number;
    verification: "pending" | "verified" | "rejected";
  };
  course: {
    id: string;
    title: string;
    blurb: string;
    category: Category;
    level: Level;
    program: string;
    modules: number;
    lessons: number;
    duration: string;
    outcomes: string[];
    instructor?: string;
    price: number;
  };
  call?: CallPreference;
  /** A code already applied to this enrollment (when coming back to change the call time). */
  promo?: AppliedPromo;
};

type Price = { list: number; promo: AppliedPromo | null; discount: number; fee: number; gst: number; total: number };

function priceFor(list: number, promo: AppliedPromo | null): Price {
  const fee = discountedFee(list, promo?.percent);
  return { list, promo, discount: list - fee, fee, gst: gstOn(fee), total: priceWithGst(fee) };
}

const STEPS = ["Your details", "Order summary", "Schedule call", "Confirmation"] as const;

export default function CheckoutWizard({ editing, learner, course, call, promo: initialPromo }: Props) {
  const [step, setStep] = useState(editing ? 2 : 0);
  const [promo, setPromo] = useState<AppliedPromo | null>(initialPromo ?? null);
  const price = priceFor(course.price, promo);
  const [state, action, pending] = useActionState<CheckoutState, FormData>(confirmEnrollmentAction, {});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const errors = state.errors ?? {};
  // React resets the form after each submit; defaults come from the last submission so nothing typed is lost.
  const v = state.values ?? { phone: call?.phone ?? learner.phone, slot: call?.slot ?? "", note: call?.note ?? "", agree: editing };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const profileHref = `/onboarding?next=${encodeURIComponent(`/checkout/${course.id}${editing ? "?edit=1" : ""}`)}`;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-1">
        <Link href={`/courses/${course.id}`} className="-my-2 self-start py-2 text-sm font-semibold text-brand-ink hover:underline">← Back to course</Link>
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{editing ? "Update your call preference" : "Enroll in this course"}</h1>
      </div>

      <Stepper step={step} />

      {/* Phones: the order summary collapses into a strip so the steps stay above the fold. */}
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/70 lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy-900">{course.title}</p>
          <p className="text-xs text-slate-500">{course.program}</p>
        </div>
        <p className="shrink-0 text-right font-display text-lg font-bold text-navy-900">{formatINR(price.total)}<span className="block text-[11px] font-normal text-slate-500">{promo ? `${promo.percent}% off · incl. GST` : "incl. GST"}</span></p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[1fr_360px]">
        <form action={action} className="min-w-0 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="promo" value={promo?.code ?? ""} />

          {/* Step 1 */}
          <section hidden={step !== 0} className="p-5 sm:p-8">
            <StepHeading ref={step === 0 ? headingRef : undefined} n={1} title="Confirm your details" text="We have filled these in from your profile. Our team uses them to set up your enrollment." />
            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Full name", value: learner.name },
                { label: "Email", value: learner.email },
                { label: "Mobile", value: `+91 ${learner.phone}` },
                { label: "Location", value: learner.location },
                { label: "Qualification", value: learner.qualification },
                { label: "Teaching experience", value: `${learner.experienceYears} ${learner.experienceYears === 1 ? "year" : "years"}` },
              ].map((r) => (
                <div key={r.label} className="min-w-0 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                  <dt className="text-xs font-semibold text-slate-500">{r.label}</dt>
                  <dd className="mt-0.5 truncate font-semibold text-navy-900">{r.value}</dd>
                </div>
              ))}
            </dl>
            <div className={`mt-4 flex items-start gap-3 rounded-xl px-4 py-3 text-sm ring-1 ${learner.verification === "verified" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : learner.verification === "rejected" ? "bg-amber-50 text-amber-900 ring-amber-200" : "bg-sky-50 text-sky-900 ring-sky-100"}`}>
              <IconShield className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                {learner.verification === "verified"
                  ? "Your ID and CV are verified."
                  : learner.verification === "rejected"
                    ? "Our team asked you to update your documents. You can continue, but please update your profile so we can assign the course."
                    : "Your ID and CV are with our team for verification. You can continue — we complete this before assigning the course."}
              </p>
            </div>
            <p className="mt-5 text-sm text-slate-600">
              Something not right?{" "}
              <Link href={profileHref} className="inline-flex items-center gap-1 font-semibold text-brand-ink hover:underline"><IconPencil className="h-3.5 w-3.5" /> Edit my profile</Link>
            </p>
            <StepNav onNext={next} nextLabel="Continue to order summary" />
          </section>

          {/* Step 2 */}
          <section hidden={step !== 1} className="p-5 sm:p-8">
            <StepHeading ref={step === 1 ? headingRef : undefined} n={2} title="Review your order" text="Check the course and the fee before you continue." />
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <div className={`h-1.5 bg-gradient-to-r ${CATEGORY_ACCENT[course.category]}`} />
              <div className="p-5">
                <p className="text-xs font-semibold text-brand-ink">{course.program}</p>
                <p className="mt-1 font-display text-lg leading-snug font-semibold text-navy-900">{course.title}</p>
                <p className="mt-1.5 text-sm text-slate-600">{course.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-1.5"><IconBook className="h-4 w-4 text-brand-ink" /> {course.modules} modules · {course.lessons} lessons</li>
                  <li className="flex items-center gap-1.5"><IconClock className="h-4 w-4 text-brand-ink" /> {course.duration} of content</li>
                  <li className="flex items-center gap-1.5"><IconSignal className="h-4 w-4 text-brand-ink" /> {course.level}</li>
                  {course.instructor && <li className="flex items-center gap-1.5"><IconUser className="h-4 w-4 text-brand-ink" /> {course.instructor}</li>}
                </ul>
              </div>
            </div>
            {course.outcomes.length > 0 && (
              <>
                <p className="mt-6 text-sm font-semibold text-navy-900">What you will learn</p>
                <ul className="mt-2 space-y-2">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm text-slate-600"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {o}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <PriceLines price={price} />
            </div>
            <PromoBox promo={promo} onChange={setPromo} />
            <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
              <li className="flex gap-2.5"><IconBadge className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" /> Counts towards the {course.program} certification exam</li>
              <li className="flex gap-2.5"><IconClock className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" /> Learn at your own pace, on your phone or computer</li>
              <li className="flex gap-2.5"><IconWallet className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" /> Nothing to pay now — payment details are shared on the call</li>
            </ul>
            <StepNav onBack={back} onNext={next} nextLabel="Continue to schedule call" />
          </section>

          {/* Step 3 */}
          <section hidden={step !== 2} className="p-5 sm:p-8">
            <StepHeading ref={step === 2 ? headingRef : undefined} n={3} title="Schedule a call with our team" text="There is no online payment. A representative will call you for a short telephonic round, and the course is assigned to you after the call." />

            <div className="mt-6">
              <label htmlFor="phone" className="block text-sm font-semibold text-navy-900">Number we should call</label>
              <div className={`mt-1.5 flex overflow-hidden rounded-xl border bg-white focus-within:ring-4 ${errors.phone ? "border-red-400 focus-within:ring-red-100" : "border-slate-300 focus-within:border-brand focus-within:ring-sky-100"}`}>
                <span className="flex items-center gap-1.5 border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600"><IconPhone className="h-4 w-4" /> +91</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  defaultValue={v.phone}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className="min-w-0 flex-1 px-3.5 py-3 text-sm outline-none"
                />
              </div>
              {errors.phone && <p id="phone-error" className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-navy-900">Best time to call you</legend>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {(Object.entries(CALL_SLOTS) as [CallSlot, string][]).map(([value, label]) => {
                  const [name, hours] = label.split(" (");
                  return (
                    <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition has-[:checked]:border-brand has-[:checked]:bg-sky-50 has-[:checked]:ring-2 has-[:checked]:ring-brand/30 hover:border-slate-300">
                      <input type="radio" name="slot" value={value} required defaultChecked={v.slot === value} className="h-4 w-4 accent-brand" />
                      <span>
                        <span className="block text-sm font-semibold text-navy-900">{name}</span>
                        <span className="block text-xs text-slate-500">{hours.replace(")", "")}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.slot && <p className="mt-1.5 text-sm text-red-600">{errors.slot}</p>}
            </fieldset>

            <div className="mt-6">
              <label htmlFor="note" className="block text-sm font-semibold text-navy-900">Anything we should know? <span className="font-normal text-slate-400">(optional)</span></label>
              <textarea
                id="note"
                name="note"
                rows={3}
                maxLength={300}
                defaultValue={v.note}
                placeholder="e.g. Please call after 5 pm on weekdays, or I prefer Hindi."
                className={`mt-1.5 w-full rounded-xl border px-3.5 py-3 text-sm outline-none focus:ring-4 ${errors.note ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-brand focus:ring-sky-100"}`}
              />
              {errors.note && <p className="mt-1.5 text-sm text-red-600">{errors.note}</p>}
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-950 ring-1 ring-amber-200">
              <input type="checkbox" name="agree" required defaultChecked={v.agree} className="mt-0.5 h-4 w-4 shrink-0 accent-brand" />
              <span>
                I understand that no payment is taken on the website. A NextGen Educator representative will call me, and the course will be assigned to me after the call and payment of the course fee of {formatINR(price.total)}{promo ? ` (after the ${promo.code} discount)` : ""}.
              </span>
            </label>
            {errors.agree && <p className="mt-1.5 text-sm text-red-600">{errors.agree}</p>}

            {errors.promo && (
              <div role="alert" className="mt-6 flex flex-col gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200 sm:flex-row sm:items-center sm:justify-between">
                <p>{errors.promo}</p>
                <button type="button" onClick={() => setPromo(null)} className="shrink-0 font-semibold underline">Remove code</button>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              <button type="button" onClick={back} className="btn-secondary">Back</button>
              <button type="submit" disabled={pending} className="btn-primary px-6 py-3.5 text-base disabled:opacity-60">
                {pending ? "Submitting…" : editing ? "Save call preference" : "Confirm enrollment request"} {!pending && <IconArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </section>
        </form>

        <aside className="hidden lg:block">
          <div className="sticky top-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
            <div className="bg-navy-900 px-5 py-4 text-white">
              <p className="text-xs font-bold tracking-[0.15em] text-orange-300 uppercase">Order summary</p>
              <p className="mt-1 font-display text-lg leading-snug font-semibold">{course.title}</p>
              <p className="mt-0.5 text-xs text-slate-300">{course.program}</p>
            </div>
            <div className="p-5">
              <PriceLines price={price} />
              <ol className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                {[
                  { icon: IconCheck, text: "Confirm your enrollment request" },
                  { icon: IconPhone, text: "Short telephonic round with our representative" },
                  { icon: IconWallet, text: "Pay the course fee using the details shared on the call" },
                  { icon: IconBook, text: "Course assigned — start learning" },
                ].map(({ icon: Icon, text }, i) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${i === 0 ? "bg-orange-50 text-accent-strong" : "bg-slate-100 text-slate-500"}`}><Icon className="h-3.5 w-3.5" /></span>
                    <span className="pt-1 text-slate-600">{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Enrollment steps">
      {STEPS.map((label, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <li key={label} aria-current={current ? "step" : undefined} className="min-w-0">
            <div className={`h-1.5 rounded-full ${done ? "bg-emerald-500" : current ? "bg-accent-strong" : "bg-slate-200"}`} />
            <p className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${current ? "text-navy-900" : done ? "text-emerald-700" : "text-slate-400"}`}>
              <span className={`hidden h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] sm:grid ${done ? "bg-emerald-500 text-white" : current ? "bg-navy-900 text-white" : "bg-slate-200 text-slate-500"}`}>
                {done ? <IconCheck className="h-3 w-3" /> : i + 1}
              </span>
              <span className="truncate">{label}</span>
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function StepHeading({ ref, n, title, text }: { ref?: React.Ref<HTMLHeadingElement>; n: number; title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.15em] text-accent-strong uppercase">Step {n} of 3</p>
      <h2 ref={ref} tabIndex={-1} className="mt-1 font-display text-xl font-bold text-navy-900 outline-none sm:text-2xl">{title}</h2>
      <p className="mt-1.5 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function StepNav({ onBack, onNext, nextLabel }: { onBack?: () => void; onNext: () => void; nextLabel: string }) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
      {onBack ? <button type="button" onClick={onBack} className="btn-secondary">Back</button> : <span className="hidden sm:block" />}
      <button type="button" onClick={onNext} className="btn-primary px-6 py-3.5 text-base">{nextLabel} <IconArrowRight className="h-4 w-4" /></button>
    </div>
  );
}

function PromoBox({ promo, onChange }: { promo: AppliedPromo | null; onChange: (p: AppliedPromo | null) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [checking, startCheck] = useTransition();
  const apply = () =>
    startCheck(async () => {
      const r = await checkPromoAction(code);
      if (r.ok) {
        onChange({ code: r.code, percent: r.percent });
        setError(undefined);
        setCode("");
      } else setError(r.error);
    });

  if (promo) {
    return (
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm ring-1 ring-emerald-200">
        <p className="flex min-w-0 items-center gap-2 text-emerald-900">
          <IconCheck className="h-4 w-4 shrink-0" />
          <span className="min-w-0"><span className="font-bold">{promo.code}</span> applied — {promo.percent}% off the course fee</span>
        </p>
        <button type="button" onClick={() => onChange(null)} className="shrink-0 text-xs font-semibold text-emerald-800 underline">Remove</button>
      </div>
    );
  }
  return (
    <div className="mt-4">
      <label htmlFor="promo-code" className="block text-sm font-semibold text-navy-900">Have a promo or referral code?</label>
      <div className="mt-1.5 flex gap-2">
        <input
          id="promo-code"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(undefined); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (code.trim()) apply(); } }}
          maxLength={20}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g. JACK50"
          aria-invalid={!!error}
          aria-describedby={error ? "promo-error" : undefined}
          className={`min-w-0 flex-1 rounded-xl border px-3.5 py-3 text-sm font-semibold tracking-wider uppercase outline-none placeholder:font-normal placeholder:tracking-normal placeholder:normal-case focus:ring-4 ${error ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-brand focus:ring-sky-100"}`}
        />
        <button type="button" onClick={apply} disabled={!code.trim() || checking} className="btn shrink-0 bg-navy-900 px-5 text-white hover:bg-navy-800 disabled:opacity-50">
          {checking ? "Checking…" : "Apply"}
        </button>
      </div>
      {error && <p id="promo-error" className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function PriceLines({ price }: { price: Price }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between gap-3"><dt className="text-slate-600">Course fee</dt><dd className={`font-semibold ${price.promo ? "text-slate-400 line-through" : "text-navy-900"}`}>{formatINR(price.list)}</dd></div>
      {price.promo && (
        <>
          <div className="flex justify-between gap-3 text-emerald-700"><dt>Promo {price.promo.code} ({price.promo.percent}% off)</dt><dd className="font-semibold">− {formatINR(price.discount)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-slate-600">Fee after discount</dt><dd className="font-semibold text-navy-900">{formatINR(price.fee)}</dd></div>
        </>
      )}
      <div className="flex justify-between gap-3"><dt className="text-slate-600">GST ({Math.round(GST_RATE * 100)}%)</dt><dd className="font-semibold text-navy-900">{formatINR(price.gst)}</dd></div>
      <div className="flex items-end justify-between gap-3 border-t border-dashed border-slate-200 pt-3">
        <dt className="font-semibold text-navy-900">Total</dt>
        <dd className="font-display text-2xl font-bold text-navy-900">{formatINR(price.total)}</dd>
      </div>
      <div className="flex justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
        <dt>Due today</dt><dd>{formatINR(0)}</dd>
      </div>
    </dl>
  );
}
