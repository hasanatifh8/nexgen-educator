import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProfileForm from "@/app/onboarding/ProfileForm";
import { isAdminEmail, requireAdmin } from "@/lib/dal";
import { findUserById } from "@/lib/users";
import { adminSaveProfileAction } from "../../../actions";
import { AccessDenied, adminSkeleton } from "../../../ui";

type P = PageProps<"/admin/users/[id]/profile">;

/** Lets an admin complete or correct a learner's profile when the learner can't do it themselves. */
async function AdminProfile({ params }: { params: P["params"] }) {
  const { id } = await params;
  if (!(await requireAdmin(`/admin/users/${id}/profile`))) return <AccessDenied />;
  const user = await findUserById(id);
  if (!user || isAdminEmail(user.email)) notFound();
  const p = user.profile;
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <Link href={`/admin/users/${user.id}`} className="text-sm font-semibold text-brand-ink hover:underline">← Back to {name}</Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-navy-900">{p ? "Edit profile" : "Complete profile"} for {name}</h1>
      <p className="mt-1 text-sm text-slate-500">{user.email}</p>
      <p className="mt-4 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-100">
        Use this when the learner can’t fill in their profile themselves — for example, they sent their details and documents by WhatsApp or email.
        The learner can open their courses as soon as the profile is complete, and the profile records that you entered it.
      </p>
      <section className="card mt-6 p-6 sm:p-8">
        <ProfileForm
          mode="admin"
          action={adminSaveProfileAction}
          hidden={{ userId: user.id }}
          learnerName={user.firstName}
          existing={p ? { phone: p.phone, city: p.city, state: p.state, qualification: p.qualification, experienceYears: p.experienceYears, idType: p.idType, idName: p.idDocument.originalName, cvName: p.cv.originalName } : null}
        />
      </section>
    </>
  );
}

export default function AdminProfilePage({ params }: P) {
  return <Suspense fallback={adminSkeleton}><AdminProfile params={params} /></Suspense>;
}
