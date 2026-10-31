"use server";

import { getCourse } from "@/lib/catalogStore";
import { CALL_TIMES, addEnquiry, recentFromPhone } from "@/lib/enquiries";

export type EnquiryState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string>; firstName?: string };

const str = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function submitEnquiry(_prev: EnquiryState, fd: FormData): Promise<EnquiryState> {
  // Honeypot: real people never see or fill this field — quietly "succeed" for bots.
  if (str(fd, "website", 200)) return { ok: true };

  const name = str(fd, "name", 81);
  const phone = str(fd, "phone", 20).replace(/[\s-]/g, "").replace(/^\+91/, "");
  const email = str(fd, "email", 121);
  const callTime = str(fd, "callTime", 40);
  const message = str(fd, "message", 501);
  const courseId = str(fd, "courseId", 80);
  const source = str(fd, "source", 20) === "course-page" ? "course-page" : "home";

  const e: Record<string, string> = {};
  if (name.length < 2 || name.length > 80) e.name = "Please enter your name.";
  if (!/^[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) e.email = "Enter a valid email or leave it blank.";
  if (!CALL_TIMES.includes(callTime as (typeof CALL_TIMES)[number])) e.callTime = "Choose a time.";
  if (message.length > 500) e.message = "Keep your message under 500 characters.";
  if (fd.get("consent") !== "on") e.consent = "Please allow us to call you.";
  const course = await getCourse(courseId);
  if (!course) return { error: "This course is no longer available." };
  if (Object.keys(e).length) return { error: "Please check the highlighted fields.", fieldErrors: e };

  if ((await recentFromPhone(phone)) >= 3) {
    return { error: "We’ve already received your enquiries today — our representative will call you soon." };
  }

  await addEnquiry({
    name,
    phone,
    ...(email ? { email } : {}),
    courseId: course.id,
    courseTitle: course.title,
    callTime,
    ...(message ? { message } : {}),
    source,
  });
  return { ok: true, firstName: name.split(" ")[0] };
}
