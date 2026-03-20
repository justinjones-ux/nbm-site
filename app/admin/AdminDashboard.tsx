"use client";

import { Fragment, useState, useMemo } from "react";

export type Request = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  message: string;
  status: "awaiting_review" | "approved" | "call_scheduled" | "strategy_review" | "closed" | "declined";
  admin_notes: string | null;
  fit_assessment: string | null;
  booked_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};

/* ─── Constants ─────────────────────────────────────────── */

const STATUS_OPTIONS = [
  "awaiting_review",
  "approved",
  "call_scheduled",
  "strategy_review",
  "closed",
  "declined",
] as const;

const STATUS_COLORS: Record<string, string> = {
  awaiting_review: "#f59e0b",
  approved: "#4ade80",
  call_scheduled: "#60a5fa",
  strategy_review: "#a78bfa",
  closed: "#34d399",
  declined: "#9ca3af",
};

const STATUS_LABELS: Record<string, string> = {
  awaiting_review: "Awaiting Review",
  approved: "Approved",
  call_scheduled: "Call Scheduled",
  strategy_review: "Strategy Review",
  closed: "Closed \u2014 Won",
  declined: "Declined",
};

const STATUS_NEXT: Record<string, string> = {
  awaiting_review: "Review and assess fit",
  approved: "Waiting for client to book consult",
  call_scheduled: "Prepare for call",
  strategy_review: "Deliver strategy summary",
  closed: "Project active",
  declined: "No action required",
};

const FIT_OPTIONS = [
  { value: "", label: "\u2014" },
  { value: "strong", label: "Strong Fit" },
  { value: "possible", label: "Possible Fit" },
  { value: "weak", label: "Weak Fit" },
];

const FIT_COLORS: Record<string, string> = {
  strong: "#4ade80",
  possible: "#f59e0b",
  weak: "#f87171",
};

/* ─── Overview stat items ───────────────────────────────── */

const OVERVIEW_KEYS = [
  { key: "all", label: "Total", color: "rgba(255,255,255,.55)" },
  { key: "awaiting_review", label: "Awaiting Review", color: "#f59e0b" },
  { key: "approved", label: "Approved", color: "#4ade80" },
  { key: "call_scheduled", label: "Consult Booked", color: "#60a5fa" },
  { key: "strategy_review", label: "Strategy Review", color: "#a78bfa" },
  { key: "closed", label: "Closed \u2014 Won", color: "#34d399" },
  { key: "declined", label: "Declined", color: "#9ca3af" },
];

/* ─── Component ─────────────────────────────────────────── */

interface Props {
  initialRequests: Request[];
}

