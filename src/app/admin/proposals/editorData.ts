import { EXAM_ATTEMPT_POLICY } from "@/lib/access";
import { getCatalog } from "@/lib/catalogStore";
import { OFFICES, ORG, SITE_URL } from "@/lib/organization";
import { proposalPrograms, proposalStats } from "@/lib/proposal/data";
import type { ProposalOrg } from "@/lib/proposal/pdf";
import type { ProposalInput } from "@/lib/proposal/types";
import { listProposals } from "@/lib/proposals";
import { getSettings } from "@/lib/settings";

type Admin = { firstName: string; lastName: string; email: string };

/** Everything the proposal editor needs: live catalog, organisation details and sender defaults. */
export async function proposalEditorData(admin: Admin) {
  const [catalog, settings, proposals] = await Promise.all([getCatalog(), getSettings(), listProposals()]);
  const programs = proposalPrograms(catalog);
  const phone = settings.supportPhone || ORG.phone.label;
  const org: ProposalOrg = {
    name: settings.organizationName || ORG.name,
    website: SITE_URL,
    websiteLabel: SITE_URL.replace(/^https?:\/\//, ""),
    phone,
    email: settings.supportEmail,
    cities: OFFICES.map((o) => o.city),
    disclaimer:
      "NextGen Educator certificates are professional development credentials. They do not replace government-issued teaching licences or state/national certification requirements. Recognition of credentials and continuing education credits varies by institution and jurisdiction.",
  };
  // Sender details: whatever the last proposal used, so the admin types them once.
  const last = proposals[0];
  const sender: Pick<ProposalInput, "preparedBy" | "preparedByTitle" | "preparedPhone" | "preparedEmail"> = last
    ? { preparedBy: last.preparedBy, preparedByTitle: last.preparedByTitle, preparedPhone: last.preparedPhone, preparedEmail: last.preparedEmail }
    : { preparedBy: `${admin.firstName} ${admin.lastName}`.trim(), preparedByTitle: "", preparedPhone: phone, preparedEmail: settings.supportEmail || admin.email };
  return { programs, org, stats: proposalStats(programs), attemptsPerDay: EXAM_ATTEMPT_POLICY.maxAttempts, sender };
}
