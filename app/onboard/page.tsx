"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com"
const DASHBOARD = "https://app.iamclara.ai"

const DAYS = ["mon","tue","wed","thu","fri","sat","sun"] as const
const DAY_LABELS: Record<string, string> = {
  mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",
  fri:"Friday",sat:"Saturday",sun:"Sunday",
}
const PRESET_SERVICES = [
  "Cleanings and exams","Emergency dentistry","Dental implants",
  "Full arch implants (All-on-4 / All-on-X)","Cosmetic dentistry","Veneers",
  "Teeth whitening","Crowns and bridges","Fillings","Extractions",
  "Root canal therapy","Orthodontics / clear aligners","Pediatric dentistry",
  "Periodontal treatment","Bone grafting","Same-day crowns",
  "3D imaging / CBCT","Sedation dentistry","Dentures","Night guards / TMJ",
]

type Step = "welcome" | "info" | "hours" | "services" | "greetings" | "submitting" | "provisioning" | "done"

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-navy-800/80">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Clara <span className="text-teal-400">AI</span>
        </Link>
      </div>
    </nav>
  )
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 mb-8">
      <div
        className="bg-teal-400 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  )
}

export default function OnboardPage() {
  const [step, setStep] = useState<Step>("welcome")
  const [email, setEmail] = useState("")
  const [form, setForm] = useState({
    practice_name: "", admin_name: "", admin_email: "",
    phone: "", address: "", timezone: "America/New_York", doctor_name: "",
  })
  const [hours, setHours] = useState<Record<string, string>>({
    mon:"9:00am–5:00pm",tue:"9:00am–5:00pm",wed:"9:00am–5:00pm",
    thu:"9:00am–5:00pm",fri:"9:00am–5:00pm",sat:"Closed",sun:"Closed",
  })
  const [services, setServices] = useState<string[]>([])
  const [greeting, setGreeting] = useState("")
  const [alertEmails, setAlertEmails] = useState<string[]>([])
  const [alertEmailInput, setAlertEmailInput] = useState("")
  const [provStatus, setProvStatus] = useState<string>("waiting")
  const [provTenantId, setProvTenantId] = useState<string | null>(null)
  const [provTimedOut, setProvTimedOut] = useState(false)
  const [error, setError] = useState("")

  const [verified, setVerified] = useState<"checking" | "ok" | "fail">("checking")
  const [plan, setPlan] = useState<string>("core")

  // Verify Stripe session_id before showing anything
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get("session_id") || ""
    const e = params.get("email") || ""

    if (!sessionId) {
      setVerified("fail")
      return
    }

    fetch(`${BACKEND}/public/verify-stripe-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setVerified("ok")
          setPlan(data.plan || "core")
          const resolvedEmail = data.email || e
          if (resolvedEmail) {
            setEmail(resolvedEmail)
            setForm(f => ({ ...f, admin_email: resolvedEmail }))
          }
        } else {
          setVerified("fail")
        }
      })
      .catch(() => setVerified("fail"))
  }, [])

  // Poll provisioning status when on provisioning step
  useEffect(() => {
    if (step !== "provisioning") return
    const checkEmail = form.admin_email || email
    if (!checkEmail) return

    // Safety net: if not provisioned after 3 min, show contact screen
    const timeout = setTimeout(() => setProvTimedOut(true), 3 * 60 * 1000)

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND}/public/onboard-status?email=${encodeURIComponent(checkEmail)}`)
        const data = await res.json()
        setProvStatus(data.status)
        if (data.status === "provisioned") {
          setProvTenantId(data.tenant_id)
          setStep("done")
          clearInterval(interval)
        } else if (data.status === "error") {
          // Keep polling — transient DB issue
          console.warn("onboard-status error, retrying...")
        }
      } catch {}
    }, 3000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [step, form.admin_email, email])

  function toggleService(svc: string) {
    setServices(s => s.includes(svc) ? s.filter(x => x !== svc) : [...s, svc])
  }

  async function submitIntake() {
    setStep("submitting")
    setError("")
    try {
      const payload = {
        info: {
          practice_name: form.practice_name,
          admin_name: form.admin_name,
          admin_email: form.admin_email,
          phone: form.phone,
          address: form.address,
          timezone: form.timezone,
          doctor_name: form.doctor_name,
          plan: "auto",
        },
        hours,
        services,
        alertEmails: [form.admin_email, ...alertEmails.filter(e => e !== form.admin_email)],
        greeting: greeting || `Thank you for calling ${form.practice_name}! This is Clara, your virtual assistant. How can I help you today?`,
        notes: "",
      }
      const res = await fetch(`${BACKEND}/public/intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Submission failed")
      setStep("provisioning")
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.")
      setStep("greetings")
    }
  }

  const stepNum = { welcome:1, info:2, hours:3, services:4, greetings:5, submitting:5, provisioning:5, done:5 }[step] || 1

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <Nav />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">

          {/* ── Not verified ── */}
        {verified === "checking" && (
          <div className="text-center py-24">
            <div className="text-4xl mb-4 animate-spin inline-block">⚙️</div>
            <p className="text-white/50">Verifying your payment…</p>
          </div>
        )}

        {verified === "fail" && (
          <div className="text-center py-24">
            <div className="text-5xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold mb-4">Payment required</h2>
            <p className="text-white/50 mb-8">This page is only accessible after completing a Clara AI subscription.</p>
            <a href="/#pricing"
              className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3.5 rounded-full transition-colors">
              View Plans →
            </a>
          </div>
        )}

        {verified === "ok" && (<>

      {step !== "welcome" && step !== "provisioning" && step !== "done" && step !== "submitting" && (
          <ProgressBar step={stepNum - 1} total={4} />
        )}

        {/* ── Welcome ── */}
        {step === "welcome" && (
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Clara AI!</h1>
            <p className="text-white/60 text-lg mb-8">
              You're just a few minutes away from having a 24/7 AI receptionist answering your calls.
              Let's get your practice set up.
            </p>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-3">
              {["We'll set up your AI receptionist in minutes","Your Clara number will be ready immediately","We'll email your login details when done"].map(item => (
                <div key={item} className="flex items-center gap-3 text-white/70 text-sm">
                  <span className="text-teal-400">✓</span>{item}
                </div>
              ))}
            </div>
            <button onClick={() => setStep("info")}
              className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-4 rounded-full text-lg transition-colors">
              Let's get started →
            </button>
          </div>
        )}

        {/* ── Practice Info ── */}
        {step === "info" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Practice</h2>
            <p className="text-white/50 mb-8">This is how Clara will introduce your practice to callers.</p>
            <div className="space-y-5">
              {[
                { label: "Practice name *", key: "practice_name", placeholder: "Radiant Dental Care" },
                { label: "Your name *", key: "admin_name", placeholder: "Dr. Smith" },
                { label: "Email address *", key: "admin_email", placeholder: "you@practice.com", type: "email" },
                { label: "Practice phone number *", key: "phone", placeholder: "+13016522222" },
                { label: "Address / location", key: "address", placeholder: "Chevy Chase, MD" },
                { label: "Doctor name (for emergencies)", key: "doctor_name", placeholder: "Dr. Smith" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm text-white/60 mb-1.5">{label}</label>
                  <input type={type || "text"} value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-teal-500/60"
                    placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Timezone</label>
                <select value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/60">
                  {["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Phoenix"].map(tz => (
                    <option key={tz} value={tz}>{tz.replace(/_/g," ")}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                if (!form.practice_name || !form.admin_email || !form.phone || !form.admin_name) {
                  setError("Please fill in all required fields."); return;
                }
                setError(""); setStep("hours")
              }}
              className="w-full mt-8 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-4 rounded-full transition-colors">
              Next: Business Hours →
            </button>
            {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
          </div>
        )}

        {/* ── Business Hours ── */}
        {step === "hours" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Business Hours</h2>
            <p className="text-white/50 mb-8">Clara will tell callers when you're open and closed.</p>
            <div className="space-y-3">
              {DAYS.map(day => (
                <div key={day} className="flex items-center gap-4">
                  <span className="text-white/60 text-sm w-24 flex-shrink-0">{DAY_LABELS[day]}</span>
                  <input value={hours[day] || ""}
                    onChange={e => setHours(h => ({ ...h, [day]: e.target.value }))}
                    className="flex-1 bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-teal-500/60 text-sm"
                    placeholder="9:00am–5:00pm or Closed" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep("info")}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-full transition-colors">
                ← Back
              </button>
              <button onClick={() => setStep("services")}
                className="flex-2 flex-grow bg-teal-500 hover:bg-teal-400 text-white font-semibold py-4 rounded-full transition-colors">
                Next: Services →
              </button>
            </div>
          </div>
        )}

        {/* ── Services ── */}
        {step === "services" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Services Offered</h2>
            <p className="text-white/50 mb-8">Clara mentions these when patients ask. Check everything you offer.</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {PRESET_SERVICES.map(svc => {
                const checked = services.includes(svc)
                return (
                  <button key={svc} type="button" onClick={() => toggleService(svc)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      checked
                        ? "border-teal-500 bg-teal-500/20 text-teal-300"
                        : "border-white/15 bg-white/[0.04] text-white/50"
                    }`}>
                    {checked && "✓ "}{svc}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("hours")}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-full transition-colors">
                ← Back
              </button>
              <button onClick={() => setStep("greetings")}
                className="flex-2 flex-grow bg-teal-500 hover:bg-teal-400 text-white font-semibold py-4 rounded-full transition-colors">
                Next: Finalize →
              </button>
            </div>
          </div>
        )}

        {/* ── Greetings + Alert emails ── */}
        {step === "greetings" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Almost Done!</h2>
            <p className="text-white/50 mb-8">Customize how Clara greets callers and who gets notified.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Clara's greeting <span className="text-white/30">(optional — we'll generate one if blank)</span></label>
                <textarea rows={3} value={greeting} onChange={e => setGreeting(e.target.value)}
                  placeholder={`Thank you for calling ${form.practice_name || "our practice"}! This is Clara, your virtual assistant. How can I help you today?`}
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-teal-500/60 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Staff alert emails <span className="text-white/30">(who gets notified after each call)</span></label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[form.admin_email, ...alertEmails].filter(Boolean).map(e => (
                    <span key={e} className="bg-teal-500/15 text-teal-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                      {e}
                      {e !== form.admin_email && (
                        <button type="button" onClick={() => setAlertEmails(a => a.filter(x => x !== e))}
                          className="text-teal-400 hover:text-white font-bold">×</button>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={alertEmailInput} onChange={e => setAlertEmailInput(e.target.value)}
                    onKeyDown={e => { if(e.key==="Enter"){e.preventDefault();if(alertEmailInput.trim()){setAlertEmails(a=>[...a,alertEmailInput.trim()]);setAlertEmailInput("")}}}}
                    placeholder="Add another email…"
                    className="flex-1 bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-teal-500/60 text-sm" />
                  <button type="button"
                    onClick={() => { if(alertEmailInput.trim()){setAlertEmails(a=>[...a,alertEmailInput.trim()]);setAlertEmailInput("")}}}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl text-sm font-medium">Add</button>
                </div>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep("services")}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-full transition-colors">
                ← Back
              </button>
              <button onClick={submitIntake}
                className="flex-2 flex-grow bg-teal-500 hover:bg-teal-400 text-white font-semibold py-4 rounded-full transition-colors">
                Launch Clara AI 🚀
              </button>
            </div>
          </div>
        )}

        {/* ── Submitting ── */}
        {step === "submitting" && (
          <div className="text-center py-20">
            <div className="text-5xl mb-6 animate-spin inline-block">⚙️</div>
            <h2 className="text-2xl font-bold mb-3">Setting up your account…</h2>
            <p className="text-white/50">This only takes a moment.</p>
          </div>
        )}

        {/* ── Provisioning (polling) ── */}
        {step === "provisioning" && provTimedOut && (
          <div className="text-center py-12">
            <div className="text-5xl mb-6">⏳</div>
            <h2 className="text-2xl font-bold mb-4">Taking longer than usual…</h2>
            <p className="text-white/50 mb-8">Your account is still being set up. We'll email you at <strong className="text-white">{form.admin_email}</strong> as soon as it's ready — usually within a few minutes.</p>
            <a href="mailto:support@iamclara.ai" className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3.5 rounded-full transition-colors">
              Contact Support
            </a>
          </div>
        )}

        {step === "provisioning" && !provTimedOut && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🏗️</div>
            <h2 className="text-2xl font-bold mb-4">Clara AI is spinning up for {form.practice_name}…</h2>
            <div className="space-y-3 max-w-sm mx-auto mb-10">
              {[
                { label: "Saving your practice settings", done: true },
                { label: "Provisioning your Clara phone number", done: provStatus !== "paid_pending_intake" && provStatus !== "new" },
                { label: "Setting up your dashboard account", done: provStatus === "provisioned" },
                { label: "Sending your login credentials", done: provStatus === "provisioned" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                  item.done
                    ? "border-teal-500/30 bg-teal-500/[0.06] text-white"
                    : "border-white/10 bg-white/[0.02] text-white/40"
                }`}>
                  <span className={item.done ? "text-teal-400" : "text-white/20"}>
                    {item.done ? "✓" : "○"}
                  </span>
                  {item.label}
                </div>
              ))}
            </div>
            <p className="text-white/30 text-sm">Usually ready in under 60 seconds…</p>
          </div>
        )}


        {/* ── Done ── */}
        {step === "done" && (
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4">You're live!</h1>
            <p className="text-white/60 text-lg mb-8">
              Clara AI is now answering calls for <strong>{form.practice_name}</strong>.
              Check your email for your dashboard login and Clara phone number.
            </p>
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6 mb-8 space-y-2 text-left">
              <p className="text-sm text-white/60">✅ Your Clara phone number is ready</p>
              <p className="text-sm text-white/60">✅ Dashboard login sent to <strong className="text-white">{form.admin_email}</strong></p>
              <p className="text-sm text-white/60">✅ Forward your practice line to start taking calls</p>
            </div>
            <a href={DASHBOARD}
              className="block w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-4 rounded-full transition-colors text-lg mb-4">
              Open Dashboard →
            </a>
            <p className="text-white/30 text-sm">Questions? Email us at <a href="mailto:support@iamclara.ai" className="text-teal-400">support@iamclara.ai</a></p>
          </div>
        )}

        </>)}
      </div>
    </div>
  )
}

