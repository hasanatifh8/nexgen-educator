import { fulfilOrder } from "@/lib/onlinePayments";
import { verifyWebhookSignature, webhookConfigured } from "@/lib/razorpay";

/**
 * Razorpay webhook (Dashboard → Webhooks → https://<site>/api/razorpay/webhook, events: payment.captured, order.paid).
 * A safety net for learners who close the tab before Checkout reports success: the course still unlocks.
 * We only take the order id from the event and re-check the payment with Razorpay's API before fulfilling.
 */
export async function POST(req: Request) {
  if (!webhookConfigured()) return new Response("Webhook secret not configured", { status: 503 });
  const raw = await req.text(); // the signature covers the raw body, byte for byte
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature"))) return new Response("Invalid signature", { status: 400 });

  let event: { event?: string; payload?: { payment?: { entity?: { order_id?: string } }; order?: { entity?: { id?: string } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }
  if (event.event !== "payment.captured" && event.event !== "order.paid") return Response.json({ ignored: event.event ?? null });

  const orderId = event.payload?.order?.entity?.id ?? event.payload?.payment?.entity?.order_id;
  if (!orderId) return Response.json({ ignored: "no order id" });
  try {
    const r = await fulfilOrder(orderId);
    // Unknown orders (e.g. from another site on the same Razorpay account) are acknowledged so Razorpay stops retrying.
    return Response.json({ ok: r.ok, ...(r.ok ? { alreadyDone: r.alreadyDone } : { reason: r.reason }) });
  } catch (e) {
    console.error("[razorpay] webhook fulfilment failed", e);
    return new Response("Temporary error", { status: 500 }); // Razorpay retries
  }
}
