"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/* ─── Data ──────────────────────────────────────────────────── */

const services = [
  {
    kicker: "Qualified traffic",
    title: "Performance Campaigns",
    desc: "Paid campaigns built around buying intent, not vanity reach. Every pound goes toward people who are actually looking for what you sell — tied to commercial outcomes, not click counts.",
    bullets: [
      "Paid search and social built around buying intent",
      "Ad creative matched to the landing page",
      "Audience targeting focused on people ready to act",
      "Budget allocated where it produces return",
    ],
    system: "Campaigns bring the right people in.",
  },
  {
    kicker: "Focused conversion",
    title: "Conversion Landing Pages",
    desc: "Every campaign needs somewhere to send people. A landing page is a focused sales argument for one offer. If the page doesn\u2019t match what the ad promised, you\u2019re paying for clicks and wasting them.",
    bullets: [
      "Pages built to match the traffic landing on them",
      "Offer positioning that converts cold audiences",
      "Message testing to find what your market responds to",
      "Lower CPL and higher close rates from the same spend",
    ],
    system: "Landing pages convert focused traffic.",
  },
  {
    kicker: "Brand authority",
    title: "Premium Websites",
    desc: "Your website is doing sales while you sleep \u2014 or it isn\u2019t. We build sites that make you look like the obvious choice before anyone picks up the phone.",
    bullets: [
      "Proof and trust where decisions actually happen",
      "Visual hierarchy that makes you look established",
      "Layout that guides visitors toward action",
      "The site that makes your pricing feel justified",
    ],
    system: "Websites build trust and brand authority.",
  },
];

const steps = [
  { n: "01", t: "Diagnose", d: "Audit the full journey: traffic source \u2192 ad \u2192 page \u2192 conversion. Find where it\u2019s leaking." },
  { n: "02", t: "Engineer", d: "Build campaigns, pages, and sites around how people actually decide to buy. Not how it looks in a pitch deck." },
  { n: "03", t: "Deploy", d: "Launch campaigns, ship pages, go live. No six-month timelines." },
  { n: "04", t: "Optimise", d: "Test what matters. Improve the numbers that move your business, not the ones that look good on a slide." },
];

const fitFor = [
  "You\u2019re already making money but know you\u2019re leaving more on the table",
  "You\u2019re running campaigns but the pages they land on aren\u2019t converting",
  "Your website doesn\u2019t reflect the quality of what you actually sell",
  "You want one team that owns traffic and conversion together",
  "You\u2019re doing \u00a310k+/month and ready to grow without guessing",
];

const fitNot = [
  "You haven\u2019t found product-market fit yet",
  "You just want someone to \u201Crun some ads\u201D with no plan for what happens after the click",
  "You\u2019re shopping on price, not outcomes",
  "You\u2019re not open to changing things that aren\u2019t working",
  "You want a full-service agency for socials, SEO, PR, and everything else",
];

const whyItems = [
  {
    title: "One system, not separate vendors",
    body: "Most businesses hire one team for ads, another for the website, and hope it all connects. It doesn\u2019t. We build campaigns, landing pages, and websites as one integrated system \u2014 so the traffic and the conversion work together instead of against each other.",
  },
  {
    title: "We optimise for decisions, not impressions",
    body: "Reach means nothing if nobody acts. We measure what actually drives revenue \u2014 conversion rates, cost per acquisition, return on ad spend. If a number doesn\u2019t move your business forward, we don\u2019t report on it.",
  },
  {
    title: "Commercially accountable",
    body: "If we build the page, we should be accountable for the traffic hitting it. That\u2019s why we own both sides. No finger-pointing between agencies. One team, one system, one set of numbers we\u2019re both looking at.",
  },
  {
    title: "Selective intake",
    body: "We don\u2019t take on everyone. We work with a small number of clients at any given time so we can go deep instead of wide. If we don\u2019t think we can deliver a meaningful result, we\u2019ll say so upfront.",
  },
];

