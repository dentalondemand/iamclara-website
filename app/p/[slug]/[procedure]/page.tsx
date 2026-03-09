"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

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

interface ProcedureConfig {
  name: string;
  headline: string;
  starting_price?: number;
  selling_points: string[];
  free_consultation: boolean;
  financing_available: boolean;
  financing_details?: string;
  practice_differentiators?: string;
  tech_highlights?: string[];
}

interface PracticeMarketingConfig {
  practice_name?: string;
  theme?: string;
  cta_offer?: string;
  cta_offer_detail?: string;
  procedure?: ProcedureConfig;
}

// ── Lead Capture Form ──────────────────────────────────────────────────────────
function LeadForm({
  tenantId,
  procedureName,
  offer,
  offerDetail,
  primary = "#0d9488",
  accent = "#2DD4BF",
}: {
  tenantId: string;
  procedureName: string;
  offer?: string;
  offerDetail?: string;
  primary?: string;
  accent?: string;
}) {
  const P = primary;
  const A = accent;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    interest: procedureName,
    credit_score: "",
    timeline: "",
    savings: "",
    procedure_detail: procedureName,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone) { setErr("Please enter your phone number."); return; }
    setSubmitting(true);
    setErr("");
    try {
      const res = await fetch(`${BACKEND}/public/${tenantId}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) setDone(true);
      else setErr("Something went wrong — please call us directly.");
    } catch {
      setErr("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return (
    <div style={{
      background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.3)",
      borderRadius: 14, padding: "24px 20px", textAlign: "center",
    }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>📞</div>
      <div style={{ fontWeight: 700, fontSize: 17, color: "#16a34a", marginBottom: 6 }}>We&apos;ll call you shortly!</div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
        A team member will reach out within minutes during business hours.
      </div>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15,
    outline: "none", width: "100%", boxSizing: "border-box",
  };
  const selectStyle = (hasValue: boolean): React.CSSProperties => ({
    padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(20,30,45,0.95)", color: hasValue ? "#fff" : "rgba(255,255,255,0.45)",
    fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box",
  });

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {offer && (
        <div style={{
          background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)",
          borderRadius: 10, padding: "10px 14px", marginBottom: 4,
        }}>
          <div style={{ color: A, fontWeight: 700, fontSize: 13 }}>🎁 {offer}</div>
          {offerDetail && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{offerDetail}</div>}
        </div>
      )}
      <input
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        placeholder="Your name"
        style={inputStyle}
      />
      <input
        value={form.phone}
        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
        placeholder="Phone number *"
        type="tel"
        required
        style={inputStyle}
      />
      <select
        value={form.credit_score}
        onChange={e => setForm(p => ({ ...p, credit_score: e.target.value }))}
        style={selectStyle(!!form.credit_score)}
      >
        <option value="">What is your credit score range?</option>
        <option value="Excellent (750+)">Excellent (750+)</option>
        <option value="Good (650–749)">Good (650–749)</option>
        <option value="Fair (550–649)">Fair (550–649)</option>
        <option value="Below 550">Below 550</option>
        <option value="Not sure">Not sure</option>
      </select>
      <select
        value={form.timeline}
        onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}
        style={selectStyle(!!form.timeline)}
      >
        <option value="">When are you looking to get started?</option>
        <option value="As soon as possible">As soon as possible</option>
        <option value="Within 1–3 months">Within 1–3 months</option>
        <option value="Within 3–6 months">Within 3–6 months</option>
        <option value="6+ months from now">6+ months from now</option>
      </select>
      <select
        value={form.savings}
        onChange={e => setForm(p => ({ ...p, savings: e.target.value }))}
        style={selectStyle(!!form.savings)}
      >
        <option value="">Do you have savings set aside?</option>
        <option value="Yes, I have funds ready">Yes, I have funds ready</option>
        <option value="I'll need financing">I&apos;ll need financing</option>
        <option value="Not sure yet">Not sure yet</option>
      </select>
      {/* Hidden field — procedure pre-filled from the ad */}
      <input type="hidden" value={form.procedure_detail} readOnly />
      {err && <div style={{ color: "#f87171", fontSize: 13 }}>{err}</div>}
      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: "15px", borderRadius: 12, border: "none", background: P,
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
          opacity: submitting ? 0.7 : 1, letterSpacing: 0.3,
        }}
      >
        {submitting ? "Sending…" : "Get My Free Consultation →"}
      </button>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0, textAlign: "center" }}>
        No spam. We&apos;ll call you — not the other way around.
      </p>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProcedureLandingPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const procedure = (params?.procedure as string) || "";

  const [config, setConfig] = useState<PracticeMarketingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BACKEND}/marketing/config/public?tenant_id=${encodeURIComponent(slug)}&procedure_id=${encodeURIComponent(procedure)}`)
      .then(r => {
        if (!r.ok) return null;
        return r.json();
      })
      .then(d => { if (d) setConfig(d); })
      .catch(() => { /* silently fall back to defaults */ })
      .finally(() => setLoading(false));
  }, [slug, procedure]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 15 }}>Loading…</div>
    </div>
  );

  // ── Resolve values (with fallbacks) ──
  const practiceName =
    config?.practice_name ||
    slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const theme = THEMES[config?.theme || "teal"];
  const P = theme.primary;
  const A = theme.accent;

  const proc = config?.procedure;
  const procedureDisplayName =
    proc?.name ||
    procedure.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const headline = proc?.headline || `${procedureDisplayName} — Expert Care, Beautiful Results`;
  const sellingPoints: string[] = proc?.selling_points || [];
  const techHighlights: string[] = proc?.tech_highlights || [];
  const freeConsult = proc?.free_consultation !== false;
  const financingAvailable = proc?.financing_available !== false;
  const startingPrice = proc?.starting_price;
  const financingDetails = proc?.financing_details;
  const practiceDiffs = proc?.practice_differentiators;

  const ctaOffer = config?.cta_offer ?? (freeConsult ? "Free Consultation — No Obligation" : undefined);
  const ctaOfferDetail = config?.cta_offer_detail;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#fff" }}>

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(${theme.hero})`,
        padding: "0 20px", minHeight: "100vh", display: "flex", flexDirection: "column",
      }}>
        {/* Nav */}
        <div style={{
          maxWidth: 1100, margin: "0 auto", width: "100%", padding: "20px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{practiceName}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Powered by Clara AI</div>
          </div>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "10px 20px", borderRadius: 50, border: "none", background: P,
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >
            Free Consultation
          </button>
        </div>

        {/* Hero content */}
        <div style={{
          maxWidth: 1100, margin: "0 auto", width: "100%", flex: 1,
          display: "flex", alignItems: "center", gap: 60, padding: "40px 0 60px",
          flexWrap: "wrap",
        }}>
          {/* Left: copy */}
          <div style={{ flex: "1 1 420px" }}>
            {/* Procedure badge */}
            <div style={{
              display: "inline-block", background: "rgba(13,148,136,0.2)",
              border: "1px solid rgba(13,148,136,0.4)", borderRadius: 20,
              padding: "4px 14px", fontSize: 12, color: A, fontWeight: 700,
              marginBottom: 20, letterSpacing: 1,
            }}>
              {practiceName.toUpperCase()} · {procedureDisplayName.toUpperCase()}
            </div>

            <h1 style={{
              color: "#fff", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900,
              lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1,
            }}>
              {headline}
            </h1>

            {/* Price callout */}
            {startingPrice && (
              <div style={{
                display: "inline-block", background: "rgba(45,212,191,0.15)",
                border: "1px solid rgba(45,212,191,0.4)", borderRadius: 12,
                padding: "8px 20px", marginBottom: 24,
              }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginRight: 6 }}>Starting at</span>
                <span style={{ color: A, fontWeight: 800, fontSize: 24 }}>
                  ${startingPrice.toLocaleString()}
                </span>
              </div>
            )}

            {/* Selling points */}
            {sellingPoints.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {sellingPoints.map((pt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "rgba(45,212,191,0.2)", border: "1px solid rgba(45,212,191,0.4)",
                      color: A, fontSize: 12, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                    }}>
                      ✓
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Badges */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              {freeConsult && (
                <div style={{
                  background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.35)",
                  borderRadius: 20, padding: "7px 16px", fontSize: 13, color: A, fontWeight: 700,
                }}>
                  🆓 Free Consultation
                </div>
              )}
              {financingAvailable && (
                <div style={{
                  background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)",
                  borderRadius: 20, padding: "7px 16px", fontSize: 13, color: A, fontWeight: 600,
                }}>
                  💳 Financing Available
                  {financingDetails && (
                    <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400, marginLeft: 4 }}>
                      · {financingDetails}
                    </span>
                  )}
                </div>
              )}
              <div style={{
                background: "rgba(255,255,255,0.06)", borderRadius: 20,
                padding: "7px 16px", fontSize: 13, color: "rgba(255,255,255,0.7)",
              }}>
                📞 Call back in minutes
              </div>
              <div style={{
                background: "rgba(255,255,255,0.06)", borderRadius: 20,
                padding: "7px 16px", fontSize: 13, color: "rgba(255,255,255,0.7)",
              }}>
                🔒 No obligation
              </div>
            </div>

            {/* Tech highlights */}
            {techHighlights.length > 0 && (
              <div>
                <div style={{
                  color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700,
                  letterSpacing: 1, marginBottom: 10, textTransform: "uppercase",
                }}>
                  Advanced Technology
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {techHighlights.map(key => (
                    <div key={key} style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                      padding: "5px 12px", fontSize: 12,
                      color: "rgba(255,255,255,0.7)", fontWeight: 600,
                    }}>
                      ⚡ {TECH_LABELS[key] || key}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: form */}
          <div
            ref={formRef}
            style={{
              flex: "0 1 380px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 28,
              backdropFilter: "blur(10px)",
            }}
          >
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>
              Get Your Free Consultation
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 20px" }}>
              Takes 10 seconds. We&apos;ll call you.
            </p>
            <LeadForm
              tenantId={slug}
              procedureName={procedureDisplayName}
              offer={ctaOffer}
              offerDetail={ctaOfferDetail}
              primary={P}
              accent={A}
            />
          </div>
        </div>
      </section>

      {/* ── PRACTICE DIFFERENTIATORS (if available) ── */}
      {practiceDiffs && (
        <section style={{ padding: "60px 20px", background: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 20 }}>
              WHY {practiceName.toUpperCase()}
            </div>
            <p style={{ color: "#374151", fontSize: 17, lineHeight: 1.8, margin: "0 auto", maxWidth: 680 }}>
              {practiceDiffs}
            </p>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(${theme.hero})` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, margin: "0 0 16px" }}>
            Ready to get started?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, margin: "0 0 40px", lineHeight: 1.6 }}>
            Your free consultation takes about an hour. We&apos;ll give you a complete treatment plan and exact pricing — no pressure, no surprises.
          </p>
          <LeadForm
            tenantId={slug}
            procedureName={procedureDisplayName}
            offer={ctaOffer}
            offerDetail={ctaOfferDetail}
            primary={P}
            accent={A}
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#060e1a", padding: "24px 20px", textAlign: "center" }}>
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
