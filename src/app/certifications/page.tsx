import { redirect } from "next/navigation";

/** Certification programs now live on each learner's My Learning page. */
export default function CertificationsPage() {
  redirect("/my-learning#programs");
}
