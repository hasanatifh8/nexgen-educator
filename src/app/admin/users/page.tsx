import Link from "next/link";
import { Suspense } from "react";
import { isAdminEmail, requireAdmin } from "@/lib/dal";
import { listUsers } from "@/lib/users";
import { AccessDenied, AdminTitle, adminSkeleton, one } from "../ui";
import { ProfileBadge } from "./badges";

const FILTERS = [
  { id: "all", label: "All learners" },
  { id: "review", label: "Awaiting review" },
  { id: "requests", label: "Course requests" },
  { id: "incomplete", label: "Profile incomplete" },
] as const;

async function Users({ searchParams }: { searchParams: PageProps<"/admin/users">["searchParams"] }) {
  if (!(await requireAdmin("/admin/users"))) return <AccessDenied />;
  const sp = await searchParams;
  const filter = one(sp.filter) ?? "all";
  const q = (one(sp.q) ?? "").toLowerCase().trim();

  const learners = (await listUsers()).filter((u) => !isAdminEmail(u.email)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const counts = {
    all: learners.length,
    review: learners.filter((u) => u.profile && u.verification.status === "pending").length,
    requests: learners.filter((u) => u.requests.length).length,
    incomplete: learners.filter((u) => !u.profile).length,
  };
  const shown = learners
    .filter((u) => filter === "review" ? u.profile && u.verification.status === "pending" : filter === "requests" ? u.requests.length > 0 : filter === "incomplete" ? !u.profile : true)
    .filter((u) => !q || `${u.firstName} ${u.lastName} ${u.email} ${u.profile?.phone ?? ""}`.toLowerCase().includes(q));

  return (
    <>
      <AdminTitle title="Learners" subtitle="Verify profiles and assign free or paid courses." />

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <Link key={f.id} href={`/admin/users?filter=${f.id}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${filter === f.id ? "bg-navy-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-navy-900"}`}>
              {f.label} <span className="ml-1 opacity-60">{counts[f.id]}</span>
            </Link>
          ))}
        </nav>
        <form className="flex gap-2">
          <input type="hidden" name="filter" value={filter} />
          <input name="q" defaultValue={q} placeholder="Search name, email, phone" className="w-64 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-sky-100" />
          <button className="btn-secondary py-2">Search</button>
        </form>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr><th className="px-5 py-3">Learner</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Assigned</th><th className="px-5 py-3">Requests</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shown.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-navy-900">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-slate-500">{u.email}{u.profile ? ` · ${u.profile.city}, ${u.profile.state}` : ""}</p>
                </td>
                <td className="px-5 py-3.5"><ProfileBadge user={u} /></td>
                <td className="px-5 py-3.5 text-slate-600">{u.assignedCourses.length} courses</td>
                <td className="px-5 py-3.5">
                  {u.requests.length ? <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700 ring-1 ring-orange-200">{u.requests.length} pending</span> : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-5 py-3.5 text-slate-500">{u.createdAt.slice(0, 10)}</td>
                <td className="px-5 py-3.5 text-right"><Link href={`/admin/users/${u.id}`} className="rounded-md px-3 py-1.5 text-xs font-semibold text-brand-ink hover:bg-sky-50">Manage →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="px-5 py-12 text-center text-sm text-slate-500">No learners match.</p>}
      </div>
    </>
  );
}

export default function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  return <Suspense fallback={adminSkeleton}><Users searchParams={searchParams} /></Suspense>;
}
