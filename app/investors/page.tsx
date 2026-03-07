"use client"
import { useState } from 'react'
import Link from 'next/link'

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-navy-800/80">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">Clara <span className="text-teal-400">AI</span></span>
        </Link>
        <Link href="/get-started"
          className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
          Get Started
        </Link>
      </div>
    </nav>
  )
}

const STATS = [
  { value: "$25B+", label: "US dental practice management market" },
  { value: "200K+", label: "dental practices in the US alone" },
  { value: "62%", label: "of calls to dental offices go unanswered" },
  { value: "$50K+", label: "average revenue per new implant patient" },
]

const MILESTONES = [
  { done: true,  label: "Product built & deployed" },
  { done: true,  label: "First paying practice live" },
  { done: true,  label: "Outbound lead calling (AI-to-patient)" },
  { done: true,  label: "Multi-tenant architecture" },
  { done: false, label: "10 paying practices" },
  { done: false, label: "Stripe billing automation" },
  { done: false, label: "Google / Meta ad integrations" },
  { done: false, label: "White-label & franchise licensing" },
]

export default function InvestorsPage() {
  const [form, setForm] = useState({ name: "", email: "", firm: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      await fetch("https://ai-dental-receptionist-backend.onrender.com/public/investor-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } catch {}
    setSent(true)
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <Nav />

      {/* ── Hero ── */}
      <section className="pt-36 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Investor Relations
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            The AI receptionist<br />
            <span className="text-teal-400">every dental practice needs.</span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
            Clara answers every call, captures every lead, and books consultations automatically —
            replacing a $50,000/year front desk role for $199/month.
          </p>
        </div>
      </section>

      {/* ── Market Stats ── */}
      <section className="py-16 px-6 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold text-teal-400 mb-2">{s.value}</div>
              <div className="text-sm text-white/50 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">The Problem</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📞",
                title: "Calls go unanswered",
                body: "Most dental offices miss 40–60% of inbound calls. Each missed call is a lost patient worth thousands.",
              },
              {
                icon: "💸",
                title: "Front desk is expensive",
                body: "A single receptionist costs $45–60K/year plus benefits — and they still can't answer calls after hours or on hold.",
              },
              {
                icon: "🚫",
                title: "Leads fall through",
                body: "High-value implant and cosmetic leads from Facebook and web forms rarely get followed up within the critical first hour.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Solution ── */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">What Clara Does</h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            A fully autonomous AI receptionist that works 24/7, speaks naturally, and never calls in sick.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: "🎙️", title: "Answers every call", body: "Natural voice conversations via ElevenLabs AI — patients can't tell it's not human." },
              { icon: "📋", title: "Captures intake", body: "Name, callback number, reason for visit — all structured and sent to staff instantly." },
              { icon: "📞", title: "Outbound lead calling", body: "Clara calls web and Facebook leads within minutes. 3-attempt follow-up schedule, fully automated." },
              { icon: "📅", title: "Books consultations", body: "Offers real calendar slots and confirms appointments without any staff involvement." },
              { icon: "📊", title: "Live dashboard", body: "Full call history, transcripts, lead pipeline, and analytics — accessible anywhere." },
              { icon: "📱", title: "Social media content", body: "Generates on-brand posts from clinical photos and auto-schedules them to Instagram and Facebook." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="font-semibold mb-1">{f.title}</div>
                  <div className="text-white/50 text-sm leading-relaxed">{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Traction ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Traction & Roadmap</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {MILESTONES.map((m) => (
              <div key={m.label} className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${
                m.done
                  ? "border-teal-500/30 bg-teal-500/[0.06]"
                  : "border-white/10 bg-white/[0.02]"
              }`}>
                <span className={`text-lg flex-shrink-0 ${m.done ? "text-teal-400" : "text-white/20"}`}>
                  {m.done ? "✓" : "○"}
                </span>
                <span className={`text-sm font-medium ${m.done ? "text-white" : "text-white/40"}`}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business Model ── */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Business Model</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: "Core",
                price: "$199/mo",
                color: "border-white/20",
                accent: "text-white",
                features: ["Inbound AI receptionist", "Call summaries + transcripts", "Staff notifications", "Live dashboard"],
              },
              {
                tier: "Growth",
                price: "$999/mo",
                color: "border-teal-500/50",
                accent: "text-teal-400",
                features: ["Everything in Core", "Outbound lead calling", "Facebook & Google ad leads", "Landing page system", "Social media automation"],
              },
              {
                tier: "Pro",
                price: "$1,499/mo",
                color: "border-white/20",
                accent: "text-white",
                features: ["Multi-location", "White-label", "Dedicated support", "API access"],
              },
            ].map((t) => (
              <div key={t.tier} className={`border ${t.color} rounded-2xl p-6 bg-white/[0.03]`}>
                <div className={`text-sm font-semibold uppercase tracking-widest mb-1 ${t.accent}`}>{t.tier}</div>
                <div className="text-2xl font-bold mb-5">{t.price}<span className="text-sm text-white/40 font-normal"> /practice</span></div>
                <ul className="space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-8">
            Pure SaaS — flat monthly recurring revenue, no per-call fees, no ad spend markup.
          </p>
        </div>
      </section>

      {/* ── Why Now ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Now</h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            Conversational AI crossed the threshold in 2024. ElevenLabs' voice quality is indistinguishable
            from human. Twilio makes telephony programmable. GPT-4 class models handle complex intake logic.
            The infrastructure finally exists to replace the front desk — and dental is the perfect beachhead.
            High-value procedures, a fragmented $25B market, and owners who desperately want to reduce overhead.
          </p>
          <p className="text-white/60 text-lg leading-relaxed">
            We're not building a phone tree. We're building the autonomous practice operator —
            starting with the phone, expanding to scheduling, billing reminders, follow-up care, and beyond.
          </p>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="py-20 px-6 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">Get in Touch</h2>
          <p className="text-white/50 text-center mb-10">Interested in learning more? We'd love to connect.</p>

          {sent ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Thanks for reaching out!</h3>
              <p className="text-white/50">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Your name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-teal-500/60 text-sm"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-teal-500/60 text-sm"
                    placeholder="john@fund.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Firm / Organization</label>
                <input
                  value={form.firm}
                  onChange={(e) => setForm({ ...form, firm: e.target.value })}
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-teal-500/60 text-sm"
                  placeholder="Acme Ventures"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-teal-500/60 text-sm resize-none"
                  placeholder="Tell us about your interest or what you'd like to know..."
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                {sending ? "Sending…" : "Send Message"}
              </button>
              <p className="text-center text-white/30 text-xs">
                Or email us directly at{" "}
                <a href="mailto:invest@iamclara.ai" className="text-teal-400 hover:underline">invest@iamclara.ai</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-white/10 text-center text-white/30 text-sm">
        <span className="font-semibold text-white/50">Clara AI</span> © {new Date().getFullYear()} · All rights reserved ·{" "}
        <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
      </footer>
    </div>
  )
}