const nextSteps = [
  { n: "1", t: "Request access", d: "Create an account and tell us about your business. Takes two minutes." },
  { n: "2", t: "Verify your email", d: "Quick verification to protect the process. One click." },
  { n: "3", t: "We review fit", d: "We look at your business, your current setup, and whether we can actually move the needle. 1\u20132 business days." },
  { n: "4", t: "Approved businesses book", d: "If it\u2019s a fit, you\u2019ll unlock scheduling for a private strategy consult inside your portal." },
  { n: "5", t: "We diagnose what\u2019s leaking value", d: "30\u201345 minute call. We go through your funnel, find the gaps, and tell you what to fix first." },
];

const caseStudy = {
  label: "Campaign + Landing Page Rebuild \u00b7 Ecommerce \u00b7 Paid Social",
  metric: "\u00a318k \u2192 \u00a341k/mo",
  metricSub: "Revenue increase in 90 days",
  context: "Mid-size ecommerce brand spending \u00a38k/month on Meta and Google ads. Declining returns over six months. Landing page converting at 1.2%. Good product, growing market \u2014 but the funnel was bleeding money at every stage.",
  problem: "The campaigns were driving traffic, but the page wasn\u2019t closing. Reviews and proof were buried below the fold where nobody scrolled. The offer wasn\u2019t clear on first read \u2014 visitors had to work to understand what they were getting. Ad copy said one thing, the landing page said something different. And there was zero retargeting, so anyone who didn\u2019t buy on the first visit just disappeared forever.",
  changes: [
    "Rebuilt the landing page around one clear offer with proof visible above the fold",
    "Tightened campaign targeting to higher-intent audience segments",
    "Matched ad creative to landing page messaging so visitors got exactly what they expected",
    "Made the value obvious before showing the price",
    "Built retargeting sequences by funnel stage to recapture warm leads",
  ],
  results: [
    { value: "\u00a341k/mo", label: "Monthly revenue (was \u00a318k)" },
    { value: "3.1\u00d7", label: "Return on ad spend" },
    { value: "\u221222%", label: "Cost per acquisition" },
    { value: "2.8%", label: "Landing page CVR (was 1.2%)" },
  ],
  why: "The traffic was never the problem \u2014 the system behind it was. Campaigns were sending qualified people to a page that didn\u2019t convince them, with an offer that wasn\u2019t clear, and no way to recapture lost interest. Once the page matched the campaign, the offer made sense on first scroll, and retargeting caught the drop-off \u2014 the same ad spend started producing completely different numbers.",
};

const publicFaq = [
  {
    q: "What happens after I submit a request?",
    a: "We look at your business, your current setup, and whether we think we can actually move the needle. Takes 1\u20132 business days. You\u2019ll get a response either way \u2014 we don\u2019t leave people hanging.",
  },
  {
    q: "Does creating an account guarantee approval?",
    a: "No. An account lets you submit a request \u2014 whether we move forward depends on fit and capacity. We\u2019d rather turn down work than do it badly.",
  },
  {
    q: "How long does the review process take?",
    a: "Usually 1\u20132 business days. Sometimes longer if we need to look deeper into your setup. Your portal updates automatically \u2014 no need to chase.",
  },
  {
    q: "Who is this best suited for?",
    a: "Businesses doing \u00a310k+/month that already have demand but aren\u2019t converting enough of it. You\u2019re getting attention \u2014 you just need more of it turning into money.",
  },
  {
    q: "Why is email verification required?",
    a: "It keeps out spam and protects the review process. We look at every request personally, so we need to know you\u2019re real. It also protects your own data.",
  },
  {
    q: "How is my information protected?",
    a: "Your data is encrypted and access-controlled. Only you can see your own submission. Only our review team can access it. We don\u2019t sell it, share it, or do anything else with it.",
  },
  {
    q: "Why might my request not be approved?",
    a: "Usually one of three things: we don\u2019t think we can deliver meaningful results for your situation, your business is too early-stage for our approach, or we\u2019re at capacity. We\u2019ll tell you why \u2014 no vague rejection emails.",
  },
  {
    q: "How long is the private consultation?",
    a: "30\u201345 minutes. We go through your current setup, find where you\u2019re losing people and money, and tell you what to fix first. You leave with a clear picture, not a sales pitch.",
  },
  {
    q: "What\u2019s the difference between a landing page and a website?",
    a: "A landing page is a focused sales argument for one specific offer \u2014 it\u2019s where campaign traffic lands. A website is your broader brand home \u2014 it builds trust, answers wider questions, and supports every channel. Different jobs, both necessary.",
  },
];

