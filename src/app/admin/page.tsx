import Link from "next/link";
import { Suspense } from "react";
import { IconArrowRight, IconPhone } from "@/components/Icons";
import { getCatalog } from "@/lib/catalogStore";
import { isAdminEmail, requireAdmin } from "@/lib/dal";
import { listEnquiries } from "@/lib/enquiries";
import { listUsers } from "@/lib/users";
import { formatIST, requestTime, timeAgo } from "./enquiries/format";
import { AccessDenied, AdminTitle, adminSkeleton } from "./ui";
import { ProfileBadge } from "./users/badges";

async function Dashboard() {
  const admin = await requireAdmin("/admin");
  if (!admin) return <AccessDenied />;

  const [{ programs, courses }, allUsers, enquiries] = await Promise.all([getCatalog(), listUsers(), listEnquiries()]);
  const newEnquiries = enquiries.filter((e) => e.status === "new");
  const now = requestTime();
  const users = allUsers.filter((u) => !isAdminEmail(u.email));
  const awaitingReview = users.filter((u) => u.profile && u.verification.status === "pending").length;
  const requests = users.reduce((n, u) => n + u.requests.length, 0);
  const certificates = users.flatMap((u) => u.certificates);
  const noExam = programs.filter((p) => p.exam.questions.length === 0);

  const stats = [
    { label: "New enquiries", value: newEnquiries.length, sub: `${enquiries.length} total call-back requests`, href: "/admin/enquiries", hot: newEnquiries.length > 0 },
    { label: "Learners", value: users.length, sub: `${users.filter((u) => !u.profile).length} haven’t completed their profile`, href: "/admin/users" },
    { label: "Awaiting review", value: awaitingReview, sub: "profiles with documents to verify", href: "/admin/users?filter=review", hot: awaitingReview > 0 },
    { label: "Course requests", value: requests, sub: "waiting to be assigned", href: "/admin/users?filter=requests", hot: requests > 0 },
    { label: "Certificates issued", value: certificates.length, sub: `${programs.length} programs · ${courses.length} courses`, href: "/admin/programs" },
  ];

  const recent = [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);

  return (
    <>
      <AdminTitle title={`Welcome, ${admin.firstName}`} subtitle="Manage programs, pricing, courses and certification exams." />

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`card card-hover block p-5 ${s.hot ? "ring-2 ring-accent/60" : ""}`}>
            <dt className="text-sm text-slate-500">{s.label}</dt>
            <dd className={`mt-1 font-display text-3xl font-bold ${s.hot ? "text-accent-strong" : "text-navy-900"}`}>{s.value}</dd>
            <dd className="mt-1 text-xs text-slate-500">{s.sub}</dd>
          </Link>
        ))}
      </dl>

      {noExam.length > 0 && (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          <span className="font-semibold">{noExam.length} program{noExam.length > 1 ? "s have" : " has"} no exam questions yet:</span>{" "}
          {noExam.map((p, i) => (
            <span key={p.id}>
              {i > 0 && ", "}
              <Link href={`/admin/programs/${p.id}/exam`} className="font-semibold underline">{p.title}</Link>
            </span>
          ))}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/admin/programs/new", label: "New certification program" },
          { href: "/admin/courses/new", label: "New course" },
          { href: "/admin/users?filter=review", label: "Review learner profiles" },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="card card-hover flex items-center justify-between p-5 font-semibold text-navy-900">
            {a.label} <IconArrowRight className="h-4 w-4 text-brand-ink" />
          </Link>
        ))}
      </div>

      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-navy-900">Latest enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-brand-ink hover:underline">View all →</Link>
        </div>
        {enquiries.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No enquiries yet — they’ll appear here when visitors click “Enquire now”.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {enquiries.slice(0, 6).map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3.5 text-sm">
                <span className="w-44 shrink-0">
                  <span className="block font-semibold text-navy-900">{formatIST(e.createdAt)}</span>
                  <span className="text-xs text-slate-500">{timeAgo(e.createdAt, now)}</span>
                </span>
                <span className="min-w-40 flex-1">
                  <span className="block font-semibold text-navy-900">{e.name}</span>
                  <a href={`tel:+91${e.phone}`} className="flex items-center gap-1 text-xs font-semibold text-brand-ink hover:underline"><IconPhone className="h-3.5 w-3.5" /> +91 {e.phone}</a>
                </span>
                <span className="min-w-48 flex-1 text-slate-600">{e.courseTitle}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${e.status === "new" ? "bg-orange-50 text-orange-700 ring-orange-200" : e.status === "contacted" ? "bg-sky-50 text-sky-700 ring-sky-200" : "bg-slate-100 text-slate-600 ring-slate-200"}`}>
                  {e.status === "new" ? "New" : e.status === "contacted" ? "Contacted" : "Closed"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card mt-8 overflow-hidden">
        <h2 className="border-b border-slate-200 px-5 py-4 font-display text-lg font-semibold text-navy-900">Recent registrations</h2>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Profile</th><th className="px-5 py-3">Assigned</th><th className="px-5 py-3">Certificates</th><th className="px-5 py-3">Joined</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3 font-medium text-navy-900"><Link href={`/admin/users/${u.id}`} className="hover:text-brand-ink">{u.firstName} {u.lastName}</Link></td>
                    <td className="px-5 py-3 text-slate-600">{u.email}</td>
                    <td className="px-5 py-3"><ProfileBadge user={u} /></td>
                    <td className="px-5 py-3 text-slate-600">{u.assignedCourses.length}</td>
                    <td className="px-5 py-3 text-slate-600">{u.certificates.length}</td>
                    <td className="px-5 py-3 text-slate-500">{u.createdAt.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default function AdminDashboardPage() {
  return <Suspense fallback={adminSkeleton}><Dashboard /></Suspense>;
}
