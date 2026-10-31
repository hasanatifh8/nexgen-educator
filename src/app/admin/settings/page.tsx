import { Suspense } from "react";
import { requireAdmin } from "@/lib/dal";
import { readStoredSettings } from "@/lib/settings";
import { AccessDenied, AdminTitle, adminSkeleton } from "../ui";
import SettingsForm from "./SettingsForm";
async function Settings() {
  if (!(await requireAdmin("/admin/settings"))) return <AccessDenied />;
  const stored = await readStoredSettings();
  return (
    <>
      <AdminTitle title="Site & certificate settings" subtitle="Website address for QR codes and emails, plus the names printed on certificates." />
      <SettingsForm initial={stored} envFallback={(process.env.APP_URL ?? "").replace(/\/+$/, "")} />
    </>
  );
}

export default function AdminSettingsPage() {
  return <Suspense fallback={adminSkeleton}><Settings /></Suspense>;
}
