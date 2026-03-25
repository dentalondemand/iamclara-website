"use client";
import { useEffect, useRef, useState } from "react";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";

// ── Lead Capture Form ──────────────────────────────────────────────────────────
export function LeadForm({
  tenantId,
  procedureName,
  procedureId,
  offer,
  offerDetail,
  primary = "#0d9488",
  accent = "#2DD4BF",
}: {
  tenantId: string;
  procedureName: string;
  procedureId?: string;
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
    email: "",
    interest: procedureName,
    credit_score: "",
    timeline: "",
    savings: "",
    procedure_detail: procedureName,
    procedure_id: procedureId || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = sp.get(key);
      if (v) utm[key] = v;
    }
    setUtmParams(utm);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Please enter your name."); return; }
    if (!form.phone) { setErr("Please enter your phone number."); return; }
    // Credit score gate — Cherry financing requires 580+
    if (form.credit_score === "below_650" || form.credit_score === "not_sure") {
      setErr("Cherry financing typically requires a 580+ credit score. We recommend checking your score first — you can apply at cherrytechnologies.com. Questions? Call us at (301) 652-2222.");
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      const res = await fetch(`${BACKEND}/public/${tenantId}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...utmParams }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Lead", { content_name: procedureName, content_category: "dental_procedure", value: 0, currency: "USD" });
        }
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "generate_lead", { currency: "USD", value: 0, event_category: "lead_form", event_label: procedureName });
        }
      } else setErr("Something went wrong — please call us directly.");
    } catch {
      setErr("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return (
    <div style={{ background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>📞</div>
      <div style={{ fontWeight: 700, fontSize: 17, color: "#16a34a", marginBottom: 6 }}>We&apos;ll call you shortly!</div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>A team member will reach out within minutes during business hours.</div>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15,
    outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {offer && (
        <div style={{ background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 4 }}>
          <div style={{ color: A, fontWeight: 700, fontSize: 13 }}>🎁 {offer}</div>
          {offerDetail && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{offerDetail}</div>}
        </div>
      )}
      <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name *" required style={inputStyle} />
      <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number *" type="tel" required style={inputStyle} />

      {/* Qualifying: teeth missing */}
      <select
        value={(form as any).teeth_missing ?? ""}
        onChange={e => setForm(p => ({ ...p, teeth_missing: e.target.value } as any))}
        required
        style={{ ...inputStyle, color: (form as any).teeth_missing ? "#fff" : "rgba(255,255,255,0.4)" }}
      >
        <option value="" disabled>How many teeth are you missing? *</option>
        <option value="1-3">1–3 teeth</option>
        <option value="4+">4 or more teeth</option>
        <option value="full_arch">Full arch (most or all)</option>
        <option value="not_sure">Not sure</option>
      </select>

      {/* Qualifying: timeline */}
      <select
        value={form.timeline}
        onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}
        required
        style={{ ...inputStyle, color: form.timeline ? "#fff" : "rgba(255,255,255,0.4)" }}
      >
        <option value="" disabled>When are you looking to move forward? *</option>
        <option value="asap">As soon as possible</option>
        <option value="1-3_months">Within 1–3 months</option>
        <option value="3-6_months">3–6 months</option>
        <option value="just_looking">Just researching for now</option>
      </select>

      {/* Qualifying: credit score (financing eligibility) */}
      <select
        value={form.credit_score}
        onChange={e => setForm(p => ({ ...p, credit_score: e.target.value }))}
        required
        style={{ ...inputStyle, color: form.credit_score ? "#fff" : "rgba(255,255,255,0.4)" }}
      >
        <option value="" disabled>Estimated credit score? *</option>
        <option value="750+">750+ (Excellent)</option>
        <option value="700-749">700–749 (Good)</option>
        <option value="650-699">650–699 (Fair)</option>
        <option value="below_650">Below 650</option>
        <option value="not_sure">Not sure</option>
      </select>

      <input type="hidden" value={form.procedure_detail} readOnly />
      {err && <div style={{ color: "#f87171", fontSize: 13 }}>{err}</div>}
      <button type="submit" disabled={submitting} style={{ padding: "15px", borderRadius: 12, border: "none", background: P, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1, letterSpacing: 0.3 }}>
        {submitting ? "Sending…" : "Get My Free Consultation →"}
      </button>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0, textAlign: "center" }}>No spam. We&apos;ll call you — not the other way around.</p>
    </form>
  );
}

// ── Scroll-to-form button (needs useRef on client) ────────────────────────────
export function ScrollToFormButton({ primary, children }: { primary: string; children: React.ReactNode }) {
  function scrollToForm() {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <button onClick={scrollToForm} style={{ padding: "10px 20px", borderRadius: 50, border: "none", background: primary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
      {children}
    </button>
  );
}

// ── Sticky mobile CTA ─────────────────────────────────────────────────────────
export function StickyMobileCTA({ primary }: { primary: string }) {
  function scrollToForm() {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, padding: "12px 16px", background: "rgba(6,14,26,0.97)", borderTop: `2px solid ${primary}`, display: "flex", gap: 10, alignItems: "center" }} className="mobile-sticky-cta">
      <button onClick={scrollToForm} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: primary, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}>
        Get My Free Consultation →
      </button>
    </div>
  );
}

// ── Pixel injection (client-only) ─────────────────────────────────────────────
export function PixelInjector({
  metaPixelId,
  googleTagId,
  procedureKey,
  procedureName,
}: {
  metaPixelId?: string;
  googleTagId?: string;
  procedureKey?: string;   // e.g. "fullarch", "veneers" — used as content_type for audience segmentation
  procedureName?: string;  // e.g. "Full Arch Dental Implants"
}) {
  useEffect(() => {
    if (metaPixelId) {
      const s = document.createElement("script");
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`;
      document.head.appendChild(s);

      // ViewContent — fires after PageView, tagged to this specific procedure page.
      // Lets Meta build separate retargeting audiences per procedure
      // (e.g. "people who viewed full arch page" vs "people who viewed veneers page").
      if (procedureKey) {
        const vc = document.createElement("script");
        vc.innerHTML = `fbq('track','ViewContent',{content_ids:['${procedureKey}'],content_name:'${procedureName || procedureKey}',content_category:'dental_procedure',content_type:'product'});`;
        document.head.appendChild(vc);
      }
    }
    if (googleTagId) {
      const gs = document.createElement("script");
      gs.async = true;
      gs.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagId}`;
      document.head.appendChild(gs);
      const gc = document.createElement("script");
      gc.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleTagId}');`;
      document.head.appendChild(gc);
      // Google: fire page_view with procedure context for audience segmentation
      if (procedureKey) {
        const gvc = document.createElement("script");
        gvc.innerHTML = `gtag('event','view_item',{item_id:'${procedureKey}',item_name:'${procedureName || procedureKey}',item_category:'dental_procedure'});`;
        document.head.appendChild(gvc);
      }
    }
  }, [metaPixelId, googleTagId, procedureKey, procedureName]);
  return null;
}
