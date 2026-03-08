"use client"
import { useState } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    id: 1,
    label: "Cover",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-12">
        <div className="text-6xl mb-6">🦷</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Clara <span className="text-teal-400">AI</span>
        </h1>
        <p className="text-2xl text-white/60 mb-8">The AI Receptionist for Dental Practices</p>
        <div className="inline-block bg-teal-500/10 border border-teal-500/30 rounded-full px-6 py-2 text-teal-400 text-sm font-semibold tracking-wide">
          SEED ROUND — 2026
        </div>
        <p className="text-white/30 text-sm mt-8">iamclara.ai · invest@iamclara.ai</p>
      </div>
    ),
  },
  {
    id: 2,
    label: "Problem",
    content: (
      <div className="px-10 py-8">
        <SlideHeading>The Problem</SlideHeading>
        <p className="text-white/50 text-lg mb-10">Dental practices are hemorrhaging revenue every single day.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { stat: "62%", label: "of calls go unanswered", sub: "Every missed call is a missed patient worth $3K–$50K in lifetime revenue." },
            { stat: "$55K", label: "avg. receptionist cost/year", sub: "Plus benefits, PTO, and sick days — and they still can't work after hours." },
            { stat: "< 5%", label: "of ad leads get called back within 1 hour", sub: "Speed-to-lead is the #1 predictor of conversion. Most practices fail it completely." },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-5xl font-bold text-red-400 mb-2">{s.stat}</div>
              <div className="font-semibold mb-2 text-white">{s.label}</div>
              <div className="text-white/40 text-sm leading-relaxed">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: "Solution",
    content: (
      <div className="px-10 py-8">
        <SlideHeading>The Solution</SlideHeading>
        <p className="text-white/50 text-lg mb-10">Clara AI is a fully autonomous receptionist — answers calls, captures leads, books consultations.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: "🎙️", title: "Answers every call, 24/7", body: "ElevenLabs voice AI — indistinguishable from human. Handles intake, FAQs, hours, emergencies." },
            { icon: "📞", title: "Calls leads within minutes", body: "New web and Facebook leads get called back automatically. 3-attempt follow-up until answered." },
            { icon: "📅", title: "Books consultations", body: "Offers real calendar slots, confirms appointments — zero staff involvement." },
            { icon: "📱", title: "Social media on autopilot", body: "Upload a clinical photo → Clara writes the caption and posts to Instagram & Facebook." },
            { icon: "📊", title: "Full practice dashboard", body: "Call history, transcripts, lead pipeline, analytics — web + mobile." },
            { icon: "🌐", title: "Multilingual", body: "Auto-detects caller language. 21 languages supported. Responds naturally in kind." },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-1">{f.title}</div>
                <div className="text-white/45 text-sm leading-relaxed">{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    label: "Market",
    content: (
      <div className="px-10 py-8">
        <SlideHeading>Market Opportunity</SlideHeading>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            {[
              { label: "TAM", value: "$25B+", sub: "US dental practice management software market" },
              { label: "SAM", value: "$6B+", sub: "200,000+ US dental practices needing front desk automation" },
              { label: "SOM", value: "$600M+", sub: "30,000 implant & cosmetic-focused practices (our beachhead)" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-5">
                <div className="text-xs font-bold text-white/40 tracking-widest w-10 flex-shrink-0">{m.label}</div>
                <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4">
                  <div className="text-3xl font-bold text-teal-400">{m.value}</div>
                  <div className="text-white/50 text-sm mt-1">{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white/80">Why dental first?</h3>
            {[
              "High-value procedures ($3K–$50K per case) justify premium software spend",
              "Fragmented market — 85% of practices are independent, not corporate",
              "Practice owners are tech-forward but time-starved",
              "Clear ROI: one saved implant consultation pays for 5 years of Clara Pro",
              "Natural expansion: orthodontics, oral surgery, med spas",
            ].map((p) => (
              <div key={p} className="flex items-start gap-3 text-sm text-white/60">
                <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span>{p}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    label: "Business Model",
    content: (
      <div className="px-10 py-8">
        <SlideHeading>Business Model</SlideHeading>
        <p className="text-white/50 text-lg mb-8">Pure SaaS. Flat monthly recurring revenue. No per-call fees, no ad spend markup.</p>
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            { tier: "Core", price: "$199", color: "border-white/20", accent: "text-white", features: ["AI inbound calls", "Summaries + alerts", "Dashboard + app"] },
            { tier: "Growth", price: "$499", color: "border-teal-500/50", accent: "text-teal-400", highlight: true, features: ["Everything in Core", "Social media automation", "Lab case tracker"] },
            { tier: "Pro", price: "$999", color: "border-amber-500/40", accent: "text-amber-400", features: ["Everything in Growth", "Outbound lead calling", "Landing page + ad leads"] },
          ].map((t) => (
            <div key={t.tier} className={`border ${t.color} rounded-2xl p-5 ${t.highlight ? "bg-teal-500/[0.06]" : "bg-white/[0.03]"}`}>
              <div className={`text-xs font-bold tracking-widest mb-1 ${t.accent}`}>{t.tier}</div>
              <div className="text-3xl font-bold mb-1">{t.price}<span className="text-sm text-white/40 font-normal">/mo</span></div>
              <ul className="space-y-1.5 mt-3">
                {t.features.map((f) => (
                  <li key={f} className="text-sm text-white/55 flex items-center gap-2">
                    <span className="text-teal-400 flex-shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 grid grid-cols-3 gap-6 text-center">
          {[
            { label: "Avg. MRR at Core", value: "$199" },
            { label: "Avg. MRR at Pro", value: "$999" },
            { label: "100 practices @ Pro", value: "$99.9K MRR" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-teal-400">{s.value}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 6,
    label: "Competition",
    content: (
      <div className="px-10 py-8">
        <SlideHeading>Competitive Landscape</SlideHeading>
        <p className="text-white/50 text-lg mb-8">Current alternatives are expensive, fragmented, and built for a pre-AI world.</p>
        <div className="overflow-x-auto rounded-2xl border border-white/10 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="text-left px-5 py-3 text-white/60 font-semibold"></th>
                {["Answering Service", "Social Media Agency", "Lead Gen Agency", "Clara AI"].map((h) => (
                  <th key={h} className={`text-center px-4 py-3 font-semibold ${h === "Clara AI" ? "text-teal-400" : "text-white/60"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["24/7 call answering", "✓", "✗", "✗", "✓"],
                ["Natural AI voice", "✗", "✗", "✗", "✓"],
                ["Outbound lead calling", "✗", "✗", "Partial", "✓"],
                ["Social media content", "✗", "✓", "✗", "✓"],
                ["Patient intake + CRM", "✗", "✗", "✗", "✓"],
                ["Monthly cost", "$500–700", "$800–1,500", "$2,000–5,000", "$199–999"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-white/[0.06]">
                  <td className="px-5 py-3 text-white/60 font-medium">{row[0]}</td>
                  {row.slice(1).map((cell, i) => (
                    <td key={i} className={`text-center px-4 py-3 ${
                      cell === "✓" ? "text-teal-400 font-bold" :
                      cell === "✗" ? "text-white/20" :
                      i === 3 ? "text-teal-400 font-bold" : "text-white/50"
                    }`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-white/40 text-sm">Clara AI is the only solution that replaces all four vendors in a single platform.</p>
      </div>
    ),
  },
  {
    id: 7,
    label: "Traction",
    content: (
      <div className="px-10 py-8">
        <SlideHeading>Traction</SlideHeading>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="font-semibold text-white/70 mb-4 text-sm uppercase tracking-widest">Completed ✓</h3>
            <div className="space-y-3">
              {[
                "Full product built — inbound IVR, outbound calls, dashboard, mobile app",
                "First paying practice live (Radiant Dental Care, Chevy Chase MD)",
                "Real patient leads captured and called back automatically",
                "Multi-tenant architecture — ready to onboard new practices in minutes",
                "Social media content pipeline live",
                "Legal: Privacy Policy, Terms, HIPAA-aligned data handling",
              ].map((m) => (
                <div key={m} className="flex items-start gap-3 bg-teal-500/[0.06] border border-teal-500/20 rounded-xl px-4 py-3 text-sm text-white/80">
                  <span className="text-teal-400 flex-shrink-0">✓</span>{m}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white/70 mb-4 text-sm uppercase tracking-widest">Next 6 Months</h3>
            <div className="space-y-3">
              {[
                "10 paying practices across 3 states",
                "Stripe billing fully automated",
                "Google & Meta lead ad native integration",
                "Two-way AI SMS nurture sequences",
                "White-label licensing for DSOs",
                "Expand to orthodontics & oral surgery",
              ].map((m) => (
                <div key={m} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50">
                  <span className="text-white/20 flex-shrink-0">○</span>{m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    label: "Vision",
    content: (
      <div className="px-10 py-8 flex flex-col justify-center h-full">
        <SlideHeading>The Bigger Vision</SlideHeading>
        <div className="max-w-2xl">
          <p className="text-white/60 text-xl leading-relaxed mb-8">
            We're not building a phone tree.
            <span className="text-white font-semibold"> We're building the autonomous practice operator.</span>
          </p>
          <div className="space-y-4 mb-10">
            {[
              { phase: "Phase 1 (Now)", title: "AI Receptionist", body: "Inbound calls, lead capture, social media — dental beachhead." },
              { phase: "Phase 2 (2026–27)", title: "AI Practice Manager", body: "Scheduling, recall reminders, billing follow-up, patient reviews, reputation management." },
              { phase: "Phase 3 (2027+)", title: "AI Practice Owner", body: "Fully autonomous practice ops — staffing recommendations, revenue optimization, multi-location management." },
            ].map((p) => (
              <div key={p.phase} className="flex gap-5 border border-white/10 rounded-xl p-5 bg-white/[0.03]">
                <div className="text-xs text-teal-400 font-semibold uppercase tracking-widest w-28 flex-shrink-0 mt-0.5">{p.phase}</div>
                <div>
                  <div className="font-bold mb-1">{p.title}</div>
                  <div className="text-white/50 text-sm">{p.body}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-sm">
            Starting with dental. Expanding to orthodontics, oral surgery, med spas, and beyond.
            The platform is specialty-agnostic — dental is the proof of concept.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    label: "Ask",
    content: (
      <div className="px-10 py-8 flex flex-col justify-center h-full">
        <SlideHeading>The Ask</SlideHeading>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-5xl font-bold text-teal-400 mb-2">$500K</div>
            <div className="text-white/50 text-lg mb-8">Seed Round</div>
            <h3 className="font-semibold text-white/70 mb-4 text-sm uppercase tracking-widest">Use of Funds</h3>
            <div className="space-y-3">
              {[
                { pct: "40%", label: "Sales & marketing — first 50 practices" },
                { pct: "35%", label: "Engineering — SMS nurture, ad integrations, billing automation" },
                { pct: "15%", label: "Infrastructure & compliance — HIPAA BAAs, SOC 2" },
                { pct: "10%", label: "Operations & legal" },
              ].map((u) => (
                <div key={u.label} className="flex items-center gap-4">
                  <div className="w-12 text-teal-400 font-bold text-sm flex-shrink-0">{u.pct}</div>
                  <div className="flex-1 text-white/60 text-sm">{u.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-white/70 mb-4 text-sm uppercase tracking-widest">18-Month Targets</h3>
            {[
              { label: "Paying practices", value: "50+" },
              { label: "Monthly Recurring Revenue", value: "$35K+ MRR" },
              { label: "Annual Run Rate", value: "$420K+ ARR" },
              { label: "Gross Margin", value: "80%+" },
            ].map((t) => (
              <div key={t.label} className="flex justify-between items-center border border-white/10 rounded-xl px-5 py-4 bg-white/[0.03]">
                <span className="text-white/50 text-sm">{t.label}</span>
                <span className="font-bold text-teal-400">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 10,
    label: "Contact",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-12">
        <div className="text-5xl mb-6">🦷</div>
        <h2 className="text-4xl font-bold mb-4">Let's build the future of dental together.</h2>
        <p className="text-white/50 text-xl mb-10 max-w-lg">
          Clara AI is live, generating revenue, and ready to scale.
          We'd love to tell you more.
        </p>
        <div className="space-y-3 mb-10">
          <a href="mailto:invest@iamclara.ai"
            className="block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-10 py-4 rounded-full transition-colors text-lg">
            invest@iamclara.ai
          </a>
          <a href="/investors"
            className="block bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-full transition-colors">
            Full Investor Page →
          </a>
        </div>
        <p className="text-white/30 text-sm">iamclara.ai · Chevy Chase, MD</p>
      </div>
    ),
  },
]

function SlideHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-bold mb-3 text-white">{children}</h2>
}

export default function DeckPage() {
  const [current, setCurrent] = useState(0)
  const slide = SLIDES[current]

  function prev() { if (current > 0) setCurrent(current - 1) }
  function next() { if (current < SLIDES.length - 1) setCurrent(current + 1) }

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col" style={{ fontFamily: "inherit" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="text-xl font-bold text-white">
          Clara <span className="text-teal-400">AI</span>
        </Link>
        <div className="text-white/40 text-sm">
          {current + 1} / {SLIDES.length}
        </div>
        <Link href="/investors" className="text-sm text-white/50 hover:text-white transition-colors">
          Investor Page →
        </Link>
      </div>

      {/* Slide tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-white/10 overflow-x-auto">
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setCurrent(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              i === current ? "bg-teal-500/20 text-teal-400" : "text-white/30 hover:text-white/60"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 max-w-6xl w-full mx-auto py-6 min-h-[520px]">
          {slide.content}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-white/10">
          <button onClick={prev} disabled={current === 0}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white disabled:opacity-20 transition-colors">
            ← Previous
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-teal-400" : "bg-white/20"}`} />
            ))}
          </div>
          <button onClick={next} disabled={current === SLIDES.length - 1}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white disabled:opacity-20 transition-colors">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
