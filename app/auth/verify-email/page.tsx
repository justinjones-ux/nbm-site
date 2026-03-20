import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <main className="nbm auth-page">
      <div aria-hidden="true" className="ambient">
        <div className="orb orb1" />
        <div className="orb orb2" />
      </div>

      <div className="auth-wrap">
        <div className="auth-card glass shadow-soft" style={{ textAlign: "center" }}>
          <Link href="/" className="auth-brand logo">
            NBM.
          </Link>

          <div className="verify-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          <h1 className="h2" style={{ marginTop: 16 }}>
            Verify your email.
          </h1>
          <p className="p" style={{ marginTop: 8 }}>
            We&apos;ve sent a verification link to your inbox. Click it to confirm your
            account &mdash; then you can submit your request.
          </p>
          <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
            Verification protects the review process and keeps submissions genuine.
          </p>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
            <p className="muted" style={{ fontSize: 13 }}>
              Didn&apos;t receive it? Check your spam folder, or
            </p>
            <Link href="/auth/signup" className="btn btn-ghost" style={{ display: "inline-flex", justifyContent: "center" }}>
              Try a different email
            </Link>
            <Link href="/auth/login" className="btn btn-ghost" style={{ display: "inline-flex", justifyContent: "center" }}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
