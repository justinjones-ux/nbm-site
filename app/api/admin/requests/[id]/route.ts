import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["awaiting_review", "approved", "call_scheduled", "strategy_review", "closed", "declined"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Guard: only admin can update
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, admin_notes, fit_assessment } = body as {
    status?: string;
    admin_notes?: string;
    fit_assessment?: string;
  };

  const VALID_FITS = ["strong", "possible", "weak", null];
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }
  if (fit_assessment !== undefined && !VALID_FITS.includes(fit_assessment)) {
    return NextResponse.json({ error: "Invalid fit value." }, { status: 400 });
  }

  // Validate admin_notes length
  if (admin_notes !== undefined && typeof admin_notes === "string" && admin_notes.length > 5000) {
    return NextResponse.json({ error: "Notes too long (max 5000 chars)." }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status) update.status = status;
  if (admin_notes !== undefined) update.admin_notes = typeof admin_notes === "string" ? admin_notes.trim() : null;
  if (fit_assessment !== undefined) update.fit_assessment = fit_assessment;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("requests")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
