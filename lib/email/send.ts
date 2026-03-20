import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/** Strip HTML to plain text fallback */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rarr;/g, "→")
    .replace(/&middot;/g, "·")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const fromAddress = process.env.SMTP_FROM || "hello@northbridgemarketing.co.uk";

  return transporter.sendMail({
    from: `"Northbridge Marketing" <${fromAddress}>`,
    replyTo: fromAddress,
    to,
    subject,
    html,
    text: text || htmlToPlainText(html),
  });
}
