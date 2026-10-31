import { getCurrentUser } from "@/lib/dal";
import { listEnquiries } from "@/lib/enquiries";
import { formatIST } from "../format";

/** CSV download of enquiries for the calling team (admins only). */
export async function GET(req: Request) {
  const admin = await getCurrentUser();
  if (!admin?.isAdmin) return new Response("Not found", { status: 404 });
  const status = new URL(req.url).searchParams.get("status") ?? "all";
  const rows = (await listEnquiries()).filter((e) => status === "all" || e.status === status);

  // Quote every cell and neutralise spreadsheet formulas (=, +, -, @) from user input.
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = ["Received (IST)", "Name", "Mobile", "Email", "Course", "Best time", "Message", "Status", "Admin note", "Source"];
  const lines = rows.map((e) =>
    [formatIST(e.createdAt), e.name, `+91 ${e.phone}`, e.email, e.courseTitle, e.callTime, e.message, e.status, e.adminNote, e.source].map(cell).join(","),
  );
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enquiries-${status}-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
