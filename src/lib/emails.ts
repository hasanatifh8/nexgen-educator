/** Transactional email content. Every template returns the subject plus matching plain-text and HTML bodies. */

const BRAND = "NextGen Educator";

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

function render(subject: string, { greeting, paragraphs, list, button, footnote }: Layout): Email {
  const text = [
    greeting,
    ...paragraphs,
    ...(list?.length ? [list.map((i) => `• ${i.label}: ${i.url}`).join("\n")] : []),
    ...(button ? [`${button.label}: ${button.url}`] : []),
    ...(footnote ? [footnote] : []),
    `Warm regards,\nThe ${BRAND} Team`,
  ].join("\n\n");

  const p = (s: string) => `<p style="margin:0 0 16px">${escapeHtml(s)}</p>`;
  const html = `<!DOCTYPE html>
<html><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#0b1b3a;padding:20px 32px;color:#ffffff;font-size:18px;font-weight:bold">${BRAND}<span style="display:block;font-size:12px;font-weight:normal;color:#cbd5e1;margin-top:4px">Train. Test. Certify.</span></td></tr>
<tr><td style="padding:32px;font-size:15px;line-height:1.6">
${p(greeting)}
${paragraphs.map(p).join("\n")}
${list?.length ? `<ul style="margin:0 0 20px;padding-left:20px">${list.map((i) => `<li style="margin-bottom:8px"><a href="${escapeHtml(i.url)}" style="color:#ea580c;font-weight:bold">${escapeHtml(i.label)}</a></li>`).join("")}</ul>` : ""}
${button ? `<p style="margin:8px 0 24px"><a href="${escapeHtml(button.url)}" style="display:inline-block;background:#f97316;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">${escapeHtml(button.label)}</a></p>` : ""}
${footnote ? `<p style="margin:0 0 16px;color:#64748b;font-size:13px">${escapeHtml(footnote)}</p>` : ""}
<p style="margin:0">Warm regards,<br>The ${BRAND} Team</p>
</td></tr></table>
<p style="color:#94a3b8;font-size:12px;margin:16px 0 0">This is an automated message from ${BRAND}.</p>
</td></tr></table>
</body></html>`;

  return { subject, text, html };
}

export function welcomeEmail(firstName: string, base: string): Email {
  return render(`Welcome to ${BRAND} — your account is ready`, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      `Thank you for registering with ${BRAND}. Your account has been created successfully.`,
      "To get started, please log in and complete your educator profile. This takes about two minutes and requires a valid government ID (Aadhaar or PAN) and your CV. Our team reviews every profile before assigning courses, so completing it promptly helps you begin sooner.",
    ],
    button: { label: "Log in and complete your profile", url: `${base}/login` },
    footnote: `If you did not create an account with ${BRAND}, please ignore this email.`,
  });
}

export function courseApprovedEmail(firstName: string, base: string, courses: { id: string; title: string }[]): Email {
  const one = courses.length === 1;
  return render(one ? `Course approved: ${courses[0].title}` : `${courses.length} courses approved for you`, {
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

export function passwordResetEmail(firstName: string, link: string): Email {
  return render(`Reset your ${BRAND} password`, {
    greeting: `Dear ${firstName},`,
    paragraphs: ["We received a request to reset the password for your account. Use the button below to set a new password. This link is valid for 30 minutes."],
    button: { label: "Reset password", url: link },
    footnote: "If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.",
  });
}

export function paymentReceivedEmail(firstName: string, base: string, p: { programTitle: string; amount: string; reference?: string; date: string }): Email {
  return render(`Payment received: ${p.programTitle}`, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      `Thank you. We have received your payment of ${p.amount} for the ${p.programTitle} program on ${p.date}.${p.reference ? ` Transaction reference: ${p.reference}.` : ""}`,
      "You can view the status of all your payments at any time in the Payments section of your learner portal.",
    ],
    button: { label: "View payments", url: `${base}/my-learning/payments` },
  });
}

export function resumeReadyEmail(firstName: string, base: string): Email {
  return render("Your upgraded resume is ready", {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      "Congratulations on completing your course. Our career team has rewritten your resume to highlight your new skills and certifications.",
      "You can compare it side by side with your original CV, review the improvements we made, and download it from your learner portal.",
    ],
    button: { label: "View my new resume", url: `${base}/my-learning/resume` },
    footnote: "If you would like any changes, simply reply to this email.",
  });
}

export function courseRequestedEmail(firstName: string, base: string, r: { courseTitle: string; programTitle: string; fee?: string }): Email {
  return render(`Course request received: ${r.courseTitle}`, {
    greeting: `Dear ${firstName},`,
    paragraphs: [
      `We have received your request to join ${r.courseTitle}, part of the ${r.programTitle} program.`,
      r.fee
        ? `This is a premium program with a one-time fee of ${r.fee} (including 18% GST). Our team will contact you with payment details, and the course will be approved for you as soon as payment is confirmed.`
        : "This course is free. Our team will review your request and approve it, usually within 1–2 working days.",
      "We will email you again the moment the course is available in your learner portal.",
    ],
    button: { label: "Track my request", url: `${base}/my-learning/courses` },
  });
}
