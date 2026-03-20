import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RequestForm from "./RequestForm";
import Portal from "./Portal";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already blocks unauthed/unverified users — this is a safety net
  if (!user) redirect("/auth/login?next=/dashboard");
  if (!user.email_confirmed_at) redirect("/auth/verify-email");

  // Check if user already has a pending request
  const { data: existing } = await supabase
    .from("requests")
    .select("id, name, email, company, website, message, status, booked_at, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const isAdmin = user.email === process.env.ADMIN_EMAIL;

  return (
    <main className="nbm auth-page">
      <div aria-hidden="true" className="ambient">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      {/* Minimal nav */}
      <nav className="nav glass shadow-soft" aria-label="Primary">
        <div className="brand">
          <Link href="/" className="logo">NBM.</Link>
          <span className="tag">Performance Marketing</span>
        </div>
        <div className="links">
          {isAdmin && (
            <Link href="/admin" className="nav-admin-link">
              Admin
            </Link>
          )}
          <span className="muted" style={{ fontSize: 13 }}>{user.email}</span>
          <SignOutButton />
        </div>
      </nav>

      <div className={existing ? "portal-wrap" : "dashboard-wrap"}>
        {existing ? (
          <Portal request={existing} userEmail={user.email!} />
        ) : (
          <RequestForm
            userEmail={user.email!}
            userName={user.user_metadata?.full_name}
          />
        )}
      </div>
    </main>
  );
}

// Tiny client component just for the sign-out button
function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button type="submit" className="btn btn-ghost" style={{ padding: "8px 14px" }}>
        Sign out
      </button>
    </form>
  );
}
