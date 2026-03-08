"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

const PLAN_INFO: Record<string, { name: string; price: string; badge?: string; description: string }> = {
  core: {
    name: "Core Plan",
    price: "$199/month",
    description: "AI receptionist + call summaries + dashboard",
  },
  growth: {
    name: "Growth Plan",
    price: "$399/month",
    badge: "Founding Rate",
    description: "Core + social media automation — locked for life",
  },
  founders: {
    name: "Founding Member",
    price: "$399/month",
    badge: "Founding Rate",
    description: "Core + social media automation — locked for life",
  },
  pro: {
    name: "Pro Plan",
    price: "$799/month",
    badge: "Founding Rate",
    description: "Growth + lead capture, outbound calls & AI texting — locked for life",
  },
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "13px 16px",
  color: "#fff",
  fontSize: 15,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 7,
  marginBottom: 18,
  color: "rgba(255,255,255,0.65)",
  fontSize: 13,
  fontWeight: 500,
}

function GetStartedForm() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "core"
  const cancelled = searchParams.get("cancelled") === "true"

  const planInfo = PLAN_INFO[plan] || PLAN_INFO.core

  const [form, setForm] = useState({
    practice_name: "",
    admin_name: "",
    admin_email: "",
    phone: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function setField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const canSubmit =
    form.practice_name.trim() &&
    form.admin_name.trim() &&
    form.admin_email.trim() &&
    form.phone.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || submitting) return

    setSubmitting(true)
    setError("")

    try {
      const resp = await fetch(
        "https://ai-dental-receptionist-backend.onrender.com/public/start-onboarding",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            practice_name: form.practice_name.trim(),
            admin_name: form.admin_name.trim(),
            admin_email: form.admin_email.trim().toLowerCase(),
            phone: form.phone.trim(),
            plan,
          }),
        }
      )

      const data = await resp.json()

      if (!resp.ok || !data.ok) {
        throw new Error(data.detail || data.error || "Something went wrong. Please try again.")
      }

      // Redirect to Stripe checkout
      window.location.href = data.checkout_url
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(msg)
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D1520",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px 80px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", marginBottom: 40 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
          Clara <span style={{ color: "#2DD4BF" }}>AI</span>
        </span>
      </a>

      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#141E2B",
          borderRadius: 24,
          padding: "36px 32px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* Plan badge */}
        <div
          style={{
            background: "rgba(45,212,191,0.1)",
            border: "1px solid rgba(45,212,191,0.25)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{planInfo.name}</span>
            {planInfo.badge && (
              <span
                style={{
                  background: "#0d9488",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 20,
                  letterSpacing: "0.03em",
                }}
              >
                {planInfo.badge}
              </span>
            )}
          </div>
          <div style={{ color: "#2DD4BF", fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
            {planInfo.price}
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{planInfo.description}</div>
        </div>

        {/* Cancellation notice */}
        {cancelled && (
          <div
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.25)",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 24,
              color: "#fbbf24",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Payment cancelled — your information was saved. Complete payment below.
          </div>
        )}

        <h1
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            margin: "0 0 6px",
          }}
        >
          Tell us about your practice
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 14,
            margin: "0 0 28px",
            lineHeight: 1.5,
          }}
        >
          Takes 30 seconds. You&apos;ll complete payment on the next screen.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Practice Name
            <input
              value={form.practice_name}
              onChange={e => setField("practice_name", e.target.value)}
              placeholder="Radiant Dental Care"
              style={inputStyle}
              required
              autoComplete="organization"
            />
          </label>

          <label style={labelStyle}>
            Doctor&apos;s Name
            <input
              value={form.admin_name}
              onChange={e => setField("admin_name", e.target.value)}
              placeholder="Dr. Smith"
              style={inputStyle}
              required
              autoComplete="name"
            />
          </label>

          <label style={labelStyle}>
            Email Address
            <input
              type="email"
              value={form.admin_email}
              onChange={e => setField("admin_email", e.target.value)}
              placeholder="admin@yourpractice.com"
              style={inputStyle}
              required
              autoComplete="email"
            />
          </label>

          <label style={labelStyle}>
            Phone Number
            <input
              type="tel"
              value={form.phone}
              onChange={e => setField("phone", e.target.value)}
              placeholder="(301) 555-0100"
              style={inputStyle}
              required
              autoComplete="tel"
            />
          </label>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#f87171",
                fontSize: 13,
                marginBottom: 18,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            style={{
              width: "100%",
              background:
                canSubmit && !submitting
                  ? "linear-gradient(135deg, #14B8A6, #0d9488)"
                  : "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 50,
              padding: "15px 24px",
              color: canSubmit && !submitting ? "#fff" : "rgba(255,255,255,0.3)",
              fontSize: 16,
              fontWeight: 700,
              cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {submitting ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Setting up your account…
              </>
            ) : (
              "Continue to Payment →"
            )}
          </button>
        </form>

        <p
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: 12,
            textAlign: "center",
            marginTop: 20,
            marginBottom: 0,
            lineHeight: 1.5,
          }}
        >
          🔒 Secure checkout powered by Stripe. Cancel anytime.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function GetStarted() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0D1520", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading…</div>
      </div>
    }>
      <GetStartedForm />
    </Suspense>
  )
}
