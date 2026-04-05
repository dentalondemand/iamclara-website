"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmedContent() {
  const params = useSearchParams();
  const slot    = params.get("slot") || "";
  const name    = params.get("name") || "";
  const practice = params.get("practice") || "Radiant Dental Care";
  const first   = name.split(" ")[0] || "there";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2240 60%, #0f3460 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "24px 16px",
      fontFamily: "'Inter', sans-serif", textAlign: "center",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24,
        padding: "40px 32px", maxWidth: 460, width: "100%",
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8, margin: "0 0 8px" }}>
          You&apos;re booked, {first}!
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.7 }}>
          {slot
            ? <>Your consultation is confirmed for <strong style={{ color: "#fff" }}>{slot}</strong> at {practice}.</>
            : <>Your consultation at {practice} is confirmed.</>}
        </p>

        {/* What to expect */}
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: 16,
          padding: "20px", marginBottom: 20, textAlign: "left",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            What happens next
          </div>
          {[
            ["📱", "You'll get a confirmation text shortly"],
            ["⏰", "We'll send a reminder 24 hours before"],
            ["📍", "5454 Wisconsin Avenue, Suite 1415, Chevy Chase, MD 20815"],
            ["❓", "Questions? Call (301) 652-2222"],
          ].map(([icon, text]) => (
            <div key={text as string} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{text as string}</span>
            </div>
          ))}
        </div>

        <div style={{
          padding: "14px 16px", borderRadius: 14,
          background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
          color: "#4ade80", fontSize: 13, fontWeight: 600,
        }}>
          ✅ A team member will confirm your appointment
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {["⭐ 276 Google Reviews", "🦷 Same-Day Results", "🔒 HIPAA Secure"].map(item => (
          <div key={item} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{item}</div>
        ))}
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense>
      <ConfirmedContent />
    </Suspense>
  );
}