type CtaKey = "logged-out" | "no-request" | "awaiting_review" | "approved" | "call_scheduled" | "strategy_review" | "closed" | "declined";

const CTA_CONFIG: Record<CtaKey, { kicker: string; headline: string; copy: string; trust: string }> = {
  "logged-out": {
    kicker: "Limited client partnerships",
    headline: "Apply for a private strategy consult.",
    copy: "You\u2019ll leave with a clear plan \u2014 what to fix, why it matters, and what to do first. If we\u2019re not the right fit, we\u2019ll say so.",
    trust: "Verified email required \u00b7 Requests reviewed privately \u00b7 Only selected businesses move forward",
  },
  "no-request": {
    kicker: "You\u2019re verified",
    headline: "You\u2019re in. Tell us about your business.",
    copy: "Fill in the details and we\u2019ll take a look. Every submission gets reviewed personally \u2014 expect to hear back within 1\u20132 business days.",
    trust: "Only selected businesses move forward \u00b7 You\u2019ll hear back either way",
  },
  "awaiting_review": {
    kicker: "Request received",
    headline: "Your request is under review.",
    copy: "We\u2019re looking at your business and figuring out if we can actually help. Sit tight \u2014 you\u2019ll hear from us soon.",
    trust: "You\u2019ll be notified when your status changes",
  },
  approved: {
    kicker: "Approved",
    headline: "You\u2019ve been approved.",
    copy: "Head to your portal to book your private strategy consult. Limited slots available each week.",
    trust: "Book directly inside your private portal",
  },
  call_scheduled: {
    kicker: "Confirmed",
    headline: "Your consult is confirmed.",
    copy: "We\u2019re doing our homework on your business before the call so we can make the most of the time.",
    trust: "Check your portal for date and time",
  },
  strategy_review: {
    kicker: "In progress",
    headline: "Strategy in review.",
    copy: "We\u2019re putting together your plan based on what we discussed. You\u2019ll get something concrete, not a generic template.",
    trust: "Expect a summary within 2\u20133 business days",
  },
  closed: {
    kicker: "Complete",
    headline: "Project complete.",
    copy: "Thanks for working with us. If you need anything else down the line, you know where to find us.",
    trust: "Your portal remains accessible",
  },
  declined: {
    kicker: "Update",
    headline: "Not the right fit \u2014 for now.",
    copy: "We don\u2019t think we\u2019re the right people to help right now. We\u2019d rather be straight about that than waste your time.",
    trust: "You\u2019re welcome to reapply in the future",
  },
};

const CTA_ACTIONS: Record<CtaKey, { text: string; href: string; secondary?: { text: string; href: string } }> = {
  "logged-out": {
    text: "Create Account & Verify Email",
    href: "/auth/signup",
    secondary: { text: "Already have an account? Sign in \u2192", href: "/auth/login?next=/dashboard" },
  },
  "no-request": { text: "Continue to Private Request \u2192", href: "/dashboard" },
  "awaiting_review": { text: "View Request Status \u2192", href: "/dashboard" },
  approved: { text: "Book Your Strategy Consult \u2192", href: "/dashboard" },
  call_scheduled: { text: "View Appointment Details \u2192", href: "/dashboard" },
  strategy_review: { text: "View Strategy Progress \u2192", href: "/dashboard" },
  closed: { text: "View Project Summary \u2192", href: "/dashboard" },
  declined: { text: "View Status Details \u2192", href: "/dashboard" },
};

/* ─── Sub-components ────────────────────────────────────────── */

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill glass">{children}</span>;
}

