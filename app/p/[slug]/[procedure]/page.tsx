// SERVER COMPONENT — data fetched at request time, no CORS issues
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

const BACKEND = "https://mqxnyexmrk.us-east-1.awsapprunner.com";

const THEMES: Record<string, { primary: string; accent: string }> = {
  teal:   { primary: "#0d9488", accent: "#2DD4BF" },
  navy:   { primary: "#1d4ed8", accent: "#60a5fa" },
  purple: { primary: "#7c3aed", accent: "#a78bfa" },
  green:  { primary: "#15803d", accent: "#4ade80" },
  slate:  { primary: "#475569", accent: "#94a3b8" },
};

async function fetchConfig(slug: string, procedure: string) {
  try {
    const res = await fetch(
      `${BACKEND}/marketing/config/public?tenant_id=${encodeURIComponent(slug)}&procedure_id=${encodeURIComponent(procedure)}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata(
  { params }: { params: { slug: string; procedure: string } }
): Promise<Metadata> {
  const cfg = await fetchConfig(params.slug, params.procedure);
  const practiceName = cfg?.practice_name || params.slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const procName = cfg?.name || params.procedure.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  return { title: `${procName} | ${practiceName}` };
}

export default async function ProcedureLandingPage(
  { params }: { params: { slug: string; procedure: string } }
) {
  const { slug, procedure } = params;
  const config = await fetchConfig(slug, procedure);

  // Tenant colors
  const themeKey = config?.theme || "teal";
  const themeBase = THEMES[themeKey] || THEMES.teal;
  const P = config?.primary_color || themeBase.primary;
  const A = config?.secondary_color || themeBase.accent;

  // Practice info
  const practiceName   = config?.practice_name || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const practiceAddress = config?.practice_address || "";
  const practicePhone   = config?.practice_phone || "";
  const heroImageUrl    = config?.hero_image_url || "";
  const procedureName    = config?.name || procedure.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const headline        = config?.headline_override || config?.headline || `${procedureName} — Expert Care, Beautiful Results`;
  const subheadline     = config?.subheadline_override || "";
  const specialtyBadge  = config?.specialty_badge || "";

  // Pricing
  const startingPrice    = config?.starting_price;
  const regularPrice     = config?.regular_price;
  const savingsLabel     = config?.savings_label || (startingPrice && regularPrice && regularPrice > startingPrice
    ? `Save $${(regularPrice - startingPrice).toLocaleString()}+` : "");
  const financingDetails = config?.financing_details;
  const ctaOffer         = config?.cta_offer || "Free Consultation — No Obligation";
  const ctaOfferDetail   = config?.cta_offer_detail || "";
  const pricingHeadline  = config?.pricing_headline || "";
  const pricingFootnote  = config?.pricing_footnote || "";

  // Doctor / empathy
  const drName      = config?.dr_name || "";
  const drTitle     = config?.dr_title || "";
  const drPhotoUrl  = config?.dr_photo_url || "";
  const drQuote     = config?.dr_quote || "I believe every patient deserves to understand exactly what's happening with their care — and exactly what it will cost. No surprises, no pressure.";
  const patientQuote    = config?.patient_testimonial_quote || "";
  const patientName     = config?.patient_name || "";
  const patientCaseLabel = config?.patient_case_label || "";

  // Media
  const testimonialVideoIds: string[] = config?.testimonial_video_ids || [];
  const doctorVideoId: string = config?.doctor_video_youtube_id || config?.doctor_video_id || "";
  const googleReviewScore = config?.google_review_score || "";
  const googleReviewCount = config?.google_review_count || "";

  // Before/after slider
  const baSlider = config?.before_after_slider || { before_url: "", after_url: "", caption: "" };

  // Tech features
  type TechFeature = { icon: string; title: string; desc: string };
  const techFeatures: TechFeature[] = config?.tech_features?.length
    ? config.tech_features
    : (config?.tech_highlights || []).map((h: string) => ({ icon: "⚡", title: h, desc: "" }));

  // Selling points
  const sellingPoints: string[] = config?.selling_points || [];

  // Process steps with optional time/location labels
  type ProcessStep = { icon: string; title: string; desc: string; time_label?: string; location_label?: string };
  const defaultSteps: ProcessStep[] = [
    { icon: "📞", title: "Free Consultation", desc: `Meet our team, discuss your goals, and leave with a complete treatment plan and exact pricing — zero pressure.`, time_label: "45-60 min", location_label: "Complimentary" },
    { icon: "🔬", title: "Comprehensive Exam & Planning", desc: `Digital imaging, X-rays, and a full clinical assessment. Your treatment is planned precisely before we begin.`, time_label: "Same visit", location_label: "In-office" },
    { icon: "🦷", title: procedureName, desc: `Your procedure, performed by our experienced team using modern technology for the best possible outcome.`, time_label: "Varies", location_label: "In-office" },
    { icon: "✨", title: "Follow-Up & Results", desc: `We stay with you through your recovery and final results. Your long-term outcome is our success.`, time_label: "Ongoing", location_label: "Included" },
  ];
  const processSteps: ProcessStep[] = config?.process_steps?.length ? config.process_steps : defaultSteps;

  // FAQ
  type FaqItem = { q: string; a: string };
  const faqItems: FaqItem[] = config?.faq_items?.length ? config.faq_items : [];

  // Why Us
  type WhyUsItem = { icon: string; label: string; sub: string };
  const defaultWhyUs: WhyUsItem[] = [
    { icon: "🏆", label: "Experienced Team", sub: "Years of dedicated expertise" },
    { icon: "💡", label: "Advanced Technology", sub: "Modern equipment & techniques" },
    { icon: "🛡️", label: "Patient-First Care", sub: "Comfort & transparency always" },
    { icon: "📍", label: "Convenient Location", sub: practiceAddress || "Easy to reach" },
  ];
  const whyUsItems: WhyUsItem[] = config?.why_us_items?.length ? config.why_us_items : defaultWhyUs;

  // Stars for review
  const stars = googleReviewScore ? "★".repeat(Math.round(parseFloat(googleReviewScore))) : "";

  return (
    <div
      style={{
        fontFamily: `var(--font-dm-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        background: "#FAFCFD",
        color: "#1c2f47",
        minHeight: "100vh",
      }}
    >
      <PixelInjector
        metaPixelId={config?.meta_pixel_id}
        googleTagId={config?.google_tag_id}
        procedureKey={procedure}
        procedureName={procedureName}
      />

      {/* ═══════════════════════════════════════════
          GLOBAL STYLES
      ═══════════════════════════════════════════ */}
      <style>{`
        :root {
          --navy: #0B2240;
          --navy-deep: #081828;
          --teal: var(--accent, ${A});
          --teal-mid: color-mix(in oklab, ${A} 85%, white);
          --teal-lt: color-mix(in oklab, ${A} 12%, white);
          --white: #FAFCFD;
          --offwhite: #F2F7F7;
          --muted: #6B8090;
          --ink: #1c2f47;
          --subink: #3a5068;
          --border: rgba(11,34,64,.10);
          --accent: var(--primary, ${P});
          --ease-out: cubic-bezier(0.22,1,0.36,1);
          --radius-sm: 10px;
          --radius: 14px;
          --radius-lg: 20px;
          --section-py: 100px;
          --container-w: 1180px;
          --font-barlow: 'Barlow', sans-serif;
          --font-dm-sans: 'DM Sans', sans-serif;
        }

        h1, h2, h3, h4 {
          font-family: var(--font-barlow), sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

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

        .container {
          max-width: var(--container-w);
          margin: 0 auto;
          padding: 0 24px;
        }

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

      {/* ═══════════════════════════════════════════
          STICKY NAV
      ═══════════════════════════════════════════ */}
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
        <div style={{
          maxWidth: "var(--container-w)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: 17, color: "var(--navy)" }}>
              {practiceName}
            </div>
            {practiceAddress && (
              <div style={{ color: "var(--muted)", fontSize: 11 }}>{practiceAddress}</div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {practicePhone && (
              <a href={`tel:${practicePhone}`} style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                {practicePhone}
              </a>
            )}
            <ScrollToFormButton primary={P}>Free Consult</ScrollToFormButton>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(135deg, ${P}15 0%, var(--navy-deep) 55%, var(--navy) 100%)`,
        padding: "80px 24px 100px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Radial glow blobs */}
        <div style={{
          position: "absolute", top: "20%", left: "10%",
          width: 500, height: 500,
          background: `radial-gradient(circle, color-mix(in oklab, ${P} 14%, transparent) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: 400, height: 400,
          background: `radial-gradient(circle, color-mix(in oklab, ${A} 10%, transparent) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div className="container">
          <div className="hero-grid" style={{ display: "flex", alignItems: "center", gap: 60, justifyContent: "center" }}>

            {/* LEFT: headline + trust */}
            <div style={{ flex: "1 1 460px", maxWidth: 560 }}>
              {/* Eyebrow */}
              {specialtyBadge && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: `color-mix(in oklab, ${A} 12%, transparent)`,
                  border: `1px solid color-mix(in oklab, ${A} 30%, transparent)`,
                  borderRadius: 20,
                  padding: "6px 16px",
                  fontSize: 12,
                  color: A,
                  fontWeight: 700,
                  marginBottom: 24,
                  letterSpacing: 0.4,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: A,
                    animation: "pulse 2s ease-in-out infinite",
                    display: "inline-block",
                  }} />
                  {specialtyBadge}
                </div>
              )}

              <h1 style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "clamp(2.4rem, 5vw, 4.4rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#fff",
                margin: "0 0 20px",
              }}>
                {headline}
              </h1>

              {subheadline && (
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 500 }}>
                  {subheadline}
                </p>
              )}

              {/* Trust row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
                {googleReviewScore && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "7px 14px" }}>
                    <span style={{ color: "#facc15", fontSize: 14 }}>{stars}</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{googleReviewScore}</span>
                    {googleReviewCount && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>({googleReviewCount})</span>}
                  </div>
                )}
                <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  One doctor, one dedicated team
                </div>
              </div>

              {/* Selling points */}
              {sellingPoints.slice(0, 4).map((pt: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: `color-mix(in oklab, ${A} 18%, transparent)`, border: `1px solid color-mix(in oklab, ${A} 40%, transparent)`, color: A, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    ✓
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, lineHeight: 1.5 }}>{pt}</span>
                </div>
              ))}
            </div>

            {/* RIGHT: before/after slider or form */}
            <div className="hero-right" style={{ flex: "0 1 420px", display: "flex", flexDirection: "column", gap: 16 }}>
              {baSlider.before_url && baSlider.after_url ? (
                <BeforeAfterSlider
                  beforeUrl={baSlider.before_url}
                  afterUrl={baSlider.after_url}
                  caption={baSlider.caption || undefined}
                  accent={A}
                />
              ) : heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImageUrl}
                  alt={`${procedureName} result`}
                  style={{ width: "100%", borderRadius: "var(--radius-lg)", objectFit: "cover", maxHeight: 340, display: "block", border: `2px solid color-mix(in oklab, ${A} 35%, transparent)` }}
                />
              ) : null}

              {/* Lead form card */}
              <div id="lead-form" style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.13)",
                borderRadius: "var(--radius-lg)",
                padding: "28px 24px",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>🦷</div>
                  <h2 style={{ color: "#fff", fontFamily: "var(--font-barlow)", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
                    Claim Your Free Consultation
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
                    Takes 30 seconds · We&apos;ll call you · No pressure
                  </p>
                </div>
                <LeadForm tenantId={slug} procedureName={procedureName} procedureId={procedure} offer={ctaOffer} offerDetail={ctaOfferDetail} primary={P} accent={A} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EMPATHY SECTION
      ═══════════════════════════════════════════ */}
      <section style={{
        background: "var(--navy-deep)",
        padding: "100px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700, height: 400,
          background: `radial-gradient(ellipse, color-mix(in oklab, ${P} 10%, transparent) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ fontSize: 32, marginBottom: 24 }}>❝</div>
          <blockquote style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "clamp(1.3rem, 3vw, 2rem)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.92)",
            lineHeight: 1.5,
            margin: "0 0 32px",
            fontStyle: "italic",
          }}>
            {drQuote}
          </blockquote>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 8 }}>—</div>
          <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 16, color: "#fff" }}>{drName || "Dr. Jay Siddiqui"}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{drTitle || "Your Doctor"}</div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY US (4 cards)
      ═══════════════════════════════════════════ */}
      <section style={{
        background: "var(--navy)",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800, height: 500,
          background: `radial-gradient(ellipse, color-mix(in oklab, ${P} 8%, transparent) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-eyebrow" style={{ color: A }}>WHY US</div>
            <h2 className="section-heading" style={{ color: "#fff" }}>
              The difference is in the details
            </h2>
          </div>

          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {whyUsItems.map((item: WhyUsItem, i: number) => (
              <div
                key={i}
                className="card-glow"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "var(--radius)",
                  padding: "28px 20px",
                  textAlign: "center",
                  transition: "all 0.3s var(--ease-out)",
                  cursor: "default",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
                <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DOCTOR BIO
      ═══════════════════════════════════════════ */}
      {(drPhotoUrl || drName) && (
        <section style={{ background: "var(--offwhite)", padding: "100px 24px" }}>
          <div className="container">
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 60,
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              {drPhotoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={drPhotoUrl}
                  alt={drName || "Dr."}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `4px solid color-mix(in oklab, ${P} 30%, transparent)`,
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: "1 1 400px", maxWidth: 560 }}>
                <div className="section-eyebrow">MEET YOUR DOCTOR</div>
                <h2 className="section-heading" style={{ marginBottom: 8 }}>{drName || "Dr. Jay Siddiqui"}</h2>
                <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
                  {drTitle || "Owner, Radiant Dental Care"}
                </div>
                <div style={{ color: "var(--subink)", fontSize: 15, lineHeight: 1.8 }}>
                  {patientQuote && (
                    <blockquote style={{
                      borderLeft: `3px solid ${P}`,
                      margin: "0 0 20px",
                      paddingLeft: 16,
                      fontStyle: "italic",
                      color: "var(--subink)",
                    }}>
                      &ldquo;{patientQuote}&rdquo;
                      {patientName && <span style={{ display: "block", fontStyle: "normal", fontWeight: 600, fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
                        — {patientName}{patientCaseLabel ? `, ${patientCaseLabel}` : ""}
                      </span>}
                    </blockquote>
                  )}
                  <p style={{ margin: 0 }}>
                    With years of specialized experience in implant dentistry and cosmetic procedures, Dr. {drName.split(" ").pop() || "Siddiqui"} has helped thousands of patients restore their smiles using the latest technology. Each treatment plan is customized — no cookie-cutter approaches.
                  </p>
                </div>
                <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {["DDS / DMD Licensed", "xNav Guided Surgery Certified", "In-House Lab Director"].map((tag) => (
                    <span key={tag} style={{
                      background: `color-mix(in oklab, ${P} 10%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${P} 25%, transparent)`,
                      borderRadius: 6,
                      padding: "4px 12px",
                      fontSize: 12,
                      color: P,
                      fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          PROCESS STEPS
      ═══════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "100px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-eyebrow">YOUR JOURNEY</div>
            <h2 className="section-heading">From consultation to new smile</h2>
            <p className="section-subheading" style={{ margin: "0 auto" }}>
              A clear, predictable path — every step explained upfront.
            </p>
          </div>

          <div className="process-steps" style={{ display: "flex", gap: 0, position: "relative", alignItems: "flex-start" }}>
            {/* Connecting line */}
            <div className="process-connector" style={{
              position: "absolute",
              top: 32,
              left: "calc(12.5% + 32px)",
              right: "calc(12.5% + 32px)",
              height: 2,
              background: `linear-gradient(90deg, transparent, color-mix(in oklab, ${P} 30%, transparent) 15%, color-mix(in oklab, ${P} 30%, transparent) 85%, transparent)`,
              pointerEvents: "none",
              zIndex: 0,
            }} />

            {processSteps.map((s: ProcessStep, i: number) => (
              <div key={i} style={{
                flex: 1,
                padding: "0 16px",
                position: "relative",
                zIndex: 1,
                textAlign: "center",
              }}>
                {/* Icon circle */}
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${P}, ${A})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  fontSize: 26,
                  boxShadow: `0 4px 20px color-mix(in oklab, ${P} 35%, transparent)`,
                  position: "relative",
                  zIndex: 2,
                }}>
                  {s.icon}
                </div>

                {/* Step number */}
                <div style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                  marginBottom: 10,
                }}>
                  STEP {String(i + 1).padStart(2, "0")}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--navy)",
                  margin: "0 0 10px",
                  lineHeight: 1.25,
                }}>
                  {s.title}
                </h3>

                {/* Description */}
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>
                  {s.desc}
                </p>

                {/* Time + location */}
                {(s.time_label || s.location_label) && (
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: `color-mix(in oklab, ${P} 8%, transparent)`,
                    border: `1px solid color-mix(in oklab, ${P} 20%, transparent)`,
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    color: P,
                    fontWeight: 600,
                  }}>
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

      {/* ═══════════════════════════════════════════
          TECH FEATURES
      ═══════════════════════════════════════════ */}
      {techFeatures.length > 0 && (
        <section style={{ background: "var(--offwhite)", padding: "100px 24px" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="section-eyebrow">TECHNOLOGY</div>
              <h2 className="section-heading">Built different — literally</h2>
              <p className="section-subheading" style={{ margin: "0 auto" }}>
                The equipment most practices outsource, we run in-house. That means faster results, tighter quality control, and no finger-pointing between providers.
              </p>
            </div>

            <div className="tech-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {techFeatures.map((f: TechFeature, i: number) => (
                <div
                  key={i}
                  className="card-glow"
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "28px 24px",
                  transition: "all 0.3s var(--ease-out)",
                  cursor: "default",
                }}
                >
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 16, color: "var(--navy)", margin: "0 0 8px" }}>
                    {f.title}
                  </h3>
                  {f.desc && (
                    <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      {f.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      {testimonialVideoIds.length > 0 && (
        <section style={{ background: "#fff", padding: "100px 24px" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="section-eyebrow">REAL PATIENTS. REAL RESULTS.</div>
              <h2 className="section-heading">Hear from our patients</h2>
              {(googleReviewScore || googleReviewCount) && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 16 }}>
                  <span style={{ color: "#facc15", fontSize: 18 }}>{stars}</span>
                  <span style={{ color: "var(--subink)", fontWeight: 600, fontSize: 15 }}>{googleReviewScore} stars</span>
                  {googleReviewCount && <span style={{ color: "var(--muted)", fontSize: 14 }}>· {googleReviewCount} Google reviews</span>}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {testimonialVideoIds.map((vidId: string, i: number) => (
                <div key={i} style={{ flex: "1 1 300px" }}>
                  <div style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${vidId}`}
                      title={`Patient Testimonial ${i + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          PRICING BLOCK
      ═══════════════════════════════════════════ */}
      {startingPrice && (
        <section style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${P} 8%, var(--offwhite)) 0%, var(--offwhite) 100%)`,
          padding: "100px 24px",
          borderTop: `1px solid var(--border)`,
          borderBottom: `1px solid var(--border)`,
        }}>
          <div className="container" style={{ textAlign: "center" }}>
            {pricingHeadline && (
              <div className="section-eyebrow">PRICING</div>
            )}
            <h2 className="section-heading" style={{ marginBottom: 8 }}>
              {pricingHeadline || "Transparent pricing — no surprises"}
            </h2>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
              {regularPrice && regularPrice > startingPrice && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600 }}>REGULAR PRICE</span>
                  <span style={{ color: "var(--muted)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, textDecoration: "line-through" }}>
                    ${regularPrice.toLocaleString()}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600 }}>STARTING FROM</span>
                <span style={{ color: P, fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, fontFamily: "var(--font-barlow)", letterSpacing: "-0.02em" }}>
                  ${startingPrice.toLocaleString()}
                </span>
              </div>
              {savingsLabel && (
                <div style={{
                  background: `color-mix(in oklab, ${P} 12%, transparent)`,
                  border: `1px solid color-mix(in oklab, ${P} 30%, transparent)`,
                  borderRadius: "var(--radius)",
                  padding: "10px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}>
                  <span style={{ color: P, fontWeight: 800, fontSize: 16 }}>💰 {savingsLabel}</span>
                </div>
              )}
            </div>

            {pricingFootnote && (
              <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>{pricingFootnote}</p>
            )}

            {financingDetails && (
              <p style={{ color: "var(--subink)", fontSize: 15, marginBottom: 28 }}>
                💳 {financingDetails}
              </p>
            )}

            <ScrollToFormButton primary={P}>Get Your Exact Quote →</ScrollToFormButton>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════ */}
      {faqItems.length > 0 && (
        <section style={{ background: "var(--offwhite)", padding: "100px 24px" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="section-eyebrow">COMMON QUESTIONS</div>
              <h2 className="section-heading">We hear these every day</h2>
            </div>

            <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {faqItems.map((item: FaqItem, i: number) => (
                <div key={i} style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "24px 26px",
                }}>
                  <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 10 }}>
                    {item.q}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(135deg, ${P}18 0%, var(--navy-deep) 50%, var(--navy) 100%)`,
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600, height: 400,
          background: `radial-gradient(ellipse, color-mix(in oklab, ${P} 12%, transparent) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div className="container" style={{ maxWidth: 560, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🦷</div>
          <h2 style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 14px",
            lineHeight: 1.1,
          }}>
            Your new smile is one call away.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, margin: "0 0 36px", lineHeight: 1.7 }}>
            Free consultation. Complete treatment plan. Exact pricing.<br />No pressure, no commitment — just answers.
          </p>
          <div style={{ marginBottom: 24 }}>
            <LeadForm tenantId={slug} procedureName={procedureName} procedureId={procedure} offer={ctaOffer} offerDetail={ctaOfferDetail} primary={P} accent={A} />
          </div>
          {(practiceAddress || practiceName) && (
            <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 13 }}>
              📍 {practiceAddress || practiceName}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STICKY MOBILE CTA
      ═══════════════════════════════════════════ */}
      <StickyMobileCTA primary={P} tenantId={slug} />

      {/* ═══════════════════════════════════════════
          CLARA LIVE CHAT AGENT
      ═══════════════════════════════════════════ */}
      <ClaraChat
        tenantId={slug}
        practiceName={practiceName}
        primaryColor={P}
        accentColor={A}
        openingMessage={`Hi! I'm Clara, the AI assistant for ${practiceName}. Have questions about ${procedureName} or want to book your free consultation? I'm here to help! 😊`}
      />

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{
        background: "var(--navy-deep)",
        padding: "24px 24px 90px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>
          © {new Date().getFullYear()} {practiceName} · Powered by{" "}
          <a href="https://iamclara.ai" style={{ color: A, textDecoration: "none" }}>Clara AI</a>
          {" "}·{" "}
          <a href="https://iamclara.ai/privacy" style={{ color: "rgba(255,255,255,0.22)", textDecoration: "none" }}>Privacy</a>
        </div>
      </footer>
    </div>
  );
}
