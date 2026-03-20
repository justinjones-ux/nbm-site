"use client";

import { useState } from "react";

interface Props {
  userEmail: string;
  userName?: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function RequestForm({ userEmail, userName }: Props) {
  const [name, setName] = useState(userName ?? "");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, website, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="request-success glass shadow-soft">
        <div className="success-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="h2">Request received.</h2>
        <p className="p">
          We&apos;re reviewing your submission now. Expect to hear back within 1&ndash;2 business days at <strong>{userEmail}</strong>.
        </p>
        <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
          Your portal will update automatically when your status changes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="request-form glass shadow-soft" aria-label="Strategy call request">
      <div className="request-form-header">
        <div className="kicker">Private request</div>
        <h1 className="h2">Tell us about your business.</h1>
        <p className="p">
          Submitting as <strong style={{ color: "rgba(255,255,255,.88)", wordBreak: "break-all" }}>{userEmail}</strong>.
          Every request is reviewed personally &mdash; expect to hear back within 1&ndash;2 business days.
        </p>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>Full name <span className="req">*</span></span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            autoComplete="name"
          />
        </label>

        <label className="form-field">
          <span>Company</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Ltd"
            autoComplete="organization"
          />
        </label>

        <label className="form-field">
          <span>Website</span>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="yoursite.com (if you have one)"
            autoComplete="url"
          />
        </label>

        <label className="form-field form-field--full">
          <span>What are you trying to improve? <span className="req">*</span></span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your current challenges — leads, conversions, CPL, close-rate, positioning…"
            rows={5}
            required
          />
        </label>
      </div>

      {status === "error" && <div className="auth-error">{errorMsg}</div>}

      <div className="form-footer">
        <button type="submit" className="btn btn-primary" disabled={status === "loading"} style={{ minWidth: 200 }}>
          {status === "loading" ? "Sending…" : "Submit Request"}
        </button>
        <p className="fineprint">Your verified email is attached automatically &middot; Only our team sees this &middot; No spam</p>
      </div>
    </form>
  );
}
