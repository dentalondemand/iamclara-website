// DEMO PAGE — hardcoded data, no backend fetch
import type { Metadata } from "next";
import { Barlow, DM_Sans } from "next/font/google";
import { LeadForm, ScrollToFormButton, StickyMobileCTA, PixelInjector, BeforeAfterSlider } from "./LandingClient";
import ClaraChat from "../../../../components/ClaraChat";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

// ── Brightsmile Dental hardcoded demo data ─────────────────────────────────

const PRACTICE_NAME   = "Brightsmile Dental";
const PRACTICE_ADDRESS = "4200 Bull Creek Rd, Austin, TX 78756";
const PRACTICE_PHONE   = "(512) 555-0199";
const PROCEDURE_NAME   = "Dental Implants";
const SLUG             = "demo-brightsmile";

const P = "#0d9488";  // teal primary
const A = "#2dd4bf";  // teal accent

const HEADLINE        = "One dentist. One plan. New teeth in one day.";
const SUBHEADLINE     = "Same-day implants in Austin with computer-guided surgery — no referral, no lab wait, no temporary gap.";
const SPECIALTY_BADGE = "Limited Time: Dental Implants from $14,500";

const STARTING_PRICE   = 14500;
const REGULAR_PRICE   = 22000;
const SAVINGS_LABEL   = "Save $7,500 — Limited Time";
const PRICING_HEADLINE = "Dental Implants — Transparent Pricing";

const DR_NAME  = "Dr. Elena Reyes";
const DR_TITLE = "Owner, Brightsmile Dental";
const DR_QUOTE = "I've seen what happens when patients get shuffled between offices. At Brightsmile, you have one dentist from your first call to your final smile. That's the difference.";

const PATIENT_QUOTE     = "I was embarrassed about my teeth for years. In one day, that changed. I left with teeth I could smile with — and I haven't stopped smiling since.";
const PATIENT_NAME      = "Marcus T.";
const PATIENT_CASE_LABEL = "Full upper arch · same-day temps";

const GOOGLE_REVIEW_SCORE  = "4.9";
const GOOGLE_REVIEW_COUNT   = "183 reviews";
const STARS = "★★★★★";

const DOCTOR_VIDEO_ID     = "H-yTacz9W5c";
const TESTIMONIAL_VIDEO_IDS = ["HYc_j9aWhP0", "HYc_j9aWhP0"];

const BA_BEFORE = "https://plus.unsplash.com/premium_photo-1664382972779-18f539a289ef?w=600&q=80";
const BA_AFTER  = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80";

const TECH_FEATURES = [
  { icon: "🎯", title: "Guided Implant Surgery",    desc: "3D planning maps every implant before we begin. Surgery is precise, predictable, and faster healing." },
  { icon: "🏭", title: "In-House Milling Lab",       desc: "Your crown or arch is designed and fabricated in our office. No outside lab, no weeks of waiting." },
  { icon: "⚡", title: "Same-Day Teeth",             desc: "Leave with working temporary teeth the same day as surgery. No gap, no flipper, no waiting." },
];

const PROCESS_STEPS = [
  { icon: "📞", title: "Free Consultation",         desc: "Meet Dr. Reyes, get a 3D scan, and leave with a written plan and exact price — no pressure.", time_label: "45-60 min", location_label: "Complimentary" },
  { icon: "🔬", title: "3D Scan & Planning",         desc: "A full cone beam CT scan maps your bone structure. Your implants are planned digitally before surgery.", time_label: "Same visit",  location_label: "In-house" },
  { icon: "🦷", title: "Same-Day Surgery",           desc: "Computer-guided implant placement. Walk out the same day with a full set of functional temporary teeth.", time_label: "One visit",   location_label: "Local anesthesia" },
  { icon: "✨", title: "Your Permanent Smile",       desc: "Custom-milled zirconia crown or arch delivered and seated once healing is complete.", time_label: "3-4 months", location_label: "In-house lab" },
];

