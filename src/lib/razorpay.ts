import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Razorpay Standard Checkout, server side (https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/).
 * Keys come from the environment and never reach the browser, except the public Key ID.
 *
 *   RAZORPAY_KEY_ID        rzp_test_… (test mode) or rzp_live_…
 *   RAZORPAY_KEY_SECRET    the matching secret
 *   RAZORPAY_WEBHOOK_SECRET  the secret you set on the webhook in the Razorpay Dashboard (optional but recommended)
 */
const KEY_ID = process.env.RAZORPAY_KEY_ID ?? "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";
const API = "https://api.razorpay.com/v1";

/** Online payment is offered only when both keys are configured; otherwise checkout falls back to the call flow. */
export const razorpayEnabled = () => KEY_ID.startsWith("rzp_") && KEY_SECRET.length > 0;
export const razorpayKeyId = () => KEY_ID;
export const razorpayTestMode = () => KEY_ID.startsWith("rzp_test_");

async function api<T>(path: string, init?: { method?: "GET" | "POST"; body?: unknown }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64")}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { description?: string } };
  if (!res.ok) throw new Error(`Razorpay ${path}: ${res.status} ${data.error?.description ?? ""}`.trim());
  return data;
}

export type RazorpayOrder = { id: string; amount: number; currency: string; status: "created" | "attempted" | "paid"; receipt?: string };
export type RazorpayPayment = { id: string; order_id: string; amount: number; currency: string; status: "created" | "authorized" | "captured" | "refunded" | "failed"; method?: string };

/** `amount` in paise (₹1 = 100). `receipt` must be unique and at most 40 characters. */
export const createOrder = (o: { amount: number; receipt: string; notes: Record<string, string> }) =>
  api<RazorpayOrder>("/orders", { method: "POST", body: { amount: o.amount, currency: "INR", receipt: o.receipt.slice(0, 40), notes: o.notes } });

export const fetchPayment = (id: string) => api<RazorpayPayment>(`/payments/${encodeURIComponent(id)}`);

export const fetchOrderPayments = (orderId: string) => api<{ items: RazorpayPayment[] }>(`/orders/${encodeURIComponent(orderId)}/payments`);

/** Only needed if auto-capture is switched off in the Dashboard; authorised payments are otherwise captured automatically. */
export const capturePayment = (id: string, amount: number) =>
  api<RazorpayPayment>(`/payments/${encodeURIComponent(id)}/capture`, { method: "POST", body: { amount, currency: "INR" } });

const hmacHex = (key: string, message: string) => createHmac("sha256", key).update(message).digest("hex");
const sameHex = (a: string, b: string) => {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
};

/** Checkout success signature: HMAC-SHA256(order_id + "|" + payment_id, key secret). Use our own order id. */
export const verifyPaymentSignature = (orderId: string, paymentId: string, signature: string) =>
  !!KEY_SECRET && sameHex(hmacHex(KEY_SECRET, `${orderId}|${paymentId}`), String(signature));

export const webhookConfigured = () => WEBHOOK_SECRET.length > 0;

/** Webhook signature: HMAC-SHA256 of the raw request body with the webhook secret (header X-Razorpay-Signature). */
export const verifyWebhookSignature = (rawBody: string, signature: string | null) =>
  !!WEBHOOK_SECRET && !!signature && sameHex(hmacHex(WEBHOOK_SECRET, rawBody), signature);
