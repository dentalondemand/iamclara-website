/**
 * Server-side layout for /p/[slug]/[procedure]
 * More specific OG tags — includes the procedure name in the title.
 * e.g. "Radiant Dental Care — Full Arch Implants | Chevy Chase, MD"
 */

import type { Metadata } from "next";
import { ReactNode } from "react";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";

interface LayoutProps {
  children: ReactNode;
  params: { slug: string; procedure: string };
}

async function fetchConfig(slug: string, procedure: string) {
  try {
    const res = await fetch(
      `${BACKEND}/marketing/config/public?tenant_id=${encodeURIComponent(slug)}&procedure_id=${encodeURIComponent(procedure)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function toReadable(id: string): string {
  const map: Record<string, string> = {
    full_arch: "Full Arch Implants",
    single_implant: "Single Tooth Implant",
    no_prep_veneers: "No-Prep Veneers",
    veneers: "Porcelain Veneers",
    smile_makeover: "Smile Makeover",
    invisalign: "Invisalign",
    whitening: "Teeth Whitening",
    crowns: "Same-Day Crowns",
    bone_graft: "Bone Grafting",
    implant_consult: "Implant Consultation",
  };
  return map[id] || id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug, procedure } = params;
  const config = await fetchConfig(slug, procedure);

  const practiceName = config?.practice_name
    || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const procedureName = config?.procedure?.name || toReadable(procedure);
  const city = config?.city || config?.practice_city || "";
  const state = config?.state || config?.practice_state || "";
  const location = [city, state].filter(Boolean).join(", ");

  const title = location
    ? `${practiceName} — ${procedureName} | ${location}`
    : `${practiceName} — ${procedureName}`;

  const differentiators = config?.practice_differentiators || "";
  const description = differentiators
    ? `${differentiators.split(".")[0].trim()}. Free ${procedureName} consultation at ${practiceName}${location ? ` in ${location}` : ""}.`
    : `Book a free ${procedureName} consultation at ${practiceName}${location ? ` in ${location}` : ""}. Same-day results, no pressure.`;

  const ogImage = config?.hero_image_url || config?.logo_url || "https://iamclara.ai/og-dental.jpg";
  const canonicalUrl = `https://iamclara.ai/p/${slug}/${procedure}`;

  return {
    title,
    description,
    openGraph: {
      title: `${practiceName} — ${procedureName}`,
      description,
      url: canonicalUrl,
      siteName: practiceName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${practiceName} — ${procedureName}`,
      description,
      images: [ogImage],
    },
    robots: { index: false, follow: false },
  };
}

export default function ProcedureLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
