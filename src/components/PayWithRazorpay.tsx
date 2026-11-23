"use client";

import { useState } from "react";
import { confirmOnlinePaymentAction, startOnlinePaymentAction } from "@/app/checkout/payActions";
import { IconArrowRight, IconLock } from "./Icons";

type RazorpaySuccess = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayFailure = { error?: { description?: string; reason?: string; metadata?: { payment_id?: string } } };
type RazorpayInstance = { open: () => void; on: (event: "payment.failed", cb: (r: RazorpayFailure) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
let loading: Promise<void> | null = null;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("Could not load Razorpay"));
    };
    document.body.appendChild(s);
  });
  return loading;
}

type Props = {
  courseId: string;
  promoCode?: string;
  /** Shown on the button, e.g. "Pay ₹531 securely". */
  label: string;
  className?: string;
  onPaid: (courseId: string) => void;
  /** The server rejected the promo code; the parent can offer to remove it. */
  onPromoError?: (message: string) => void;
};

/** Opens Razorpay Checkout for a course priced on the server; unlocks the course on verified success. */
export default function PayWithRazorpay({ courseId, promoCode = "", label, className = "btn-primary w-full py-3.5 text-base", onPaid, onPromoError }: Props) {
  const [busy, setBusy] = useState<"starting" | "open" | "confirming" | null>(null);
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  const pay = async () => {
    setMessage(null);
    setBusy("starting");
    try {
      const [start] = await Promise.all([startOnlinePaymentAction(courseId, promoCode), loadCheckout()]);
      if (!start.ok) {
        if (start.promoError) onPromoError?.(start.error);
        setMessage({ tone: "error", text: start.error });
        setBusy(null);
        return;
      }
      if (!window.Razorpay) throw new Error("Razorpay unavailable");
      const rzp = new window.Razorpay({
        key: start.keyId,
        amount: start.amount,
        currency: "INR",
        name: start.business,
        description: start.description,
        image: `${window.location.origin}/logo-512.png`,
        order_id: start.orderId,
        prefill: start.prefill,
        notes: { courseId },
        theme: { color: "#0f2a4a" },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setBusy((b) => (b === "open" ? null : b));
            setMessage((m) => m ?? { tone: "info", text: "Payment window closed. If you didn’t finish paying, nothing was charged — you can try again whenever you’re ready." });
          },
        },
        handler: async (r: RazorpaySuccess) => {
          setBusy("confirming");
          const res = await confirmOnlinePaymentAction({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature });
          if (res.ok) onPaid(res.courseId);
          else {
            setMessage({ tone: "error", text: `${res.error} Payment ID: ${r.razorpay_payment_id}` });
            setBusy(null);
          }
        },
      });
      rzp.on("payment.failed", (r) => {
        const why = r.error?.description || "The payment did not go through.";
        setMessage({ tone: "error", text: `${why} Please try again or choose another payment method. If any amount was debited for a failed payment, your bank returns it automatically.` });
      });
      setBusy("open");
      rzp.open();
    } catch {
      setMessage({ tone: "error", text: "We couldn’t open the payment window. Check your internet connection and try again." });
      setBusy(null);
    }
  };

  return (
    <div>
      <button type="button" onClick={pay} disabled={busy !== null} className={`${className} disabled:opacity-60`}>
        {busy === "starting" ? "Opening secure payment…" : busy === "open" ? "Complete payment in the Razorpay window…" : busy === "confirming" ? "Confirming your payment…" : (
          <><IconLock className="h-4 w-4" /> {label} <IconArrowRight className="h-4 w-4" /></>
        )}
      </button>
      {message && (
        <p role={message.tone === "error" ? "alert" : "status"} className={`mt-3 rounded-xl px-4 py-3 text-sm ring-1 ${message.tone === "error" ? "bg-red-50 text-red-800 ring-red-200" : "bg-sky-50 text-sky-900 ring-sky-100"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
