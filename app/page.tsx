"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const DASHBOARD_URL = 'https://ai-receptionist-dashboard-seven.vercel.app'

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-navy-800/80">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">Clara<span className="text-teal-400">.</span></span>
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
          <a href="#pricing"
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
          Clara handles every inbound call, captures patient intent, sends your team instant summaries,
          and follows up on leads automatically — so you never miss a case.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="#pricing"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 glow">
            Start for $149/month
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
            { value: '$450+', label: 'Saved vs Yobi/mo' },
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
      desc: 'Clara doesn\'t follow a rigid script. She understands natural speech, handles unexpected questions, and keeps the conversation flowing.',
    },
    {
      icon: '📋',
      title: 'Instant Call Summaries',
      desc: 'Every call ends with a structured summary — caller name, intent, phone number, preferred callback time. Your team sees everything they need at a glance.',
    },
    {
      icon: '🚨',
      title: 'High-Priority Alerts',
      desc: 'Implant consults, cosmetic inquiries, and emergencies trigger immediate SMS and email alerts to your team — no checking the dashboard required.',
    },
    {
      icon: '📅',
      title: 'Automatic Consultation Booking',
      desc: 'Clara checks your Google Calendar in real time and books implant consultations directly — no back-and-forth, no double-booking.',
    },
    {
      icon: '🎙️',
      title: 'Call Recording + Dashboard',
      desc: 'Every call is recorded and accessible from the web or mobile app. Filter by status, play recordings, and review summaries from anywhere.',
    },
    {
      icon: '🔒',
      title: 'HIPAA-Conscious Design',
      desc: 'Calls are recorded and stored securely. No patient data is shared with third parties. Built specifically for dental practices.',
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

        {/* Growth tier teaser */}
        <div className="mt-10 bg-teal-500/10 border border-teal-500/20 rounded-2xl p-8 text-center">
          <div className="text-2xl mb-2">📣</div>
          <h3 className="text-xl font-semibold mb-2">Plus: Outbound Lead Follow-Up</h3>
          <p className="text-white/50 max-w-xl mx-auto">
            Available in the Growth plan — Clara automatically calls Facebook leads and website form submissions,
            qualifies interest, and books consultations without your team lifting a finger.
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

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Core Plan */}
          <div className="bg-card-gradient border border-white/10 rounded-3xl p-8 flex flex-col">
            <div className="mb-6">
              <div className="text-teal-400 text-sm font-bold tracking-widest mb-2">CORE</div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold">$149</span>
                <span className="text-white/40 mb-2">/month</span>
              </div>
              <p className="text-white/50 text-sm">
                Everything you need to replace your answering service and never miss a patient call.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                '24/7 AI inbound call answering',
                'Natural LLM conversation',
                'Instant call summaries',
                'High-priority SMS + email alerts',
                'Call recording + playback',
                'Web + mobile dashboard',
                'Google Calendar integration',
                'Automatic consultation booking',
                'Unlimited calls',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <a href="mailto:hello@iamclara.ai?subject=Clara Core - Get Started"
              className="block text-center bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3.5 rounded-full transition-colors">
              Get Started
            </a>
            <p className="text-center text-white/30 text-xs mt-3">No credit card required to start</p>
          </div>

          {/* Growth Plan */}
          <div className="relative bg-card-gradient border border-teal-500/40 rounded-3xl p-8 flex flex-col glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">COMING SOON</span>
            </div>

            <div className="mb-6">
              <div className="text-teal-400 text-sm font-bold tracking-widest mb-2">GROWTH</div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold text-white/40">$—</span>
              </div>
              <p className="text-white/50 text-sm">
                Everything in Core, plus automated outbound lead follow-up and marketing integrations.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Everything in Core',
                'Outbound lead calling (Facebook, website forms)',
                'Lead qualification & booking',
                'Google Sheets integration',
                'Lead tracking dashboard',
                'Automated retry scheduling',
                'Results write-back to your CRM',
                'Priority support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                  <span className="text-teal-400/50 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <a href="mailto:hello@iamclara.ai?subject=Clara Growth - Notify Me"
              className="block text-center border border-teal-500/40 hover:border-teal-400 text-white/70 hover:text-white font-semibold py-3.5 rounded-full transition-colors">
              Notify Me When Available
            </a>
          </div>
        </div>

        {/* Savings callout */}
        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm">
            💡 The average dental answering service costs <span className="text-white/70 font-semibold">$500–$700/month</span>.
            Clara Core saves you <span className="text-teal-400 font-semibold">$350–550/month</span> — and works harder.
          </p>
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
            <a href="mailto:hello@iamclara.ai?subject=Clara - Get Started"
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
          <span className="text-xl font-bold text-white">Clara<span className="text-teal-400">.</span></span>
          <span className="text-white/30 text-sm ml-2">AI Dental Receptionist</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/40">
          <a href="#how-it-works" className="hover:text-white/70 transition-colors">How it works</a>
          <a href="#features" className="hover:text-white/70 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white/70 transition-colors">Pricing</a>
          <a href="mailto:hello@iamclara.ai" className="hover:text-white/70 transition-colors">Contact</a>
        </div>
        <div className="text-white/30 text-sm">
          © 2026 Clara AI. All rights reserved.
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
