/* ═══════════════════════════════════════════════════════════
   NBM EMAIL TEMPLATES
   Dark, premium, restrained. Private-access feel.
   ═══════════════════════════════════════════════════════════ */

/** Shared wrapper — dark surface, warm text, clean structure */
function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Northbridge Marketing</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root { color-scheme: dark; }
    body, table, td, div, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; padding: 0 16px !important; }
      .inner-pad { padding: 32px 24px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#08090d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader (hidden) -->
  <div style="display:none; font-size:1px; color:#08090d; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">&nbsp;</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08090d;">
    <tr>
      <td align="center" style="padding: 40px 16px 48px;">

        <!-- Email container -->
        <table role="presentation" class="email-container" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">

          <!-- Logo -->
          <tr>
            <td style="padding: 0 0 32px; text-align: left;">
              <span style="font-size: 20px; font-weight: 800; color: #f5f0e8; letter-spacing: 0.08em;">NBM.</span>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0e1017; border: 1px solid #1c1d26; border-radius: 20px;">
                <tr>
                  <td class="inner-pad" style="padding: 44px 40px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 0 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #4a4843; line-height: 1.6;">
                Northbridge Marketing Ltd.
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #36342f; line-height: 1.5;">
                This is a private communication. If you did not expect this email, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Primary CTA button — warm ivory on dark, subtle border */
function ctaButton(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 32px 0 0;">
  <tr>
    <td style="border-radius: 9999px; background-color: #f5f0e8;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:48px; v-text-anchor:middle; width:240px;" arcsize="50%" fillcolor="#f5f0e8">
        <v:textbox inset="0,0,0,0">
          <center style="color:#0a0b10; font-family:Helvetica,Arial,sans-serif; font-size:14px; font-weight:600;">
            ${text}
          </center>
        </v:textbox>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${href}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 600; color: #0a0b10; text-decoration: none; border-radius: 9999px; letter-spacing: 0.01em; mso-hide: all;">
        ${text}
      </a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}

/** Secondary link — subtle, no button */
function subtleLink(text: string, href: string): string {
  return `<a href="${href}" target="_blank" style="color: #87847c; font-size: 13px; text-decoration: underline; text-underline-offset: 3px;">${text}</a>`;
}

/** Divider line */
function divider(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
  <tr>
    <td style="border-top: 1px solid #1a1b23;"></td>
  </tr>
</table>`;
}

/* ─── EMAIL 1: VERIFICATION ──────────────────────────────── */

/**
 * Supabase Auth verification email template.
 *
 * In Supabase Dashboard → Auth → Email Templates → Confirm signup:
 * - Subject: "Verify your email — Northbridge Marketing"
 * - Paste the HTML output of this template
 * - Supabase variables: {{ .ConfirmationURL }}
 *
 * This function is exported for reference / preview.
 * The actual template should be pasted into Supabase Dashboard.
 */
export function verificationEmailHTML(): string {
  const content = `
    <!-- Kicker -->
    <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #5a6db3; font-weight: 600;">
      EMAIL VERIFICATION
    </p>

    <!-- Heading -->
    <h1 style="margin: 0 0 20px; font-size: 26px; font-weight: 700; color: #f5f0e8; line-height: 1.25; letter-spacing: -0.02em;">
      One step to go.
    </h1>

    <!-- Body -->
    <p style="margin: 0 0 8px; font-size: 15px; color: #9a978f; line-height: 1.7;">
      You've created a Northbridge Marketing account. Before you can submit your request, we need to confirm your email address.
    </p>
    <p style="margin: 0; font-size: 15px; color: #9a978f; line-height: 1.7;">
      Verification keeps the review process genuine and protects both sides. It takes one click.
    </p>

    <!-- CTA -->
    ${ctaButton("Verify Email Address →", "{{ .ConfirmationURL }}")}

    ${divider()}

    <!-- Trust footer -->
    <p style="margin: 0; font-size: 13px; color: #504e49; line-height: 1.6;">
      This link will expire in 24 hours. If you didn't create an account with us, no action is needed — this email can be safely ignored.
    </p>
  `;

  return emailWrapper(content);
}

/* ─── EMAIL 2: APPOINTMENT BOOKED ────────────────────────── */

interface BookingEmailData {
  userName: string;
  userEmail: string;
  date: string;       // e.g. "Thursday, 27 March 2026"
  time: string;       // e.g. "2:00 PM"
  timezone: string;   // e.g. "GMT (London)"
  portalUrl: string;  // e.g. "https://northbridgemarketing.co.uk/dashboard"
}

export function bookingConfirmationHTML(data: BookingEmailData): string {
  const content = `
    <!-- Kicker -->
    <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #5a6db3; font-weight: 600;">
      CONSULTATION CONFIRMED
    </p>

    <!-- Heading -->
    <h1 style="margin: 0 0 20px; font-size: 26px; font-weight: 700; color: #f5f0e8; line-height: 1.25; letter-spacing: -0.02em;">
      You're booked in.
    </h1>

    <!-- Intro -->
    <p style="margin: 0 0 24px; font-size: 15px; color: #9a978f; line-height: 1.7;">
      Your strategy consultation has been confirmed. Here are the details.
    </p>

    <!-- Details card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #111219; border: 1px solid #1a1b23; border-radius: 14px;">
      <tr>
        <td style="padding: 24px 28px;">

          <!-- Date -->
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
            <tr>
              <td style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #504e49; font-weight: 600; padding-bottom: 4px;">
                DATE
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px; font-weight: 600; color: #f5f0e8;">
                ${data.date}
              </td>
            </tr>
          </table>

          <!-- Time -->
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
            <tr>
              <td style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #504e49; font-weight: 600; padding-bottom: 4px;">
                TIME
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px; font-weight: 600; color: #f5f0e8;">
                ${data.time}
              </td>
            </tr>
          </table>

          <!-- Timezone -->
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #504e49; font-weight: 600; padding-bottom: 4px;">
                TIMEZONE
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px; font-weight: 600; color: #f5f0e8;">
                ${data.timezone}
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

    ${divider()}

    <!-- What happens next -->
    <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #87847c; letter-spacing: 0.04em; text-transform: uppercase;">
      What happens next
    </p>
    <p style="margin: 0 0 6px; font-size: 15px; color: #9a978f; line-height: 1.7;">
      We'll come prepared. The call is focused on understanding your business, your current setup, and where we think we can move the needle. Expect it to last around 30&ndash;45 minutes.
    </p>
    <p style="margin: 0; font-size: 15px; color: #9a978f; line-height: 1.7;">
      If you need to reschedule, let us know at least 24 hours in advance.
    </p>

    <!-- CTA -->
    ${ctaButton("View Your Portal →", data.portalUrl)}

    ${divider()}

    <!-- Contact -->
    <p style="margin: 0; font-size: 13px; color: #504e49; line-height: 1.6;">
      Questions before the call? Reply to this email or reach us at
      <a href="mailto:hello@northbridgemarketing.co.uk" style="color: #706d66; text-decoration: underline; text-underline-offset: 3px;">hello@northbridgemarketing.co.uk</a>
    </p>
  `;

  return emailWrapper(content);
}
