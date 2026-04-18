"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const DASHBOARD_URL = 'https://app.iamclara.ai'

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-navy-800/80">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/clara-logo.webp" alt="Clara AI" className="w-9 h-9 rounded-xl object-cover" />
          <span className="text-2xl font-bold tracking-tight text-white">Clara <span className="text-teal-400">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="/try-clara" className="hover:text-teal-400 transition-colors text-teal-400 font-medium">Try Clara</a>
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
          <a href="/try-clara" className="block text-teal-400 font-medium py-2" onClick={() => setOpen(false)}>Try Clara</a>
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
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <span className="text-teal-400 text-sm font-medium">AI Practice Growth Platform</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <span className="text-base">🦷</span>
            <span className="text-white/60 text-sm font-medium">Built by dentists, for dentists</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          While you&#39;re in the chair,
          <br />
          <span className="gradient-text">Clara&#39;s filling your schedule.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Calls answered. Leads followed up. Content posted. Cases booked — automatically.
          Clara is the AI platform that runs your practice growth while you focus on patients.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="/get-started"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 glow">
            Get Started
          </a>
          <a href="/try-clara"
            className="w-full sm:w-auto border border-teal-500/40 hover:border-teal-400 text-teal-400 font-medium px-8 py-4 rounded-full text-lg transition-colors">
            Try free →
          </a>
          <a href="#pricing"
            className="w-full sm:w-auto border border-white/20 hover:border-white/40 text-white font-medium px-8 py-4 rounded-full text-lg transition-colors">
            See pricing ↓
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-white/10 pt-10">
          {[
            { value: '24/7', label: 'Always on' },
            { value: '$400–$3K+', label: 'Saved per month vs. traditional' },
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
      desc: 'Using AI, Clara identifies intent (new patient, consult, emergency, etc.), collects name and contact info, and holds a natural conversation.',
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
  const heroFeatures = [
    {
      icon: '📞',
      title: 'Answers every call. Instantly.',
      desc: 'Clara picks up in under 2 seconds — 24/7, including after hours, weekends, and holidays. No voicemail. No missed patients. No exceptions.',
      highlight: 'Never miss a new patient call again',
    },
    {
      icon: '⚡',
      title: 'Alerts your team in real time',
      desc: 'Implant consults, full arch inquiries, and emergencies trigger instant SMS + email + push alerts. Your team knows about high-value cases before they even walk back to the front desk.',
      highlight: 'High-value leads flagged immediately',
    },
    {
      icon: '📅',
      title: 'Books consultations automatically',
      desc: 'Clara checks your Google Calendar live and books consult slots directly — no callback required, no double-booking, no back-and-forth.',
      highlight: 'Google Calendar sync included',
    },
  ]

  const otherFeatures = [
    { icon: '🧠', title: 'Natural AI conversation', desc: 'No rigid scripts. Clara understands natural speech, handles unexpected questions, and keeps the conversation flowing.' },
    { icon: '📋', title: 'AI call summaries', desc: 'Caller name, intent, phone number, callback preference — structured and waiting for your team after every call.' },
    { icon: '🎙️', title: 'Call recording + transcripts', desc: 'Every call recorded, searchable, and accessible from the web or mobile app.' },
    { icon: '🔁', title: 'Repeat caller recognition', desc: 'Clara greets returning patients by name — a small touch that makes a big impression.' },
    { icon: '🆘', title: 'Emergency call routing', desc: 'True emergencies get routed directly to your phone. Clara handles triage so you only get pulled away when it truly matters.' },
    { icon: '🌍', title: '21-language support', desc: 'Auto-detects the caller\'s language and responds in kind — Spanish, French, Mandarin, Korean, Arabic, and 16 more.' },
    { icon: '🛡️', title: 'Spam & robocall filtering', desc: 'Clara identifies and drops spam automatically so your dashboard only shows real patients.' },
    { icon: '📊', title: 'Lead management dashboard', desc: 'Every caller becomes a lead. Tag, note, track call-back status, and monitor high-value cases from one place.' },
    { icon: '📱', title: 'iOS + Android app', desc: 'Review calls, manage leads, and update settings from anywhere — full-featured mobile app included.' },
    { icon: '🔒', title: 'HIPAA compliant + BAA included', desc: 'Every practice gets a signed BAA. AES-256 encryption at rest, TLS in transit, row-level security, TOTP MFA, automatic PHI purge, and full audit logging.' },
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

        {/* Hero features — big cards, prominent */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {heroFeatures.map((f) => (
            <div key={f.title} className="bg-card-gradient border border-teal-500/30 rounded-2xl p-8 hover:border-teal-500/50 transition-colors">
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed mb-4">{f.desc}</p>
              <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                <span className="text-teal-400 text-xs font-semibold">✓ {f.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Everything else — smaller grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {otherFeatures.map((f) => (
            <div key={f.title} className="bg-card-gradient border border-white/8 rounded-xl p-5 hover:border-white/20 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold mb-1.5 text-white">{f.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Tier upgrade teaser */}
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-8 text-center">
          <div className="text-2xl mb-2">📈</div>
          <h3 className="text-xl font-semibold mb-2">Two plans. No complexity.</h3>
          <p className="text-white/50 max-w-2xl mx-auto">
            Start with Core at $299/mo for the AI receptionist, or go all-in with Growth at $449/mo — ads, social media, lead nurturing, and more. All-inclusive, no per-minute fees, no agency markups.
          </p>
        </div>
      </div>
    </section>
  )
}

function Differentiators() {
  return (
    <section className="py-24 px-6" id="differentiators">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Three things <span className="gradient-text">no one else does.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Not a generic answering service. Not a social media scheduler. Not an ad agency. Clara is all three — and built specifically for dental.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Smile Simulator */}
          <div className="relative bg-card-gradient border border-teal-500/30 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-8 translate-x-8 blur-2xl pointer-events-none" />
            <div className="text-5xl mb-5">😁</div>
            <div className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-3">Smile Simulator</div>
            <h3 className="text-xl font-bold text-white mb-3 leading-snug">
              Patients see their new smile before they book
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Upload a photo on your landing page — Clara's AI shows a realistic preview of their veneers or implants in seconds. When patients can visualize the result, they book. Simple as that.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">Growth plan</span>
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">Growth plan</span>
            </div>
          </div>

          {/* Video Ads */}
          <div className="relative bg-card-gradient border border-purple-500/30 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-8 translate-x-8 blur-2xl pointer-events-none" />
            <div className="text-5xl mb-5">🎬</div>
            <div className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">Video Ads on Autopilot</div>
            <h3 className="text-xl font-bold text-white mb-3 leading-snug">
              Upload a patient video. Clara launches the campaign.
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Drop your best before/after or testimonial video into Clara's dashboard. She writes the caption, builds the Facebook and Instagram campaign, A/B tests price vs. outcome copy, and goes live — no agency, no creative brief, no waiting.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">Growth plan</span>
            </div>
          </div>

          {/* Market-Type Targeting */}
          <div className="relative bg-card-gradient border border-amber-500/30 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-8 translate-x-8 blur-2xl pointer-events-none" />
            <div className="text-5xl mb-5">📍</div>
            <div className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Smart Market Targeting</div>
            <h3 className="text-xl font-bold text-white mb-3 leading-snug">
              Ads built for your market. Not the national average.
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Urban patients drive 10 miles. Rural patients drive 45. Generic agencies use one radius for everyone. Clara adjusts targeting radius, age range, and budget allocation based on your market type — and optimizes weekly based on who actually books.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">Growth plan</span>
            </div>
          </div>
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

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Core Plan */}
          <div className="bg-card-gradient border border-white/10 rounded-3xl p-8 flex flex-col opacity-80">
            <div className="mb-6">
              <div className="text-teal-400 text-sm font-bold tracking-widest mb-2">CORE</div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold">$299</span>
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
                'Insurance + DOB intake on new patients',
                'AI-powered call summaries + lead scoring',
                'SMS + email + push staff alerts',
                'Call recording + playback',
                'Repeat caller recognition',
                'Emergency call forwarding',
                '21-language auto-detect',
                'Spam & robocall filtering',
                'Call intelligence analytics',
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

            <div className="mt-auto">
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl px-4 py-3 mb-4 text-center">
                <p className="text-teal-400 font-bold text-sm">Save ~$400/mo</p>
                <p className="text-white/40 text-xs mt-0.5">vs. a traditional answering service ($500–700/mo)</p>
              </div>
              <a href="/get-started?plan=core"
                className="block text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 rounded-full transition-colors">
                Get Started — $299/mo
              </a>
            </div>
          </div>

          {/* Growth Plan */}
          <div className="relative bg-card-gradient border border-teal-500/40 rounded-3xl p-8 flex flex-col glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</span>
            </div>

            <div className="mb-6">
              <div className="text-teal-400 text-sm font-bold tracking-widest mb-2">GROWTH</div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold">$449</span>
                <span className="text-white/40 mb-2">/mo</span>
              </div>
              <p className="text-amber-400 text-xs font-semibold mb-2">→ $549/mo after month 1</p>
              <p className="text-white/50 text-sm">
                Everything in Core — plus AI-managed ads, social media automation, and a full lead machine. All-inclusive, no per-minute fees.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Everything in Core',
                'Facebook & Instagram ad campaigns',
                'Google Ads management',
                'A/B tests price vs. outcome copy automatically',
                'AI ad copy from your real differentiators',
                'Weekly ad performance report',
                'Photo upload → AI caption → auto-post',
                'Instagram, Facebook & TikTok posting',
                'Weekly AI content ideas calendar',
                'Before & after photo gallery on landing page',
                'Custom practice landing page',
                'AI outbound calling — calls leads in 60 seconds',
                'Automated SMS + email follow-up sequences',
                'Lead pipeline with deal tracking',
                'Patient review request tool',
                'Priority support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl px-4 py-3 mb-4 text-center">
                <p className="text-teal-400 font-bold text-sm">Save $6,000–$11,000/mo</p>
                <p className="text-white/40 text-xs mt-0.5">vs. agency + social media manager + answering service</p>
              </div>
              <a href="/get-started?plan=growth"
                className="block text-center bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3.5 rounded-full transition-colors">
                Get Started — $449/mo
              </a>
              <p className="text-center text-white/30 text-xs mt-3">🔒 No contracts · Cancel anytime · $549/mo after month 1</p>
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
                    with: "Core — $299/mo",
                    save: "~$400/mo",
                  },
                  {
                    what: "Social media manager",
                    note: "1–2 posts/week. Slow turnaround. No clinical voice.",
                    cost: "$800–$1,500/mo",
                    with: "Growth — $449/mo",
                    save: "~$800/mo",
                  },
                  {
                    what: "Lead gen / marketing agency",
                    note: "Charges 10–20% of your ad budget on top. Slow follow-up. No guarantees.",
                    cost: "$2,000–$5,000/mo",
                    with: "Growth — $449/mo",
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
                  <td className="px-4 py-4 text-center font-bold text-teal-400">Growth — $449/mo</td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-teal-500/20 text-teal-300 font-bold text-sm px-3 py-1.5 rounded-full whitespace-nowrap">
                      Save $6K–$11K/mo
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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

function SecurityTrust() {
  const badges = [
    { icon: '🔒', label: 'HIPAA Compliant', sub: 'BAA included with every plan' },
    { icon: '🛡️', label: 'AES-256 Encryption', sub: 'At rest and in transit (TLS 1.2+)' },
    { icon: '🗂️', label: 'AWS Infrastructure', sub: 'BAA-backed RDS + S3 storage' },
    { icon: '🔑', label: 'MFA Required', sub: 'TOTP app-based for all staff logins' },
    { icon: '🗑️', label: 'Auto PHI Purge', sub: 'Recordings deleted after 90 days' },
    { icon: '📋', label: 'Full Audit Log', sub: 'Every data access is logged' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, rgba(15,24,35,0) 0%, rgba(20,184,166,0.04) 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-teal-400 rounded-full" />
            <span className="text-teal-400 text-sm font-medium">Built for Healthcare</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            HIPAA compliant from day one.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Every Clara subscription includes a signed Business Associate Agreement. Your patients' data is protected by the same infrastructure that powers enterprise healthcare.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {badges.map(b => (
            <div key={b.label} className="flex items-start gap-3 p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-2xl mt-0.5">{b.icon}</span>
              <div>
                <div className="font-semibold text-white text-sm">{b.label}</div>
                <div className="text-white/40 text-xs mt-0.5">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="/baa"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium">
            Read our Business Associate Agreement →
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <img src="/clara-logo.webp" alt="Clara AI" className="w-7 h-7 rounded-lg object-cover" />
            <span className="text-xl font-bold text-white">Clara <span className="text-teal-400">AI</span></span>
            <span className="text-white/30 text-sm ml-2">AI Practice Growth Platform</span>
          </div>
          <span className="text-white/25 text-xs">🦷 Built by dentists, for dentists</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/40">
          <a href="#how-it-works" className="hover:text-white/70 transition-colors">How it works</a>
          <a href="#features" className="hover:text-white/70 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white/70 transition-colors">Pricing</a>
          <a href="mailto:hello@iamclara.ai" className="hover:text-white/70 transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4 text-white/30 text-sm">
          <span>© 2026 Clara AI. All rights reserved.</span>
          <a href="/privacy" className="hover:text-white/70 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white/70 transition-colors">Terms</a>
          <a href="/baa" className="hover:text-white/70 transition-colors">BAA</a>
        </div>
      </div>
    </footer>
  )
}

function TieredIntelligence() {
  const tiers = [
    {
      plan: 'Core',
      price: '$299/mo',
      color: '#2DD4BF',
      border: 'rgba(45,212,191,0.2)',
      bg: 'rgba(45,212,191,0.05)',
      icon: '🧠',
      headline: 'Clara learns which callers book',
      bullets: [
        'Auto-scores every lead on interest, urgency & case type',
        'Flags high-value callers (implants, full arch, cosmetics) instantly',
        'Learns your practice patterns — fewer missed cases over time',
        'Staff scores refine Clara\'s model with every interaction',
      ],
    },
    {
      plan: 'Growth',
      price: '$449/mo',
      color: '#818cf8',
      border: 'rgba(129,140,248,0.2)',
      bg: 'rgba(129,140,248,0.05)',
      icon: '📈',
      headline: 'Clara learns what content drives calls — and optimizes your ad spend automatically',
      bullets: [
        'Tracks which posts generate the most inbound inquiries',
        'Pauses underperforming adsets, scales winning ones weekly',
        'A/B tests price-shown vs. outcome copy — picks the winner',
        'Weekly content + campaign performance report — what worked, what didn\'t',
      ],
    },
  ]

  return (
    <section className="py-20 px-6" id="intelligence">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unrivaled optimization — <span className="gradient-text">at every plan</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Clara isn't just an answering service. Both plans include AI that learns your practice, improves week over week, and tells you exactly what's working.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div key={tier.plan} style={{ background: tier.bg, border: `1px solid ${tier.border}` }}
              className="rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-white font-bold text-lg">{tier.plan}</span>
                  <span className="text-white/30 text-sm ml-2">{tier.price}</span>
                </div>
                <span className="text-2xl">{tier.icon}</span>
              </div>
              <p style={{ color: tier.color }} className="font-semibold text-sm mb-4 leading-snug">
                {tier.headline}
              </p>
              <ul className="space-y-2.5 flex-1">
                {tier.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-white/55">
                    <span style={{ color: tier.color }} className="mt-0.5 flex-shrink-0 text-xs">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-white/25 text-xs mt-8">
          Intelligence compounds over time. The longer Clara runs, the better she gets — for your practice specifically.
        </p>
      </div>
    </section>
  )
}

function ProOptimizer() {
  const steps = [
    {
      icon: '📋',
      label: 'Lead submits form',
      detail: 'Clara scores them instantly on credit, timeline, savings, and procedure fit',
    },
    {
      icon: '📞',
      label: 'Clara calls in 60 sec',
      detail: 'Asks one smart qualifying question — "Is this something you\'re looking at soon?" — and records the answer',
    },
    {
      icon: '🧠',
      label: 'Pattern detected',
      detail: 'Clara compares good leads vs. bad leads across every dimension: age, objections, timeline, which ad brought them',
    },
    {
      icon: '⚙️',
      label: 'Campaign adjusted',
      detail: 'Clara acts automatically — pauses bad adsets, raises the age floor, shifts budget, or swaps copy. No agency meeting needed.',
    },
  ]

  const adjustments = [
    { signal: '"Too expensive" ×3', action: 'Pause price-shown variant → lead with financing instead' },
    { signal: '"Not ready yet" ×3', action: 'Raise target age by 5 years — audience is too young to buy' },
    { signal: '65%+ leads qualified', action: 'Increase daily budget 20% — scale what\'s working' },
    { signal: 'One adset underperforming', action: 'Pause it, redistribute budget to the winning creative' },
    { signal: 'New patient video added', action: 'A/B test new video vs. current winner automatically' },
    { signal: 'Price vs. no-price unclear', action: 'Run both for 2 weeks, pick the winner by CPQ — not just CPL' },
  ]

  return (
    <section className="py-24 px-6 bg-navy-900/80" id="pro-optimizer">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Growth Plan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Clara's ads get smarter every week
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Most agencies report <span className="text-white/70 line-through">cost per lead</span>. We optimize for the only number that matters: <span className="text-teal-400 font-semibold">cost per booked patient</span>.
          </p>
        </div>

        {/* CPL vs CPQ callout */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">Typical agency</div>
            <div className="text-2xl font-bold text-white/40 mb-2 line-through">60 leads at $45 CPL</div>
            <p className="text-white/30 text-sm">Looks great on the monthly report. But 50 of them were tire-kickers who never answered the phone.</p>
          </div>
          <div className="bg-teal-500/[0.06] border border-teal-500/20 rounded-2xl p-6">
            <div className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">Clara AI</div>
            <div className="text-2xl font-bold text-white mb-2">12 leads at $210 CPQ</div>
            <p className="text-white/50 text-sm">Every lead scored, called within 60 seconds, and qualified. Clara knows which 12 are worth your front desk's time.</p>
          </div>
        </div>

        {/* Feedback loop */}
        <div className="mb-16">
          <h3 className="text-center text-white/60 text-sm uppercase tracking-widest font-semibold mb-8">The self-improving loop</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 h-full">
                  <div className="text-2xl mb-3">{step.icon}</div>
                  <div className="text-white font-semibold text-sm mb-2">{step.label}</div>
                  <div className="text-white/40 text-xs leading-relaxed">{step.detail}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 z-10 text-teal-400/40 text-lg">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Smart adjustments */}
        <div>
          <h3 className="text-center text-white/60 text-sm uppercase tracking-widest font-semibold mb-8">What Clara adjusts automatically</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {adjustments.map((adj, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4">
                <div className="flex-shrink-0 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-1.5 text-xs font-mono text-indigo-400 whitespace-nowrap">
                  {adj.signal}
                </div>
                <div className="text-white/60 text-sm leading-relaxed">→ {adj.action}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/25 text-xs mt-6">
            Clara only acts when the signal is clear. When it's not, she tells you what she found and waits for your input.
          </p>
        </div>

      </div>
    </section>
  )
}

export default function Home() {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Clara AI",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "Clara is an AI dental receptionist that answers calls 24/7, captures leads, books consultations, and automates follow-up for dental practices.",
        "url": "https://iamclara.ai",
        "offers": [
          {
            "@type": "Offer",
            "name": "Core Plan",
            "price": "299",
            "priceCurrency": "USD",
            "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P1M" }
          },
          {
            "@type": "Offer",
            "name": "Growth Plan",
            "price": "449",
            "priceCurrency": "USD",
            "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P1M" }
          }
        ],
        "provider": { "@type": "Organization", "name": "Clara AI", "url": "https://iamclara.ai" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How does call forwarding work?", "acceptedAnswer": { "@type": "Answer", "text": "You configure your practice phone to forward to your Clara number after 2–3 rings. Clara answers immediately after that. Setup takes about 5 minutes through your phone carrier or VoIP portal." } },
          { "@type": "Question", "name": "What happens if Clara doesn't understand a caller?", "acceptedAnswer": { "@type": "Answer", "text": "Clara is graceful about it — she asks clarifying questions naturally. If a caller has an urgent emergency, she routes them appropriately and fires an alert to your team immediately." } },
          { "@type": "Question", "name": "Can Clara book appointments directly?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — for consultation appointments (implants, cosmetics, etc.), Clara checks your Google Calendar in real time and books directly. For general appointments, she collects info and your front desk calls back." } },
          { "@type": "Question", "name": "Does it work with my existing phone number?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. You keep your practice number. Clara is assigned a dedicated Twilio number that your main number forwards to. Patients never know the difference." } },
          { "@type": "Question", "name": "Is there a setup fee or contract?", "acceptedAnswer": { "@type": "Answer", "text": "No setup fees, no contracts, no hidden costs. Pay month-to-month and cancel anytime." } },
          { "@type": "Question", "name": "What practice management systems does it work with?", "acceptedAnswer": { "@type": "Answer", "text": "Clara is PMS-agnostic — it works alongside Dentrix, Eaglesoft, Open Dental, Curve, and any other PMS." } }
        ]
      }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <Differentiators />
      <TieredIntelligence />
      <ProOptimizer />
      <Pricing />
      <FAQ />
      <CTA />
      <SecurityTrust />
      <Footer />
    </>
  )
}