const FAQ_ITEMS = [
  { q: "Am I a candidate for dental implants?", a: "Most adults with missing teeth are candidates. We'll do a 3D CBCT scan at your free consultation to evaluate your bone and give you a definitive answer." },
  { q: "Does the surgery hurt?", a: "Local anesthesia numbs the area completely. Most patients say they felt pressure but no pain. We also offer sedation options for anxious patients." },
  { q: "How long does recovery take?", a: "Most patients are back to normal activities within 2–3 days. Full healing and osseointegration takes 3–4 months before permanent teeth are seated." },
  { q: "What's included in the $14,500 starting price?", a: "The starting price covers the implant fixtures, abutments, and a temporary healing prosthesis. Your final zirconia crown or full arch is placed at the 3–4 month visit." },
  { q: "Do you offer financing?", a: "Yes — we partner with CareCredit and offer in-house payment plans. Many patients pay as little as $200/month with approved credit." },
  { q: "What if I need multiple teeth or a full arch?", a: "Full arch cases are our specialty. Pricing is scaled based on how many implants and whether you need a full zirconia arch or single crowns. Your written plan will have every line item." },
];

const WHY_US = [
  { icon: "🏆", label: "Experienced Team",      sub: "500+ implant cases completed" },
  { icon: "💡", label: "Advanced Technology",    sub: "CBCT, xNav, in-house milling" },
  { icon: "🛡️", label: "Patient-First Care",    sub: "No pressure, no upselling" },
  { icon: "📍", label: "Convenient Location",   sub: "4200 Bull Creek Rd, Austin" },
];

const SELLING_POINTS = [
  "Same-day temporary teeth — no gap, no flipper",
  "One dentist from consultation to final smile",
  "Computer-guided surgery for precision placement",
  "In-house milling lab — no outside lab delays",
];

// ── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `Dental Implants | Brightsmile Dental`,
};

// ── Component ──────────────────────────────────────────────────────────────

