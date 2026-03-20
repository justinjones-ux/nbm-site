import Link from "next/link";

export default function PrivacyPage() {
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
          <h1 className="h2">Privacy Policy</h1>
          <p className="legal-updated">Last updated: March 2026</p>

          <div className="legal-content">
            <h3 className="h3">1. Information We Collect</h3>
            <p className="p">
              When you create an account or submit a strategy call request, we collect your name, email address,
              company name, website URL, and the details you share about your business challenges. We also collect
              standard technical data such as IP address and browser type for security purposes.
            </p>

            <h3 className="h3">2. How We Use Your Information</h3>
            <p className="p">
              Your information is used solely to assess business fit, communicate with you about your request,
              and deliver our consulting services. We do not use your data for marketing purposes without your
              explicit consent.
            </p>

            <h3 className="h3">3. Data Storage & Security</h3>
            <p className="p">
              Your data is stored securely using industry-standard encryption and row-level security policies.
              Only you can access your own submission data, and only our authorised team members can review
              submissions for assessment purposes.
            </p>

            <h3 className="h3">4. Data Sharing</h3>
            <p className="p">
              We do not sell, share, or distribute your personal data to third parties. Your information is
              used exclusively for the purposes described in this policy.
            </p>

            <h3 className="h3">5. Your Rights</h3>
            <p className="p">
              You have the right to access, correct, or request deletion of your personal data at any time.
              To exercise these rights, contact us at{" "}
              <a href="mailto:hello@northbridgemarketing.co.uk" style={{ color: "rgba(255,255,255,.85)", textDecoration: "underline" }}>
                hello@northbridgemarketing.co.uk
              </a>.
            </p>

            <h3 className="h3">6. Cookies</h3>
            <p className="p">
              We use essential cookies required for authentication and site functionality. We do not use
              tracking cookies or third-party advertising cookies.
            </p>

            <h3 className="h3">7. Contact</h3>
            <p className="p">
              If you have questions about this privacy policy, contact us at{" "}
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
