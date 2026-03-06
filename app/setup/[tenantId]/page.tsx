"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";

const DIFFERENTIATORS = [
  "Same-day teeth (guided surgery)", "CBCT / 3D imaging on-site",
  "Guided implant surgery (navigation system)", "In-house dental lab",
  "3D printing in-house", "Milling unit (same-day crowns/veneers)",
  "IV sedation available", "Oral sedation available",
  "Digital smile design", "Intraoral scanner",
  "Exocad case design", "No-wait appointments",
  "Evening / weekend hours", "Bilingual staff",
  "Accepts most PPO plans", "Lifetime warranty on implants",
];

const COLOR_THEMES = [
  { id: "teal",   name: "Teal",     primary: "#0d9488", accent: "#2DD4BF", hero: "135deg, #0a1628 0%, #0d2240 60%, #0f3460 100%" },
  { id: "navy",   name: "Navy",     primary: "#1d4ed8", accent: "#60a5fa", hero: "135deg, #0a0f1e 0%, #0f1f4a 60%, #1a3070 100%" },
  { id: "purple", name: "Purple",   primary: "#7c3aed", accent: "#a78bfa", hero: "135deg, #0f0a1e 0%, #1e0f3a 60%, #2d1060 100%" },
  { id: "green",  name: "Forest",   primary: "#15803d", accent: "#4ade80", hero: "135deg, #0a1a0f 0%, #0f2d1a 60%, #16402a 100%" },
  { id: "slate",  name: "Slate",    primary: "#475569", accent: "#94a3b8", hero: "135deg, #0f1117 0%, #1a1f2e 60%, #252b3b 100%" },
];

const FINANCING_OPTIONS = [
  "CareCredit", "Cherry", "Proceed Finance", "Alphaeon",
  "LendingClub", "Sunbit", "Lending USA", "In-house payment plan",
];

const PACKAGE_INCLUSIONS = [
  "Extractions included", "Oral sedation included",
  "IV sedation included", "Provisional (temporary) arch same day",
  "Final zirconia arch included", "3-year warranty",
  "Lifetime warranty", "Free CT scan / 3D imaging",
  "Free consultation", "Abutments included",
];

