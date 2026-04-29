"use client"
import { useState, useEffect } from "react"

const TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "America/Phoenix", "America/Anchorage", "Pacific/Honolulu",
]

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

const SERVICES = [
  "Cleanings and exams","Emergency dentistry","Dental implants",
  "Full arch implants (All-on-4 / All-on-X)","Cosmetic dentistry","Veneers",
  "Teeth whitening","Crowns and bridges","Fillings / restorations","Extractions",
  "Root canal therapy","Orthodontics / clear aligners","Pediatric dentistry",
  "Periodontal treatment","Bone grafting","Same-day crowns","3D imaging / CBCT",
  "Sedation dentistry","Dentures","Night guards / TMJ",
]

const AD_BUDGETS = [
  "Under $500/month",
  "$500–$1,000/month",
  "$1,000–$2,500/month",
  "$2,500–$5,000/month",
  "$5,000+/month",
  "Not sure yet",
]

export default function GetStarted() {
  const [step, setStep] = useState(1)
  const [isPartner, setIsPartner] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setIsPartner(params.get("partner") === "true" || params.get("free") === "true")
      const planParam = params.get("plan")
      if (planParam && ["core", "growth", "pro", "founders"].includes(planParam)) {
        setInfo(prev => ({ ...prev, plan: planParam }))
      }
      const refParam = params.get("ref")
      if (refParam) {
        setInfo(prev => ({ ...prev, referral_code: refParam.toUpperCase() }))
      }
    }
  }, [])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [baaAccepted, setBaaAccepted] = useState(false)

  const [info, setInfo] = useState({
    practice_name: "", phone: "", address: "", timezone: "America/New_York",
    website: "", admin_name: "", admin_email: "", plan: "core",
    referral_code: "",
    voip_provider: "", rings_before_forward: "3",
    wants_calendar: "yes", wants_outbound: "no",
    priority_cases: "both",
    // Social media (Growth + Pro)
    instagram: "", facebook_page: "", tiktok: "", google_business: "",
    photo_contact_email: "",
    posting_approval: "review",     // "auto" | "review"
    posting_frequency: "3x",       // "daily" | "4x" | "3x" | "2x" | "1x"
    caption_style: "real_person",  // "real_person" | "expert"
    // A2P Compliance (Pro only)
    business_legal_name: "", ein: "", business_type: "",
    street_address: "", city: "", state: "", zip: "",
    compliance_contact_name: "", compliance_contact_email: "",
    // Ads (Pro only)
    ad_budget: "",
  })
  const [hours, setHours] = useState<Record<string,string>>({
    Monday:"", Tuesday:"", Wednesday:"", Thursday:"", Friday:"", Saturday:"Closed", Sunday:"Closed",
  })
  const [services, setServices] = useState<string[]>([])
  const [alertEmails, setAlertEmails] = useState([""])
  const [alertPhones, setAlertPhones] = useState([""])
  const [notes, setNotes] = useState("")

  const isPro = info.plan === "pro"
  const isGrowthOrPro = info.plan === "growth" || info.plan === "pro"

  const stepLabels = isPro
    ? ["Practice","Hours","Services","Alerts","Social Media","Compliance","Review"]
    : isGrowthOrPro
    ? ["Practice","Hours","Services","Alerts","Social Media","Compliance","Review"]
    : ["Practice","Hours","Services","Alerts","Review"]
  const totalSteps = stepLabels.length

  function toggleService(s: string) {
    setServices(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev,s])
  }

  // Map logical step to label (Growth inserts step 5 = Marketing)
  const canNext: Record<number,boolean> = {
    1: !!(info.practice_name && info.phone && info.address && info.admin_email && info.admin_name),
    2: true,
    3: services.length > 0,
    4: !!(alertEmails[0]),
    5: true,
    6: true,
    7: true,
  }

  async function submit() {
    setSubmitting(true)
    setError("")
    try {
      const payload = {
        practice_name: info.practice_name,
        admin_name: info.admin_name,
        admin_email: info.admin_email,
        phone: info.phone,
        plan: info.plan,
        referral_code: info.referral_code,
        baa_accepted: baaAccepted,
        baa_accepted_at: new Date().toISOString(),
        // Full practice data for rich provisioning
        full_data: { info, hours, services, alertEmails: alertEmails.filter(Boolean), alertPhones: alertPhones.filter(Boolean), notes },
      }
      const resp = await fetch(
        "https://mqxnyexmrk.us-east-1.awsapprunner.com/public/start-onboarding",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      )
      const data = await resp.json()
      if (!resp.ok || !data.ok) throw new Error(data.detail || data.error || "Submission failed")
      // Redirect to Stripe checkout
      window.location.href = data.checkout_url
    } catch(e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return (
    <div style={{ minHeight:"100vh", background:"#141E2B", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#1C2A38", borderRadius:24, padding:48, maxWidth:480, textAlign:"center", border:"1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h1 style={{ color:"#fff", fontSize:28, marginBottom:12 }}>You're all set!</h1>
        <p style={{ color:"rgba(255,255,255,0.6)", lineHeight:1.6, marginBottom:8 }}>
          We received your intake for <strong style={{color:"#fff"}}>{info.practice_name}</strong>.
          {isPartner
            ? " Jay will be in touch shortly to get Clara set up for your practice — no payment needed."
            : " Jay will reach out within 1 business day to get Clara configured for your practice."
          }
        </p>
        {!isPartner && (
          <>
            <p style={{ color:"rgba(255,255,255,0.35)", fontSize:13, marginBottom:24 }}>
              {info.plan === "pro" ? "Pro plan · $799/mo founding rate "
                : info.plan === "growth" ? "Growth plan · $399/mo founding rate "
                : "Core plan · $199/month"}
            </p>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, marginBottom:16 }}>
              Want to get started sooner? Complete payment now and we'll prioritize your setup.
            </p>
            <a href={`/get-started?plan=${info.plan}`}
              style={{ display:"block", background:"#14B8A6", color:"#fff", padding:"14px 28px",
                       borderRadius:50, fontWeight:700, textDecoration:"none", fontSize:16, marginBottom:16 }}>
              Continue to Payment →
            </a>
          </>
        )}
        {isPartner && (
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, marginTop:16, marginBottom:8 }}>
            Questions? Email <a href="mailto:jay@dental-on-demand.com" style={{color:"#14B8A6"}}>jay@dental-on-demand.com</a>
          </p>
        )}
        <a href="/" style={{ display:"inline-block", color:"rgba(255,255,255,0.35)", fontSize:13,
                              textDecoration:"none", marginTop: isPartner ? 8 : 0 }}>
          Back to iamclara.ai
        </a>
      </div>
    </div>
  )

  const isReviewStep = step === totalSteps

  return (
    <div style={{ minHeight:"100vh", background:"#141E2B", padding:"24px 16px 60px" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <a href="/" style={{ textDecoration:"none" }}>
          <span style={{ fontSize:24, fontWeight:700, color:"#fff" }}>Clara <span style={{color:"#2DD4BF"}}>AI</span></span>
        </a>
        <h1 style={{ color:"#fff", fontSize:26, fontWeight:700, marginTop:16, marginBottom:8 }}>Get Started</h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:15 }}>Tell us about your practice — takes about 5 minutes.</p>
      </div>

      {/* Step indicator */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:32, flexWrap:"wrap" }}>
        {stepLabels.map((label, i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:13, fontWeight:700,
                          background: step > i+1 ? "#14B8A6" : step === i+1 ? "#2DD4BF" : "rgba(255,255,255,0.1)",
                          color: step >= i+1 ? "#fff" : "rgba(255,255,255,0.3)" }}>
              {step > i+1 ? "✓" : i+1}
            </div>
            <span style={{ fontSize:10, color: step === i+1 ? "#2DD4BF" : "rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{ maxWidth:560, margin:"0 auto", background:"#1C2A38", borderRadius:20,
                    padding:"28px 24px", border:"1px solid rgba(255,255,255,0.08)" }}>

        {/* ── Step 1: Practice Info ── */}
        {step === 1 && (
          <>
            <h2 style={sh}>Practice Information</h2>
            {([
              ["Practice name", "practice_name", "Radiant Dental Care"],
              ["Main phone number", "phone", "(301) 652-2222"],
              ["Address / city, state", "address", "Chevy Chase, MD"],
              ["Website (optional)", "website", "https://yourpractice.com"],
              ["Contact name (owner / admin)", "admin_name", "Dr. Smith"],
              ["Admin email", "admin_email", "admin@yourpractice.com"],
            ] as [string,string,string][]).map(([label, key, ph]) => (
              <label key={key} style={labelStyle}>
                {label}
                <input value={(info as Record<string,string>)[key]}
                  onChange={e => setInfo({...info, [key]: e.target.value})}
                  placeholder={ph} style={inputStyle} />
              </label>
            ))}
            <label style={labelStyle}>Timezone
              <select value={info.timezone} onChange={e => setInfo({...info, timezone: e.target.value})} style={inputStyle}>
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g," ")}</option>)}
              </select>
            </label>

            {/* Plan selector */}
            <label style={labelStyle}>
              Plan
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:4 }}>
                {[
                  { val:"core",   name:"Core",   price:"$299/mo",             badge:"",          desc:"AI receptionist + dashboard" },
                  { val:"growth", name:"Growth", price:"$449/mo (intro price)",    badge:"",          desc:"Core + ads, social media, lead automation — rises to $549/mo after intro" },
                  { val:"pro",    name:"Pro",    price:"$449/mo (intro price)",    badge:"Legacy",    desc:"Pro tier retired — Growth is our full platform" },
                ].map(p => (
                  <div key={p.val} onClick={() => setInfo({...info, plan:p.val})}
                    style={{ cursor:"pointer", borderRadius:12, padding:"14px",
                              border: info.plan===p.val ? "2px solid #2DD4BF" : "2px solid rgba(255,255,255,0.1)",
                              background: info.plan===p.val ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.03)",
                              transition:"all .15s" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{p.name}</span>
                      {p.badge && (
                        <span style={{ background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.6)", fontSize:10, fontWeight:700,
                                        padding:"1px 7px", borderRadius:20 }}>{p.badge}</span>
                      )}
                    </div>
                    <div style={{ color:"#2DD4BF", fontSize:16, fontWeight:700, marginBottom:4 }}>{p.price}</div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, lineHeight:1.4 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
              {info.plan==="growth" && (
                <p style={{ marginTop:8, color:"rgba(45,212,191,0.8)", fontSize:12 }}>
                  Growth plan includes everything in Core plus ads, social media automation, and full lead management.
                </p>
              )}
            </label>

            {/* Referral code */}
            <label style={labelStyle}>
              Referral code <span style={{ color:"rgba(255,255,255,0.3)", fontWeight:400 }}>(optional)</span>
              <input
                value={info.referral_code}
                onChange={e => setInfo({ ...info, referral_code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) })}
                placeholder="e.g. A3B7XY12"
                maxLength={10}
                style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.1em" }}
              />
              {info.referral_code && (
                <p style={{ marginTop:4, color:"rgba(45,212,191,0.7)", fontSize:12 }}>
                  🎁 Referrer detected — you'll both get $50 off your subscription!
                </p>
              )}
            </label>
          </>
        )}

        {/* ── Step 2: Hours ── */}
        {step === 2 && (
          <>
            <h2 style={sh}>Business Hours</h2>
            <p style={subText}>Enter hours as "9:00am–5:00pm" or "Closed"</p>
            {DAYS.map(day => (
              <label key={day} style={labelStyle}>{day}
                <input value={hours[day] || ""}
                  onChange={e => setHours({...hours, [day]: e.target.value})}
                  placeholder={["Saturday","Sunday"].includes(day) ? "Closed" : "9:00am–5:00pm"}
                  style={inputStyle} />
              </label>
            ))}
            <label style={labelStyle}>Phone system / VoIP provider
              <input value={info.voip_provider}
                onChange={e => setInfo({...info, voip_provider: e.target.value})}
                placeholder="e.g. Mango, RingCentral, 8x8, AT&T, Vonage" style={inputStyle} />
            </label>
            <label style={labelStyle}>Rings before forwarding to Clara
              <select value={info.rings_before_forward}
                onChange={e => setInfo({...info, rings_before_forward: e.target.value})} style={inputStyle}>
                {["2","3","4","5"].map(n => <option key={n} value={n}>{n} rings (~{parseInt(n)*5} seconds)</option>)}
              </select>
            </label>
          </>
        )}

        {/* ── Step 3: Services ── */}
        {step === 3 && (
          <>
            <h2 style={sh}>Services Offered</h2>
            <p style={subText}>Clara mentions these when patients ask. Check everything you offer.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:8 }}>
              {SERVICES.map(s => (
                <label key={s} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer",
                                        background: services.includes(s) ? "rgba(45,212,191,0.1)" : "rgba(255,255,255,0.04)",
                                        borderRadius:8, padding:"10px 14px",
                                        border: services.includes(s) ? "1px solid rgba(45,212,191,0.3)" : "1px solid rgba(255,255,255,0.06)",
                                        transition:"all .15s" }}>
                  <input type="checkbox" checked={services.includes(s)} onChange={() => toggleService(s)}
                    style={{ width:16, height:16, accentColor:"#2DD4BF", cursor:"pointer", flexShrink:0 }} />
                  <span style={{ color: services.includes(s) ? "#fff" : "rgba(255,255,255,0.7)", fontSize:14 }}>{s}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {/* ── Step 4: Alerts & Features ── */}
        {step === 4 && (
          <>
            <h2 style={sh}>Alerts & Notifications</h2>
            <p style={subText}>Who should receive call alerts from Clara?</p>

            <div style={{ marginBottom:20 }}>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:13, fontWeight:600, marginBottom:8 }}>
                📧 Email recipients <span style={{color:"rgba(255,255,255,0.4)", fontWeight:400}}>(call summaries after every call)</span>
              </div>
              {alertEmails.map((e, i) => (
                <input key={i} value={e}
                  onChange={ev => { const a=[...alertEmails]; a[i]=ev.target.value; setAlertEmails(a) }}
                  placeholder="email@yourpractice.com" style={{...inputStyle, marginBottom:8}} />
              ))}
              <button onClick={() => setAlertEmails([...alertEmails,""])}
                style={{ background:"none", border:"1px dashed rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.5)",
                          borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:13 }}>
                + Add another email
              </button>
            </div>

            <div style={{ marginBottom:24 }}>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:13, fontWeight:600, marginBottom:8 }}>
                📱 SMS recipients <span style={{color:"rgba(255,255,255,0.4)", fontWeight:400}}>(urgent calls only — implants, emergencies)</span>
              </div>
              {alertPhones.map((p, i) => (
                <input key={i} value={p}
                  onChange={ev => { const a=[...alertPhones]; a[i]=ev.target.value; setAlertPhones(a) }}
                  placeholder="+13015551234" style={{...inputStyle, marginBottom:8}} />
              ))}
              <button onClick={() => setAlertPhones([...alertPhones,""])}
                style={{ background:"none", border:"1px dashed rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.5)",
                          borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:13 }}>
                + Add another number
              </button>
            </div>

            <h2 style={{...sh, marginTop:4}}>Features</h2>
            <label style={labelStyle}>
              📅 Appointment booking
              <select value={info.wants_calendar}
                onChange={e => setInfo({...info, wants_calendar: e.target.value})} style={inputStyle}>
                <option value="yes">Yes — connect my Google Calendar and book consultations</option>
                <option value="no">No — just take a message and alert staff</option>
              </select>
            </label>

            <h2 style={{...sh, marginTop:20}}>Priority Cases</h2>
            <p style={subText}>What high-value cases should Clara focus on for marketing and lead follow-up?</p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              {([
                ["implants", "🦷 Implants", "Full arch, single implants, guided surgery"],
                ["cosmetic",  "✨ Cosmetics", "Veneers, smile makeovers, whitening"],
                ["both",      "🎯 Both",      "Implants & cosmetics equally"],
              ] as [string, string, string][]).map(([val, label, desc]) => (
                <div key={val}
                  onClick={() => setInfo({...info, priority_cases: val})}
                  style={{
                    flex:"1 1 140px", padding:"14px 16px", borderRadius:12, cursor:"pointer",
                    border: info.priority_cases === val ? "1px solid rgba(45,212,191,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: info.priority_cases === val ? "rgba(45,212,191,0.1)" : "rgba(255,255,255,0.03)",
                    transition:"all 0.15s",
                  }}>
                  <div style={{ fontWeight:700, fontSize:15, color:"#fff", marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>{desc}</div>
                </div>
              ))}
            </div>

            <h2 style={{...sh, marginTop:4}}>Additional Notes</h2>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Special instructions, things Clara should avoid saying, language preferences, VIP patients, etc."
              rows={4} style={{...inputStyle, resize:"vertical", lineHeight:1.5}} />
          </>
        )}

        {/* ── Step 5: Social Media (Growth + Pro) ── */}
        {step === 5 && isGrowthOrPro && (
          <>
            <h2 style={sh}>Social Media Setup</h2>
            <p style={subText}>
              Clara will generate captions and post content to your connected channels.
              Add whatever you have — nothing is required to start.
            </p>

            <div style={{ background:"rgba(45,212,191,0.08)", border:"1px solid rgba(45,212,191,0.2)",
                           borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ color:"#2DD4BF", fontWeight:700, fontSize:13, marginBottom:4 }}>📧 Your content submission email</div>
              <div style={{ color:"#fff", fontSize:15, fontWeight:600, marginBottom:4 }}>
                {info.practice_name
                  ? `${info.practice_name.toLowerCase().replace(/[^a-z0-9]/g,"-").replace(/-+/g,"-")}@submit.iamclara.ai`
                  : "yourpractice@submit.iamclara.ai"}
              </div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, lineHeight:1.5 }}>
                Email photos to this address and Clara automatically writes captions and posts them.
              </div>
            </div>

            {([
              ["Instagram handle", "instagram", "@yourpractice"],
              ["Facebook Page URL", "facebook_page", "https://facebook.com/yourpractice"],
              ["TikTok handle", "tiktok", "@yourpractice"],
              ["Google Business Profile URL", "google_business", "https://g.page/yourpractice"],
            ] as [string,string,string][]).map(([lbl, key, ph]) => (
              <label key={key} style={labelStyle}>
                {lbl} <span style={{color:"rgba(255,255,255,0.35)", fontWeight:400}}>(optional)</span>
                <input value={(info as Record<string,string>)[key]}
                  onChange={e => setInfo({...info, [key]: e.target.value})}
                  placeholder={ph} style={inputStyle} />
              </label>
            ))}

            <label style={labelStyle}>
              Who should receive the Sunday photo request?
              <span style={{color:"rgba(255,255,255,0.4)", fontWeight:400, fontSize:12, display:"block", marginTop:2}}>
                Every Sunday, Clara emails this person asking for photos/videos to post that week.
              </span>
              <input value={info.photo_contact_email}
                onChange={e => setInfo({...info, photo_contact_email: e.target.value})}
                placeholder="office@yourpractice.com" style={{...inputStyle, marginTop:6}} />
            </label>

            <div style={{ marginBottom:16 }}>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, marginBottom:8 }}>
                Posting approval workflow
              </div>
              <div style={{ display:"flex", gap:10 }}>
                {([
                  ["review", "📋 Review first", "AI drafts captions → you approve in dashboard → Clara posts"],
                  ["auto",   "⚡ Auto-post",    "AI drafts and posts automatically — no approval needed"],
                ] as [string,string,string][]).map(([val, title, desc]) => (
                  <div key={val} onClick={() => setInfo({...info, posting_approval: val})}
                    style={{ flex:1, padding:"12px 14px", borderRadius:12, cursor:"pointer",
                      border: info.posting_approval === val ? "1px solid rgba(45,212,191,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      background: info.posting_approval === val ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.03)" }}>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:4 }}>{title}</div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, lineHeight:1.4 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption style */}
            <div style={{ marginBottom:16 }}>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, marginBottom:4 }}>
                Caption voice
              </div>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, margin:"0 0 10px" }}>
                How should Clara write your social media captions?
              </p>
              <div style={{ display:"flex", gap:10 }}>
                {([
                  ["real_person", "💬 Real Person", "Casual & authentic — sounds like someone on your team posted it. Conversational, no marketing speak."],
                  ["expert",      "✍️ Expert",       "Polished & sharp — elevated copy that feels premium. Confident, clear, strong CTAs."],
                ] as [string,string,string][]).map(([val, title, desc]) => (
                  <div key={val} onClick={() => setInfo({...info, caption_style: val})}
                    style={{ flex:1, padding:"12px 14px", borderRadius:12, cursor:"pointer",
                      border: info.caption_style === val ? "1px solid rgba(45,212,191,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      background: info.caption_style === val ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.03)" }}>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:4 }}>{title}</div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, lineHeight:1.4 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <label style={labelStyle}>
              How often do you want to post?
              <select value={info.posting_frequency} onChange={e => setInfo({...info, posting_frequency: e.target.value})} style={{...inputStyle, marginTop:4}}>
                <option value="daily">Daily (7x/week)</option>
                <option value="4x">4x per week</option>
                <option value="3x">3x per week (recommended)</option>
                <option value="2x">2x per week</option>
                <option value="1x">Once per week</option>
              </select>
            </label>

            {isPro && (
              <label style={labelStyle}>
                Monthly Facebook & Google ad budget
                <select value={info.ad_budget} onChange={e => setInfo({...info, ad_budget: e.target.value})} style={{...inputStyle, marginTop:4}}>
                  <option value="">Select a range…</option>
                  {AD_BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </label>
            )}
          </>
        )}

        {/* ── Step 6: Compliance (Growth + Pro) ── */}
        {step === 6 && isGrowthOrPro && (
          <>
            <h2 style={sh}>Texting Compliance (A2P)</h2>
            <p style={subText}>
              Required for sending review request texts to patients. Twilio needs this to register your brand so texts actually deliver.
              All info is kept private and used only for carrier registration.
            </p>

            <label style={labelStyle}>
              Legal business name <span style={{color:"rgba(255,255,255,0.35)", fontWeight:400}}>(as it appears on your EIN)</span>
              <input value={info.business_legal_name}
                onChange={e => setInfo({...info, business_legal_name: e.target.value})}
                placeholder="Radiant Dental Care LLC" style={inputStyle} />
            </label>

            <label style={labelStyle}>
              EIN / Tax ID <span style={{color:"#f87171", fontWeight:600}}>*</span>
              <input value={info.ein}
                onChange={e => setInfo({...info, ein: e.target.value})}
                placeholder="XX-XXXXXXX" style={inputStyle} />
            </label>

            <label style={labelStyle}>
              Business type <span style={{color:"#f87171", fontWeight:600}}>*</span>
              <select value={info.business_type} onChange={e => setInfo({...info, business_type: e.target.value})} style={inputStyle}>
                <option value="">Select…</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
                <option value="llc">LLC</option>
                <option value="s_corp">S-Corp / PC</option>
                <option value="c_corp">C-Corp</option>
                <option value="partnership">Partnership</option>
                <option value="non_profit">Non-Profit</option>
              </select>
            </label>

            <label style={labelStyle}>Street address
              <input value={info.street_address}
                onChange={e => setInfo({...info, street_address: e.target.value})}
                placeholder="123 Main St, Suite 100" style={inputStyle} />
            </label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 100px", gap:10 }}>
              <label style={labelStyle}>City
                <input value={info.city} onChange={e => setInfo({...info, city: e.target.value})}
                  placeholder="Chevy Chase" style={inputStyle} />
              </label>
              <label style={labelStyle}>State
                <input value={info.state} onChange={e => setInfo({...info, state: e.target.value})}
                  placeholder="MD" maxLength={2} style={inputStyle} />
              </label>
              <label style={labelStyle}>ZIP
                <input value={info.zip} onChange={e => setInfo({...info, zip: e.target.value})}
                  placeholder="20815" style={inputStyle} />
              </label>
            </div>

            <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", marginTop:16, paddingTop:16 }}>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:600, marginBottom:4 }}>
                Authorized contact
              </div>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:0, marginBottom:10 }}>
                Person legally authorized to register on behalf of the business.
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <label style={labelStyle}>Full name
                  <input value={info.compliance_contact_name}
                    onChange={e => setInfo({...info, compliance_contact_name: e.target.value})}
                    placeholder="Dr. Jay Siddiqui" style={inputStyle} />
                </label>
                <label style={labelStyle}>Email
                  <input value={info.compliance_contact_email}
                    onChange={e => setInfo({...info, compliance_contact_email: e.target.value})}
                    placeholder="jay@yourpractice.com" style={inputStyle} />
                </label>
              </div>
            </div>

            <div style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)",
                           borderRadius:10, padding:"12px 14px", marginTop:16 }}>
              <div style={{ color:"#fbbf24", fontWeight:700, fontSize:13, marginBottom:4 }}>⏱ Timeline note</div>
              <div style={{ color:"rgba(255,255,255,0.55)", fontSize:13, lineHeight:1.6 }}>
                SMS brand registration takes 1–7 business days with Twilio. Clara will begin outbound calling immediately;
                texting activates once registration is approved.
              </div>
            </div>
          </>
        )}

        {/* ── Review step ── */}
        {isReviewStep && (
          <>
            <h2 style={sh}>Review & Submit</h2>
            <p style={subText}>Confirm your details below. We'll be in touch within 1 business day.</p>

            {([
              ["Practice", info.practice_name],
              ["Phone", info.phone],
              ["Address", info.address],
              ["Timezone", info.timezone.replace(/_/g," ")],
              ["Plan", info.plan === "pro" ? "Pro — $799/mo (founding)" : info.plan === "growth" ? "Growth — $399/mo (founding)" : "Core — $199/mo"],
              ["Admin", `${info.admin_name} (${info.admin_email})`],
              ["Legal name", info.business_legal_name || info.practice_name],
              ["EIN", info.ein || "—"],
              ["Business type", info.business_type.replace(/_/g," ") || "—"],
              ["Address", [info.street_address, info.city, info.state, info.zip].filter(Boolean).join(", ") || info.address],
              ["Alert emails", alertEmails.filter(Boolean).join(", ") || "—"],
              ["Alert SMS", alertPhones.filter(Boolean).join(", ") || "—"],
              ["Services", `${services.length} selected`],
              ["Google Calendar booking", info.wants_calendar === "yes" ? "Yes" : "No"],
              ["Priority cases", info.priority_cases === "implants" ? "Implants" : info.priority_cases === "cosmetic" ? "Cosmetics" : "Both"],
              ["VoIP", info.voip_provider || "Not specified"],
              ...(isGrowthOrPro ? [
                ["Instagram", info.instagram || "—"],
                ["Facebook", info.facebook_page || "—"],
                ["TikTok", info.tiktok || "—"],
                ["Photo contact", info.photo_contact_email || info.admin_email],
                ["Posting approval", info.posting_approval === "auto" ? "Auto-post" : "Review in dashboard"],
                ["Posting frequency", info.posting_frequency + "/week"],
              ] : []),
              ...(isPro ? [
                ["Legal name", info.business_legal_name || "—"],
                ["EIN", info.ein || "—"],
                ["Business type", info.business_type.replace(/_/g," ") || "—"],
                ["Business address", [info.street_address, info.city, info.state, info.zip].filter(Boolean).join(", ") || "—"],
                ["Compliance contact", info.compliance_contact_name || "—"],
                ["Ad budget", info.ad_budget || "—"],
              ] : []),
            ] as [string,string][]).map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0",
                                     borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:14 }}>
                <span style={{ color:"rgba(255,255,255,0.5)" }}>{k}</span>
                <span style={{ color:"#fff", fontWeight:500, textAlign:"right", maxWidth:"60%" }}>{v}</span>
              </div>
            ))}

            {/* BAA Acceptance */}
            <div style={{ marginTop:20, padding:"16px 18px", background:"rgba(45,212,191,0.05)",
                           border:"1px solid rgba(45,212,191,0.15)", borderRadius:12 }}>
              <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer" }}>
                <input type="checkbox" checked={baaAccepted} onChange={e => setBaaAccepted(e.target.checked)}
                  style={{ marginTop:2, width:16, height:16, accentColor:"#14B8A6", flexShrink:0 }} />
                <span style={{ color:"rgba(255,255,255,0.7)", fontSize:13, lineHeight:1.6 }}>
                  I agree to the{' '}
                  <a href="/baa" target="_blank" rel="noopener noreferrer"
                     style={{ color:"#2DD4BF", textDecoration:"underline" }}>
                    Business Associate Agreement
                  </a>
                  {' '}on behalf of {info.practice_name || "my practice"}. I understand that Clara AI will handle PHI in accordance with HIPAA requirements as described in that agreement.
                </span>
              </label>
            </div>

            {error && (
              <div style={{ marginTop:16, padding:"10px 14px", background:"rgba(239,68,68,0.1)",
                             border:"1px solid rgba(239,68,68,0.3)", borderRadius:8,
                             color:"#f87171", fontSize:13 }}>
                {error}
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div style={{ display:"flex", gap:12, marginTop:28 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s-1)}
              style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                        color:"rgba(255,255,255,0.7)", padding:14, borderRadius:50, cursor:"pointer",
                        fontWeight:600, fontSize:15 }}>
              ← Back
            </button>
          )}
          {!isReviewStep ? (
            <button onClick={() => setStep(s => s+1)} disabled={!canNext[step]}
              style={{ flex:2, background: canNext[step] ? "#14B8A6" : "rgba(255,255,255,0.1)",
                        border:"none", color: canNext[step] ? "#fff" : "rgba(255,255,255,0.3)",
                        padding:14, borderRadius:50, cursor: canNext[step] ? "pointer" : "not-allowed",
                        fontWeight:700, fontSize:15, transition:"all .2s" }}>
              Next →
            </button>
          ) : (
            <button onClick={submit} disabled={submitting || !baaAccepted}
              style={{ flex:2, background: (submitting || !baaAccepted) ? "rgba(255,255,255,0.1)" : "#14B8A6",
                        border:"none", color: (submitting || !baaAccepted) ? "rgba(255,255,255,0.3)" : "#fff",
                        padding:14, borderRadius:50,
                        cursor: (submitting || !baaAccepted) ? "not-allowed" : "pointer",
                        fontWeight:700, fontSize:15 }}>
              {submitting ? "Setting up your account…" : !baaAccepted ? "Accept BAA to continue" : "Continue to Payment →"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const sh: React.CSSProperties = { color:"#fff", fontSize:18, fontWeight:700, marginBottom:16, marginTop:0 }
const subText: React.CSSProperties = { color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:16, marginTop:-8 }
const labelStyle: React.CSSProperties = { display:"flex", flexDirection:"column", gap:6, marginBottom:14,
                                            color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500 }
const inputStyle: React.CSSProperties = { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                                            borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14,
                                            outline:"none", width:"100%", boxSizing:"border-box" }