export default function AdminDashboard({ initialRequests }: Props) {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  /* ── Derived data ─────────────────────────────────── */

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: requests.length };
    STATUS_OPTIONS.forEach((s) => {
      c[s] = requests.filter((r) => r.status === s).length;
    });
    return c;
  }, [requests]);

  const filtered = useMemo(() => {
    let list = filterStatus === "all"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.company ?? "").toLowerCase().includes(q) ||
          (r.website ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [requests, filterStatus, search]);

  /* ── API helpers ──────────────────────────────────── */

  async function updateField(id: string, payload: Record<string, unknown>) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const { data } = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...data } : r))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  function handleSaveNote(id: string) {
    const note = noteDrafts[id];
    if (note === undefined) return;
    setSavingNote(id);
    updateField(id, { admin_notes: note }).then(() => setSavingNote(null));
  }

  /* ── Render ───────────────────────────────────────── */

  return (
    <div className="ad">
      {/* ── Overview Bar ──────────────────────────── */}
      <div className="ad-overview">
        {OVERVIEW_KEYS.map(({ key, label, color }) => (
          <button
            key={key}
            className={`ad-ov-item${filterStatus === key ? " ad-ov-active" : ""}`}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
          >
            <span className="ad-ov-count" style={{ color }}>
              {counts[key] ?? 0}
            </span>
            <span className="ad-ov-label">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Search + active filter ────────────────── */}
      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <svg className="ad-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="ad-search"
            placeholder="Search name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="ad-search-clear" onClick={() => setSearch("")}>&times;</button>
          )}
        </div>
        {filterStatus !== "all" && (
          <button className="ad-filter-tag" onClick={() => setFilterStatus("all")}>
            <span className="ad-filter-dot" style={{ background: STATUS_COLORS[filterStatus] }} />
            {STATUS_LABELS[filterStatus]}
            <span className="ad-filter-x">&times;</span>
          </button>
        )}
        <span className="ad-result-count">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="ad-empty glass shadow-soft">
          <p>No requests found{search ? ` matching "${search}"` : ""}.</p>
        </div>
      ) : (
        <div className="ad-table-wrap glass shadow-soft">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Business</th>
                <th>Email</th>
                <th>Website</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Next Step</th>
                <th>Fit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => {
                const isOpen = expanded === req.id;
                return (
                  <Fragment key={req.id}>
                    <tr
                      className={`ad-row${isOpen ? " ad-row-open" : ""}`}
                      onClick={() => setExpanded(isOpen ? null : req.id)}
                    >
                      <td className="ad-td-name">{req.name}</td>
                      <td className="ad-td-co">{req.company ?? "\u2014"}</td>
                      <td className="ad-td-email">
                        <a href={`mailto:${req.email}`} onClick={(e) => e.stopPropagation()}>
                          {req.email}
                        </a>
                      </td>
                      <td className="ad-td-web">
                        {req.website ? (
                          <a href={req.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            {req.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                          </a>
                        ) : "\u2014"}
                      </td>
                      <td className="ad-td-date">
                        {new Date(req.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="ad-td-status">
                        <span
                          className="status-badge"
                          data-status={req.status}
                        >
                          {STATUS_LABELS[req.status] ?? req.status}
                        </span>
                      </td>
                      <td className="ad-td-next">{STATUS_NEXT[req.status]}</td>
                      <td className="ad-td-fit" onClick={(e) => e.stopPropagation()}>
                        {req.fit_assessment ? (
                          <span className="ad-fit-badge" style={{ color: FIT_COLORS[req.fit_assessment] }}>
                            {FIT_OPTIONS.find((f) => f.value === req.fit_assessment)?.label ?? "\u2014"}
                          </span>
                        ) : (
                          <span className="ad-fit-badge ad-fit-none">\u2014</span>
                        )}
                      </td>
                    </tr>

                    {/* ── Detail panel ──────────────── */}
                    {isOpen && (
                      <tr key={`${req.id}-detail`} className="ad-detail-row">
                        <td colSpan={8}>
                          <div className="ad-detail">
                            {/* Top: full request info */}
                            <div className="ad-detail-top">
                              <div className="ad-detail-grid">
                                <div className="ad-df">
                                  <span className="ad-df-k">Full Name</span>
                                  <span className="ad-df-v">{req.name}</span>
                                </div>
                                <div className="ad-df">
                                  <span className="ad-df-k">Email</span>
                                  <span className="ad-df-v">
                                    <a href={`mailto:${req.email}`}>{req.email}</a>
                                  </span>
                                </div>
                                <div className="ad-df">
                                  <span className="ad-df-k">Company</span>
                                  <span className="ad-df-v">{req.company ?? "\u2014"}</span>
                                </div>
                                <div className="ad-df">
                                  <span className="ad-df-k">Website</span>
                                  <span className="ad-df-v">
                                    {req.website ? (
                                      <a href={req.website} target="_blank" rel="noopener noreferrer">{req.website}</a>
                                    ) : "\u2014"}
                                  </span>
                                </div>
                                <div className="ad-df">
                                  <span className="ad-df-k">Submitted</span>
                                  <span className="ad-df-v">
                                    {new Date(req.created_at).toLocaleDateString("en-GB", {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="ad-df">
                                  <span className="ad-df-k">Current Status</span>
                                  <span className="ad-df-v">
                                    <span className="status-badge" data-status={req.status}>
                                      {STATUS_LABELS[req.status]}
                                    </span>
                                  </span>
                                </div>
                                {req.booked_at && (
                                  <div className="ad-df">
                                    <span className="ad-df-k">Consult Booked</span>
                                    <span className="ad-df-v">
                                      {new Date(req.booked_at).toLocaleDateString("en-GB", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}{" "}
                                      at{" "}
                                      {new Date(req.booked_at).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="ad-df ad-df-full">
                                <span className="ad-df-k">Primary Growth Issue</span>
                                <p className="ad-df-msg">{req.message}</p>
                              </div>
                            </div>

                            {/* Controls row */}
                            <div className="ad-detail-controls">
                              {/* Status action */}
                              <div className="ad-ctrl">
                                <span className="ad-ctrl-label">Status</span>
                                <select
                                  className="ad-select"
                                  value={req.status}
                                  onChange={(e) => updateField(req.id, { status: e.target.value })}
                                  disabled={updating === req.id}
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                      {STATUS_LABELS[s]}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Fit assessment */}
                              <div className="ad-ctrl">
                                <span className="ad-ctrl-label">Fit Assessment</span>
                                <select
                                  className="ad-select"
                                  value={req.fit_assessment ?? ""}
                                  onChange={(e) =>
                                    updateField(req.id, {
                                      fit_assessment: e.target.value || null,
                                    })
                                  }
                                  disabled={updating === req.id}
                                >
                                  {FIT_OPTIONS.map((f) => (
                                    <option key={f.value} value={f.value}>
                                      {f.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Quick email */}
                              <div className="ad-ctrl">
                                <span className="ad-ctrl-label">Contact</span>
                                <a
                                  href={`mailto:${req.email}?subject=Re: Your Northbridge Marketing Request`}
                                  className="btn btn-ghost ad-email-btn"
                                >
                                  Email {req.name.split(" ")[0]}
                                </a>
                              </div>
                            </div>

                            {/* Admin notes */}
                            <div className="ad-notes">
                              <span className="ad-ctrl-label">Internal Notes</span>
                              <textarea
                                className="ad-notes-input"
                                rows={3}
                                placeholder="Private notes about this request..."
                                value={noteDrafts[req.id] ?? req.admin_notes ?? ""}
                                onChange={(e) =>
                                  setNoteDrafts((d) => ({ ...d, [req.id]: e.target.value }))
                                }
                              />
                              <div className="ad-notes-actions">
                                <button
                                  className="btn btn-primary ad-notes-save"
                                  onClick={() => handleSaveNote(req.id)}
                                  disabled={
                                    savingNote === req.id ||
                                    (noteDrafts[req.id] ?? req.admin_notes ?? "") ===
                                      (req.admin_notes ?? "")
                                  }
                                >
                                  {savingNote === req.id ? "Saving\u2026" : "Save Notes"}
                                </button>
                                {req.admin_notes && noteDrafts[req.id] !== undefined && noteDrafts[req.id] !== req.admin_notes && (
                                  <button
                                    className="btn btn-ghost"
                                    onClick={() =>
                                      setNoteDrafts((d) => {
                                        const next = { ...d };
                                        delete next[req.id];
                                        return next;
                                      })
                                    }
                                  >
                                    Discard
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
