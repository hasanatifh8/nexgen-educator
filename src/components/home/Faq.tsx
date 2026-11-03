import { IconChevronDown } from "../Icons";
import JsonLd from "../JsonLd";
import { faqLd } from "@/lib/structuredData";

export const FAQS: [question: string, answer: string][] = [
  ["Is NextGen Educator free?", "Registration is free and many courses are completely free. Paid courses have a one-time fee plus 18% GST, shown on each course. Nothing is paid on the website — our representative calls you first and shares the payment details."],
  ["Why do you ask for Aadhaar or PAN and my CV?", "We verify every educator so our certificates are trustworthy for schools and employers. For Aadhaar we only need the masked version (last 4 digits visible). Documents are stored privately and only authorised administrators can view them."],
  ["How do I get access to a course?", "Browse the catalog, open any course to see its full syllabus, and click “Request access” (free courses) or “Enroll now” (paid courses). For a paid course, our representative calls you for a short telephonic round first. Once your profile is complete, our team assigns the course and it appears in My Learning."],
  ["When can I take the certification exam?", "After you finish every lesson in every course of a program. The exam is timed and auto-graded, and passing gives you a QR-verified certificate instantly."],
  ["Can my school enrol a whole team?", "Yes — see “For Institutions” below for bulk enrolment, progress dashboards and custom exams."],
];

export default function Faq() {
  return (
    <section id="faq" className="py-20 lg:py-28">
      {/* The institutions answer describes features still being built, so it stays out of structured data. */}
      <JsonLd data={faqLd(FAQS.filter(([q]) => !q.startsWith("Can my school")))} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title mt-4">Questions educators ask us</h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group card overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                {q}
                <IconChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-6 pb-5 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
