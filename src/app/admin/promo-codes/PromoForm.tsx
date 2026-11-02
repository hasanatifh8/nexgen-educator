"use client";

import { useActionState, useState } from "react";
import { createPromoAction, type FormState } from "../actions";
import { Field, FormError, inputCls } from "../fields";

/** Create a promo code. Codes can’t be edited afterwards — pause or delete and create a new one. */
export default function PromoForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createPromoAction, {});
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const e = state.fieldErrors ?? {};
  const pct = Number(percent);
  const example = Number.isInteger(pct) && pct >= 1 && pct <= 100 ? Math.round(450 * (100 - pct)) / 100 : null;

  return (
    <form action={action} className="space-y-5">
      <FormError error={state.error} />
      <Field id="code" label="Code" error={e.code} hint="Letters, digits, dashes or underscores. Learners can type it in any case.">
        <input id="code" name="code" required maxLength={20} value={code} onChange={(ev) => setCode(ev.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="JACK50" autoComplete="off" className={`${inputCls(!!e.code)} font-semibold tracking-wider uppercase`} />
      </Field>
      <Field id="percent" label="Discount (%)" error={e.percent} hint={example !== null ? `A ₹450 course becomes ₹${example.toLocaleString("en-IN")} + GST.` : "Taken off the course fee before GST. 100% makes the course free."}>
        <input id="percent" name="percent" type="number" required min={1} max={100} step={1} inputMode="numeric" value={percent} onChange={(ev) => setPercent(ev.target.value)} placeholder="50" className={inputCls(!!e.percent)} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="expiresOn" label={<>Valid until <span className="font-normal text-slate-400">(optional)</span></>} error={e.expiresOn} hint="Works until the end of this day.">
          <input id="expiresOn" name="expiresOn" type="date" className={inputCls(!!e.expiresOn)} />
        </Field>
        <Field id="maxUses" label={<>Usage limit <span className="font-normal text-slate-400">(optional)</span></>} error={e.maxUses} hint="Blank = unlimited.">
          <input id="maxUses" name="maxUses" type="number" min={1} step={1} inputMode="numeric" placeholder="e.g. 100" className={inputCls(!!e.maxUses)} />
        </Field>
      </div>
      <Field id="note" label={<>Note for admins <span className="font-normal text-slate-400">(optional)</span></>} hint="Who the code is for, e.g. “Jack’s referrals”. Learners never see this.">
        <input id="note" name="note" maxLength={120} className={inputCls()} />
      </Field>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Creating…" : "Create promo code"}</button>
    </form>
  );
}
