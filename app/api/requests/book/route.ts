import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { bookingConfirmationHTML } from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 5 booking attempts per minute per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const { allowed } = rateLimit(`book:${ip}`, { windowMs: 60_000, max: 5 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email_confirmed_at) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { request_id, booked_at } = body as {
    request_id: string;
    booked_at: string;
  };

  if (!request_id || !booked_at) {
    return NextResponse.json(
      { error: "Missing request_id or booked_at" },
      { status: 400 }
    );
  }

  // Validate the date is in the future
  const bookDate = new Date(booked_at);
  if (isNaN(bookDate.getTime()) || bookDate < new Date()) {
    return NextResponse.json(
      { error: "Please select a future date and time" },
      { status: 400 }
    );
  }

  // Verify the request belongs to this user and is in "approved" status
  const { data: existing } = await supabase
    .from("requests")
    .select("id, status, user_id, name")
    .eq("id", request_id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (existing.status !== "approved") {
    return NextResponse.json(
      { error: "Request must be approved before booking" },
      { status: 400 }
    );
  }

  // Update the request with the booking and change status
  const { data, error } = await supabase
    .from("requests")
    .update({
      booked_at: bookDate.toISOString(),
      status: "call_scheduled",
    })
    .eq("id", request_id)
    .eq("user_id", user.id)
    .select("id, status, booked_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send booking confirmation email (non-blocking — don't fail the request if email fails)
  try {
    const dateFormatted = bookDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/London",
    });

    const timeFormatted = bookDate.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Europe/London",
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://northbridgemarketing.co.uk";

    await sendEmail({
      to: user.email!,
      subject: "Your consultation is confirmed — Northbridge Marketing",
      html: bookingConfirmationHTML({
        userName: existing.name || "there",
        userEmail: user.email!,
        date: dateFormatted,
        time: timeFormatted,
        timezone: "GMT (London)",
        portalUrl: `${siteUrl}/dashboard`,
      }),
    });
  } catch (emailError) {
    // Log but don't fail the booking
    console.error("Failed to send booking confirmation email:", emailError);
  }

  return NextResponse.json({ data });
}
