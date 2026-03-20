import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="nbm auth-page">
      <div aria-hidden="true" className="ambient">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <nav className="nav glass shadow-soft" aria-label="Primary">
        <div className="brand">
          <Link href="/" className="logo">NBM.</Link>
          <span className="tag">Performance Marketing</span>
        </div>
        <div className="links">
          <Link href="/" className="btn btn-ghost" style={{ padding: "8px 14px" }}>
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="legal-wrap">
        <div className="legal-card glass shadow-soft">
          <h1 className="h2">Terms of Service</h1>
          <p className="legal-updated">Last updated: March 2026</p>

          <div className="legal-content">
            <h3 className="h3">1. Service Description</h3>
            <p className="p">
              Northbridge Marketing (&ldquo;NBM&rdquo;) provides performance marketing consultancy services.
              Access to our services begins with a request submission through our platform, followed by an
              internal review process.
            </p>

            <h3 className="h3">2. Account & Verification</h3>
            <p className="p">
              To submit a strategy call request, you must create an account with a valid email address and
              complete email verification. You are responsible for maintaining the security of your account
              credentials.
            </p>

            <h3 className="h3">3. Request Review</h3>
            <p className="p">
              Submitting a request does not guarantee approval or a consultation. We review all requests
              individually and approve engagements based on mutual fit and our current capacity. We reserve
              the right to decline any request at our discretion.
            </p>

            <h3 className="h3">4. Consultations</h3>
            <p className="p">
              Approved consultations are typically 30&ndash;45 minutes. Rescheduling requires at least 24 hours
              notice. The content discussed during consultations is confidential and intended solely for the
              participating parties.
            </p>

            <h3 className="h3">5. Intellectual Property</h3>
            <p className="p">
              All content on this website, including text, design, and code, is the property of
              Northbridge Marketing. Strategies and recommendations provided during consultations are for
              the client&rsquo;s use only and may not be redistributed.
            </p>

            <h3 className="h3">6. Limitation of Liability</h3>
            <p className="p">
              NBM provides strategic guidance and recommendations. While we work to deliver measurable
              results, we cannot guarantee specific outcomes. Implementation decisions remain the
              responsibility of the client.
            </p>

            <h3 className="h3">7. Contact</h3>
            <p className="p">
              For questions about these terms, contact us at{" "}
              <a href="mailto:hello@northbridgemarketing.co.uk" style={{ color: "rgba(255,255,255,.85)", textDecoration: "underline" }}>
                hello@northbridgemarketing.co.uk
              </a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
