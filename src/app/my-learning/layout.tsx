import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/actions/auth";
import { IconArrowRight, IconLogout, IconShield } from "@/components/Icons";
import Logo from "@/components/Logo";
import { getCurrentUser } from "@/lib/dal";
import PortalNav, { PortalTabBar } from "./PortalNav";

export const metadata: Metadata = { title: "My Learning — NextGen Educator" };

/** The signed-in learner portal: an app-style shell, separate from the promotional site's header and footer. */
export default function PortalLayout({ children }: LayoutProps<"/my-learning">) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-slate-100 lg:flex-row">
      <aside className="bg-navy-950 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 lg:px-5 lg:pt-6 lg:pb-6">
          <Logo light />
          <form action={logout} className="lg:hidden">
            <button type="submit" className="grid h-11 w-11 place-items-center rounded-lg text-slate-300 hover:bg-white/10" aria-label="Log out">
              <IconLogout className="h-5 w-5" />
            </button>
          </form>
        </div>
        <div className="hidden px-3 pb-3 lg:block lg:flex-1">
          <Suspense fallback={<div className="h-72 rounded-xl bg-white/5" />}>
            <PortalNav />
          </Suspense>
        </div>
        <div className="hidden space-y-4 p-4 lg:block">
          <Link href="/courses" className="flex items-center justify-between rounded-xl bg-gradient-to-br from-brand to-brand-teal p-4 text-sm font-semibold text-white">
            <span>Explore more courses<span className="block text-xs font-normal text-sky-50">Request any course in the catalog</span></span>
            <IconArrowRight className="h-4 w-4 shrink-0" />
          </Link>
          <Suspense fallback={<div className="h-14 rounded-xl bg-white/5" />}>
            <UserChip />
          </Suspense>
        </div>
      </aside>
      <main className="min-w-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
        <p className="flex items-center justify-center gap-2 px-4 pb-8 text-xs text-slate-500">
          <IconShield className="h-4 w-4" /> Your documents are private — only you and our verification team can see them.
        </p>
      </main>
      <Suspense fallback={null}>
        <PortalTabBar />
      </Suspense>
    </div>
  );
}

async function UserChip() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-amber-500 font-display text-sm font-bold">
        {user.firstName[0]}{user.lastName[0]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{user.firstName} {user.lastName}</p>
        <p className="truncate text-xs text-slate-400">{user.email}</p>
      </div>
      <form action={logout}>
        <button type="submit" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Log out" title="Log out">
          <IconLogout className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
