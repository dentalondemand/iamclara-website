"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ClaraChat from "../../../components/ClaraChat";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";

const THEMES: Record<string, { primary: string; accent: string; hero: string }> = {
  teal:   { primary: "#0d9488", accent: "#2DD4BF", hero: "135deg, #0a1628 0%, #0d2240 60%, #0f3460 100%" },
  navy:   { primary: "#1d4ed8", accent: "#60a5fa", hero: "135deg, #0a0f1e 0%, #0f1f4a 60%, #1a3070 100%" },
  purple: { primary: "#7c3aed", accent: "#a78bfa", hero: "135deg, #0f0a1e 0%, #1e0f3a 60%, #2d1060 100%" },
  green:  { primary: "#15803d", accent: "#4ade80", hero: "135deg, #0a1a0f 0%, #0f2d1a 60%, #16402a 100%" },
  slate:  { primary: "#475569", accent: "#94a3b8", hero: "135deg, #0f1117 0%, #1a1f2e 60%, #252b3b 100%" },
};

function ytEmbed(url: string) {
  if (!url) return "";
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1` : "";
}

function LeadForm({ tenantId, offer, offerDetail, interestOptions, focus, primary = "#0d9488", accent = "#2DD4BF" }: {
  tenantId: string; offer: string; offerDetail?: string; interestOptions: string[];
  focus?: string; primary?: string; accent?: string;
}) {
  const P = primary; const A = accent;
  const [form, setForm] = useState({ name: "", phone: "", interest: interestOptions[0] ?? "", credit_score: "", timeline: "", savings: "", procedure_detail: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  // Capture UTM params from URL so Clara knows which Meta adset sent this lead
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
    if (!form.phone) { setErr("Please enter your phone number."); return; }
    setSubmitting(true); setErr("");
    try {
      const res = await fetch(`${BACKEND}/public/${tenantId}/lead`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...utmParams }),  // UTMs ride along with form data
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        // Meta pixel Lead event
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead', {
            content_name: 'Dental Inquiry',
            content_category: 'Full Arch Implants',
          });
        }
        // Google conversion event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'contact_form',
            event_label: 'landing_page',
          });
        }
      } else {
        setErr("Something went wrong — please call us directly.");
      }
    } catch { setErr("Network error — please try again."); }
    finally { setSubmitting(false); }
  }

  if (done) return (
    <div style={{ background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.3)",
      borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>📞</div>
      <div style={{ fontWeight: 700, fontSize: 17, color: "#16a34a", marginBottom: 6 }}>We'll call you shortly!</div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
        A team member will reach out within minutes during business hours.
      </div>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {offer && (
        <div style={{ background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)",
          borderRadius: 10, padding: "10px 14px", marginBottom: 4 }}>
          <div style={{ color: A, fontWeight: 700, fontSize: 13 }}>🎁 {offer}</div>
          {offerDetail && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{offerDetail}</div>}
        </div>
      )}
      <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        placeholder="Your name" style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }} />
      <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
        placeholder="Phone number *" type="tel" required
        style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }} />
      {interestOptions.length > 1 && (
        <select value={form.interest} onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
          style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(20,30,45,0.95)", color: "#fff", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }}>
          {interestOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      <select value={form.credit_score} onChange={e => setForm(p => ({ ...p, credit_score: e.target.value }))}
        style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(20,30,45,0.95)", color: form.credit_score ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }}>
        <option value="" style={{ color: "rgba(255,255,255,0.45)" }}>What is your credit score range?</option>
        <option value="Excellent (750+)" style={{ color: "#fff" }}>Excellent (750+)</option>
        <option value="Good (650–749)" style={{ color: "#fff" }}>Good (650–749)</option>
        <option value="Fair (550–649)" style={{ color: "#fff" }}>Fair (550–649)</option>
        <option value="Below 550" style={{ color: "#fff" }}>Below 550</option>
        <option value="Not sure" style={{ color: "#fff" }}>Not sure</option>
      </select>
      <select value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}
        style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(20,30,45,0.95)", color: form.timeline ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }}>
        <option value="" style={{ color: "rgba(255,255,255,0.45)" }}>When are you looking to get started?</option>
        <option value="As soon as possible" style={{ color: "#fff" }}>As soon as possible</option>
        <option value="Within 1–3 months" style={{ color: "#fff" }}>Within 1–3 months</option>
        <option value="Within 3–6 months" style={{ color: "#fff" }}>Within 3–6 months</option>
        <option value="6+ months from now" style={{ color: "#fff" }}>6+ months from now</option>
      </select>
      <select value={form.savings} onChange={e => setForm(p => ({ ...p, savings: e.target.value }))}
        style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(20,30,45,0.95)", color: form.savings ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }}>
        <option value="" style={{ color: "rgba(255,255,255,0.45)" }}>Do you have savings set aside?</option>
        <option value="Yes, I have funds ready" style={{ color: "#fff" }}>Yes, I have funds ready</option>
        <option value="I'll need financing" style={{ color: "#fff" }}>I&apos;ll need financing</option>
        <option value="Not sure yet" style={{ color: "#fff" }}>Not sure yet</option>
      </select>
      {(focus === "implants") && (
        <input value={form.procedure_detail} onChange={e => setForm(p => ({ ...p, procedure_detail: e.target.value }))}
          placeholder="How many teeth are you missing?" type="number" min="1"
          style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }} />
      )}
      {(focus === "veneers" || focus === "cosmetic") && (
        <input value={form.procedure_detail} onChange={e => setForm(p => ({ ...p, procedure_detail: e.target.value }))}
          placeholder="How many veneers are you interested in?" type="number" min="1"
          style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }} />
      )}
      {err && <div style={{ color: "#f87171", fontSize: 13 }}>{err}</div>}
      <button type="submit" disabled={submitting}
        style={{ padding: "15px", borderRadius: 12, border: "none", background: P,
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
          opacity: submitting ? 0.7 : 1, letterSpacing: 0.3 }}>
        {submitting ? "Sending…" : "Get My Free Consultation →"}
      </button>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0, textAlign: "center" }}>
        No spam. We'll call you — not the other way around.
      </p>
    </form>
  );
}

const FAQS_IMPLANTS = [
  ["Am I a candidate for dental implants?", "Most adults with good general health are candidates. The best way to know is a free consultation — we'll do a 3D scan to assess your bone density and give you a definitive answer."],
  ["Does the procedure hurt?", "You'll be fully numb during the procedure. Most patients report the recovery is far easier than they expected — similar to a tooth extraction. We also offer sedation options for anxious patients."],
  ["How long does the process take?", "With our guided surgery system, the implant surgery itself takes 1-2 hours. We place a temporary tooth the same day. The final crown is placed several months later once the implant has integrated."],
  ["How much do implants cost?", "Single implants start as listed above. Full arch restorations vary based on case complexity. We'll give you an exact treatment plan and cost breakdown at your free consultation — no surprises."],
  ["Do you offer financing?", "Yes — we work with CareCredit and other financing partners to make monthly payments affordable. Many patients pay less per month than they spent on temporary solutions like dentures."],
];

const FAQS_COSMETIC = [
  ["How long do veneers last?", "Porcelain veneers typically last 15-20 years with proper care. We use high-quality materials and design each veneer digitally for a perfect fit."],
  ["Will my teeth look fake?", "Not with our approach. We use digital smile design to plan every case and match the exact shade, shape, and translucency of natural teeth. Patients tell us people notice they look great — not that they've had work done."],
  ["Is the process painful?", "Veneer placement is minimally invasive. Most patients have little to no discomfort. We use local anesthesia for any preparation required."],
  ["How long does a smile makeover take?", "Most veneer cases take 2-3 appointments over 2-3 weeks. Same-day cases using our milling unit can be done in a single visit."],
  ["What's the difference between veneers and bonding?", "Veneers are thin porcelain shells — more durable, stain-resistant, and natural-looking. Bonding uses composite resin — more affordable and reversible, but less durable. We'll recommend the best option for your goals."],
];

export default function LandingPage() {
  const params = useParams();
  const slug = params?.slug as string || "";
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [marketingDiffs, setMarketingDiffs] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BACKEND}/public/landing/${slug}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then(d => { if (d?.ok) setContent(d.content); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Inject per-tenant tracking pixels once content loads
  useEffect(() => {
    if (!content) return;
    const c = content as any;

    // Meta Pixel
    if (c.meta_pixel_id) {
      const script = document.createElement('script');
      script.innerHTML = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${c.meta_pixel_id}');
fbq('track', 'PageView');`;
      document.head.appendChild(script);
    }

    // Google Tag (GA4 or GTM gtag)
    if (c.google_tag_id) {
      const gtagJs = document.createElement('script');
      gtagJs.async = true;
      gtagJs.src = `https://www.googletagmanager.com/gtag/js?id=${c.google_tag_id}`;
      document.head.appendChild(gtagJs);

      const gtagConfig = document.createElement('script');
      gtagConfig.innerHTML = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${c.google_tag_id}');`;
      document.head.appendChild(gtagConfig);
    }
  }, [content]);

  // Fetch practice-level marketing config (BUILD 2 & 4)
  useEffect(() => {
    if (!slug) return;
    fetch(`${BACKEND}/marketing/config/public?tenant_id=${encodeURIComponent(slug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        // BUILD 4: if exactly one procedure configured, redirect to procedure page
        if (Array.isArray(d.procedures) && d.procedures.length === 1 && d.procedures[0]?.slug) {
          router.replace(`/p/${slug}/${d.procedures[0].slug}`);
          return;
        }
        // BUILD 2: store practice differentiators for display
        if (d.practice_differentiators) {
          setMarketingDiffs(d.practice_differentiators);
        }
      })
      .catch(() => { /* silent — backend endpoint may not be live yet */ });
  }, [slug, router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 15 }}>Loading…</div>
    </div>
  );

  if (notFound || !content) return (
    <div style={{ minHeight: "100vh", background: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🦷</div>
        <h1>Page not found</h1>
        <a href="https://iamclara.ai" style={{ color: "#2DD4BF" }}>Powered by Clara</a>
      </div>
    </div>
  );

  const c = content;
  const theme = THEMES[c.theme] || THEMES.teal;
  const P = theme.primary;   // primary color
  const A = theme.accent;    // accent color
  const dr = c.doctor || {};
  const pricing = c.pricing || {};
  const stats = c.stats || {};
  const diffs: string[] = c.differentiators || [];
  const videoTestimonials: any[] = (c.testimonials || []).filter((t: any) => t.video_url);
  const textReviews: any[] = (c.text_reviews || c.testimonials || []).filter((t: any) => t.result && t.patient_name);
  const beforeAfters: { before: string; after: string; label?: string }[] =
    (c.before_afters || []).filter((b: any) => b?.before || b?.after || typeof b === "string").map((b: any) =>
      typeof b === "string" ? { before: b, after: b } : b
    );
  const focus = c.priority_cases || "both";
  const faqs = focus === "cosmetic" ? FAQS_COSMETIC : FAQS_IMPLANTS;

  const headline = c.headline || (
    focus === "implants" ? "Get a Complete Smile in One Day" :
    focus === "cosmetic" ? "Your Dream Smile Is Closer Than You Think" :
    "Expert Dental Care. Real Results. Same Day."
  );
  const subheadline = focus === "implants"
    ? "Guided implant surgery. Temporary teeth placed the same day. No long waits, no multiple surgeries."
    : focus === "cosmetic"
    ? "Custom veneers and smile makeovers designed digitally, placed beautifully. See your new smile before we start."
    : "From implants to smile makeovers — advanced, same-day dentistry that fits your life.";

  const interestOptions = focus === "implants"
    ? ["Dental Implants", "Full Arch Implants (All-on-4)", "Not sure — I'd like a consultation"]
    : focus === "cosmetic"
    ? ["Veneers", "Smile Makeover", "Teeth Whitening", "Not sure — I'd like a consultation"]
    : ["Dental Implants", "Veneers / Cosmetics", "Not sure — I'd like a consultation"];

  const pricingItems = [
    focus !== "cosmetic" && pricing.implant_consult && { label: "Consultation", price: pricing.implant_consult, note: "Includes 3D scan" },
    focus !== "cosmetic" && pricing.full_arch && { label: "Full Arch (All-on-4)", price: `From ${pricing.full_arch}`, note: "Temp teeth same day + final teeth included" },
    focus !== "cosmetic" && pricing.single_implant && { label: "Single Implant", price: `From ${pricing.single_implant}`, note: "Implant + abutment + crown" },
    focus !== "implants" && pricing.veneer_per_tooth && { label: "Porcelain Veneer", price: `From ${pricing.veneer_per_tooth}`, note: "Per tooth" },
    focus !== "implants" && pricing.smile_makeover && { label: "Smile Makeover", price: `From ${pricing.smile_makeover}`, note: "Custom full-mouth design" },
  ].filter(Boolean) as { label: string; price: string; note: string }[];

  const statItems = [
    stats.implants_placed && { value: stats.implants_placed, label: focus === "cosmetic" ? "Smile Makeovers" : "Implants Placed" },
    stats.years_practice && { value: String(stats.years_practice).includes("+") || isNaN(Number(stats.years_practice)) ? `${stats.years_practice} yrs` : `${stats.years_practice}yrs`, label: "In Practice" },
    { value: "★ 5.0", label: "Patient Rating" },
    stats.custom_stat_value && stats.custom_stat_label && { value: stats.custom_stat_value, label: stats.custom_stat_label },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#fff" }}>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(${theme.hero})`,
        padding: "0 20px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Nav */}
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", padding: "20px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{c.practice_name}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Powered by Clara AI</div>
          </div>
          <button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "10px 20px", borderRadius: 50, border: "none", background: P,
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Free Consultation
          </button>
        </div>

        {/* Hero content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", flex: 1,
          display: "flex", alignItems: "center", gap: 60, padding: "40px 0 60px",
          flexWrap: "wrap" }}>

          {/* Left: copy */}
          <div style={{ flex: "1 1 420px" }}>
            <div style={{ display: "inline-block", background: "rgba(13,148,136,0.2)",
              border: "1px solid rgba(13,148,136,0.4)", borderRadius: 20,
              padding: "4px 14px", fontSize: 12, color: A, fontWeight: 700,
              marginBottom: 20, letterSpacing: 1 }}>
              {c.practice_name?.toUpperCase()} · ACCEPTING NEW PATIENTS
            </div>

            <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900,
              lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1 }}>
              {headline}
            </h1>

            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 18, lineHeight: 1.6,
              margin: "0 0 28px", maxWidth: 500 }}>
              {subheadline}
            </p>

            {/* Hero Before/After — stacked layout so teeth show full width */}
            {beforeAfters.length > 0 && (
              <div style={{ marginBottom: 32, borderRadius: 16, overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)", maxWidth: 500 }}>
                {/* AFTER on top — show the result first */}
                <div style={{ position: "relative" }}>
                  <img src={beforeAfters[0].after} alt="After"
                    style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "center top" }} />
                  <div style={{ position: "absolute", top: 10, left: 10,
                    background: P, color: "#fff", fontSize: 12,
                    fontWeight: 800, padding: "4px 12px", borderRadius: 4,
                    letterSpacing: 1, textTransform: "uppercase" }}>
                    After
                  </div>
                </div>
                <div style={{ height: 3, background: "#fff" }} />
                {/* BEFORE below */}
                <div style={{ position: "relative" }}>
                  <img src={beforeAfters[0].before} alt="Before"
                    style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "center top" }} />
                  <div style={{ position: "absolute", top: 10, left: 10,
                    background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 12,
                    fontWeight: 800, padding: "4px 12px", borderRadius: 4,
                    letterSpacing: 1, textTransform: "uppercase" }}>
                    Before
                  </div>
                </div>
                {beforeAfters[0].label && (
                  <div style={{ background: "rgba(0,0,0,0.6)", padding: "8px 14px",
                    fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center",
                    letterSpacing: 0.5 }}>
                    ✓ {beforeAfters[0].label} · Real Patient · Dr. {dr.name || "Siddiqui"}
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            {statItems.length > 0 && (
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 32 }}>
                {statItems.map(s => (
                  <div key={s.label}>
                    <div style={{ color: A, fontWeight: 800, fontSize: 22 }}>{s.value}</div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Smile Simulator CTA */}
            <a href={`https://app.iamclara.ai/smile/${slug}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: 50, padding: "14px 28px", textDecoration: "none",
                color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 20,
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
              ✨ Preview Your New Smile — Free
            </a>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {["📞 Call back in minutes", "🔒 No obligation", "🆓 Free consultation"].map(b => (
                <div key={b} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20,
                  padding: "6px 14px", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div ref={formRef} style={{ flex: "0 1 380px", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 28,
            backdropFilter: "blur(10px)" }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>
              Get Your Free Consultation
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 20px" }}>
              Takes 10 seconds. We'll call you.
            </p>
            <LeadForm tenantId={slug} offer={c.cta_offer} offerDetail={c.cta_offer_detail} interestOptions={interestOptions} focus={focus} primary={P} accent={A} />
          </div>
        </div>
      </section>

      {/* ── PRACTICE DIFFERENTIATORS (from marketing config) ── */}
      {marketingDiffs && (
        <section style={{ padding: "48px 20px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 16 }}>
              WHY {c.practice_name?.toUpperCase()}
            </div>
            <p style={{ color: "#374151", fontSize: 17, lineHeight: 1.8, margin: "0 auto", maxWidth: 680 }}>
              {marketingDiffs}
            </p>
          </div>
        </section>
      )}

      {/* ── OFFER BANNER ── */}
      {c.cta_offer && (
        <div style={{ background: P, padding: "16px 20px", textAlign: "center" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            🎁 {c.cta_offer}
          </span>
          {c.cta_offer_detail && (
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginLeft: 12 }}>
              {c.cta_offer_detail}
            </span>
          )}
        </div>
      )}

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>THE PROCESS</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, margin: 0, color: "#0a1628" }}>
              Simple. Fast. Permanent.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 32 }}>
            {(focus === "cosmetic" ? [
              { n: "01", title: "Free Smile Assessment", desc: "We scan, photograph, and digitally design your new smile. You see exactly what you'll look like before any treatment begins." },
              { n: "02", title: "Custom Design & Approval", desc: "We design each veneer using Exocad and present you with a preview. You approve every detail — shade, shape, length." },
              { n: "03", title: "Beautiful Results", desc: "Placement is gentle and precise. Walk out with a completely transformed smile, often in just one or two appointments." },
            ] : [
              { n: "01", title: "Free Consultation + 3D Scan", desc: "We assess your bone, map your anatomy in 3D, and build a complete treatment plan. You'll know exactly what to expect — and the cost — before anything begins." },
              { n: "02", title: "Same-Day Guided Surgery", desc: "Our xNav navigation system guides every implant to the exact position planned in your 3D scan. Precise, predictable, and comfortable." },
              { n: "03", title: "Leave with Teeth", desc: "Temporary teeth are placed the same day. You walk out smiling. The final, permanent crown follows after healing." },
            ]).map(s => (
              <div key={s.n} style={{ textAlign: "center", padding: "0 16px" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e6f9f7",
                  color: P, fontWeight: 900, fontSize: 18, display: "flex",
                  alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px", color: "#0a1628" }}>{s.title}</h3>
                <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCTOR ── */}
      {(dr.full_name || dr.intro_video_url) && (
        <section style={{ padding: "80px 20px", background: "#f8fafc" }}>
          <div style={{ maxWidth: 960, margin: "0 auto",
            display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 400px" }}>
              <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>
                MEET YOUR DOCTOR
              </div>
              <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, margin: "0 0 8px", color: "#0a1628" }}>
                {dr.full_name}
              </h2>
              {dr.credentials && (
                <div style={{ color: P, fontWeight: 600, marginBottom: 20, fontSize: 15 }}>{dr.credentials}</div>
              )}
              {dr.bio && (
                <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.8, margin: "0 0 24px" }}>{dr.bio}</p>
              )}
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {dr.years_experience && (
                  <div><div style={{ fontWeight: 800, fontSize: 28, color: "#0a1628" }}>{dr.years_experience}yr{parseInt(dr.years_experience) > 1 ? "s" : ""}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>Experience</div></div>
                )}
                {dr.cases_completed && (
                  <div><div style={{ fontWeight: 800, fontSize: 28, color: "#0a1628" }}>{dr.cases_completed}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>Cases</div></div>
                )}
              </div>
            </div>
            {dr.intro_video_url && ytEmbed(dr.intro_video_url) && (
              <div style={{ flex: "0 1 460px" }}>
                <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                  <iframe src={ytEmbed(dr.intro_video_url)} style={{ position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── PRICING ── */}
      {pricingItems.length > 0 && (
        <section style={{ padding: "80px 20px", background: "#0a1628" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ color: A, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>TRANSPARENT PRICING</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
                No hidden fees. No surprises.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, margin: 0 }}>
                We believe you deserve to know the cost before you come in.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
              {pricingItems.map(p => (
                <div key={p.label} style={{ background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8 }}>{p.label}</div>
                  <div style={{ color: A, fontWeight: 800, fontSize: 26, marginBottom: 6 }}>{p.price}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{p.note}</div>
                </div>
              ))}
            </div>
            {pricing.financing === "yes" && (
              <div style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.3)",
                borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                <span style={{ color: A, fontWeight: 700 }}>💳 Financing available</span>
                <span style={{ color: "rgba(255,255,255,0.5)", marginLeft: 8, fontSize: 14 }}>
                  {pricing.financing_partners ? `through ${pricing.financing_partners}` : "— ask us about monthly payment plans"}
                </span>
              </div>
            )}
            {pricing.custom_pricing_note && (
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, textAlign: "center", marginTop: 16 }}>
                {pricing.custom_pricing_note}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── VIDEO TESTIMONIALS ── */}
      {videoTestimonials.length > 0 && (
        <section style={{ padding: "80px 20px", background: "#fff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>REAL PATIENTS. REAL RESULTS.</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#0a1628", margin: 0 }}>
                Hear from our patients
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {videoTestimonials.map((t: any, i: number) => (
                <div key={i} style={{ borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6" }}>
                  <div style={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe src={ytEmbed(t.video_url)} style={{ position: "absolute", top: 0, left: 0,
                      width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TEXT REVIEWS ── */}
      {textReviews.length > 0 && (
        <section style={{ padding: "80px 20px", background: "#f8fafc" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>PATIENT REVIEWS</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#0a1628", margin: 0 }}>
                ★★★★★ 5-Star Reviews
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {textReviews.map((t: any, i: number) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "28px 24px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ color: "#f59e0b", fontSize: 18, marginBottom: 14 }}>★★★★★</div>
                  <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, margin: "0 0 20px", fontStyle: "italic" }}>
                    "{t.result}"
                  </p>
                  <div style={{ fontWeight: 700, color: "#0a1628", fontSize: 14 }}>— {t.patient_name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BEFORE/AFTER ── */}
      {beforeAfters.length > 0 && (
        <section style={{ padding: "80px 20px", background: "#f8fafc" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>OUR WORK</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#0a1628", margin: 0 }}>
                Before &amp; After
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
              {beforeAfters.map((pair, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)", background: "#fff",
                  border: "1px solid #e5e7eb" }}>
                  {/* Stacked: After on top, Before below */}
                  <div style={{ position: "relative" }}>
                    <img src={pair.after} alt={`After ${i + 1}`}
                      style={{ width: "100%", objectFit: "cover", display: "block" }}
                      onError={e => (e.currentTarget.parentElement!.style.display = "none")} />
                    <div style={{ position: "absolute", top: 8, left: 8, background: P,
                      color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                      AFTER
                    </div>
                  </div>
                  <div style={{ height: 2, background: "#e5e7eb" }} />
                  <div style={{ position: "relative" }}>
                    <img src={pair.before} alt={`Before ${i + 1}`}
                      style={{ width: "100%", objectFit: "cover", display: "block" }}
                      onError={e => (e.currentTarget.parentElement!.style.display = "none")} />
                    <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.6)",
                      color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                      BEFORE
                    </div>
                  </div>
                  {pair.label && (
                    <div style={{ padding: "10px 14px", fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                      {pair.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DIFFERENTIATORS ── */}
      {diffs.length > 0 && (
        <section style={{ padding: "60px 20px", background: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 28 }}>
              WHY {c.practice_name?.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {diffs.map(d => (
                <div key={d} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 20, padding: "8px 18px", fontSize: 14, color: "#166534", fontWeight: 600 }}>
                  ✓ {d}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 20px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: P, fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#0a1628", margin: 0 }}>
              Questions we hear every day
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {faqs.map(([q, a], i) => (
              <FaqItem key={i} q={q} a={a} primary={P} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(${theme.hero})` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, margin: "0 0 16px" }}>
            Ready to get started?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, margin: "0 0 40px", lineHeight: 1.6 }}>
            Your free consultation takes about an hour. We'll give you a complete treatment plan and exact pricing — no pressure, no surprises.
          </p>
          <LeadForm tenantId={slug} offer={c.cta_offer} offerDetail={c.cta_offer_detail} interestOptions={interestOptions} focus={focus} primary={P} accent={A} />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#060e1a", padding: "24px 20px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          © {new Date().getFullYear()} {c.practice_name} · Powered by{" "}
          <a href="https://iamclara.ai" style={{ color: A, textDecoration: "none" }}>Clara AI</a>
          {" "}·{" "}
          <a href="https://iamclara.ai/privacy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Privacy</a>
        </div>
      </footer>

      {/* Clara live chat widget */}
      <ClaraChat
        tenantId={c.tenant_id || slug}
        practiceName={c.practice_name || "our practice"}
        primaryColor={P}
        accentColor={A}
      />
    </div>
  );
}

function FaqItem({ q, a, primary = "#0d9488" }: { q: string; a: string; primary?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", textAlign: "left", padding: "20px 0", background: "none",
          border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#0a1628", lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: primary, fontSize: 20, flexShrink: 0 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.8, paddingBottom: 20 }}>{a}</div>
      )}
    </div>
  );
}
