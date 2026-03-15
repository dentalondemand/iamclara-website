// SERVER COMPONENT — data fetched at request time, no CORS issues
import type { Metadata } from "next";
import { LeadForm, ScrollToFormButton, StickyMobileCTA, PixelInjector } from "./LandingClient";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";

const TECH_LABELS: Record<string, string> = {
  cbct: "3D CBCT Imaging",
  same_day_crowns: "Same-Day Crowns",
  intraoral_scanner: "Digital Intraoral Scanner",
  "3d_printing": "In-House 3D Printing",
  xnav: "xNav Guided Implants",
  exocad: "Exocad Digital Design",
  same_day_implants: "Same-Day Implants",
};

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
      { next: { revalidate: 60 } } // cache for 60s, then refresh
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
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

  // ── Resolve values (with fallbacks) ──
  const practiceName = config?.practice_name || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const theme = THEMES[config?.theme || "teal"];
  const P = theme.primary;
  const A = theme.accent;

  const beforeAfterPairs: { before: string; after: string; label?: string }[] =
    config?.media?.before_after || [];
  const heroImageUrl: string = config?.hero_image_url || "";
  // YouTube video IDs — from old landing page
  const testimonialVideoIds: string[] = (config as any)?.testimonial_video_ids || ["KSAhOeq8SXk", "Sb9pAeQTpW0", "HYc_j9aWhP0"];
  const doctorVideoId: string = (config as any)?.doctor_video_id || "Qt_0JGlu7T4";
  const procedureDisplayName = config?.name || procedure.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const headline = config?.headline || `${procedureDisplayName} — Expert Care, Beautiful Results`;
  const sellingPoints: string[] = config?.selling_points || [];
  const techHighlights: string[] = config?.tech_highlights || [];
  const freeConsult = config?.free_consultation !== false;
  const financingAvailable = config?.financing_available !== false;
  const startingPrice = config?.starting_price;
  const financingDetails = config?.financing_details;
  const practiceDiffs = config?.practice_differentiators;
  const ctaOffer = config?.cta_offer ?? (freeConsult ? "Free Consultation — No Obligation" : undefined);
  const ctaOfferDetail = config?.cta_offer_detail;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#fff" }}>

      {/* Pixel injection — client only */}
      <PixelInjector metaPixelId={config?.meta_pixel_id} googleTagId={config?.google_tag_id} />

      {/* ── HERO ── */}
      <section style={{
        background: heroImageUrl
          ? `linear-gradient(to right, rgba(6,14,26,0.92) 0%, rgba(6,14,26,0.75) 60%, rgba(6,14,26,0.5) 100%), url(${heroImageUrl}) center/cover no-repeat`
          : `linear-gradient(${theme.hero})`,
        padding: "0 20px", minHeight: "100vh", display: "flex", flexDirection: "column",
      }}>
        {/* Nav */}
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{practiceName}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Powered by Clara AI</div>
          </div>
          <ScrollToFormButton primary={P}>Free Consultation</ScrollToFormButton>
        </div>

        {/* Hero content — form first on mobile via flex-wrap-reverse trick */}
        <style>{`
          @media (max-width: 768px) {
            .hero-content { flex-direction: column-reverse !important; }
            .hero-copy { order: 2; }
            .hero-form { order: 1; }
          }
        `}</style>
        <div className="hero-content" style={{ maxWidth: 1100, margin: "0 auto", width: "100%", flex: 1, display: "flex", alignItems: "center", gap: 60, padding: "40px 0 60px", flexWrap: "wrap" }}>
          {/* Left: copy */}
          <div className="hero-copy" style={{ flex: "1 1 420px" }}>
            <div style={{ display: "inline-block", background: "rgba(13,148,136,0.2)", border: "1px solid rgba(13,148,136,0.4)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: A, fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>
              {practiceName.toUpperCase()} · {procedureDisplayName.toUpperCase()}
            </div>

            <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1 }}>
              {headline}
            </h1>

            {startingPrice && (
              <div style={{ display: "inline-block", background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.4)", borderRadius: 12, padding: "8px 20px", marginBottom: 24 }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginRight: 6 }}>Starting at</span>
                <span style={{ color: A, fontWeight: 800, fontSize: 24 }}>${startingPrice.toLocaleString()}</span>
              </div>
            )}

            {sellingPoints.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {sellingPoints.map((pt: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(45,212,191,0.2)", border: "1px solid rgba(45,212,191,0.4)", color: A, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>✓</div>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              {freeConsult && (
                <div style={{ background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.35)", borderRadius: 20, padding: "7px 16px", fontSize: 13, color: A, fontWeight: 700 }}>🆓 Free Consultation</div>
              )}
              {financingAvailable && (
                <div style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 20, padding: "7px 16px", fontSize: 13, color: A, fontWeight: 600 }}>
                  💳 Financing Available
                  {financingDetails && <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400, marginLeft: 4 }}>· {financingDetails}</span>}
                </div>
              )}
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "7px 16px", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>📞 Call back in minutes</div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "7px 16px", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>🔒 No obligation</div>
            </div>

            {techHighlights.length > 0 && (
              <div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Advanced Technology</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {techHighlights.map((key: string) => (
                    <div key={key} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                      ⚡ {TECH_LABELS[key] || key}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: form */}
          <div className="hero-form" id="lead-form" style={{ flex: "0 1 380px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 28, backdropFilter: "blur(10px)" }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>Get Your Free Consultation</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 20px" }}>Takes 10 seconds. We&apos;ll call you.</p>
            <LeadForm tenantId={slug} procedureName={procedureDisplayName} offer={ctaOffer} offerDetail={ctaOfferDetail} primary={P} accent={A} />
          </div>
        </div>
      </section>

      {/* ── DOCTOR VIDEO ── */}
      {doctorVideoId && (
        <section style={{ padding: "70px 20px", background: "#060e1a" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 10 }}>MEET YOUR DOCTOR</div>
              <h2 style={{ color: "#fff", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, margin: 0 }}>
                A Message from Dr. Siddiqui
              </h2>
            </div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 16, overflow: "hidden" }}>
              <iframe
                src={`https://www.youtube.com/embed/${doctorVideoId}`}
                title="Doctor Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── PATIENT TESTIMONIALS ── */}
      {testimonialVideoIds.length > 0 && (
        <section style={{ padding: "70px 20px", background: "#0a1628" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 10 }}>HEAR FROM OUR PATIENTS</div>
              <h2 style={{ color: "#fff", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, margin: 0 }}>Video Testimonials</h2>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
              {testimonialVideoIds.map((vidId: string, i: number) => (
                <div key={i} style={{ flex: "1 1 280px", maxWidth: 380 }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 12, overflow: "hidden" }}>
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

      {/* ── BEFORE / AFTER GALLERY ── */}
      {beforeAfterPairs.length > 0 && (
        <section style={{ padding: "70px 20px", background: "#0a1628" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 10 }}>REAL PATIENT RESULTS</div>
              <h2 style={{ color: "#fff", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, margin: 0 }}>Before &amp; After</h2>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
              {beforeAfterPairs.map((pair: { before: string; after: string; label?: string }, i: number) => (
                <div key={i} style={{ flex: "1 1 300px", maxWidth: 360 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pair.before} alt="Before" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>BEFORE</div>
                    </div>
                    <div style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pair.after} alt="After" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", bottom: 8, right: 8, background: P, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>AFTER</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRACTICE DIFFERENTIATORS ── */}
      {practiceDiffs && (
        <section style={{ padding: "60px 20px", background: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 20 }}>WHY {practiceName.toUpperCase()}</div>
            <p style={{ color: "#374151", fontSize: 17, lineHeight: 1.8, margin: "0 auto", maxWidth: 680 }}>{practiceDiffs}</p>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(${theme.hero})` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, margin: "0 0 16px" }}>Ready to get started?</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, margin: "0 0 40px", lineHeight: 1.6 }}>Your free consultation takes about an hour. We&apos;ll give you a complete treatment plan and exact pricing — no pressure, no surprises.</p>
          <LeadForm tenantId={slug} procedureName={procedureDisplayName} offer={ctaOffer} offerDetail={ctaOfferDetail} primary={P} accent={A} />
        </div>
      </section>

      <StickyMobileCTA primary={P} />

      {/* ── Footer ── */}
      <footer style={{ background: "#060e1a", padding: "24px 20px 80px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          © {new Date().getFullYear()} {practiceName} · Powered by{" "}
          <a href="https://iamclara.ai" style={{ color: A, textDecoration: "none" }}>Clara AI</a>
          {" "}·{" "}
          <a href="https://iamclara.ai/privacy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Privacy</a>
        </div>
      </footer>
    </div>
  );
}
