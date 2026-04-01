"use client";

import { useState, useEffect } from "react";

const BACKEND = "https://mqxnyexmrk.us-east-1.awsapprunner.com";

type Slot = { label: string; iso: string };
type Step = "procedure" | "slots" | "info" | "card" | "confirmed" | "disqualified";

interface Procedure {
  id: string;
  name: string;
  duration: string;
  icon: string;
}

const PROCEDURES: Procedure[] = [
  { id: "full_arch", name: "Full Arch Implants", duration: "60 min consult", icon: "🦷" },
  { id: "single_implant", name: "Dental Implant", duration: "45 min consult", icon: "🔬" },
  { id: "veneers", name: "Veneers / Smile Makeover", duration: "45 min consult", icon: "✨" },
  { id: "general", name: "General / Other", duration: "30 min consult", icon: "📋" },
];

// Procedures that require financing qualification
const FINANCING_REQUIRED = ["full_arch", "single_implant"];

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function BookingClient({ slug, practiceName, primaryColor }: {
  slug: string;
  practiceName: string;
  primaryColor: string;
}) {
  const P = primaryColor || "#0d9488";
  const [step, setStep] = useState<Step>("procedure");
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [cardUrl, setCardUrl] = useState("");
  const [noDepositRequired, setNoDepositRequired] = useState(false);

  // Fetch slots when procedure selected
  useEffect(() => {
    if (!procedure) return;
    setSlotsLoading(true);
    setSlots([]);
    fetch(`${BACKEND}/public/${slug}/slots?procedure=${procedure.id}&count=12`)
      .then(r => r.json())
      .then(d => {
        const raw: string[] = d.slots || [];
        setSlots(raw.map(iso => ({
          iso,
          label: new Date(iso).toLocaleString("en-US", {
            weekday: "short", month: "short", day: "numeric",
            hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
          }),
        })));
      })
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [procedure, slug]);

  async function handleConfirmInfo() {
    if (!name.trim() || !phone.replace(/\D/g, "").match(/^\d{10}$/)) {
      setError("Please enter your name and a valid 10-digit phone number.");
      return;
    }
    // Credit score gate for financing-required procedures
    if (FINANCING_REQUIRED.includes(procedure?.id || "")) {
      if (!creditScore) {
        setError("Please select your estimated credit score.");
        return;
      }
      if (creditScore === "below_580") {
        setStep("disqualified");
        return;
      }
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND}/public/${slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: "+1" + phone.replace(/\D/g, ""),
          email: email.trim() || undefined,
          procedure: procedure!.id,
          slot_iso: selectedSlot!.iso,
          slot_label: selectedSlot!.label,
          source: "online_scheduler",
          credit_score: creditScore || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Booking failed");

      setBookingId(data.lead_id);

      if (data.card_url) {
        setCardUrl(data.card_url);
        setStep("card");
      } else {
        // Redirect to thank you page
        const params = new URLSearchParams({
          slot: selectedSlot!.label,
          name: name.trim(),
          practice: practiceName,
        });
        window.location.href = `/book/confirmed?${params.toString()}`;
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const progressSteps = ["procedure", "slots", "info", "card", "confirmed"];
  const progressIdx = progressSteps.indexOf(step);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2240 60%, #0f3460 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px", fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32, maxWidth: 480, width: "100%" }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
          {practiceName}
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
          Book your consultation — takes 60 seconds
        </div>
      </div>

      {/* Progress bar */}
      {step !== "confirmed" && (
        <div style={{ display: "flex", gap: 6, marginBottom: 28, maxWidth: 480, width: "100%" }}>
          {["Choose Service", "Pick a Time", "Your Info", "Secure Spot"].map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                height: 4, borderRadius: 2, marginBottom: 4,
                background: i <= progressIdx - 1 ? P : i === progressIdx ? P : "rgba(255,255,255,0.15)",
                opacity: i === progressIdx ? 1 : i < progressIdx ? 0.7 : 0.3,
                transition: "all 0.3s",
              }} />
              <div style={{ fontSize: 10, color: i <= progressIdx ? P : "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card */}
      <div style={{
        background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
        padding: "28px 24px", maxWidth: 480, width: "100%",
      }}>

        {/* STEP 1: Procedure */}
        {step === "procedure" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
              What can we help you with?
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              Select the service you're interested in
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PROCEDURES.map(p => (
                <button key={p.id} onClick={() => { setProcedure(p); setStep("slots"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 14,
                    border: `1px solid rgba(255,255,255,0.1)`,
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff", cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = `rgba(${hexToRgb(P)},0.15)`)}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                >
                  <span style={{ fontSize: 24 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{p.duration}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 18 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Slots */}
        {step === "slots" && (
          <div>
            <button onClick={() => setStep("procedure")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", marginBottom: 12, padding: 0 }}>
              ← Back
            </button>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              {procedure?.icon} {procedure?.name}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              Pick a time that works for you
            </div>
            {slotsLoading ? (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "32px 0", fontSize: 14 }}>
                Loading available times…
              </div>
            ) : slots.length === 0 ? (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "32px 0", fontSize: 14 }}>
                No slots available right now. Call us directly!
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {slots.map(slot => (
                  <button key={slot.iso} onClick={() => { setSelectedSlot(slot); setStep("info"); }}
                    style={{
                      padding: "12px 8px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                      border: `1px solid rgba(255,255,255,0.1)`,
                      background: "rgba(255,255,255,0.05)", color: "#fff",
                      cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(${hexToRgb(P)},0.2)`; e.currentTarget.style.borderColor = P; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Info */}
        {step === "info" && (
          <div>
            <button onClick={() => setStep("slots")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", marginBottom: 12, padding: 0 }}>
              ← Back
            </button>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
              Almost there!
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              📅 {selectedSlot?.label} · {procedure?.name}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Full Name *
                </label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Phone Number *
                </label>
                <input value={phone} onChange={e => setPhone(formatPhone(e.target.value))}
                  placeholder="(555) 123-4567" type="tel"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Email (optional — for confirmation)
                </label>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="jane@email.com" type="email"
                  style={inputStyle}
                />
              </div>
              {/* Credit score — only for financing-required procedures */}
              {FINANCING_REQUIRED.includes(procedure?.id || "") && (
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                    Estimated Credit Score * <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>(for financing eligibility)</span>
                  </label>
                  <select value={creditScore} onChange={e => setCreditScore(e.target.value)}
                    style={{ ...inputStyle, color: creditScore ? "#fff" : "rgba(255,255,255,0.4)" }}>
                    <option value="" disabled>Select credit score range</option>
                    <option value="750+">750+ (Excellent)</option>
                    <option value="700-749">700–749 (Good)</option>
                    <option value="650-699">650–699 (Fair)</option>
                    <option value="580-649">580–649 (Below Average)</option>
                    <option value="below_580">Below 580</option>
                  </select>
                </div>
              )}
            </div>
            {error && (
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13 }}>
                {error}
              </div>
            )}
            <button onClick={handleConfirmInfo} disabled={submitting}
              style={{
                width: "100%", marginTop: 20, padding: "14px", borderRadius: 14,
                background: submitting ? "rgba(255,255,255,0.1)" : P,
                border: "none", color: "#fff", fontWeight: 800, fontSize: 15,
                cursor: submitting ? "default" : "pointer", transition: "all 0.2s",
              }}>
              {submitting ? "Booking…" : "Continue →"}
            </button>
          </div>
        )}

        {/* STEP: Disqualified */}
        {step === "disqualified" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💙</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
              Let's find the right path for you
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.7 }}>
              Cherry financing typically requires a 580+ credit score.
              We don't want to waste your time — but we'd still love to talk through your options.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="tel:3016522222" style={{
                display: "block", padding: "14px", borderRadius: 14,
                background: primaryColor, color: "#fff", fontWeight: 800, fontSize: 15,
                textDecoration: "none", textAlign: "center",
              }}>
                📞 Call Us — (301) 652-2222
              </a>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                We can discuss cash pricing, payment plans, and other options
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Card on file */}
        {step === "card" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              One last step — secure your spot
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.6 }}>
              We require a card on file to hold your appointment.
              <br />
              <strong style={{ color: "#fff" }}>No charge today.</strong> A $50 fee only applies if
              you no-show without 24-hour notice.
            </div>
            <a href={cardUrl}
              style={{
                display: "block", width: "100%", padding: "14px", borderRadius: 14,
                background: P, color: "#fff", fontWeight: 800, fontSize: 15,
                textDecoration: "none", textAlign: "center", marginBottom: 12,
              }}>
              Add Card to Confirm Booking →
            </a>
            <button onClick={() => {
              const params = new URLSearchParams({ slot: selectedSlot?.label || "", name, practice: practiceName });
              window.location.href = `/book/confirmed?${params.toString()}`;
            }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer" }}>
              Skip for now (booking not guaranteed)
            </button>
          </div>
        )}

        {/* STEP 5: Confirmed */}
        {step === "confirmed" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              {noDepositRequired ? "You're all set!" : "Booking request received!"}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20, lineHeight: 1.7 }}>
              <strong style={{ color: "#fff" }}>{selectedSlot?.label}</strong>
              <br />
              {procedure?.name} at {practiceName}
              <br /><br />
              We'll send a confirmation to your phone shortly.
              {!noDepositRequired && " Complete the card step to lock in your spot."}
            </div>
            <div style={{
              padding: "14px 16px", borderRadius: 14,
              background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
              color: "#4ade80", fontSize: 13, fontWeight: 600,
            }}>
              ✅ Our team will confirm your appointment within minutes
            </div>
          </div>
        )}
      </div>

      {/* Trust bar */}
      <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {["🔒 Secure & Private", "⭐ 276 Reviews", "📅 Free Cancellation 24h+"].map(item => (
          <div key={item} style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{item}</div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 12,
  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box",
};

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : "13,148,136";
}