function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`glass shadow-soft card ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [hasRequest, setHasRequest] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setAuthLoaded(true);
    } else {
      const supabase = createClient();
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (user?.email_confirmed_at) {
          setUserEmail(user.email ?? null);
          const { data } = await supabase
            .from("requests")
            .select("status")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (data) {
            setHasRequest(true);
            setRequestStatus(data.status);
          }
          fetch("/api/auth/me")
            .then((r) => r.json())
            .then((d) => { if (d.isAdmin) setIsAdmin(true); })
            .catch(() => {});
        }
        setAuthLoaded(true);
      });
    }

    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    els.forEach((el) => io.observe(el));

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const ctaKey: CtaKey = !userEmail
    ? "logged-out"
    : !hasRequest
      ? "no-request"
      : (requestStatus as CtaKey) ?? "awaiting_review";

  const cta = CTA_CONFIG[ctaKey];
  const ctaAction = CTA_ACTIONS[ctaKey];

  return (
    <main className="nbm">
      {/* Ambient orbs */}
      <div aria-hidden="true" className="ambient">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      {/* ── Nav ────────────────────────────────────────── */}
      <nav className={`nav glass shadow-soft${scrolled ? " nav--scrolled" : ""}`} aria-label="Primary">
        <div className="brand">
          <span className="logo">NBM.</span>
          <span className="tag">Performance Marketing</span>
        </div>
        <div className="links">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#proof">Proof</a>
          <a href="#faq">FAQ</a>

          {authLoaded && (
            userEmail ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="nav-admin-link">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="btn btn-ghost" style={{ padding: "8px 14px" }}>
                  {hasRequest ? "My Portal" : "My Request"}
                </Link>
                <form action="/api/auth/signout" method="POST" style={{ display: "contents" }}>
                  <button type="submit" className="btn btn-ghost" style={{ padding: "8px 14px" }}>
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/auth/login?next=/dashboard" className="btn btn-primary">
                Request a Call
              </Link>
            )
          )}

          {!authLoaded && (
            <div className="btn btn-primary" style={{ opacity: 0.4, pointerEvents: "none" }}>
              Request a Call
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <header className="wrap">
        <section className="hero glass shadow-soft">
          <div className="kicker hero-kicker">Northbridge Marketing</div>

          <h1 className="h1 hero-h1">
            Performance.
            <br />
            Without Noise.
          </h1>

          <p className="p heroSub hero-sub">
            We run the campaigns and build the pages they land on.
            One system. For businesses that already have demand &mdash;
            and want more of it converting.
          </p>

          <div className="ctaRow hero-cta" role="group" aria-label="Primary actions">
            <Link href={userEmail ? "/dashboard" : "/auth/signup"} className="btn btn-primary">
              {userEmail
                ? hasRequest
                  ? "View Your Portal"
                  : "Submit Your Request"
                : "Request a Strategy Call"}
            </Link>
            <a href="#proof" className="btn btn-ghost">
              See the Evidence
            </a>
          </div>

          <div className="pillRow hero-pills" aria-label="Highlights">
            {["3.1\u00d7 ROAS", "+32% CVR", "\u221222% CPL"].map((x) => (
              <Pill key={x}>{x}</Pill>
            ))}
          </div>

          <div className="trust hero-trust">UK-BASED &middot; LIMITED PARTNERSHIPS &middot; RESULTS-ACCOUNTABLE</div>
        </section>
      </header>

      {/* ── Services ───────────────────────────────────── */}
      <section id="services" className="section">
        <div className="wrap">
          <div className="sectionHead reveal">
            <h2 className="h2">Campaigns. Pages. Websites. One system.</h2>
            <p className="p">
              Most agencies sell traffic and design separately. We build them as one thing &mdash;
              because a great page with no traffic is invisible, and paid traffic with a weak page is waste.
            </p>
          </div>
          <div className="grid3">
            {services.map((s, i) => (
              <Card key={s.title} className="reveal" style={{ "--delay": `${i * 0.12}s` } as React.CSSProperties}>
                {s.kicker && <div className="kicker" style={{ marginBottom: 6 }}>{s.kicker}</div>}
                <h3 className="h3">{s.title}</h3>
                <p className="p">{s.desc}</p>
                <ul className="list">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="svc-system">{s.system}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Northbridge ────────────────────────────── */}
      <section id="why" className="section">
        <div className="wrap">
          <div className="sectionHead reveal">
            <div className="kicker">Why Northbridge</div>
            <h2 className="h2">Most websites don&apos;t have a traffic problem. They have a trust problem.</h2>
            <p className="p">
              Traffic is only half the equation. If people arrive and don&apos;t trust what they see,
              don&apos;t understand the offer, or can&apos;t find a reason to act &mdash; you&apos;re
              paying for attention and wasting it. We fix the system, not just the surface.
            </p>
          </div>

          <div className="why-grid">
            {whyItems.map((item, i) => (
              <div
                key={item.title}
                className="why-item glass shadow-soft reveal"
                style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
              >
                <h3 className="why-title">{item.title}</h3>
                <p className="why-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder ────────────────────────────────────── */}
      <section id="founder" className="section">
        <div className="wrap">
          <div className="founder-card glass shadow-soft reveal">
            <div className="founder-avatar" aria-hidden="true">JSJ</div>
            <div className="founder-body">
              <div className="kicker">The person behind it</div>
              <h2 className="h2" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "0.5rem" }}>
                Justin Stewart-Jones
              </h2>
              <div className="founder-role">Founder &amp; Marketing Lead</div>
              <p className="p founder-bio">
                I started Northbridge because I saw small businesses losing money on marketing that wasn&apos;t working.
                My job is to find what&apos;s broken, fix it, and make sure every pound spent is working harder.
              </p>
              <p className="p founder-bio">
                I work directly with business owners &mdash; from the first conversation to the final result.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ────────────────────────────────────── */}
      <section id="process" className="section">
        <div className="wrap">
          <div className="sectionHead reveal">
            <h2 className="h2">A calm, ruthless process.</h2>
            <p className="p">Same process whether it&apos;s a campaign, a landing page, or a full website. We skip the 47-slide deck and get to work.</p>
          </div>
          <div className="grid4">
            {steps.map((s, i) => (
              <Card key={s.n} className="step reveal" style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}>
                <div className="stepN">{s.n}</div>
                <h3 className="h3">{s.t}</h3>
                <p className="p">{s.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof ──────────────────────────────────────── */}
      <section id="proof" className="section">
        <div className="wrap">
          <div className="sectionHead reveal">
            <h2 className="h2">Proof. Not promises.</h2>
            <p className="p">
              No inflated screenshots. No &ldquo;up to&rdquo; claims. Here&apos;s what actually happened.
            </p>
          </div>

          <div className="pf-card glass shadow-soft reveal" style={{ "--delay": "0.1s" } as React.CSSProperties}>
            <div className="kicker">{caseStudy.label}</div>

            <div className="pf-hero-metric">{caseStudy.metric}</div>
            <div className="pf-hero-sub">{caseStudy.metricSub}</div>

            <p className="pf-context">{caseStudy.context}</p>

            <div className="pf-section">
              <span className="pf-section-label">The problem</span>
              <p className="pf-section-body">{caseStudy.problem}</p>
            </div>

            <div className="pf-section">
              <span className="pf-section-label">What we changed</span>
              <ul className="pf-changes-list">
                {caseStudy.changes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="pf-section">
              <span className="pf-section-label">The result</span>
              <div className="pf-results-grid">
                {caseStudy.results.map((r) => (
                  <div key={r.label} className="pf-result">
                    <span className="pf-result-val">{r.value}</span>
                    <span className="pf-result-label">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pf-section">
              <span className="pf-section-label">Why it worked</span>
              <p className="pf-section-body">{caseStudy.why}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who This Is For ────────────────────────────── */}
      <section id="fit" className="section">
        <div className="wrap">
          <div className="sectionHead reveal">
            <div className="kicker">Selective by design</div>
            <h2 className="h2">Built for businesses that are ready.</h2>
            <p className="p">
              We work with a small number of clients at any given time. If you already have demand and want
              more of it converting, this is for you. If not, we&apos;d rather save you the time.
            </p>
          </div>

          <div className="fit-grid reveal" style={{ "--delay": "0.12s" } as React.CSSProperties}>
            <div className="fit-col fit-col--yes glass shadow-soft">
              <h3 className="fit-heading">
                <span className="fit-icon fit-icon--yes" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                This is for you if&hellip;
              </h3>
              <ul className="fit-list">
                {fitFor.map((item) => (
                  <li key={item} className="fit-item">{item}</li>
                ))}
              </ul>
            </div>

            <div className="fit-col fit-col--no glass shadow-soft">
              <h3 className="fit-heading">
                <span className="fit-icon fit-icon--no" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </span>
                This is not for you if&hellip;
              </h3>
              <ul className="fit-list">
                {fitNot.map((item) => (
                  <li key={item} className="fit-item">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Happens Next ──────────────────────────── */}
      <section id="next" className="section">
        <div className="wrap">
          <div className="sectionHead reveal">
            <div className="kicker">How to start</div>
            <h2 className="h2">What happens next.</h2>
            <p className="p">
              Simple, structured, no surprises. You&apos;ll know exactly where you stand at every step.
            </p>
          </div>

          <div className="next-steps reveal" style={{ "--delay": "0.1s" } as React.CSSProperties}>
            {nextSteps.map((step, i) => (
              <div key={step.n} className="next-step">
                <div className="next-n">{step.n}</div>
                <div className="next-body">
                  <h3 className="next-title">{step.t}</h3>
                  <p className="next-desc">{step.d}</p>
                </div>
                {i < nextSteps.length - 1 && <div className="next-line" aria-hidden="true" />}
              </div>
            ))}
          </div>

          <p className="next-trust reveal" style={{ "--delay": "0.25s" } as React.CSSProperties}>
            Requests reviewed privately &middot; You&apos;ll be notified at every status change &middot; No spam, no selling your data
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section id="faq" className="section">
        <div className="wrap">
          <div className="sectionHead reveal">
            <h2 className="h2">Questions worth answering.</h2>
            <p className="p">
              How the process works, what we expect, and why we do things this way.
            </p>
          </div>

          <div className="pub-faq glass shadow-soft reveal" style={{ "--delay": "0.1s" } as React.CSSProperties}>
            {publicFaq.map(({ q, a }) => {
              const isOpen = openFaq === q;
              return (
                <div key={q} className={`faq-row${isOpen ? " faq-open" : ""}`}>
                  <button
                    className="faq-q"
                    onClick={() => setOpenFaq(isOpen ? null : q)}
                    aria-expanded={isOpen}
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
                  <div className="faq-a" aria-hidden={!isOpen}>
                    <p>{a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Dynamic CTA ────────────────────────────────── */}
      <section id="apply" className="section">
        <div className="wrap">
          <div className="cta-block glass shadow-soft reveal">
            <div className="cta-left">
              <div className="kicker">{cta.kicker}</div>
              <h2 className="h2">{cta.headline}</h2>
              <p className="p">{cta.copy}</p>

              {ctaKey === "logged-out" && (
                <ul className="list">
                  <li>30&ndash;45 minute private consult</li>
                  <li>Campaign, page, and website assessment</li>
                  <li>Clear next steps you can act on immediately</li>
                </ul>
              )}
            </div>

            <div className="cta-right glass">
              {userEmail && ctaKey !== "logged-out" && (
                <p className="cta-signed-in">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Signed in as <strong>{userEmail}</strong></span>
                </p>
              )}

              <Link href={ctaAction.href} className="btn btn-primary cta-btn">
                {ctaAction.text}
              </Link>

              {ctaAction.secondary && (
                <Link href={ctaAction.secondary.href} className="btn btn-ghost cta-btn">
                  {ctaAction.secondary.text}
                </Link>
              )}

              <p className="cta-trust">{cta.trust}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand-col">
              <span className="logo" style={{ fontSize: 20 }}>NBM.</span>
              <p className="footer-tagline">
                Performance campaigns, landing pages, and premium websites. Built as one system.
              </p>
            </div>

            <div className="footer-links-row">
              <div className="footer-col">
                <span className="footer-col-head">Company</span>
                <a href="#services">Services</a>
                <a href="#process">Process</a>
                <a href="#proof">Results</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="footer-col">
                <span className="footer-col-head">Legal</span>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
              </div>
              <div className="footer-col">
                <span className="footer-col-head">Contact</span>
                <a href="mailto:hello@northbridgemarketing.co.uk">hello@northbridgemarketing.co.uk</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="muted">&copy; {new Date().getFullYear()} Northbridge Marketing Ltd. All rights reserved.</span>
            <span className="muted footer-brandline">Traffic is only half the equation.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
