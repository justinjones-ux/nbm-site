"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // After email verification, redirect here
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/auth/verify-email");
    }
  }

  return (
    <main className="nbm auth-page">
      <div aria-hidden="true" className="ambient">
        <div className="orb orb1" />
        <div className="orb orb2" />
      </div>

      <div className="auth-wrap">
        <div className="auth-card glass shadow-soft">
          <Link href="/" className="auth-brand logo">
            NBM.
          </Link>

          <h1 className="h2" style={{ marginTop: 20 }}>
            Create your account.
          </h1>
          <p className="p" style={{ marginTop: 6, marginBottom: 24 }}>
            Verified email required. You&apos;ll receive a link to confirm &mdash; then you can submit your request.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                autoComplete="new-password"
              />
            </label>

            <label>
              <span>Confirm password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                required
                autoComplete="new-password"
              />
            </label>

            <button type="submit" className="btn btn-primary full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account & Verify Email"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link href="/auth/login">Sign in &rarr;</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
