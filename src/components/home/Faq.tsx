import { IconChevronDown } from "../Icons";
import JsonLd from "../JsonLd";
import { faqLd } from "@/lib/structuredData";
import { EXAM_ATTEMPT_POLICY } from "@/lib/access";

export const FAQS: [question: string, answer: string][] = [
  ["I am not good with computers. Can I really do this?", "Yes. The courses are made for teachers who are new to technology. Beginner courses start from the very basics in simple English, and if you can use WhatsApp on your phone, you can follow the lessons."],
  ["I teach full-time. How much time will it take?", "Most lessons take 10–15 minutes and courses are self-paced, so you can learn in a free period, on the way home or on a weekend. Your progress is saved, so you continue exactly where you stopped."],
  ["Can I learn on my mobile phone?", "Yes. The website works in any smartphone browser. There is no app to download and you don’t need a laptop."],
  ["Will this help my career?", "Your certificate gives you proof of modern teaching skills that you can add to your CV and LinkedIn, and any school can verify it in seconds. We can’t promise a job or promotion — that depends on each school — but you will walk into interviews and appraisals with evidence instead of claims."],
  ["What if I fail the exam?", `Don’t worry, it happens. You can revise the lessons and try again. You get up to ${EXAM_ATTEMPT_POLICY.maxAttempts} attempts in any 24 hours, and after that you simply wait a day and try again.`],
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
          <h2 className="section-title mt-4">Questions teachers ask us</h2>
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
