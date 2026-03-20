"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type RequestData = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  message: string;
  status: string;
  booked_at: string | null;
  created_at: string;
  updated_at: string;
};

interface Props {
  request: RequestData;
  userEmail: string;
}

/* ─── Status config ─────────────────────────────────────────── */

const STATUS_MAP: Record<
  string,
  { label: string; desc: string; next: string; wait: string; accent: string }
> = {
  awaiting_review: {
    label: "Awaiting Review",
    desc: "We\u2019ve got your request and we\u2019re looking at your business to see if we can actually move the needle.",
    next: "You\u2019ll hear back within 1\u20132 business days. Your portal updates automatically.",
    wait: "1\u20132 business days",
    accent: "#f59e0b",
  },
  approved: {
    label: "Approved for Scheduling",
    desc: "You\u2019ve been approved. Book your private strategy consult below.",
    next: "Choose a time that works for you. We\u2019ll confirm within 24 hours.",
    wait: "Book now",
    accent: "#4ade80",
  },
  call_scheduled: {
    label: "Consult Confirmed",
    desc: "Your consult is booked. We\u2019re doing homework on your business before the call so we can make the most of the time.",
    next: "Bring any questions or context you\u2019d like to discuss. We\u2019ll handle the rest.",
    wait: "See date below",
    accent: "#60a5fa",
  },
  strategy_review: {
    label: "Strategy in Review",
    desc: "We\u2019re putting together your plan based on what we discussed. You\u2019ll get something concrete, not a generic template.",
    next: "Expect a strategy summary and clear recommendations.",
    wait: "2\u20133 business days",
    accent: "#a78bfa",
  },
  closed: {
    label: "Project Active",
    desc: "We\u2019re working together. Strategy agreed, delivery underway.",
    next: "You\u2019ll get regular updates as work progresses. Reach out any time.",
    wait: "Ongoing",
    accent: "#34d399",
  },
  declined: {
    label: "Not a Fit",
    desc: "We don\u2019t think we\u2019re the right people to help right now. We\u2019d rather be straight about that than waste your time.",
    next: "No action needed. You\u2019re welcome to reapply in the future.",
    wait: "\u2014",
    accent: "#9ca3af",
  },
};

/* ─── Timeline ──────────────────────────────────────────────── */

const STAGES = [
  "Account Created",
  "Email Verified",
  "Request Submitted",
  "Under Review",
  "Approved for Scheduling",
  "Consult Confirmed",
  "Project Active",
];

function stageState(
  i: number,
  status: string
): "done" | "current" | "future" | "declined" {
  if (status === "declined") {
    if (i < 3) return "done";
    if (i === 3) return "declined";
    return "future";
  }
  const cur =
    status === "awaiting_review"
      ? 3
      : status === "approved"
        ? 4
        : status === "call_scheduled"
          ? 5
          : status === "strategy_review"
            ? 6
            : status === "closed"
              ? 7
              : 3;
  if (i < cur) return "done";
  if (i === cur) return "current";
  return "future";
}

/* ─── FAQ data ──────────────────────────────────────────────── */

const FAQ: Record<string, { q: string; a: string }[]> = {
  Process: [
    {
      q: "What happens after I submit a request?",
      a: "We look at your business, your current setup, and whether we think we can actually help. Takes 1\u20132 business days. You\u2019ll hear back either way \u2014 we don\u2019t leave people hanging.",
    },
    {
      q: "How long does review take?",
      a: "Usually 1\u20132 business days. Sometimes longer if we need to look deeper into your setup. Your portal updates automatically \u2014 no need to chase.",
    },
    {
      q: "Does creating an account guarantee an appointment?",
      a: "No. An account lets you submit a request \u2014 whether we move forward depends on fit and capacity. We\u2019d rather turn down work than do it badly.",
    },
    {
      q: "What happens if I\u2019m not approved?",
      a: "We\u2019ll tell you why. Usually it\u2019s one of three things: we don\u2019t think we can get you meaningful results, your business is too early-stage for what we do, or we\u2019re full. You\u2019re welcome to reapply later.",
    },
  ],
  Appointments: [
    {
      q: "How long is the private consult?",
      a: "30\u201345 minutes. We go through your current setup, find where you\u2019re losing people and money, and tell you what to fix first. You leave with a clear picture, not a sales pitch.",
    },
    {
      q: "What will we cover on the call?",
      a: "Your current funnel, where it\u2019s leaking, and what to do about it. We\u2019ll look at your campaigns, pages, and website together and give you a clear path forward.",
    },
    {
      q: "Can I reschedule?",
      a: "Yes. Just reply to your confirmation email or contact us directly. We ask for at least 24 hours notice.",
    },
  ],
  Privacy: [
    {
      q: "Why do I need to verify my email?",
      a: "It keeps out spam and fake submissions. We review every request personally, so we need to know you\u2019re real. It also protects your own data.",
    },
    {
      q: "How is my information protected?",
      a: "Your data is encrypted and access-controlled. Only you can see your own submission. Only our team can review it. We don\u2019t sell it, share it, or do anything weird with it.",
    },
    {
      q: "Do you share my data?",
      a: "Never. Your information is used to review fit and deliver our service. That\u2019s it. We don\u2019t sell it, share it, or pass it to anyone else.",
    },
  ],
  Fit: [
    {
      q: "Who is this best suited for?",
      a: "Businesses doing \u00a310k+/month that already have demand but aren\u2019t converting enough of it. You\u2019re getting attention \u2014 you just need more of it turning into money.",
    },
    {
      q: "Why might my request be declined?",
      a: "We don\u2019t think we can get you meaningful results, your business is too early-stage for our approach, or we\u2019re at capacity. We\u2019ll tell you the reason \u2014 no vague rejection emails.",
    },
  ],
};

