import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { IconCheck } from "@/components/Icons";
import { requireUser } from "@/lib/dal";
import { safeNextPath } from "@/lib/sessionToken";
import { findUserById } from "@/lib/users";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = { title: "Complete your profile — NextGen Educator" };

const steps = ["Create account", "Complete profile", "Admin assigns courses", "Learn & get certified"];
/** Shown when the learner is on the way to a paid-course checkout. */
const checkoutSteps = ["Create account", "Complete profile", "Confirm enrollment", "Call with our team"];

async function Onboarding({ searchParams }: { searchParams: PageProps<"/onboarding">["searchParams"] }) {
  const { next } = await searchParams;
  const dest = safeNextPath(next);
  // Keep the original destination through the login round-trip.
  const session = await requireUser(dest ? `/onboarding?next=${encodeURIComponent(dest)}` : "/onboarding");
  if (session.isAdmin) redirect("/admin");
  const user = (await findUserById(session.id))!;
  const p = user.profile;
  const v = user.verification;

  return (
    <>
      <ol className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(dest?.startsWith("/checkout/") ? checkoutSteps : steps).map((s, i) => {
          const done = i === 0 || (i === 1 && !!p);
          const current = i === 1;
          return (
            <li key={s} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${current ? "bg-navy-900 text-white" : done ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${current ? "bg-white/20" : done ? "bg-emerald-600 text-white" : "bg-slate-100"}`}>
                {done && !current ? <IconCheck className="h-3 w-3" /> : i + 1}
              </span>
              {s}
            </li>
          );
        })}
      </ol>

      <section className="card p-6 sm:p-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900">
          {p ? "Your profile" : `Welcome, ${user.firstName}! Let’s complete your profile`}
        </h1>
        <p className="mt-2 text-slate-600">
          We verify every educator before assigning courses. This takes about 2 minutes.
        </p>

        {p && v.status === "pending" && (
          <p className="mt-6 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-100">
            <span className="font-semibold">Submitted — under review.</span> You can update details or replace documents below.
          </p>
        )}
        {v.status === "rejected" && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
            <span className="font-semibold">Please update your profile.</span> {v.note || "Your documents could not be verified."}
          </p>
        )}
        {v.status === "verified" && (
          <p className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
            <IconCheck className="h-4 w-4" /> Verified. Updating your documents will send your profile back for review.
          </p>
        )}

        <div className="mt-8">
          <ProfileForm
            next={dest ?? ""}
            existing={p ? { phone: p.phone, city: p.city, state: p.state, qualification: p.qualification, experienceYears: p.experienceYears, idType: p.idType, idName: p.idDocument.originalName, cvName: p.cv.originalName } : null}
          />
        </div>
      </section>
    </>
  );
}

export default function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <Suspense fallback={<div className="h-[40rem] animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />}>
            <Onboarding searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
