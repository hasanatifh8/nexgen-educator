"use client";

import { useRouter } from "next/navigation";
import PayWithRazorpay from "@/components/PayWithRazorpay";

/** “Pay now” for a pending course fee; refreshes the page once the payment is confirmed. */
export default function PayNow({ courseId, promoCode, label }: { courseId: string; promoCode?: string; label: string }) {
  const router = useRouter();
  return (
    <PayWithRazorpay
      courseId={courseId}
      promoCode={promoCode}
      label={label}
      className="btn-primary w-full px-4 py-2 text-sm"
      onPaid={() => router.refresh()}
    />
  );
}
