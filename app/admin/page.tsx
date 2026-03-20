import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import AdminDashboard from "./AdminDashboard";
import type { Request } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/admin");
  if (user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const admin = createAdminClient();
  const { data: requests, error } = await admin
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin fetch error:", error);
  }

  return (
    <main className="nbm admin-page">
      <div aria-hidden="true" className="ambient">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <nav className="nav glass shadow-soft" aria-label="Admin nav">
        <div className="brand">
          <Link href="/" className="logo">NBM.</Link>
          <span className="tag admin-badge">Admin</span>
        </div>
        <div className="links">
          <Link href="/dashboard" className="nav-admin-link">Portal</Link>
          <span className="muted" style={{ fontSize: 13 }}>{user.email}</span>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="btn btn-ghost" style={{ padding: "8px 14px" }}>
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="admin-wrap">
        <AdminDashboard initialRequests={(requests as Request[]) ?? []} />
      </div>
    </main>
  );
}
