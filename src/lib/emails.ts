/** Transactional email content. Every template returns the subject plus matching plain-text and HTML bodies. */

const BRAND = "NextGen Educator";

/** Who the email is from: site address (for the logo and links) and the support contacts for the signature. */
export type Brand = { base: string; organizationName: string; supportEmail: string; supportPhone: string };

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Email = { subject: string; text: string; html: string };

type Layout = {
  greeting: string;
  /** Plain-text paragraphs; escaped before going into the HTML. */
  paragraphs: string[];
  list?: { label: string; url: string }[];
  button?: { label: string; url: string };
  footnote?: string;
};

const NAVY = "#0f2a4a";
const BLUE = "#0670ab";
const ORANGE = "#f97316";

function render(subject: string, brand: Brand, { greeting, paragraphs, list, button, footnote }: Layout): Email {
  const org = brand.organizationName || BRAND;
  const site = brand.base.replace(/^https?:\/\//, "");
  const phoneHref = brand.supportPhone.replace(/[^\d+]/g, "");
  const contacts = [
    { label: site, href: brand.base },
    ...(brand.supportEmail ? [{ label: brand.supportEmail, href: `mailto:${brand.supportEmail}` }] : []),
    ...(brand.supportPhone ? [{ label: brand.supportPhone, href: `tel:${phoneHref}` }] : []),
  ];

  const text = [
    greeting,
    ...paragraphs,
    ...(list?.length ? [list.map((i) => `• ${i.label}: ${i.url}`).join("\n")] : []),
    ...(button ? [`${button.label}: ${button.url}`] : []),
    ...(footnote ? [footnote] : []),
    `Warm regards,\nThe ${org} Team\nTrain. Test. Certify.\n${contacts.map((c) => c.label).join("\n")}`,
  ].join("\n\n");

  const p = (s: string) => `<p style="margin:0 0 16px">${escapeHtml(s)}</p>`;
  // One contact per line so nothing wraps mid-number on a phone.
  const contactHtml = contacts
    .map((c) => `<a href="${escapeHtml(c.href)}" style="color:${BLUE};text-decoration:none;white-space:nowrap">${escapeHtml(c.label)}</a>`)
    .join("<br>");

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<span style="display:none;max-height:0;overflow:hidden">${escapeHtml(paragraphs[0] ?? "")}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:14px;overflow:hidden">
<tr><td style="background:${NAVY};padding:24px 32px">
  <a href="${escapeHtml(brand.base)}" style="text-decoration:none"><img src="${escapeHtml(brand.base)}/email/logo-on-dark.png" width="220" height="43" alt="${escapeHtml(org)}" style="display:block;border:0;width:220px;max-width:100%;height:auto;color:#ffffff;font-size:20px;font-weight:bold"></a>
</td></tr>
<tr><td style="height:4px;background:${ORANGE};font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:32px;font-size:15px;line-height:1.65">
${p(greeting)}
${paragraphs.map(p).join("\n")}
${list?.length ? `<ul style="margin:0 0 20px;padding-left:20px">${list.map((i) => `<li style="margin-bottom:8px"><a href="${escapeHtml(i.url)}" style="color:${BLUE};font-weight:bold">${escapeHtml(i.label)}</a></li>`).join("")}</ul>` : ""}
${button ? `<p style="margin:8px 0 24px"><a href="${escapeHtml(button.url)}" style="display:inline-block;background:${ORANGE};color:#ffffff;padding:13px 24px;border-radius:8px;text-decoration:none;font-weight:bold">${escapeHtml(button.label)}</a></p>` : ""}
${footnote ? `<p style="margin:0 0 16px;color:#64748b;font-size:13px">${escapeHtml(footnote)}</p>` : ""}
<p style="margin:24px 0 0">Warm regards,</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px;border-top:1px solid #e2e8f0;padding-top:16px;width:100%"><tr>
  <td width="52" valign="top" style="padding:16px 14px 0 0"><img src="${escapeHtml(brand.base)}/email/icon.png" width="44" height="44" alt="" style="display:block;border:0;border-radius:10px"></td>
  <td valign="top" style="padding-top:16px;font-size:13px;line-height:1.55;color:#475569">
    <strong style="font-size:15px;color:${NAVY}">The ${escapeHtml(org)} Team</strong><br>
    <span style="color:${ORANGE};font-weight:bold;font-size:11px;letter-spacing:1.5px">TRAIN. TEST. CERTIFY.</span><br>
    <span style="display:block;margin-top:6px">${contactHtml}</span>
  </td>
</tr></table>
</td></tr></table>
<p style="max-width:540px;color:#94a3b8;font-size:12px;line-height:1.5;margin:16px auto 0">You are receiving this email because you have an account with ${escapeHtml(org)}. This message was sent automatically${brand.supportEmail ? ` — for help, reply or write to ${escapeHtml(brand.supportEmail)}` : ""}.<br>© ${new Date().getFullYear()} ${escapeHtml(org)}. All rights reserved.</p>
</td></tr></table>
</body></html>`;

  return { subject, text, html };
}

export function welcomeEmail(firstName: string, brand: Brand): Email {
  const { base } = brand;
  return render(`Welcome to ${BRAND} — your account is ready`, brand, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      `Thank you for registering with ${BRAND}. Your account has been created successfully.`,
      "To get started, please log in and complete your educator profile. This takes about two minutes and requires a valid government ID (Aadhaar or PAN) and your CV. Our team reviews every profile before assigning courses, so completing it promptly helps you begin sooner.",
    ],
    button: { label: "Log in and complete your profile", url: `${base}/login` },
    footnote: `If you did not create an account with ${BRAND}, please ignore this email.`,
  });
}

export function courseApprovedEmail(firstName: string, brand: Brand, courses: { id: string; title: string }[]): Email {
  const { base } = brand;
  const one = courses.length === 1;
  return render(one ? `Course approved: ${courses[0].title}` : `${courses.length} courses approved for you`, brand, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      one
        ? "We are pleased to inform you that your enrolment has been verified and approved. You now have full access to the following course:"
        : "We are pleased to inform you that your enrolment has been verified and approved. You now have full access to the following courses:",
    ],
    list: courses.map((c) => ({ label: c.title, url: `${base}/courses/${c.id}` })),
    button: { label: "Start learning", url: `${base}/my-learning` },
    footnote: "You can learn at your own pace. Your progress is saved automatically, and you can return to your courses anytime from My Learning.",
  });
}

export function passwordResetEmail(firstName: string, brand: Brand, link: string): Email {
  return render(`Reset your ${BRAND} password`, brand, {
    greeting: `Dear ${firstName},`,
    paragraphs: ["We received a request to reset the password for your account. Use the button below to set a new password. This link is valid for 30 minutes."],
    button: { label: "Reset password", url: link },
    footnote: "If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.",
  });
}

export function paymentReceivedEmail(firstName: string, brand: Brand, p: { courseTitle: string; amount: string; reference?: string; date: string }): Email {
  const { base } = brand;
  return render(`Payment received: ${p.courseTitle}`, brand, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      `Thank you. We have received your payment of ${p.amount} for ${p.courseTitle} on ${p.date}.${p.reference ? ` Transaction reference: ${p.reference}.` : ""}`,
      "You can view the status of all your payments at any time in the Payments section of your learner portal.",
    ],
    button: { label: "View payments", url: `${base}/my-learning/payments` },
  });
}

export function resumeReadyEmail(firstName: string, brand: Brand): Email {
  const { base } = brand;
  return render("Your upgraded resume is ready", brand, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      "Congratulations on completing your course. Our career team has rewritten your resume to highlight your new skills and certifications.",
      "You can compare it side by side with your original CV, review the improvements we made, and download it from your learner portal.",
    ],
    button: { label: "View my new resume", url: `${base}/my-learning/resume` },
    footnote: brand.supportEmail ? "If you would like any changes, simply reply to this email." : undefined,
  });
}

export function courseRequestedEmail(
  firstName: string,
  brand: Brand,
  r: { courseTitle: string; programTitle: string; fee?: string; call?: { phone: string; slot: string } },
): Email {
  const { base } = brand;
  if (r.fee) {
    return render(`Enrollment request received: ${r.courseTitle}`, brand, {
      greeting: `Dear ${firstName},`,
      paragraphs: [
        `Thank you for choosing ${r.courseTitle}, part of the ${r.programTitle} program. Your enrollment request has been received.`,
        r.call
          ? `Our representative will call you on ${r.call.phone} during your preferred time, ${r.call.slot.toLowerCase()}, for a short telephonic discussion. This is usually within 1–2 working days.`
          : "Our representative will call you for a short telephonic discussion, usually within 1–2 working days.",
        `During the call we will confirm the course is right for you and share the payment details for the course fee of ${r.fee} (including 18% GST). No payment is taken on the website.`,
        "The course will be assigned to you after the call, and we will email you the moment it is available in your learner portal.",
      ],
      button: { label: "View my enrollment", url: `${base}/my-learning/courses` },
    });
  }
  return render(`Course request received: ${r.courseTitle}`, brand, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      `We have received your request to join ${r.courseTitle}, part of the ${r.programTitle} program.`,
      "This course is free. Our team will review your request and approve it, usually within 1–2 working days.",
      "We will email you again the moment the course is available in your learner portal.",
    ],
    button: { label: "Track my request", url: `${base}/my-learning/courses` },
  });
}

export function notesSharedEmail(firstName: string, brand: Brand, notes: { title: string }[]): Email {
  const { base } = brand;
  const one = notes.length === 1;
  return render(one ? `New study notes: ${notes[0].title}` : `${notes.length} new study notes for you`, brand, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      one
        ? "Our team has shared new study notes with you. You can read them online or download the PDF from your learner portal:"
        : "Our team has shared new study notes with you. You can read them online or download the PDFs from your learner portal:",
    ],
    list: notes.map((n) => ({ label: n.title, url: `${base}/my-learning/notes` })),
    button: { label: "Open my notes", url: `${base}/my-learning/notes` },
    footnote: "These notes are shared with you personally. Please do not forward or publish them.",
  });
}
