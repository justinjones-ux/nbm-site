import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, isAdmin: false });
  }

  return NextResponse.json({
    user: {
      email: user.email,
      verified: !!user.email_confirmed_at,
    },
    isAdmin: user.email === process.env.ADMIN_EMAIL,
  });
}
