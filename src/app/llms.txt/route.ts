import { connection } from "next/server";
import { formatINR, launchLabel, priceWithGst } from "@/lib/catalog";
import { getPublicCatalog } from "@/lib/catalogStore";
import { FAQS } from "@/components/home/Faq";
import { OFFICES, ORG, SISTER_PLATFORMS, SITE_URL } from "@/lib/organization";

/**
 * /llms.txt — a plain-language briefing for AI assistants (the llmstxt.org convention), generated from the live
 * catalog so course names, fees and launch dates are always current. Only verifiable facts belong here.
 */
export async function GET() {
  await connection();
  const { courses, programs } = await getPublicCatalog();
  const programTitle = Object.fromEntries(programs.map((p) => [p.id, p.title]));
  const url = (path: string) => `${SITE_URL}${path}`;
  const fee = (price: number) => (price === 0 ? "Free" : `${formatINR(price)} + 18% GST (${formatINR(priceWithGst(price))} total)`);

  const lines = [
    `# ${ORG.name}`,
    "",
    `> ${ORG.description}`,
    "",
    `${ORG.name} ("${ORG.tagline}") is part of the technology and educational research ecosystem led by ${ORG.parent.name} (${ORG.parent.url}). Website: ${SITE_URL}`,
    "",
    "## How it works",
    "",
    "1. Register for free at " + url("/register") + ".",
    "2. Complete a profile with a masked Aadhaar or PAN card and a CV; the team verifies every educator.",
    "3. Request a free course, or enroll in a paid course. There is no online payment: a representative calls the learner, shares payment details, and the course is then assigned.",
    "4. Learn online at your own pace, on a phone or computer.",
    "5. After finishing every course in a program, take the timed, auto-graded certification exam.",
    `6. Passing issues a digital certificate with a credential ID and QR code that anyone can verify at ${url("/verify")}.`,
    "",
    "## Courses",
    "",
    ...courses.map((c) =>
      `- [${c.title}](${url(`/courses/${c.id}`)}): ${c.blurb} Category: ${c.category}. Level: ${c.level}. About ${c.hours} hours. Fee: ${fee(c.price)}. Certificate: ${programTitle[c.programId] ?? "—"}.${c.launch ? ` Not open for enrollment yet — ${launchLabel(c.launch)}.` : ""}`,
    ),
    "",
    "## Frequently asked questions",
    "",
    ...FAQS.filter(([q]) => !q.startsWith("Can my school")).flatMap(([q, a]) => [`### ${q}`, "", a, ""]),
    "## Contact and offices",
    "",
    `- Phone: ${ORG.phone.label}`,
    ...OFFICES.map((o) => `- ${o.label}, ${o.city}: ${o.lines.join(", ")}, India`),
    "",
    "## Related platforms",
    "",
    ...SISTER_PLATFORMS.map((p) => `- [${p.name}](${p.url}): ${p.detail}`),
    "",
    "## Key pages",
    "",
    `- [All courses](${url("/courses")})`,
    `- [About us](${url("/about")})`,
    `- [Verify a certificate](${url("/verify")})`,
    `- [Create an account](${url("/register")})`,
    "",
    "Certificates are professional-development credentials. They do not replace government-issued teaching licences or state or national certification requirements.",
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
