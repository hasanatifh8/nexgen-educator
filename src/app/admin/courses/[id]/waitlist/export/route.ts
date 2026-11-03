import { getCourse } from "@/lib/catalogStore";
import { getCurrentUser } from "@/lib/dal";
import { waitlistRows } from "../rows";

/** CSV of a course's “Notify me” list for follow-up calls and emails (admins only). */
export async function GET(_req: Request, ctx: RouteContext<"/admin/courses/[id]/waitlist/export">) {
  const admin = await getCurrentUser();
  if (!admin?.isAdmin) return new Response("Not found", { status: 404 });
  const { id } = await ctx.params;
  const course = await getCourse(id);
  if (!course) return new Response("Not found", { status: 404 });
  const rows = await waitlistRows(id);

  // Quote every cell and neutralise spreadsheet formulas (=, +, -, @) from user input.
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const date = (iso?: string) => (iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "");
  const header = ["Name", "Email", "Mobile (+91)", "Location", "Work status", "School / institution", "Profile", "Joined waiting list (IST)", "Registered (IST)", "Already enrolled/requested"];
  const lines = rows.map((r) => [r.name, r.email, r.phone, r.location, r.workStatus, r.institution, r.profile, date(r.joinedListAt), date(r.registeredAt), r.enrolled ? "Yes" : "No"].map(cell).join(","));
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waiting-list-${course.id}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
