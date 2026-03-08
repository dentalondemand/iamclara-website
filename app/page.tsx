"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const DASHBOARD_URL = 'https://app.iamclara.ai'

// ── Founders spot counters — update these as spots fill ──────────────────────
const GROWTH_FOUNDERS_SPOTS_TOTAL = 10
const GROWTH_FOUNDERS_SPOTS_TAKEN = 1   // increment as practices sign up
const PRO_FOUNDERS_SPOTS_TOTAL    = 10
const PRO_FOUNDERS_SPOTS_TAKEN    = 0   // increment as practices sign up
// ─────────────────────────────────────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-navy-800/80">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">Clara <span className="text-teal-400">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer"
            className="hidden md:block text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
            Log in
          </a>
          <a href="/get-started"
            className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
            Get Started
          </a>
          <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-navy-800 px-6 py-4 space-y-3">
          <a href="#how-it-works" className="block text-white/70 hover:text-white py-2" onClick={() => setOpen(false)}>How it works</a>
          <a href="#features" className="block text-white/70 hover:text-white py-2" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing" className="block text-white/70 hover:text-white py-2" onClick={() => setOpen(false)}>Pricing</a>
          <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" className="block text-white/70 hover:text-white py-2">Log in</a>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-20">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-navy-600/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-teal-400 text-sm font-medium">AI-Powered Dental Receptionist</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Your front desk,
          <br />
          <span className="gradient-text">always answered.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Clara answers every call, identifies patient intent, sends your team instant summaries,
          and gives you the tools to grow — so you never miss a case.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="/get-started"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 glow">
            Get Started — from $199/mo
          </a>
          <a href="#how-it-works"
            className="w-full sm:w-auto border border-white/20 hover:border-white/40 text-white font-medium px-8 py-4 rounded-full text-lg transition-colors">
            See how it works ↓
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-white/10 pt-10">
          {[
            { value: '24/7', label: 'Always on' },
            { value: '$450+', label: 'Saved vs avg service/mo' },
            { value: '< 2s', label: 'Answer time' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-1">{s.value}</div>
              <div className="text-sm text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Patient calls your number',
      desc: 'Your practice number forwards to Clara after a few rings — or immediately. Clara answers instantly, every time.',
      icon: '📞',
    },
    {
      num: '02',
      title: 'Clara understands and engages',
      desc: 'Using AI, Clara identifies intent (new patient, implant consult, emergency, etc.), collects name and contact info, and holds a natural conversation.',
      icon: '🤖',
    },
    {
      num: '03',
      title: 'Your team gets an instant summary',
      desc: 'High-priority calls (implants, cosmetics, emergencies) trigger an immediate SMS + email alert. All calls are logged in the dashboard with full summaries.',
      icon: '⚡',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Three steps to <span className="gradient-text">never miss a call</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Set up in minutes. No hardware. No training. Just forward your number.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="relative bg-card-gradient border border-white/10 rounded-2xl p-8 glow-sm">
              <div className="text-5xl mb-4">{step.icon}</div>
              <div className="text-teal-400 text-sm font-bold mb-2 tracking-widest">{step.num}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-white/50 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: '🧠',
      title: 'LLM-Powered Conversation',
      desc: 'Clara doesn\'t follow a rigid script. She understands natural speech, handles unexpected questions, and keeps the conversation flowing naturally.',
    },
    {
      icon: '📋',
      title: 'Instant AI Call Summaries',
      desc: 'Every call ends with a structured AI summary — caller name, intent, phone number, preferred callback time. Your team sees everything they need at a glance.',
    },
    {
      icon: '🚨',
      title: 'High-Priority Alerts',
      desc: 'Implant consults, cosmetic inquiries, and emergencies trigger immediate SMS and email alerts to your team — no checking the dashboard required.',
    },
    {
      icon: '📅',
      title: 'Automatic Consultation Booking',
      desc: 'Clara checks your Google Calendar in real time and books consultations directly — no back-and-forth, no double-booking.',
    },
    {
      icon: '🎙️',
      title: 'Call Recording + Playback',
      desc: 'Every call is recorded and accessible from the web or mobile app. Filter by status, play recordings, and review full transcripts from anywhere.',
    },
    {
      icon: '🔁',
      title: 'Repeat Caller Recognition',
      desc: 'Clara remembers returning patients and greets them by name — a small touch that makes a big impression.',
    },
    {
      icon: '🆘',
      title: 'Emergency Call Forwarding',
      desc: 'Dental emergencies get routed directly to your phone — always, or only after hours. Clara handles triage so you only get pulled away when it truly matters.',
    },
    {
      icon: '🌍',
      title: '21-Language Support',
      desc: 'Clara auto-detects the caller\'s language and responds in kind — Spanish, French, Arabic, Mandarin, Korean, and 16 more. No setup needed.',
    },
    {
      icon: '🛡️',
      title: 'Spam & Robocall Detection',
      desc: 'Clara identifies and filters spam calls automatically, so your dashboard stays clean and your team only sees real patients.',
    },
    {
      icon: '📊',
      title: 'Lead Management Dashboard',
      desc: 'Every caller becomes a lead. Tag by service interest, log staff notes, track call-back status, and never let a high-value case fall through the cracks.',
    },
    {
      icon: '📱',
      title: 'Web + Mobile App',
      desc: 'Full-featured iOS and Android app. Review calls, manage leads, update settings, and monitor your practice from anywhere.',
    },
    {
      icon: '🔒',
      title: 'HIPAA-Conscious Design',
      desc: 'Patient data stays secure. No PHI in email bodies, encrypted storage, configurable recording retention. Built specifically for dental practices.',
    },
  ]

  return (
    <section id="features" className="py-24 px-6 bg-navy-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything your front desk does,
            <br />
            <span className="gradient-text">at a fraction of the cost.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Built specifically for dental practices by a dentist who got tired of paying $600/month for basic answering services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card-gradient border border-white/10 rounded-2xl p-6 hover:border-teal-500/30 transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Tier upgrade teaser */}
        <div className="mt-10 bg-teal-500/10 border border-teal-500/20 rounded-2xl p-8 text-center">
          <div className="text-2xl mb-2">📈</div>
          <h3 className="text-xl font-semibold mb-2">Start with Core. Grow when you're ready.</h3>
          <p className="text-white/50 max-w-2xl mx-auto">
            Add social media automation at $399/mo with Growth (founding rate), or unlock the full lead machine — landing pages, outbound calling, and AI text follow-up — at $799/mo with Pro (founding rate). Both lock in for life. Upgrade anytime, no contracts.
          </p>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">honest pricing.</span>
          </h2>
          <p className="text-white/50 text-lg">No setup fees. No contracts. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Core Plan */}
          <div className="bg-card-gradient border border-white/10 rounded-3xl p-8 flex flex-col">
            <div className="mb-6">
              <div className="text-teal-400 text-sm font-bold tracking-widest mb-2">CORE</div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold">$199</span>
                <span className="text-white/40 mb-2">/month</span>
              </div>
              <p className="text-white/50 text-sm">
                Replace your answering service. Clara answers every call, captures every patient, and never sleeps.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                '24/7 AI inbound call answering',
                'Natural LLM conversation',
                'AI-powered call summaries + lead scoring',
                'SMS + email + push staff alerts',
                'Call recording + playback',
                'Repeat caller recognition',
                'Emergency call forwarding',
                '21-language auto-detect',
                'Spam & robocall filtering',
                'Call intelligence analytics',
                'Staff notes + activity log',
                'Google Calendar integration',
                'iOS + Android mobile app',
                'Unlimited calls',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Savings + CTA */}
            <div className="mt-auto">
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl px-4 py-3 mb-4 text-center">
                <p className="text-teal-400 font-bold text-sm">Save ~$400/mo</p>
                <p className="text-white/40 text-xs mt-0.5">vs. a traditional answering service ($500–700/mo)</p>
              </div>
              <a href="https://buy.stripe.com/14AfZj4BH7NGeEp4DuaEE01"
                className="block text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 rounded-full transition-colors">
                Get Started — $199/mo
              </a>
              <p className="text-center text-white/30 text-xs mt-3">No credit card required to start</p>
            </div>
          </div>

          {/* Growth Plan */}
          <div className="relative bg-card-gradient border border-teal-500/40 rounded-3xl p-8 flex flex-col glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">FOUNDING RATE</span>
            </div>

            <div className="mb-6">
              <div className="text-teal-400 text-sm font-bold tracking-widest mb-2">GROWTH</div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-bold">$399</span>
                <span className="text-white/40 mb-2">/month</span>
              </div>
              <p className="text-white/30 text-xs mb-1 line-through">$499/month after founding spots fill</p>
              <p className="text-amber-400 text-xs font-semibold mb-3">
                🔥 {GROWTH_FOUNDERS_SPOTS_TOTAL - GROWTH_FOUNDERS_SPOTS_TAKEN} of {GROWTH_FOUNDERS_SPOTS_TOTAL} founding spots remaining
              </p>
              <p className="text-white/50 text-sm">
                Everything in Core plus a full social media team — upload a photo, Clara writes the caption and posts it.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Everything in Core',
                'Lab case + follow-up tracker',
                'Patient review request tool',
                'Photo upload → AI caption → auto-post',
                'Instagram + Facebook posting',
                'Real-person caption voice (no AI slop)',
                'Weekly content calendar',
                'Sunday photo request workflow',
                'Caption approval queue',
                'TikTok + Google Business (coming soon)',
                'Priority support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Savings + CTA */}
            <div className="mt-auto">
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl px-4 py-3 mb-4 text-center">
                <p className="text-teal-400 font-bold text-sm">Save ~$800/mo</p>
                <p className="text-white/40 text-xs mt-0.5">vs. a social media manager ($800–1,500/mo)</p>
              </div>
              <a href="https://buy.stripe.com/7sY00l9W12tmeEp2vmaEE02"
                className="block text-center bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3.5 rounded-full transition-colors">
                Claim Founding Rate — $399/mo
              </a>
              <p className="text-center text-white/30 text-xs mt-3">🔒 Locked for life — never increases</p>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-card-gradient border border-white/10 rounded-3xl p-8 flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">FOUNDING RATE</span>
            </div>

            <div className="mb-6">
              <div className="text-teal-400 text-sm font-bold tracking-widest mb-2">PRO</div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-bold">$799</span>
                <span className="text-white/40 mb-2">/month</span>
              </div>
              <p className="text-white/30 text-xs mb-1 line-through">$999/month after founding spots fill</p>
              <p className="text-amber-400 text-xs font-semibold mb-3">
                🔥 {PRO_FOUNDERS_SPOTS_TOTAL - PRO_FOUNDERS_SPOTS_TAKEN} of {PRO_FOUNDERS_SPOTS_TOTAL} founding spots remaining
              </p>
              <p className="text-white/50 text-sm">
                Everything in Growth plus the full lead machine — Clara captures leads from ads and texts them until they book.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Everything in Growth',
                'Custom practice landing page',
                'Facebook & Google lead form capture',
                'Clara calls new leads within minutes',
                'Outbound retry logic (calls until answered)',
                'Two-way AI SMS nurture sequences',
                'Lead scoring + prioritization',
                'A2P 10DLC SMS compliance (included)',
                'Dedicated onboarding support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Savings + CTA */}
            <div className="mt-auto">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 mb-4 text-center">
                <p className="text-amber-400 font-bold text-sm">Save $6,000–$11,000/mo</p>
                <p className="text-white/40 text-xs mt-0.5">vs. answering service + social media + lead gen agency combined</p>
              </div>
              <a href="https://buy.stripe.com/9B66oJ5FL4Bu53P8TKaEE03"
                className="block text-center bg-amber-500 hover:bg-amber-400 text-white font-semibold py-3.5 rounded-full transition-colors">
                Claim Founding Rate — $799/mo
              </a>
              <p className="text-center text-white/30 text-xs mt-3">🔒 Locked for life — never increases</p>
            </div>
          </div>
        </div>

        {/* ── Savings comparison table ── */}
        <div className="mt-16">
          <p className="text-center text-white/50 text-sm uppercase tracking-widest font-semibold mb-6">
            What practices pay today vs. Clara AI
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="text-left px-5 py-4 text-white/50 font-semibold">What you're paying for</th>
                  <th className="text-center px-4 py-4 text-white/50 font-semibold">Typical cost</th>
                  <th className="text-center px-4 py-4 text-teal-400 font-semibold">With Clara AI</th>
                  <th className="text-center px-4 py-4 text-white/50 font-semibold">You save</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    what: "After-hours answering service",
                    note: "Misses 40–60% of calls. No intake. No follow-up.",
                    cost: "$500–$700/mo",
                    with: "Core — $199/mo",
                    save: "~$400/mo",
                  },
                  {
                    what: "Social media manager",
                    note: "1–2 posts/week. Slow turnaround. No clinical voice.",
                    cost: "$800–$1,500/mo",
                    with: "Growth — $399/mo ✦",
                    save: "~$800/mo",
                  },
                  {
                    what: "Lead gen / marketing agency",
                    note: "Plus ad spend fees. Slow follow-up. No guarantees.",
                    cost: "$2,000–$5,000/mo",
                    with: "Pro — $799/mo ✦",
                    save: "~$2,000+/mo",
                  },
                  {
                    what: "Front desk receptionist",
                    note: "$45–60K/year + benefits. Can't work 24/7.",
                    cost: "$3,750–$5,000/mo",
                    with: "Partially replaced",
                    save: "~$3,500/mo",
                  },
                ].map((row, i) => (
                  <tr key={row.what} className={`border-b border-white/[0.06] ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{row.what}</div>
                      <div className="text-white/30 text-xs mt-0.5">{row.note}</div>
                    </td>
                    <td className="px-4 py-4 text-center text-white/50 font-medium">{row.cost}</td>
                    <td className="px-4 py-4 text-center text-teal-400 font-semibold text-xs leading-snug">{row.with}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="bg-teal-500/15 text-teal-400 font-semibold text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
                        {row.save}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-teal-500/[0.06] border-t-2 border-teal-500/30">
                  <td className="px-5 py-4 font-bold text-white">All 4 combined</td>
                  <td className="px-4 py-4 text-center font-bold text-white">$7,050–$12,200/mo</td>
                  <td className="px-4 py-4 text-center font-bold text-teal-400">Pro — $799/mo ✦</td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-teal-500/20 text-teal-300 font-bold text-sm px-3 py-1.5 rounded-full whitespace-nowrap">
                      Save $6K–$11K/mo
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-white/25 text-xs mt-4">✦ Founding rate — locked for life while spots remain</p>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    {
      q: 'How does call forwarding work?',
      a: 'You configure your practice phone to forward to your Clara number after 2–3 rings. Clara answers immediately after that. Setup takes about 5 minutes through your phone carrier or VoIP portal.',
    },
    {
      q: 'What happens if Clara doesn\'t understand a caller?',
      a: 'Clara is graceful about it — she asks clarifying questions naturally. If a caller has an urgent emergency, she routes them appropriately and fires an alert to your team immediately.',
    },
    {
      q: 'Can Clara book appointments directly?',
      a: 'Yes — for consultation appointments (implants, cosmetics, etc.), Clara checks your Google Calendar in real time and books directly. For general appointments, she collects info and your front desk calls back.',
    },
    {
      q: 'Does it work with my existing phone number?',
      a: 'Absolutely. You keep your practice number. Clara is assigned a dedicated Twilio number that your main number forwards to. Patients never know the difference.',
    },
    {
      q: 'Is there a setup fee or contract?',
      a: 'No setup fees, no contracts, no hidden costs. Pay month-to-month and cancel anytime.',
    },
    {
      q: 'What practice management systems does it work with?',
      a: 'Clara is PMS-agnostic — it works alongside Dentrix, Eaglesoft, Open Dental, Curve, and any other PMS. Clara handles phone intake; your existing PMS handles everything else.',
    },
  ]

  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 bg-navy-900/50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Common questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card-gradient border border-white/10 rounded-2xl overflow-hidden">
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="font-medium text-white">{faq.q}</span>
                <span className="text-teal-400 flex-shrink-0 text-xl">{openIdx === i ? '−' : '+'}</span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-hero-gradient border border-teal-500/20 rounded-3xl p-12 glow">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to stop paying
            <br />
            <span className="gradient-text">for missed calls?</span>
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            Join dental practices already using Clara to capture more patients and save $400+ a month.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/get-started"
              className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105">
              Get Started Today
            </a>
            <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto border border-white/20 hover:border-white/40 text-white font-medium px-8 py-4 rounded-full text-lg transition-colors">
              Already a customer? Log in →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Clara <span className="text-teal-400">AI</span></span>
          <span className="text-white/30 text-sm ml-2">AI Dental Receptionist</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/40">
          <a href="#how-it-works" className="hover:text-white/70 transition-colors">How it works</a>
          <a href="#features" className="hover:text-white/70 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white/70 transition-colors">Pricing</a>
          <a href="mailto:jay@dental-on-demand.com" className="hover:text-white/70 transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4 text-white/30 text-sm">
          <span>© 2026 Clara AI. All rights reserved.</span>
          <a href="/privacy" className="hover:text-white/70 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white/70 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}
