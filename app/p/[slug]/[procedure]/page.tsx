// SERVER COMPONENT — data fetched at request time, no CORS issues
import type { Metadata } from "next";
import { LeadForm, ScrollToFormButton, StickyMobileCTA, PixelInjector } from "./LandingClient";
import ClaraChat from "../../../../components/ClaraChat";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";

const THEMES: Record<string, { primary: string; accent: string; hero: string }> = {
  teal:   { primary: "#0d9488", accent: "#2DD4BF", hero: "135deg, #0a1628 0%, #0d2240 60%, #0f3460 100%" },
  navy:   { primary: "#1d4ed8", accent: "#60a5fa", hero: "135deg, #0a0f1e 0%, #0f1f4a 60%, #1a3070 100%" },
  purple: { primary: "#7c3aed", accent: "#a78bfa", hero: "135deg, #0f0a1e 0%, #1e0f3a 60%, #2d1060 100%" },
  green:  { primary: "#15803d", accent: "#4ade80", hero: "135deg, #0a1a0f 0%, #0f2d1a 60%, #16402a 100%" },
  slate:  { primary: "#475569", accent: "#94a3b8", hero: "135deg, #0f1117 0%, #1a1f2e 60%, #252b3b 100%" },
};

async function fetchConfig(slug: string, procedure: string) {
  try {
    const res = await fetch(
      `${BACKEND}/marketing/config/public?tenant_id=${encodeURIComponent(slug)}&procedure_id=${encodeURIComponent(procedure)}`,
      { next: { revalidate: 60 } }
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

  const practiceName  = config?.practice_name || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const theme         = THEMES[config?.theme || "teal"];
  const P             = theme.primary;
  const A             = theme.accent;
  const heroImageUrl  = config?.hero_image_url || "";
  const beforeAfters: { before: string; after: string; label?: string }[] = config?.media?.before_after || [];
  // Only show videos if actually configured — no cross-tenant fallbacks
  const testimonialVideoIds: string[] = config?.testimonial_video_ids || [];
  const doctorVideoId: string         = config?.doctor_video_id || "";
  const procedureName = config?.name || procedure.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const headline      = config?.headline || `${procedureName} — Expert Care, Beautiful Results`;
  const sellingPoints: string[] = config?.selling_points || [];
  const techHighlights: string[] = config?.tech_highlights || [];
  const freeConsult   = config?.free_consultation !== false;
  const startingPrice = config?.starting_price;
  const regularPrice  = config?.regular_price;
  const savingsLabel  = config?.savings_label || (startingPrice && regularPrice ? `Save $${(regularPrice - startingPrice).toLocaleString()}+` : "");
  const financingDetails = config?.financing_details;
  const practiceDiffs = config?.practice_differentiators;
  const ctaOffer      = config?.cta_offer || (freeConsult ? "Free Consultation — No Obligation" : "");
  const ctaOfferDetail = config?.cta_offer_detail || "";
  const smileSimUrl   = `https://app.iamclara.ai/smile/${slug}`;
  const practiceAddress = config?.practice_address || "";
  const practicePhone   = config?.practice_phone || "";
  const specialtyBadge  = config?.specialty_badge || "";
  const googleReviewCount = config?.google_review_count || "";
  const googleReviewScore = config?.google_review_score || "";

  // Config-driven sections with generic fallbacks
  type ProcessStep = { icon: string; title: string; desc: string };
  const processSteps: ProcessStep[] = config?.process_steps?.length
    ? config.process_steps
    : [
        { icon: "📞", title: "Free Consultation", desc: `Meet our team, discuss your goals, and leave with a complete treatment plan and exact pricing — zero pressure.` },
        { icon: "🔬", title: "Comprehensive Exam & Planning", desc: `Digital imaging, X-rays, and a full clinical assessment. Your treatment is planned precisely before we begin.` },
        { icon: "🦷", title: `Your ${procedureName}`, desc: `Your procedure, performed by our experienced team using modern technology for the best possible outcome.` },
        { icon: "✨", title: "Follow-Up & Results", desc: `We stay with you through your recovery and final results. Your long-term outcome is our success.` },
      ];

  type FaqItem = { q: string; a: string };
  const faqItems: FaqItem[] = config?.faq_items?.length ? config.faq_items : [];

  type WhyUsItem = { icon: string; label: string; sub: string };
  const whyUsItems: WhyUsItem[] = config?.why_us_items?.length
    ? config.why_us_items
    : [
        { icon: "🏆", label: "Experienced Team", sub: "Years of dedicated expertise" },
        { icon: "💡", label: "Advanced Technology", sub: "Modern equipment & techniques" },
        { icon: "🛡️", label: "Patient-First Care", sub: "Comfort & transparency always" },
        { icon: "📍", label: "Convenient Location", sub: practiceAddress || "Easy to reach" },
      ];

  // Split selling points: top 4 in hero, rest in "What's included" section
  const heroPoints     = sellingPoints.slice(0, 4);
  const includesPoints = sellingPoints.slice(4);

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#060e1a", color: "#fff" }}>
      <PixelInjector
        metaPixelId={config?.meta_pixel_id}
        googleTagId={config?.google_tag_id}
        procedureKey={procedure}
        procedureName={procedureName}
      />

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .hero-right { order: -1; }
          .process-grid { flex-direction: column !important; }
          .tech-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonial-grid { flex-direction: column !important; }
          .faq-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ background: "rgba(6,14,26,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 100, padding: "0 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{practiceName}</div>
            {practiceAddress && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{practiceAddress}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {practicePhone && <a href={`tel:${practicePhone}`} style={{ color: A, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>{practicePhone}</a>}
            <ScrollToFormButton primary={P}>Free Consult</ScrollToFormButton>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(${theme.hero})`, padding: "50px 20px 70px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Headline block — always full-width, always first */}
          <div style={{ marginBottom: 36 }}>
            {specialtyBadge && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: A, fontWeight: 700, marginBottom: 20, letterSpacing: 0.5 }}>
                ⭐ {specialtyBadge}
              </div>
            )}
            <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1 }}>
              {headline}
            </h1>
            {startingPrice && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.4)", borderRadius: 12, padding: "10px 20px" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Starting at</div>
                  <div style={{ color: A, fontWeight: 900, fontSize: 26 }}>${startingPrice.toLocaleString()}</div>
                </div>
                {regularPrice && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "10px 20px" }}>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Regular price</div>
                    <div style={{ color: "#f87171", fontWeight: 700, fontSize: 20, textDecoration: "line-through" }}>${regularPrice.toLocaleString()}</div>
                  </div>
                )}
                {savingsLabel && <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 14 }}>💰 {savingsLabel}</div>}
              </div>
            )}
          </div>

          {/* Two-column: bullets left, photo+form right */}
          <div className="hero-grid" style={{ display: "flex", alignItems: "flex-start", gap: 40 }}>

            {/* Left: selling points + trust */}
            <div style={{ flex: "1 1 380px" }}>
              {heroPoints.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  {heroPoints.map((pt: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(45,212,191,0.2)", border: "1px solid rgba(45,212,191,0.4)", color: A, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>✓</div>
                      <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "7px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>📞 We call you back in minutes</div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "7px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>🔒 No obligation, ever</div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "7px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>🏆 Lifetime warranty</div>
                {financingDetails && (
                  <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 20, padding: "7px 14px", fontSize: 12, color: A }}>💳 {financingDetails}</div>
                )}
              </div>
            </div>

            {/* Right: photo + form */}
            <div className="hero-right" style={{ flex: "0 1 400px", display: "flex", flexDirection: "column", gap: 16 }}>
              {heroImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroImageUrl} alt="Full Arch Implant Result" style={{ width: "100%", borderRadius: 16, objectFit: "cover", maxHeight: 240, display: "block", border: "2px solid rgba(45,212,191,0.3)" }} />
              )}
              <div id="lead-form" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "28px 24px", backdropFilter: "blur(10px)" }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>🦷</div>
                  <h2 style={{ color: "#fff", fontSize: 19, fontWeight: 800, margin: "0 0 4px" }}>Claim Your Free Consultation</h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0 }}>Takes 30 seconds · We&apos;ll call you · No pressure</p>
                </div>
                <LeadForm tenantId={slug} procedureName={procedureName} offer={ctaOffer} offerDetail={ctaOfferDetail} primary={P} accent={A} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SMILE SIMULATOR CTA ── */}
      <section style={{ padding: "0 20px", background: "#060e1a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <a href={smileSimUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
            <div style={{ background: `linear-gradient(135deg, rgba(13,148,136,0.25) 0%, rgba(45,212,191,0.15) 100%)`, border: "1px solid rgba(45,212,191,0.4)", borderRadius: 20, padding: "32px 36px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", cursor: "pointer", transition: "border-color 0.2s", marginTop: -20 }}>
              <div style={{ fontSize: 48, flexShrink: 0 }}>😁</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 6 }}>AI SMILE SIMULATOR</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(18px, 3vw, 26px)", margin: "0 0 6px" }}>See your new smile before you commit</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>Upload a photo — our AI shows you a realistic preview of your full arch result in under 30 seconds. Free, no signup required.</div>
              </div>
              <div style={{ background: P, color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: 50, flexShrink: 0, whiteSpace: "nowrap" }}>
                Try It Free →
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 20px", background: "#060e1a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>YOUR JOURNEY</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, margin: 0 }}>From consultation to new smile — in one day</h2>
          </div>
          <div className="process-grid" style={{ display: "flex", gap: 0, position: "relative" }}>
            {processSteps.map((s: ProcessStep, i: number) => (
              <div key={i} style={{ flex: 1, padding: "0 20px", position: "relative", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${P}, ${A})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>{s.icon}</div>
                <div style={{ color: A, fontWeight: 700, fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>STEP {String(i + 1).padStart(2, "0")}</div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      {(includesPoints.length > 0 || techHighlights.length > 0) && (
        <section style={{ padding: "70px 20px", background: "#0a1628" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>EVERYTHING INCLUDED</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, margin: "0 0 10px" }}>No hidden fees. No surprises.</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, margin: 0 }}>Your quoted price covers everything from start to finish.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: techHighlights.length > 0 ? 40 : 0 }}>
              {includesPoints.map((pt: string, i: number) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ color: A, fontWeight: 700, fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</div>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.5 }}>{pt}</span>
                </div>
              ))}
            </div>
            {techHighlights.length > 0 && (
              <>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 14, textAlign: "center" }}>POWERED BY ADVANCED TECHNOLOGY</div>
                <div className="tech-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {techHighlights.map((hl: string, i: number) => (
                    <div key={i} style={{ background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>⚡</div>
                      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>{hl}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── DOCTOR VIDEO ── */}
      {doctorVideoId && (
        <section style={{ padding: "70px 20px", background: "#060e1a" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>MEET DR. SIDDIQUI</div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, margin: "0 0 10px" }}>A word from your doctor</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, margin: 0 }}>Chevy Chase&apos;s only dentist with xNav guided navigation for same-day implants</p>
            </div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 16, overflow: "hidden", border: `2px solid ${P}40` }}>
              <iframe src={`https://www.youtube.com/embed/${doctorVideoId}`} title="Message from Dr. Siddiqui" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
            </div>
          </div>
        </section>
      )}

      {/* ── PATIENT TESTIMONIALS ── */}
      {testimonialVideoIds.length > 0 && (
        <section style={{ padding: "70px 20px", background: "#0a1628" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>REAL PATIENTS. REAL RESULTS.</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, margin: "0 0 10px" }}>Hear from our patients</h2>
              {(googleReviewScore || googleReviewCount) && (
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>
                  {"⭐".repeat(Math.round(parseFloat(googleReviewScore) || 5))} {googleReviewScore && `${googleReviewScore} stars`}{googleReviewCount && ` · ${googleReviewCount} Google reviews`}
                </div>
              )}
            </div>
            <div className="testimonial-grid" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {testimonialVideoIds.map((vidId: string, i: number) => (
                <div key={i} style={{ flex: "1 1 280px" }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <iframe src={`https://www.youtube.com/embed/${vidId}`} title={`Patient Testimonial ${i + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BEFORE / AFTER ── */}
      {beforeAfters.length > 0 && (
        <section style={{ padding: "70px 20px", background: "#060e1a" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>TRANSFORMATIONS</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, margin: "0 0 10px" }}>Before &amp; After</h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Actual patients of Radiant Dental Care</p>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {beforeAfters.map((pair: { before: string; after: string; label?: string }, i: number) => (
                <div key={i} style={{ flex: "1 1 300px", maxWidth: 380 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pair.before} alt="Before" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 1 }}>BEFORE</div>
                    </div>
                    <div style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pair.after} alt="After" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", bottom: 8, right: 8, background: P, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 1 }}>AFTER</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ── */}
      {practiceDiffs && (
        <section style={{ padding: "70px 20px", background: "#0a1628" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 16 }}>WHY {practiceName.toUpperCase()}</div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.8, margin: "0 auto 40px", maxWidth: 700 }}>{practiceDiffs}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {whyUsItems.map((item: WhyUsItem, i: number) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ — only shown if configured ── */}
      {faqItems.length > 0 && (
        <section style={{ padding: "70px 20px", background: "#060e1a" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>COMMON QUESTIONS</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, margin: 0 }}>We hear these every day</h2>
            </div>
            <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {faqItems.map((item: FaqItem, i: number) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 24px" }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{item.q}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.65 }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(${theme.hero})` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🦷</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: "0 0 14px" }}>
            Your new smile is one call away.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, margin: "0 0 36px", lineHeight: 1.7 }}>
            Free consultation. Complete treatment plan. Exact pricing.<br />No pressure, no commitment — just answers.
          </p>
          <LeadForm tenantId={slug} procedureName={procedureName} offer={ctaOffer} offerDetail={ctaOfferDetail} primary={P} accent={A} />
          {(practiceAddress || practiceName) && (
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 16 }}>
              📍 {practiceAddress || practiceName}
            </div>
          )}
        </div>
      </section>

      <StickyMobileCTA primary={P} />

      {/* ── CLARA LIVE CHAT AGENT ── */}
      <ClaraChat
        tenantId={slug}
        practiceName={practiceName}
        primaryColor={P}
        accentColor={A}
        openingMessage={`Hi! I'm Clara, the AI assistant for ${practiceName}. Have questions about ${procedureName} or want to book your free consultation? I'm here to help! 😊`}
      />

      {/* ── Footer ── */}
      <footer style={{ background: "#030810", padding: "24px 20px 90px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          © {new Date().getFullYear()} {practiceName} · Powered by{" "}
          <a href="https://iamclara.ai" style={{ color: A, textDecoration: "none" }}>Clara AI</a>
          {" "}·{" "}
          <a href="https://iamclara.ai/privacy" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Privacy</a>
        </div>
      </footer>
    </div>
  );
}
