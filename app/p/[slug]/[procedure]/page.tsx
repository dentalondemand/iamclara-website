// SERVER COMPONENT — data fetched at request time, no CORS issues
import type { Metadata } from "next";
import { LeadForm, ScrollToFormButton, StickyMobileCTA, PixelInjector } from "./LandingClient";

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
  const testimonialVideoIds: string[] = (config as any)?.testimonial_video_ids || ["KSAhOeq8SXk", "Sb9pAeQTpW0", "HYc_j9aWhP0"];
  const doctorVideoId: string         = (config as any)?.doctor_video_id || "Qt_0JGlu7T4";
  const procedureName = config?.name || procedure.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const headline      = config?.headline || `${procedureName} — Expert Care, Beautiful Results`;
  const sellingPoints: string[] = config?.selling_points || [];
  const techHighlights: string[] = config?.tech_highlights || [];
  const freeConsult   = config?.free_consultation !== false;
  const startingPrice = config?.starting_price;
  const financingDetails = config?.financing_details;
  const practiceDiffs = config?.practice_differentiators;
  const ctaOffer      = config?.cta_offer ?? (freeConsult ? "Free Consultation — No Obligation" : undefined);
  const ctaOfferDetail = config?.cta_offer_detail;
  const smileSimUrl   = `https://app.iamclara.ai/smile/${slug}`;
  const practiceAddress = config?.practice_address || "";
  const practicePhone   = config?.practice_phone || "";

  // Split selling points: top 4 in hero, rest in "What's included" section
  const heroPoints     = sellingPoints.slice(0, 4);
  const includesPoints = sellingPoints.slice(4);

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#060e1a", color: "#fff" }}>
      <PixelInjector metaPixelId={config?.meta_pixel_id} googleTagId={config?.google_tag_id} />

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
      <section style={{ background: `linear-gradient(${theme.hero})`, padding: "60px 20px 80px" }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 48 }}>

          {/* Left: copy */}
          <div style={{ flex: "1 1 480px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: A, fontWeight: 700, marginBottom: 24, letterSpacing: 0.5 }}>
              ⭐ Chevy Chase&apos;s Premier Full Arch Specialist
            </div>

            <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1 }}>
              {headline}
            </h1>

            {/* Price + savings */}
            {startingPrice && (
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                <div style={{ background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.4)", borderRadius: 12, padding: "10px 20px" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Starting at</div>
                  <div style={{ color: A, fontWeight: 900, fontSize: 28 }}>${startingPrice.toLocaleString()}</div>
                </div>
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "10px 20px" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Regular price</div>
                  <div style={{ color: "#f87171", fontWeight: 700, fontSize: 22, textDecoration: "line-through" }}>$25,000</div>
                </div>
                <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 15 }}>💰 Save $4,000+</div>
              </div>
            )}

            {/* Top selling points */}
            {heroPoints.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {heroPoints.map((pt: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(45,212,191,0.2)", border: "1px solid rgba(45,212,191,0.4)", color: A, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>✓</div>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust signals */}
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
            {[
              { step: "01", icon: "📞", title: "Free Consultation", desc: "We review your dental history, take photos, and discuss your goals. You leave with a complete treatment plan and exact pricing — zero pressure." },
              { step: "02", icon: "🔬", title: "3D Scan & Design", desc: "CBCT cone beam imaging maps your jaw in 3D. xNav navigation software plans implant placement to the millimeter. Your new smile is digitally designed before we touch a drill." },
              { step: "03", icon: "🦷", title: "Same-Day Surgery", desc: "Implants placed with xNav guided precision. Temporary teeth fabricated in our on-site lab. You walk out with a full smile the same day as surgery." },
              { step: "04", icon: "✨", title: "Final Zirconia Smile", desc: "Premium zirconia bridge crafted and seated. Your permanent, lifetime-warranted smile is complete — typically within a few months of your surgery date." },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: "0 20px", position: "relative", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${P}, ${A})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>{s.icon}</div>
                <div style={{ color: A, fontWeight: 700, fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>STEP {s.step}</div>
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
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>⭐⭐⭐⭐⭐ Rated 5 stars on Google</div>
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
              {[
                { icon: "🎯", label: "xNav Guided Navigation", sub: "Sub-mm precision" },
                { icon: "🏥", label: "In-House Lab", sub: "Same-day results" },
                { icon: "📸", label: "CBCT 3D Imaging", sub: "Full treatment planned" },
                { icon: "🛡️", label: "Lifetime Warranty", sub: "On your zirconia bridge" },
              ].map((item, i) => (
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

      {/* ── FAQ ── */}
      <section style={{ padding: "70px 20px", background: "#060e1a" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ color: A, fontWeight: 700, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>COMMON QUESTIONS</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, margin: 0 }}>We hear these every day</h2>
          </div>
          <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { q: "Am I a candidate for full arch implants?", a: "Most adults with missing teeth or failing dentition are candidates. Bone loss is common — but our CBCT scan tells us exactly what we're working with. Many patients are surprised to learn they qualify even after being told elsewhere they don't." },
              { q: "Does it hurt? What's the recovery like?", a: "We use sedation dentistry — most patients report the experience as far more comfortable than expected. The first 3–5 days include swelling and soreness, managed with prescribed medication. Most patients return to normal activity within a week." },
              { q: "How is this different from dentures?", a: "Dentures rest on your gums, slip when you eat, and accelerate bone loss. Implants are anchored into your jaw like natural teeth — they're permanent, won't move, and preserve your bone. It's a completely different category of care." },
              { q: "Why $20,999 when I see ads for $9,999?", a: "The $9,999 offers are typically for 'All-on-4' with acrylic (plastic) bridges — not zirconia. Our price includes premium zirconia, guided xNav placement, in-house fabrication, sedation, and a lifetime warranty. You get what you pay for." },
              { q: "How long does the whole process take?", a: "The surgery itself is typically 3–5 hours. You leave the same day with temporary teeth. Final zirconia placement happens within a few months as your implants fully integrate. Most patients consider the whole journey complete in 3–6 months." },
              { q: "What does the free consultation include?", a: "A full exam, X-rays, and a conversation about your specific situation. You'll leave with a complete treatment plan, exact pricing, and all your questions answered — with zero pressure to proceed." },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 24px" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{item.q}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.65 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 16 }}>
            📍 {practiceAddress || `${practiceName}, Chevy Chase, MD`}
          </div>
        </div>
      </section>

      <StickyMobileCTA primary={P} />

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