export default function DemoBrightsmilePage() {
  return (
    <div
      style={{
        fontFamily: `var(--font-dm-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        background: "#FAFCFD",
        color: "#1c2f47",
        minHeight: "100vh",
      }}
    >
      <PixelInjector metaPixelId={undefined} googleTagId={undefined} procedureKey="dental-implants" procedureName={PROCEDURE_NAME} />

      <style>{`
        :root {
          --navy: #0B2240;
          --navy-deep: #081828;
          --teal: ${A};
          --teal-mid: color-mix(in oklab, ${A} 85%, white);
          --teal-lt: color-mix(in oklab, ${A} 12%, white);
          --white: #FAFCFD;
          --offwhite: #F2F7F7;
          --muted: #6B8090;
          --ink: #1c2f47;
          --subink: #3a5068;
          --border: rgba(11,34,64,.10);
          --accent: ${P};
          --ease-out: cubic-bezier(0.22,1,0.36,1);
          --radius-sm: 10px;
          --radius: 14px;
          --radius-lg: 20px;
          --section-py: 100px;
          --container-w: 1180px;
        }
        h1, h2, h3, h4 { font-family: var(--font-barlow), sans-serif; }
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .section-eyebrow {
          font-family: var(--font-barlow), sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 12px;
        }
        .section-heading {
          font-family: var(--font-barlow), sans-serif;
          font-size: clamp(1.6rem, 3.5vw, 2.6rem);
          font-weight: 800;
          color: var(--navy);
          line-height: 1.15;
          margin: 0 0 16px;
        }
        .section-subheading {
          font-size: 1.05rem;
          color: var(--muted);
          line-height: 1.7;
          max-width: 600px;
          margin: 0 auto;
        }
        .container { max-width: var(--container-w); margin: 0 auto; padding: 0 24px; }
        .card-glow:hover {
          border-color: color-mix(in oklab, var(--accent) 50%, transparent);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px color-mix(in oklab, var(--accent) 18%, transparent);
        }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .hero-right { order: -1 !important; }
          .process-steps { flex-direction: column !important; }
          .process-connector { display: none !important; }
          .tech-grid { grid-template-columns: 1fr 1fr !important; }
          .faq-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        background: "rgba(250,252,253,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: "var(--container-w)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div>
            <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: 17, color: "var(--navy)" }}>{PRACTICE_NAME}</div>
            <div style={{ color: "var(--muted)", fontSize: 11 }}>{PRACTICE_ADDRESS}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href={`tel:${PRACTICE_PHONE}`} style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>{PRACTICE_PHONE}</a>
            <ScrollToFormButton primary={P}>Free Consult</ScrollToFormButton>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(135deg, ${P}15 0%, var(--navy-deep) 55%, var(--navy) 100%)`,
        padding: "80px 24px 100px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 500, height: 500, background: `radial-gradient(circle, color-mix(in oklab, ${P} 14%, transparent) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, background: `radial-gradient(circle, color-mix(in oklab, ${A} 10%, transparent) 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div className="container">
          <div className="hero-grid" style={{ display: "flex", alignItems: "center", gap: 60, justifyContent: "center" }}>
            {/* LEFT */}
            <div style={{ flex: "1 1 460px", maxWidth: 560 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `color-mix(in oklab, ${A} 12%, transparent)`, border: `1px solid color-mix(in oklab, ${A} 30%, transparent)`, borderRadius: 20, padding: "6px 16px", fontSize: 12, color: A, fontWeight: 700, marginBottom: 24, letterSpacing: 0.4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: A, animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
                {SPECIALTY_BADGE}
              </div>

              <h1 style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(2.4rem, 5vw, 4.4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 20px" }}>
                {HEADLINE}
              </h1>

              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 500 }}>
                {SUBHEADLINE}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "7px 14px" }}>
                  <span style={{ color: "#facc15", fontSize: 14 }}>{STARS}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{GOOGLE_REVIEW_SCORE}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>({GOOGLE_REVIEW_COUNT})</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  One doctor, one dedicated team
                </div>
              </div>

              {SELLING_POINTS.map((pt, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: `color-mix(in oklab, ${A} 18%, transparent)`, border: `1px solid color-mix(in oklab, ${A} 40%, transparent)`, color: A, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>✓</div>
                  <span style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, lineHeight: 1.5 }}>{pt}</span>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="hero-right" style={{ flex: "0 1 420px", display: "flex", flexDirection: "column", gap: 16 }}>
              <BeforeAfterSlider beforeUrl={BA_BEFORE} afterUrl={BA_AFTER} accent={A} />

              <div id="lead-form" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: "var(--radius-lg)", padding: "28px 24px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>🦷</div>
                  <h2 style={{ color: "#fff", fontFamily: "var(--font-barlow)", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Claim Your Free Consultation</h2>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>Takes 30 seconds · We&apos;ll call you · No pressure</p>
                </div>
                <LeadForm tenantId={SLUG} procedureName={PROCEDURE_NAME} procedureId="dental-implants" offer="Free Consultation — No Obligation" offerDetail="" primary={P} accent={A} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMPATHY QUOTE ── */}
      <section style={{ background: "var(--navy-deep)", padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, background: `radial-gradient(ellipse, color-mix(in oklab, ${P} 10%, transparent) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ fontSize: 32, marginBottom: 24 }}>❝</div>
          <blockquote style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 500, color: "rgba(255,255,255,0.92)", lineHeight: 1.5, margin: "0 0 32px", fontStyle: "italic" }}>
            {DR_QUOTE}
          </blockquote>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 8 }}>—</div>
          <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 16, color: "#fff" }}>{DR_NAME}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{DR_TITLE}</div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ background: "var(--navy)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 500, background: `radial-gradient(ellipse, color-mix(in oklab, ${P} 8%, transparent) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-eyebrow" style={{ color: A }}>WHY US</div>
            <h2 className="section-heading" style={{ color: "#fff" }}>The difference is in the details</h2>
          </div>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {WHY_US.map((item, i) => (
              <div key={i} className="card-glow" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "var(--radius)", padding: "28px 20px", textAlign: "center", transition: "all 0.3s var(--ease-out)" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
                <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>{item.label}</div>
                <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCTOR BIO ── */}
      <section style={{ background: "var(--offwhite)", padding: "100px 24px" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flexShrink: 0, width: 200, height: 200, borderRadius: "50%", background: `linear-gradient(135deg, ${P}, ${A})`, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid color-mix(in oklab, ${P} 30%, transparent)` }}>
              <span style={{ fontSize: 72 }}>👩‍⚕️</span>
            </div>
            <div style={{ flex: "1 1 400px", maxWidth: 560 }}>
              <div className="section-eyebrow">MEET YOUR DOCTOR</div>
              <h2 className="section-heading" style={{ marginBottom: 8 }}>{DR_NAME}</h2>
              <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>{DR_TITLE}</div>
              <blockquote style={{ borderLeft: `3px solid ${P}`, margin: "0 0 20px", paddingLeft: 16, fontStyle: "italic", color: "var(--subink)" }}>
                &ldquo;{PATIENT_QUOTE}&rdquo;
                <span style={{ display: "block", fontStyle: "normal", fontWeight: 600, fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
                  — {PATIENT_NAME}, {PATIENT_CASE_LABEL}
                </span>
              </blockquote>
              <p style={{ margin: 0, color: "var(--subink)", fontSize: 15, lineHeight: 1.8 }}>
                Dr. Elena Reyes has placed over 500 dental implants using computer-guided techniques. She built Brightsmile Dental around the belief that patients deserve one trusted provider from their first consultation through their final smile.
              </p>
              <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["DDS Licensed", "xNav Guided Surgery Certified", "In-House Lab Director"].map((tag) => (
                  <span key={tag} style={{ background: `color-mix(in oklab, ${P} 10%, transparent)`, border: `1px solid color-mix(in oklab, ${P} 25%, transparent)`, borderRadius: 6, padding: "4px 12px", fontSize: 12, color: P, fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS STEPS ── */}
      <section style={{ background: "#fff", padding: "100px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-eyebrow">YOUR JOURNEY</div>
            <h2 className="section-heading">From consultation to new smile</h2>
            <p className="section-subheading" style={{ margin: "0 auto" }}>A clear, predictable path — every step explained upfront.</p>
          </div>
          <div className="process-steps" style={{ display: "flex", gap: 0, position: "relative", alignItems: "flex-start" }}>
            <div className="process-connector" style={{ position: "absolute", top: 32, left: "calc(12.5% + 32px)", right: "calc(12.5% + 32px)", height: 2, background: `linear-gradient(90deg, transparent, color-mix(in oklab, ${P} 30%, transparent) 15%, color-mix(in oklab, ${P} 30%, transparent) 85%, transparent)`, pointerEvents: "none", zIndex: 0 }} />
            {PROCESS_STEPS.map((s, i) => (
              <div key={i} style={{ flex: 1, padding: "0 16px", position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${P}, ${A})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 26, boxShadow: `0 4px 20px color-mix(in oklab, ${P} 35%, transparent)`, position: "relative", zIndex: 2 }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", color: "var(--accent)", marginBottom: 10 }}>STEP {String(i + 1).padStart(2, "0")}</div>
                <h3 style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 16, color: "var(--navy)", margin: "0 0 10px", lineHeight: 1.25 }}>{s.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>{s.desc}</p>
                {(s.time_label || s.location_label) && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `color-mix(in oklab, ${P} 8%, transparent)`, border: `1px solid color-mix(in oklab, ${P} 20%, transparent)`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: P, fontWeight: 600 }}>
                    {s.time_label && <span>{s.time_label}</span>}
                    {s.time_label && s.location_label && <span style={{ color: "var(--muted)" }}>·</span>}
                    {s.location_label && <span>{s.location_label}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH FEATURES ── */}
      <section style={{ background: "var(--offwhite)", padding: "100px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-eyebrow">TECHNOLOGY</div>
            <h2 className="section-heading">Built different — literally</h2>
            <p className="section-subheading" style={{ margin: "0 auto" }}>The equipment most practices outsource, we run in-house. That means faster results, tighter quality control, and no finger-pointing between providers.</p>
          </div>
          <div className="tech-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TECH_FEATURES.map((f, i) => (
              <div key={i} className="card-glow" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px 24px", transition: "all 0.3s var(--ease-out)" }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 16, color: "var(--navy)", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: "#fff", padding: "100px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-eyebrow">REAL PATIENTS. REAL RESULTS.</div>
            <h2 className="section-heading">Hear from our patients</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 16 }}>
              <span style={{ color: "#facc15", fontSize: 18 }}>{STARS}</span>
              <span style={{ color: "var(--subink)", fontWeight: 600, fontSize: 15 }}>{GOOGLE_REVIEW_SCORE} stars</span>
              <span style={{ color: "var(--muted)", fontSize: 14 }}>· {GOOGLE_REVIEW_COUNT} Google reviews</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {TESTIMONIAL_VIDEO_IDS.map((vidId, i) => (
              <div key={i} style={{ flex: "1 1 300px" }}>
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <iframe src={`https://www.youtube.com/embed/${vidId}`} title={`Patient Testimonial ${i + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${P} 8%, var(--offwhite)) 0%, var(--offwhite) 100%)`, padding: "100px 24px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-eyebrow">PRICING</div>
          <h2 className="section-heading" style={{ marginBottom: 8 }}>{PRICING_HEADLINE}</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600 }}>REGULAR PRICE</span>
              <span style={{ color: "var(--muted)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, textDecoration: "line-through" }}>${REGULAR_PRICE.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600 }}>STARTING FROM</span>
              <span style={{ color: P, fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, fontFamily: "var(--font-barlow)", letterSpacing: "-0.02em" }}>${STARTING_PRICE.toLocaleString()}</span>
            </div>
            <div style={{ background: `color-mix(in oklab, ${P} 12%, transparent)`, border: `1px solid color-mix(in oklab, ${P} 30%, transparent)`, borderRadius: "var(--radius)", padding: "10px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: P, fontWeight: 800, fontSize: 16 }}>💰 {SAVINGS_LABEL}</span>
            </div>
          </div>
          <p style={{          color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>Financing available · Free consultation required · Price varies by case</p>
          <ScrollToFormButton primary={P}>Get Your Exact Quote →</ScrollToFormButton>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--offwhite)", padding: "100px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-eyebrow">COMMON QUESTIONS</div>
            <h2 className="section-heading">We hear these every day</h2>
          </div>
          <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px 26px" }}>
                <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 10 }}>{item.q}</div>
                <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${P} 18% 0%, var(--navy-deep) 50%, var(--navy) 100%)`, padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: `radial-gradient(ellipse, color-mix(in oklab, ${P} 12%, transparent) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="container" style={{ maxWidth: 560, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🦷</div>
          <h2 style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: "#fff", margin: "0 0 14px", lineHeight: 1.1 }}>Your new smile is one call away.</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, margin: "0 0 36px", lineHeight: 1.7 }}>Free consultation. Complete treatment plan. Exact pricing.<br />No pressure, no commitment — just answers.</p>
          <div style={{ marginBottom: 24 }}>
            <LeadForm tenantId={SLUG} procedureName={PROCEDURE_NAME} procedureId="dental-implants" offer="Free Consultation — No Obligation" offerDetail="" primary={P} accent={A} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 13 }}>📍 {PRACTICE_ADDRESS}</div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ── */}
      <StickyMobileCTA primary={P} tenantId={SLUG} />

      {/* ── CLARA LIVE CHAT ── */}
      <ClaraChat
        tenantId={SLUG}
        practiceName={PRACTICE_NAME}
        primaryColor={P}
        accentColor={A}
        openingMessage={`Hi! I'm Clara, the AI assistant for ${PRACTICE_NAME}. Have questions about ${PROCEDURE_NAME} or want to book your free consultation? I'm here to help! 😊`}
      />

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--navy-deep)", padding: "24px 24px 90px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>
          © {new Date().getFullYear()} {PRACTICE_NAME} · Powered by{" "}
          <a href="https://iamclara.ai" style={{ color: A, textDecoration: "none" }}>Clara AI</a>
          {" · "}
          <a href="https://iamclara.ai/privacy" style={{ color: "rgba(255,255,255,0.22)", textDecoration: "none" }}>Privacy</a>
        </div>
      </footer>
    </div>
  );
}
