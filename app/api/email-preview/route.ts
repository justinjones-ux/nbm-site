import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verificationEmailHTML, bookingConfirmationHTML } from "@/lib/email/templates";

/**
 * DEV-ONLY: Preview email templates in the browser.
 * Visit /api/email-preview?template=verification
 *    or /api/email-preview?template=booking
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const template = request.nextUrl.searchParams.get("template");

  if (template === "verification") {
    return new NextResponse(verificationEmailHTML(), {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (template === "booking") {
    return new NextResponse(
      bookingConfirmationHTML({
        userName: "Alex",
        userEmail: "alex@example.com",
        date: "Thursday, 27 March 2026",
        time: "2:00 pm",
        timezone: "GMT (London)",
        portalUrl: "https://northbridgemarketing.co.uk/dashboard",
      }),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  return new NextResponse(
    `<html><body style="background:#08090d;color:#f5f0e8;font-family:system-ui;padding:40px;">
      <h2>Email Template Preview</h2>
      <p><a href="/api/email-preview?template=verification" style="color:#7896ff;">Verification Email →</a></p>
      <p><a href="/api/email-preview?template=booking" style="color:#7896ff;">Booking Confirmation Email →</a></p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