/* ─── Component ─────────────────────────────────────────────── */

export default function Portal({ request, userEmail }: Props) {
  const config = STATUS_MAP[request.status] ?? STATUS_MAP.awaiting_review;
  const isDeclined = request.status === "declined";
  const isApproved = request.status === "approved";
  const isBooked = request.status === "call_scheduled";
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Process");
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  async function handleBooking() {
    if (!bookingDate || !bookingTime) {
      setBookingError("Please select a date and time.");
      return;
    }

    const dt = new Date(`${bookingDate}T${bookingTime}`);
    if (isNaN(dt.getTime()) || dt < new Date()) {
      setBookingError("Please choose a future date and time.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch("/api/requests/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: request.id,
          booked_at: dt.toISOString(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setBookingError(json.error || "Something went wrong.");
        setBookingLoading(false);
        return;
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch {
      setBookingError("Network error. Please try again.");
      setBookingLoading(false);
    }
  }

  // Generate available time slots (10am - 5pm, 30min intervals)
  const timeSlots: string[] = [];
  for (let h = 10; h <= 16; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  timeSlots.push("17:00");

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="portal">
      {/* ── Header ───────────────────────────────────── */}
      <section className="portal-header">
        <h1 className="h2">Your portal.</h1>
        <p className="portal-sub">
          Everything you need is here &mdash; status, details, next steps. No chasing required.
        </p>
      </section>

      {/* ── Status card ──────────────────────────────── */}
      <section
        className="portal-card glass shadow-soft"
        style={{ "--sa": config.accent } as React.CSSProperties}
      >
        <div className="ps-top">
          <span className="ps-dot" />
          <span className="ps-label">{config.label}</span>
        </div>

        <p className="ps-desc">{config.desc}</p>

        <div className="ps-meta">
          <div className="ps-meta-item">
            <span className="ps-meta-k">Next step</span>
            <span className="ps-meta-v">{config.next}</span>
          </div>
          <div className="ps-meta-item">
            <span className="ps-meta-k">Expected wait</span>
            <span className="ps-meta-v">{config.wait}</span>
          </div>
        </div>
      </section>

      {/* ── Booking action (approved only) ────────────── */}
      {isApproved && !showBooking && (
        <section className="portal-card glass shadow-soft bk-card">
          <div className="bk-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2 className="bk-heading">Book your private strategy consult</h2>
          <p className="bk-copy">
            You&apos;ve been approved. Choose a date and time that works for you.
            The call runs 30&ndash;45 minutes &mdash; we&apos;ll cover your current setup,
            where you&apos;re losing people and money, and what to fix first.
          </p>
          <button
            className="btn btn-primary bk-btn"
            onClick={() => setShowBooking(true)}
          >
            Choose a Time &rarr;
          </button>
          <p className="bk-note">UK business hours &middot; Mon&ndash;Fri</p>
        </section>
      )}

      {/* ── Booking modal ─────────────────────────────── */}
      {isApproved && showBooking && (
        <section className="portal-card glass shadow-soft bk-modal-card">
          <h2 className="bk-heading">Select your consult time</h2>
          <p className="bk-copy" style={{ marginBottom: 24 }}>
            Pick a date and a 30-minute slot. We&apos;ll confirm via email within 24 hours.
          </p>

          <div className="bk-fields">
            <div className="bk-field">
              <label className="bk-label" htmlFor="bk-date">Date</label>
              <input
                id="bk-date"
                type="date"
                className="bk-input"
                value={bookingDate}
                min={minDate}
                onChange={(e) => { setBookingDate(e.target.value); setBookingError(""); }}
              />
            </div>

            <div className="bk-field">
              <label className="bk-label" htmlFor="bk-time">Time (UK)</label>
              <select
                id="bk-time"
                className="bk-input"
                value={bookingTime}
                onChange={(e) => { setBookingTime(e.target.value); setBookingError(""); }}
              >
                <option value="">Select a time</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {bookingError && (
            <p className="bk-error">{bookingError}</p>
          )}

          <div className="bk-actions">
            <button
              className="btn btn-primary bk-btn"
              onClick={handleBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking\u2026" : "Confirm Booking"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => { setShowBooking(false); setBookingError(""); }}
            >
              Back
            </button>
          </div>

          <p className="bk-note">You&apos;ll receive a confirmation email once we verify the slot.</p>
        </section>
      )}

      {/* ── Confirmed booking details ─────────────────── */}
      {isBooked && request.booked_at && (
        <section className="portal-card glass shadow-soft bk-confirmed">
          <div className="bk-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="bk-heading">Your consult is booked</h2>
          <div className="bk-datetime">
            <div className="bk-dt-item">
              <span className="bk-dt-label">Date</span>
              <span className="bk-dt-val">
                {new Date(request.booked_at).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="bk-dt-item">
              <span className="bk-dt-label">Time</span>
              <span className="bk-dt-val">
                {new Date(request.booked_at).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} UK
              </span>
            </div>
            <div className="bk-dt-item">
              <span className="bk-dt-label">Duration</span>
              <span className="bk-dt-val">30&ndash;45 minutes</span>
            </div>
          </div>
          <p className="bk-copy">
            We&apos;re preparing for the call. If you need to reschedule, email{" "}
            <a href="mailto:hello@northbridgemarketing.co.uk" className="portal-link">
              hello@northbridgemarketing.co.uk
            </a>{" "}
            with at least 24 hours notice.
          </p>
        </section>
      )}

      {/* ── Timeline ─────────────────────────────────── */}
      <section className="portal-card glass shadow-soft">
        <h2 className="portal-sh">Your progress</h2>

        <div className="tl">
          {STAGES.map((label, i) => {
            const s = stageState(i, request.status);
            return (
              <div key={label} className={`tl-step tl-${s}`}>
                <div className="tl-track">
                  <span className="tl-dot" />
                  {i < STAGES.length - 1 && <span className="tl-line" />}
                </div>
                <span className="tl-label">{label}</span>
              </div>
            );
          })}

        </div>
      </section>

      {/* ── Request summary ──────────────────────────── */}
      <section className="portal-card glass shadow-soft">
        <h2 className="portal-sh">Your request</h2>

        <div className="rs-grid">
          <div className="rs-field">
            <span className="rs-k">Name</span>
            <span className="rs-v">{request.name}</span>
          </div>
          <div className="rs-field">
            <span className="rs-k">Email</span>
            <span className="rs-v">{userEmail}</span>
          </div>
          {request.company && (
            <div className="rs-field">
              <span className="rs-k">Company</span>
              <span className="rs-v">{request.company}</span>
            </div>
          )}
          {request.website && (
            <div className="rs-field">
              <span className="rs-k">Website</span>
              <span className="rs-v">
                <a href={request.website} target="_blank" rel="noopener noreferrer">
                  {request.website}
                </a>
              </span>
            </div>
          )}
          <div className="rs-field rs-full">
            <span className="rs-k">Primary growth issue</span>
            <span className="rs-v">{request.message}</span>
          </div>
          <div className="rs-field">
            <span className="rs-k">Submitted</span>
            <span className="rs-v">
              {new Date(request.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────── */}
      <section className="portal-card glass shadow-soft">
        <h2 className="portal-sh">Common questions</h2>

        <div className="faq-tabs">
          {Object.keys(FAQ).map((cat) => (
            <button
              key={cat}
              className={`faq-tab${activeTab === cat ? " faq-tab--on" : ""}`}
              onClick={() => {
                setActiveTab(cat);
                setOpenFaq(null);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {FAQ[activeTab as keyof typeof FAQ].map(({ q, a }) => {
            const open = openFaq === q;
            return (
              <div key={q} className={`faq-row${open ? " faq-open" : ""}`}>
                <button
                  className="faq-q"
                  onClick={() => setOpenFaq(open ? null : q)}
                  aria-expanded={open}
                >
                  <span>{q}</span>
                  <svg
                    className="faq-chev"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="faq-a" aria-hidden={!open}>
                  <p>{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Support ──────────────────────────────────── */}
      <section className="portal-card glass shadow-soft" style={{ textAlign: "center" }}>
        <h2 className="portal-sh">Need to update your request?</h2>
        <p className="portal-sub" style={{ maxWidth: 520, margin: "8px auto 0" }}>
          If your situation has changed or you need to add context, email{" "}
          <a
            href="mailto:hello@northbridgemarketing.co.uk"
            className="portal-link"
          >
            hello@northbridgemarketing.co.uk
          </a>{" "}
          and reference your submission.
        </p>
      </section>
    </div>
  );
}
