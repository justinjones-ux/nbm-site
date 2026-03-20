import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 3 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const { allowed } = rateLimit(`req:${ip}`, { windowMs: 60_000, max: 3 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const supabase = await createClient();

  // Verify the caller is an authenticated, email-verified user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!user.email_confirmed_at) {
    return NextResponse.json(
      { error: "Email not verified. Please verify your email first." },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, company, website, message } = body as {
    name?: string;
    company?: string;
    website?: string;
    message?: string;
  };

  if (!name?.trim() || name.length > 200) {
    return NextResponse.json({ error: "Name is required (max 200 chars)." }, { status: 400 });
  }
  if (!message?.trim() || message.length > 3000) {
    return NextResponse.json({ error: "Message is required (max 3000 chars)." }, { status: 400 });
  }
  if (company && company.length > 200) {
    return NextResponse.json({ error: "Company name too long." }, { status: 400 });
  }
  if (website && website.length > 500) {
    return NextResponse.json({ error: "Website URL too long." }, { status: 400 });
  }

  // Prevent duplicate submissions
  const { data: existing } = await supabase
    .from("requests")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "You have already submitted a request." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase.from("requests").insert({
    user_id: user.id,
    email: user.email,          // taken from the verified session — not from form input
    name: name.trim(),
    company: company?.trim() || null,
    website: website?.trim() || null,
    message: message.trim(),
    status: "awaiting_review",
  }).select("id, status, created_at").single();

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: "Failed to save request." }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
