"use client";
import { useEffect, useState } from "react";

const BACKEND = "https://mqxnyexmrk.us-east-1.awsapprunner.com";

type Slot = {
  date: string;
  time: string;
  operatory_id?: string | null;
  provider_id?: string | null;
  appt_type_id?: string | null;
};

type AvailableResponse = {
  ok: boolean;
  enabled: boolean;
  slots: Slot[];
  duration_minutes: number;
};

type ConfirmResponse = {
  ok: boolean;
  booked: boolean;
  confirmation?: { provider?: string; result?: unknown; google_calendar?: unknown };
  error?: string;
};

type Phase = "loading" | "list" | "form" | "submitting" | "success" | "error" | "empty";

function formatSlot(iso: string): { day: string; time: string; weekday: string } {
  // Slot.time is an ISO string from backend, already in tenant TZ.
  // Render in the user's local TZ (most patients book locally) — backend
  // remains the source of truth for booking.
  try {
    const d = new Date(iso);
    return {
      weekday: d.toLocaleDateString(undefined, { weekday: "long" }),
      day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    };
  } catch {
    return { weekday: "", day: iso, time: "" };
  }
}

export default function SlotPickerModal({
  open,
  onClose,
  tenantId,
  procedureId,
  procedureName,
  primary,
  accent,
  onFallback,
}: {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  procedureId?: string;
  procedureName?: string;
  primary: string;
  accent: string;
  /** Called when the user picks "Have Clara call me instead" from a failure state. */
  onFallback?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmResponse["confirmation"]>(undefined);

  // Load slots whenever the modal opens
  useEffect(() => {
    if (!open) return;
    setPhase("loading");
    setSelected(null);
    setErrorMsg("");
    (async () => {
      try {
        const res = await fetch(
          `${BACKEND}/booking/available?tenant_id=${encodeURIComponent(tenantId)}` +
            (procedureId ? `&procedure_id=${encodeURIComponent(procedureId)}` : "") +
            `&days=5&max_slots=7`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          // 503 with no allowlist or no provider configured → empty state
          setPhase("empty");
          return;
        }
        const data: AvailableResponse = await res.json();
        if (!data.enabled) {
          // Tenant hasn't turned on the picker
          setPhase("empty");
          return;
        }
        if (!data.slots || data.slots.length === 0) {
          setPhase("empty");
          return;
        }
        setSlots(data.slots);
        setPhase("list");
      } catch {
        setPhase("error");
        setErrorMsg("We couldn't load available times. Please try again or have Clara call you.");
      }
    })();
  }, [open, tenantId, procedureId]);

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submitBooking() {
    if (!selected) return;
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Please enter your name and phone number.");
      return;
    }
    setPhase("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(`${BACKEND}/booking/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          procedure_id: procedureId,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          slot: selected,
          note: procedureName ? `Slot picker — ${procedureName}` : "Slot picker",
        }),
      });
      const data: ConfirmResponse = await res.json();
      if (!res.ok || !data.ok || !data.booked) {
        setPhase("error");
        setErrorMsg(data.error || "Booking didn't go through. Please try a different time.");
        return;
      }
      setConfirmation(data.confirmation);
      setPhase("success");
    } catch {
      setPhase("error");
      setErrorMsg("Network error — please try again.");
    }
  }

  // ── styling shared by all phases ───────────────────────────────────────────
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(8, 24, 40, 0.78)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 1000,
  };
  const modalStyle: React.CSSProperties = {
    background: "#0B2240",
    border: `1px solid color-mix(in oklab, ${accent} 30%, transparent)`,
    borderRadius: 20,
    padding: "28px 28px 24px",
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    overflow: "auto",
    color: "#fff",
    fontFamily: "var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
  };
  const headingStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow), sans-serif",
    fontSize: 22,
    fontWeight: 800,
    margin: "0 0 6px",
  };
  const subStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    margin: "0 0 20px",
  };
  const closeBtnStyle: React.CSSProperties = {
    position: "absolute",
    top: 14,
    right: 14,
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.5)",
    fontSize: 22,
    cursor: "pointer",
    width: 36,
    height: 36,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const inputStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };

  // ── phase-specific bodies ──────────────────────────────────────────────────
  let body: React.ReactNode;

  if (phase === "loading") {
    body = (
      <div role="status" aria-live="polite">
        <h2 style={headingStyle}>Finding available times…</h2>
        <p style={subStyle}>Checking the schedule now.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 64,
                borderRadius: 12,
                background: "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
                animation: "slot-pulse 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <style>{`@keyframes slot-pulse { 0%,100% { opacity: 0.6 } 50% { opacity: 1 } }`}</style>
      </div>
    );
  } else if (phase === "empty") {
    body = (
      <div>
        <h2 style={headingStyle}>No times available right now</h2>
        <p style={subStyle}>
          The schedule&apos;s tight this week. The fastest path is to have Clara call you to find a time that works.
        </p>
        <button
          onClick={() => {
            onClose();
            onFallback?.();
          }}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: primary,
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          📞 Have Clara call me instead
        </button>
      </div>
    );
  } else if (phase === "error") {
    body = (
      <div>
        <h2 style={headingStyle}>Something went wrong</h2>
        <p style={subStyle}>{errorMsg || "We couldn't complete your booking right now."}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => {
              setPhase("loading");
              setSelected(null);
              setErrorMsg("");
              // re-trigger fetch by toggling — re-run the effect
              setSlots([]);
              // Use a tick to let phase=loading paint; the open prop didn't change so
              // the effect won't re-run automatically. Manual refetch:
              (async () => {
                try {
                  const res = await fetch(
                    `${BACKEND}/booking/available?tenant_id=${encodeURIComponent(tenantId)}&days=5&max_slots=7`,
                    { cache: "no-store" }
                  );
                  const data: AvailableResponse = await res.json();
                  if (!data.enabled || !data.slots?.length) {
                    setPhase("empty");
                    return;
                  }
                  setSlots(data.slots);
                  setPhase("list");
                } catch {
                  setPhase("error");
                  setErrorMsg("Still having trouble. Please have Clara call you.");
                }
              })();
            }}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid color-mix(in oklab, ${accent} 40%, transparent)`,
              background: "transparent",
              color: accent,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ↻ Try again
          </button>
          <button
            onClick={() => {
              onClose();
              onFallback?.();
            }}
            style={{
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: primary,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            📞 Have Clara call me instead
          </button>
        </div>
      </div>
    );
  } else if (phase === "success") {
    body = (
      <div role="status" aria-live="polite" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
        <h2 style={headingStyle}>You&apos;re booked!</h2>
        <p style={subStyle}>
          We&apos;ll send a confirmation by phone or email shortly. Looking forward to meeting you.
        </p>
        {selected && (
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              border: `1px solid color-mix(in oklab, ${accent} 30%, transparent)`,
              marginBottom: 16,
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>
              YOUR APPOINTMENT
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {(() => {
                const f = formatSlot(selected.time);
                return `${f.weekday}, ${f.day} at ${f.time}`;
              })()}
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: primary,
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Done
        </button>
      </div>
    );
  } else if (phase === "form" || phase === "submitting") {
    const f = selected ? formatSlot(selected.time) : null;
    body = (
      <div>
        <h2 style={headingStyle}>Confirm your booking</h2>
        {f && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: `color-mix(in oklab, ${accent} 12%, transparent)`,
              border: `1px solid color-mix(in oklab, ${accent} 30%, transparent)`,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 12, color: accent, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>
              SELECTED TIME
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {f.weekday}, {f.day} at {f.time}
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name *"
            aria-label="Your name (required)"
            autoComplete="name"
            required
            style={inputStyle}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number *"
            aria-label="Phone number (required)"
            autoComplete="tel"
            type="tel"
            required
            style={inputStyle}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            aria-label="Email (optional)"
            autoComplete="email"
            type="email"
            style={inputStyle}
          />
          {errorMsg && (
            <div role="alert" style={{ color: "#f87171", fontSize: 13 }}>
              {errorMsg}
            </div>
          )}
          <button
            onClick={submitBooking}
            disabled={phase === "submitting"}
            style={{
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: primary,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: phase === "submitting" ? "default" : "pointer",
              opacity: phase === "submitting" ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {phase === "submitting" ? "Booking…" : "Confirm booking"}
          </button>
          <button
            onClick={() => {
              setPhase("list");
              setSelected(null);
              setErrorMsg("");
            }}
            style={{
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.55)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ← Pick a different time
          </button>
        </div>
      </div>
    );
  } else {
    // phase === "list"
    body = (
      <div>
        <h2 style={headingStyle}>Pick a time</h2>
        <p style={subStyle}>
          Free consultation. {slots.length} available {slots.length === 1 ? "time" : "times"} this week.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {slots.map((s, i) => {
            const f = formatSlot(s.time);
            const isSel = selected?.time === s.time;
            return (
              <button
                key={`${s.time}-${i}`}
                onClick={() => {
                  setSelected(s);
                  setPhase("form");
                  setErrorMsg("");
                }}
                aria-label={`Book ${f.weekday}, ${f.day} at ${f.time}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  border: isSel
                    ? `2px solid ${accent}`
                    : "1px solid rgba(255,255,255,0.12)",
                  borderLeft: `4px solid ${accent}`,
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 2 }}>
                    {f.weekday}, {f.day}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{f.time}</div>
                </div>
                <span style={{ fontSize: 18, color: accent }}>›</span>
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "16px 0 0", textAlign: "center" }}>
          Times shown in your local timezone.
        </p>
      </div>
    );
  }

  return (
    <div
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Pick an available appointment time"
    >
      <div style={{ ...modalStyle, position: "relative" }}>
        <button onClick={onClose} aria-label="Close" style={closeBtnStyle}>
          ×
        </button>
        {body}
      </div>
    </div>
  );
}
