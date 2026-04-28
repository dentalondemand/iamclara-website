"use client";
import { useEffect, useRef, useState } from "react";

const BACKEND = "https://mqxnyexmrk.us-east-1.awsapprunner.com";

// ── Lead Capture Form ──────────────────────────────────────────────────────────
export function LeadForm({
  tenantId,
  procedureName,
  procedureId,
  offer,
  offerDetail,
  primary = "#0d9488",
  accent = "#2DD4BF",
  googleAdsConversionId = "AW-444471483",
  googleAdsConversionLabel = "40AqCKmxjZ4cELux-NMB",
}: {
  tenantId: string;
  procedureName: string;
  procedureId?: string;
  offer?: string;
  offerDetail?: string;
  primary?: string;
  accent?: string;
  googleAdsConversionId?: string;
  googleAdsConversionLabel?: string;
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
          // Google Ads conversion tracking
          (window as any).gtag("event", "conversion", {
            send_to: `${googleAdsConversionId}/${googleAdsConversionLabel}`,
            value: 1,
            currency: "USD",
          });
        }
      } else setErr("Something went wrong — please call us directly.");
    } catch {
      setErr("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Confirmation */}
      <div style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 14, padding: "16px 20px", textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#4ade80", marginBottom: 3 }}>✅ We got your info!</div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>How would you like to connect?</div>
      </div>

      {/* Option A: Schedule now */}
      <a
        href={`/book/${tenantId}`}
        style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px 20px", borderRadius: 14,
          background: P, color: "#fff",
          fontWeight: 700, fontSize: 15, textDecoration: "none",
          boxShadow: `0 4px 20px rgba(${hexToRgb(P)},0.35)`,
        }}
      >
        <span style={{ fontSize: 24 }}>📅</span>
        <div>
          <div style={{ fontWeight: 800 }}>Pick my own time</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>Choose a slot & book instantly</div>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 20 }}>›</span>
      </a>

      {/* Option B: Have Clara call */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "16px 20px", borderRadius: 14,
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
        color: "#fff",
      }}>
        <span style={{ fontSize: 24 }}>📞</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Have Clara call me</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>We'll reach out within minutes during business hours</div>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#4ade80", fontWeight: 700, whiteSpace: "nowrap" }}>✓ Queued</span>
      </div>
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
        {submitting ? "Sending…" : "📞 Have Clara Call Me →"}
      </button>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0, textAlign: "center" }}>No spam. We&apos;ll call you — not the other way around.</p>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>OR</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
      </div>

      {/* Book online alternative */}
      <a
        href={`/book/${tenantId}`}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "13px", borderRadius: 12,
          border: `1px solid rgba(${hexToRgb(P)},0.4)`,
          background: `rgba(${hexToRgb(P)},0.08)`,
          color: A, fontWeight: 700, fontSize: 14,
          textDecoration: "none", textAlign: "center",
        }}
      >
        📅 Book My Own Time Online
      </a>
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
export function StickyMobileCTA({ primary, tenantId }: { primary: string; tenantId?: string }) {
  function scrollToForm() {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, padding: "12px 16px", background: "rgba(6,14,26,0.97)", borderTop: `2px solid ${primary}`, display: "flex", gap: 8, alignItems: "center" }} className="mobile-sticky-cta">
      <button onClick={scrollToForm} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: primary, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}>
        Get Free Consult →
      </button>
      {tenantId && (
        <a href={`/book/${tenantId}`} style={{
          flex: 1, padding: "14px", borderRadius: 12,
          border: `2px solid ${primary}`, background: "transparent",
          color: primary, fontSize: 15, fontWeight: 700, cursor: "pointer",
          textDecoration: "none", textAlign: "center", display: "block",
        }}>
          📅 Book Now
        </a>
      )}
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
      gc.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleTagId}',{allow_cross_domain:true});gtag('config','AW-444471483',{allow_cross_domain:true});window._gtag_initialized=true;`;
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

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : "13,148,136";
}

// ── Before/After Image Slider ──────────────────────────────────────────────────
export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  caption,
  accent = "#0D9E8F",
}: {
  beforeUrl: string;
  afterUrl: string;
  caption?: string;
  accent?: string;
}) {
  const [clip, setClip] = useState(0.5);
  const ref = useRef<HTMLDivElement>(null);

  if (!beforeUrl || !afterUrl) return null;

  function getClip(e: MouseEvent | TouchEvent): number {
    if (!ref.current) return 0.5;
    const rect = ref.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    return Math.max(0.05, Math.min(0.95, x / rect.width));
  }

  function onMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    setClip(getClip(e));
  }

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setClip(getClip(e.nativeEvent));
    const onMove2 = (ev: MouseEvent) => onMove(ev);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove2);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove2);
    window.addEventListener("mouseup", onUp);
  }

  function onTouchStart(e: React.TouchEvent) {
    setClip(getClip(e.nativeEvent));
  }

  function onTouchMove(e: React.TouchEvent) {
    onMove(e.nativeEvent);
  }

  return (
    <div
      ref={ref}
      className="ba-slider"
      style={
        {
          "--clip": clip,
          "--accent": accent,
          position: "relative",
          borderRadius: "var(--radius-lg, 20px)",
          overflow: "hidden",
          cursor: "ew-resize",
          userSelect: "none",
        } as React.CSSProperties
      }
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <style>{`
        .ba-slider { position: relative; border-radius: var(--radius-lg, 20px); overflow: hidden; cursor: ew-resize; }
        .ba-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .ba-after-wrap { position: absolute; inset: 0; width: calc(var(--clip) * 100%); overflow: hidden; }
        .ba-after-wrap .ba-img { width: calc(100% / var(--clip)); min-width: 100%; }
        .ba-handle {
          position: absolute; top: 0; bottom: 0;
          left: calc(var(--clip) * 100%);
          width: 44px; margin-left: -22px;
          cursor: ew-resize;
          display: flex; align-items: center; justify-content: center;
          z-index: 10;
        }
        .ba-handle-line { width: 2px; height: 100%; background: #fff; box-shadow: 0 0 8px rgba(0,0,0,0.4); }
        .ba-handle-knob {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 40px; height: 40px; border-radius: 50%;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          font-size: 16px;
        }
        .ba-label {
          position: absolute; top: 14px;
          font-size: 0.68rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 6px;
          backdrop-filter: blur(8px);
          z-index: 10;
          pointer-events: none;
        }
        .ba-label-before { left: 14px; background: rgba(0,0,0,0.72); color: rgba(255,255,255,0.9); }
        .ba-label-after { right: 14px; background: color-mix(in oklab, var(--accent, #0D9E8F) 85%, black); color: #fff; }
      `}</style>

      {/* Before image (full width, base layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={beforeUrl} alt="Before" className="ba-img" />

      {/* After image (clipped by --clip) */}
      <div className="ba-after-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterUrl} alt="After" className="ba-img" />
      </div>

      {/* Labels */}
      <div className="ba-label ba-label-before">Before</div>
      <div className="ba-label ba-label-after">After</div>

      {/* Drag handle */}
      <div className="ba-handle">
        <div className="ba-handle-line" />
        <div className="ba-handle-knob">⇄</div>
      </div>

      {caption && (
        <div style={{
          background: "rgba(0,0,0,0.72)",
          padding: "10px 16px",
          fontSize: 13,
          textAlign: "center",
          color: "rgba(255,255,255,0.8)",
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}
