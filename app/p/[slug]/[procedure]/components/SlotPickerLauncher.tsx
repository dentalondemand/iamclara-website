"use client";
import { useState } from "react";
import SlotPickerModal from "./SlotPickerModal";

export default function SlotPickerLauncher({
  tenantId,
  procedureId,
  procedureName,
  primary,
  accent,
  variant = "primary",
  label = "View Available Times",
}: {
  tenantId: string;
  procedureId?: string;
  procedureName?: string;
  primary: string;
  accent: string;
  /** "primary" = filled accent button. "secondary" = outline button. */
  variant?: "primary" | "secondary";
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  function scrollToLeadForm() {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  }

  const baseStyle: React.CSSProperties = {
    padding: "12px 22px",
    borderRadius: 50,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const styleByVariant: React.CSSProperties =
    variant === "primary"
      ? {
          ...baseStyle,
          border: "none",
          background: accent,
          color: "#0B2240",
        }
      : {
          ...baseStyle,
          border: `1.5px solid color-mix(in oklab, ${accent} 60%, transparent)`,
          background: "transparent",
          color: "#fff",
        };

  return (
    <>
      <button onClick={() => setOpen(true)} style={styleByVariant}>
        📅 {label}
      </button>
      <SlotPickerModal
        open={open}
        onClose={() => setOpen(false)}
        tenantId={tenantId}
        procedureId={procedureId}
        procedureName={procedureName}
        primary={primary}
        accent={accent}
        onFallback={scrollToLeadForm}
      />
    </>
  );
}