const inp = {
  width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 15,
  border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
  color: "#fff", boxSizing: "border-box" as const, outline: "none",
};
const label = { display: "block" as const, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, marginBottom: 6 };
const sh = { color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 6px" };
const sub = { color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 28px", lineHeight: 1.5 };

export default function SetupPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string || "";

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — Procedures & Pricing
  const [pricing, setPricing] = useState({
    implant_consult: "Free",
    single_implant: "",
    full_arch: "",
    veneer_per_tooth: "",
    smile_makeover: "",
    financing: "yes",
    financing_partners: "CareCredit, Alphaeon",
    custom_pricing_note: "",
  });

  // Step 2 — Doctor
  const [doctor, setDoctor] = useState({
    full_name: "", credentials: "", years_experience: "",
    cases_completed: "", bio: "", intro_video_url: "",
    photo_url: "",
  });

  // Step 3 — Testimonials
  const [testimonials, setTestimonials] = useState([
    { video_url: "", patient_name: "", result: "" },
    { video_url: "", patient_name: "", result: "" },
    { video_url: "", patient_name: "", result: "" },
  ]);

  // Step 5 — Social Media
  const [social, setSocial] = useState({
    instagram: "",
    facebook_page: "",
    tiktok: "",
    google_business: "",
    photo_contact_email: "",
    posting_approval: "review",
    posting_frequency: "3x",
  });

  // Step 4 — Differentiators, before/afters, stats, CTA
  const [selectedTheme, setSelectedTheme] = useState("teal");
  const [selectedDiffs, setSelectedDiffs] = useState<string[]>([]);
  const [selectedFinancing, setSelectedFinancing] = useState<string[]>([]);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const [beforeAfters, setBeforeAfters] = useState(["", "", ""]);
  const [stats, setStats] = useState({ implants_placed: "", years_practice: "", custom_stat_label: "", custom_stat_value: "" });
  const [cta, setCta] = useState({ offer: "", offer_detail: "", priority_cases: "both" });
  const [practiceInfo, setPracticeInfo] = useState({ practice_name: "", headline: "" });

  const TOTAL = 6;

  function toggleDiff(d: string) {
    setSelectedDiffs(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  }
  function toggleFinancing(f: string) {
    setSelectedFinancing(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);
  }
  function toggleInclusion(i: string) {
    setSelectedInclusions(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  }

  function setTestField(i: number, field: string, val: string) {
    setTestimonials(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    const payload = {
      practice_name: practiceInfo.practice_name,
      headline: practiceInfo.headline,
      priority_cases: cta.priority_cases,
      pricing: {
        ...pricing,
        financing_partners: selectedFinancing.join(", ") || pricing.financing_partners,
        package_inclusions: selectedInclusions,
      },
      doctor,
      testimonials: testimonials.filter(t => t.video_url || t.patient_name),
      differentiators: selectedDiffs,
      before_afters: beforeAfters.filter(Boolean),
      stats,
      cta_offer: cta.offer,
      cta_offer_detail: cta.offer_detail,
      theme: selectedTheme,
      social,
    };
    try {
      const res = await fetch(`${BACKEND}/public/setup/${tenantId}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) setSubmitted(true);
      else setError(data.message || "Submission failed");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return (
    <div style={{ minHeight: "100vh", background: "#0F1923", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#1C2A38", borderRadius: 24, padding: 48, maxWidth: 480, textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ color: "#fff", fontSize: 28, marginBottom: 12 }}>You're all set!</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 24 }}>
          Your landing page content has been submitted. We'll have your page live within 24 hours and send you the link.
        </p>
        <a href="https://app.iamclara.ai" style={{ display: "inline-block", background: "#14B8A6", color: "#fff", padding: "12px 28px", borderRadius: 50, fontWeight: 600, textDecoration: "none" }}>
          Go to Dashboard
        </a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0F1923", padding: "24px 16px 80px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Clara<span style={{ color: "#2DD4BF" }}>.</span></span>
          </a>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginTop: 16, marginBottom: 4 }}>Build Your Landing Page</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Takes about 10 minutes. This powers your Clara ads funnel.</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4,
              background: step > i + 1 ? "#2DD4BF" : step === i + 1 ? "#2DD4BF" : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28 }}>

          {/* ── Step 1: Practice & Pricing ── */}
          {step === 1 && (
            <>
              <h2 style={sh}>Practice & Pricing</h2>
              <p style={sub}>Transparent pricing is one of the biggest conversion drivers in dental. We'll display starting prices to attract qualified leads.</p>

              <label style={label}>Practice name<input value={practiceInfo.practice_name} onChange={e => setPracticeInfo(p => ({ ...p, practice_name: e.target.value }))} placeholder="Radiant Dental Care" style={inp} /></label>

              <label style={{ ...label, marginTop: 16 }}>
                What are you primarily marketing? <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(shapes the whole page)</span>
              </label>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {(["implants", "cosmetic", "both"] as const).map(v => (
                  <div key={v} onClick={() => setCta(p => ({ ...p, priority_cases: v }))}
                    style={{ flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                      border: cta.priority_cases === v ? "1px solid rgba(45,212,191,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      background: cta.priority_cases === v ? "rgba(45,212,191,0.1)" : "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{v === "implants" ? "🦷" : v === "cosmetic" ? "✨" : "🎯"}</div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{v === "both" ? "Both" : v === "implants" ? "Implants" : "Cosmetics"}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  ["Implant consultation", "implant_consult", "Free"],
                  ["Single implant (starting)", "single_implant", "e.g. $3,500"],
                  ["Full arch / All-on-4 (starting)", "full_arch", "e.g. $21,000"],
                  ["Veneer (per tooth)", "veneer_per_tooth", "e.g. $1,800"],
                  ["Smile makeover (starting)", "smile_makeover", "e.g. $8,000"],
                ].map(([lbl, key, ph]) => (
                  <label key={key} style={label}>
                    {lbl}
                    <input value={(pricing as any)[key]} onChange={e => setPricing(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={ph} style={inp} />
                  </label>
                ))}
              </div>

              <label style={{ ...label, marginTop: 20 }}>
                Financing available?
                <select value={pricing.financing} onChange={e => setPricing(p => ({ ...p, financing: e.target.value }))} style={{ ...inp, marginTop: 4 }}>
                  <option value="yes">Yes — we offer patient financing</option>
                  <option value="no">No — payment at time of service</option>
                </select>
              </label>
              {pricing.financing === "yes" && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ ...label, marginBottom: 10 }}>Which financing partners do you use?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {FINANCING_OPTIONS.map(f => (
                      <div key={f} onClick={() => toggleFinancing(f)} style={{
                        padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 500,
                        border: selectedFinancing.includes(f) ? "1px solid rgba(45,212,191,0.5)" : "1px solid rgba(255,255,255,0.1)",
                        background: selectedFinancing.includes(f) ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.03)",
                        color: selectedFinancing.includes(f) ? "#2DD4BF" : "rgba(255,255,255,0.6)",
                      }}>{selectedFinancing.includes(f) ? "✓ " : ""}{f}</div>
                    ))}
                  </div>
                  <input value={pricing.financing_partners}
                    onChange={e => setPricing(p => ({ ...p, financing_partners: e.target.value }))}
                    placeholder="Other (type here)" style={{ ...inp, marginTop: 10 }} />
                </div>
              )}

              <div style={{ marginTop: 24 }}>
                <div style={{ ...label, marginBottom: 6 }}>What's included in your full arch package?</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 12, marginTop: 0 }}>
                  Check everything that's included. This builds patient confidence and eliminates sticker shock.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PACKAGE_INCLUSIONS.map(item => (
                    <div key={item} onClick={() => toggleInclusion(item)} style={{
                      padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 500,
                      border: selectedInclusions.includes(item) ? "1px solid rgba(45,212,191,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      background: selectedInclusions.includes(item) ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.03)",
                      color: selectedInclusions.includes(item) ? "#2DD4BF" : "rgba(255,255,255,0.6)",
                    }}>{selectedInclusions.includes(item) ? "✓ " : ""}{item}</div>
                  ))}
                </div>
              </div>

              <label style={{ ...label, marginTop: 20 }}>
                Any pricing notes to show patients? <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(optional)</span>
                <input value={pricing.custom_pricing_note} onChange={e => setPricing(p => ({ ...p, custom_pricing_note: e.target.value }))}
                  placeholder="e.g. Price includes final zirconia. Save $4,000 vs. standard rates. Limited time." style={{ ...inp, marginTop: 4 }} />
              </label>
            </>
          )}

          {/* ── Step 2: Doctor Info ── */}
          {step === 2 && (
            <>
              <h2 style={sh}>About the Doctor</h2>
              <p style={sub}>Patients choose their dentist based on trust. A strong doctor section — especially a personal video — dramatically increases conversions.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={label}>Full name<input value={doctor.full_name} onChange={e => setDoctor(p => ({ ...p, full_name: e.target.value }))} placeholder="Dr. Jay Siddiqui" style={inp} /></label>
                <label style={label}>Credentials<input value={doctor.credentials} onChange={e => setDoctor(p => ({ ...p, credentials: e.target.value }))} placeholder="DDS, FICOI, FAGD" style={inp} /></label>
                <label style={label}>Years in practice<input value={doctor.years_experience} onChange={e => setDoctor(p => ({ ...p, years_experience: e.target.value }))} placeholder="12" style={inp} /></label>
                <label style={label}>Cases completed<input value={doctor.cases_completed} onChange={e => setDoctor(p => ({ ...p, cases_completed: e.target.value }))} placeholder="500+" style={inp} /></label>
              </div>

              <label style={{ ...label, marginTop: 16 }}>
                Doctor bio <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(2-3 sentences — personal, not corporate)</span>
                <textarea value={doctor.bio} onChange={e => setDoctor(p => ({ ...p, bio: e.target.value }))}
                  placeholder="I've been placing implants for 12 years and I've seen firsthand how a complete smile changes someone's life. My goal is to make that transformation accessible and comfortable for every patient..."
                  rows={4} style={{ ...inp, resize: "vertical" as const, lineHeight: 1.6, marginTop: 4 }} />
              </label>

              <label style={{ ...label, marginTop: 16 }}>
                Doctor intro video (YouTube URL) <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(highly recommended — 30-90 sec talking to the camera)</span>
                <input value={doctor.intro_video_url} onChange={e => setDoctor(p => ({ ...p, intro_video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..." style={{ ...inp, marginTop: 4 }} />
              </label>

              <label style={{ ...label, marginTop: 16 }}>
                Doctor photo URL <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(optional — professional headshot)</span>
                <input value={doctor.photo_url} onChange={e => setDoctor(p => ({ ...p, photo_url: e.target.value }))}
                  placeholder="https://..." style={{ ...inp, marginTop: 4 }} />
              </label>

              <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, padding: 14, marginTop: 20 }}>
                <div style={{ color: "#2DD4BF", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💡 Video tip</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6 }}>
                  Record yourself on your phone for 60-90 seconds. Just talk naturally: why you do implants, what makes your approach different, and invite them to come in. No script needed — authenticity converts better than polish.
                </div>
              </div>
            </>
          )}

          {/* ── Step 3: Testimonials ── */}
          {step === 3 && (
            <>
              <h2 style={sh}>Patient Testimonials</h2>
              <p style={sub}>Video testimonials are the #1 conversion driver for high-ticket dental. At least 2 are required. Ask patients to record a 30-60 second video on their phone sharing their experience.</p>

              {testimonials.map((t, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ color: "#2DD4BF", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                    {i === 0 ? "★ Testimonial 1 (required)" : i === 1 ? "★ Testimonial 2 (required)" : "Testimonial 3 (optional)"}
                  </div>
                  <label style={label}>YouTube video URL<input value={t.video_url} onChange={e => setTestField(i, "video_url", e.target.value)} placeholder="https://youtube.com/watch?v=..." style={inp} /></label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    <label style={label}>Patient first name<input value={t.patient_name} onChange={e => setTestField(i, "patient_name", e.target.value)} placeholder="Maria" style={inp} /></label>
                    <label style={label}>One-line result<input value={t.result} onChange={e => setTestField(i, "result", e.target.value)} placeholder="Full arch implants, same day" style={inp} /></label>
                  </div>
                </div>
              ))}

              <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, padding: 14, marginTop: 8 }}>
                <div style={{ color: "#2DD4BF", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💡 Testimonial tip</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6 }}>
                  Ask patients: "What were you worried about before?" and "What would you tell someone considering this?" Upload to YouTube (can be unlisted) and paste the link here.
                </div>
              </div>
            </>
          )}

          {/* ── Step 4: Differentiators & CTA ── */}
          {step === 4 && (
            <>
              <h2 style={sh}>Page Style</h2>
              <p style={{ ...sub, marginBottom: 16 }}>Choose a color theme for your landing page.</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                {COLOR_THEMES.map(t => (
                  <div key={t.id} onClick={() => setSelectedTheme(t.id)}
                    style={{ cursor: "pointer", textAlign: "center", opacity: selectedTheme === t.id ? 1 : 0.6,
                      transition: "opacity 0.15s" }}>
                    <div style={{
                      width: 56, height: 40, borderRadius: 10, marginBottom: 6,
                      background: `linear-gradient(${t.hero})`,
                      border: selectedTheme === t.id ? `2px solid ${t.accent}` : "2px solid rgba(255,255,255,0.1)",
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{ position: "absolute", bottom: 6, left: 6, right: 6, height: 4,
                        borderRadius: 4, background: t.primary }} />
                    </div>
                    <div style={{ color: selectedTheme === t.id ? t.accent : "rgba(255,255,255,0.5)",
                      fontSize: 12, fontWeight: 600 }}>{t.name}</div>
                  </div>
                ))}
              </div>

              <h2 style={sh}>What Makes You Different</h2>
              <p style={sub}>Check everything that applies. These become trust badges on your landing page.</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                {DIFFERENTIATORS.map(d => (
                  <div key={d} onClick={() => toggleDiff(d)} style={{
                    padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 500,
                    border: selectedDiffs.includes(d) ? "1px solid rgba(45,212,191,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: selectedDiffs.includes(d) ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.03)",
                    color: selectedDiffs.includes(d) ? "#2DD4BF" : "rgba(255,255,255,0.6)",
                  }}>
                    {selectedDiffs.includes(d) ? "✓ " : ""}{d}
                  </div>
                ))}
              </div>

              <h2 style={{ ...sh, marginBottom: 6 }}>Your Numbers</h2>
              <p style={{ ...sub, marginBottom: 20 }}>Stats build credibility. Add what you can.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <label style={label}>Implants placed<input value={stats.implants_placed} onChange={e => setStats(p => ({ ...p, implants_placed: e.target.value }))} placeholder="500+" style={inp} /></label>
                <label style={label}>Years in practice<input value={stats.years_practice} onChange={e => setStats(p => ({ ...p, years_practice: e.target.value }))} placeholder="12" style={inp} /></label>
                <label style={label}>Custom stat label<input value={stats.custom_stat_label} onChange={e => setStats(p => ({ ...p, custom_stat_label: e.target.value }))} placeholder="5-star reviews" style={inp} /></label>
                <label style={label}>Custom stat value<input value={stats.custom_stat_value} onChange={e => setStats(p => ({ ...p, custom_stat_value: e.target.value }))} placeholder="200+" style={inp} /></label>
              </div>

              <h2 style={{ ...sh, marginBottom: 6 }}>Your Offer</h2>
              <p style={{ ...sub, marginBottom: 20 }}>The CTA offer is what gets people off the fence. Be specific and valuable.</p>
              <label style={label}>
                Offer headline <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(what they get for free)</span>
                <input value={cta.offer} onChange={e => setCta(p => ({ ...p, offer: e.target.value }))}
                  placeholder='e.g. "Free Implant Consultation + 3D Scan (Worth $350)"' style={{ ...inp, marginTop: 4 }} />
              </label>
              <label style={{ ...label, marginTop: 14 }}>
                Offer details <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(optional fine print)</span>
                <input value={cta.offer_detail} onChange={e => setCta(p => ({ ...p, offer_detail: e.target.value }))}
                  placeholder="Limited to 10 consultations per month. New patients only." style={{ ...inp, marginTop: 4 }} />
              </label>

              <h2 style={{ ...sh, marginTop: 24, marginBottom: 6 }}>Before/After Photos</h2>
              <p style={{ ...sub, marginBottom: 16 }}>Paste URLs of 3-5 before/after images (with patient permission).</p>
              {beforeAfters.map((url, i) => (
                <input key={i} value={url} onChange={e => setBeforeAfters(p => p.map((x, j) => j === i ? e.target.value : x))}
                  placeholder={`Before/after photo ${i + 1} URL`} style={{ ...inp, marginBottom: 10 }} />
              ))}
              <button onClick={() => setBeforeAfters(p => [...p, ""])}
                style={{ background: "none", border: "1px dashed rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)",
                  borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, marginBottom: 8 }}>
                + Add another
              </button>
            </>
          )}

          {/* ── Step 5: Social Media ── */}
          {step === 5 && (
            <>
              <h2 style={sh}>Social Media Setup</h2>
              <p style={sub}>Connect your social channels so Clara can post your content automatically.</p>

              <div style={{ background:"rgba(45,212,191,0.08)", border:"1px solid rgba(45,212,191,0.2)",
                             borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
                <div style={{ color:"#2DD4BF", fontWeight:700, fontSize:13, marginBottom:4 }}>📧 Your content submission email</div>
                <div style={{ color:"#fff", fontSize:14, fontWeight:600, marginBottom:4 }}>
                  {tenantId}@submit.iamclara.ai
                </div>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, lineHeight:1.5 }}>
                  Email photos here and Clara writes captions + posts automatically.
                </div>
              </div>

              {([
                ["Instagram handle", "instagram", "@yourpractice"],
                ["Facebook Page URL", "facebook_page", "https://facebook.com/yourpractice"],
                ["TikTok handle", "tiktok", "@yourpractice"],
                ["Google Business Profile URL", "google_business", "https://g.page/yourpractice"],
              ] as [string,string,string][]).map(([lbl, key, ph]) => (
                <label key={key} style={{ ...label, marginBottom: 14 }}>
                  {lbl} <span style={{color:"rgba(255,255,255,0.35)", fontWeight:400}}>(optional)</span>
                  <input value={(social as Record<string,string>)[key]}
                    onChange={e => setSocial(s => ({...s, [key]: e.target.value}))}
                    placeholder={ph} style={{...inp, marginTop:4}} />
                </label>
              ))}

              <label style={{ ...label, marginBottom: 14 }}>
                Sunday photo request email
                <span style={{display:"block", color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:400, marginBottom:4}}>
                  Who should Clara email each Sunday asking for photos/videos to post that week?
                </span>
                <input value={social.photo_contact_email}
                  onChange={e => setSocial(s => ({...s, photo_contact_email: e.target.value}))}
                  placeholder="office@yourpractice.com" style={inp} />
              </label>

              <div style={{ marginBottom: 16 }}>
                <div style={{ ...label, marginBottom: 10 }}>Posting approval workflow</div>
                <div style={{ display:"flex", gap:10 }}>
                  {([
                    ["review", "📋 Review first", "AI drafts → you approve in dashboard"],
                    ["auto",   "⚡ Auto-post",    "AI drafts and posts automatically"],
                  ] as [string,string,string][]).map(([val, title, desc]) => (
                    <div key={val} onClick={() => setSocial(s => ({...s, posting_approval: val}))}
                      style={{ flex:1, padding:"12px 14px", borderRadius:12, cursor:"pointer",
                        border: social.posting_approval === val ? "1px solid rgba(45,212,191,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        background: social.posting_approval === val ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.03)" }}>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:4 }}>{title}</div>
                      <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <label style={label}>
                Posting frequency
                <select value={social.posting_frequency} onChange={e => setSocial(s => ({...s, posting_frequency: e.target.value}))}
                  style={{...inp, marginTop:6}}>
                  <option value="daily">Daily (7x/week)</option>
                  <option value="4x">4x per week</option>
                  <option value="3x">3x per week (recommended)</option>
                  <option value="2x">2x per week</option>
                  <option value="1x">Once per week</option>
                </select>
              </label>
            </>
          )}

          {/* ── Step 6: Review ── */}
          {step === 6 && (
            <>
              <h2 style={sh}>Review & Submit</h2>
              <p style={sub}>Everything looks good? We'll build your landing page and send you the link within 24 hours.</p>

              {[
                ["Practice", practiceInfo.practice_name || "—"],
                ["Focus", cta.priority_cases],
                ["CTA Offer", cta.offer || "—"],
                ["Doctor", `${doctor.full_name}${doctor.credentials ? `, ${doctor.credentials}` : ""}` || "—"],
                ["Doctor video", doctor.intro_video_url ? "✓ Provided" : "Not provided"],
                ["Testimonials", `${testimonials.filter(t => t.video_url).length} video(s)`],
                ["Before/Afters", `${beforeAfters.filter(Boolean).length} photo(s)`],
                ["Differentiators", `${selectedDiffs.length} selected`],
                ["Instagram", social.instagram || "—"],
                ["Facebook", social.facebook_page || "—"],
                ["TikTok", social.tiktok || "—"],
                ["Posting", `${social.posting_frequency}/week · ${social.posting_approval === "auto" ? "auto-post" : "review first"}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{k}</span>
                  <span style={{ color: "#fff", fontWeight: 500 }}>{v}</span>
                </div>
              ))}

              {error && <div style={{ marginTop: 16, padding: 12, background: "rgba(220,38,38,0.1)", borderRadius: 8, color: "#f87171", fontSize: 13 }}>{error}</div>}
            </>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                style={{ padding: "12px 24px", borderRadius: 50, border: "1px solid rgba(255,255,255,0.15)",
                  background: "none", color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 500 }}>
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < TOTAL ? (
              <button onClick={() => setStep(s => s + 1)}
                style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: "#14B8A6",
                  color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 700 }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: "#14B8A6",
                  color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 700, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Submitting…" : "Submit & Build My Page →"}
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 24 }}>
          Step {step} of {TOTAL} · {tenantId}
        </p>
      </div>
    </div>
  );
}
