/**
 * Server-side layout for /p/[slug] and /p/[slug]/[procedure]
 * Generates dynamic Open Graph metadata so when shared on Facebook,
 * iMessage, WhatsApp, etc. it shows the PRACTICE name and info —
 * not the generic "Clara AI" branding.
 *
 * Example output for radiant-dental-care / full_arch:
 *   title:       "Radiant Dental Care — Full Arch Implants"
 *   description: "Same-day guided implants in Chevy Chase, MD. Walk in missing teeth, walk out smiling."
 *   og:image:    Practice logo (if set) or default dental hero image
 */

import type { Metadata } from "next";
import { ReactNode } from "react";

const BACKEND = "https://mqxnyexmrk.us-east-1.awsapprunner.com";

interface LayoutProps {
  children: ReactNode;
  params: { slug: string; procedure?: string };
}

// Fetch public config from backend (no auth needed)
async function fetchPracticeConfig(slug: string, procedure?: string) {
  try {
    const url = procedure
      ? `${BACKEND}/marketing/config/public?tenant_id=${encodeURIComponent(slug)}&procedure_id=${encodeURIComponent(procedure)}`
      : `${BACKEND}/marketing/config/public?tenant_id=${encodeURIComponent(slug)}`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Slugify procedure_id into a readable label
function procedureLabel(procId?: string, configName?: string): string {
  if (configName) return configName;
  if (!procId) return "";
  return procId
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace("Full Arch", "Full Arch Implants")
    .replace("Single Implant", "Single Tooth Implant")
    .replace("No Prep Veneers", "No-Prep Veneers");
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const slug = params.slug;

  // Try to fetch config — fall back gracefully if backend is down
  const config = await fetchPracticeConfig(slug);

  const practiceName = config?.practice_name || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const city = config?.city || config?.practice_city || "";
  const state = config?.state || config?.practice_state || "";
  const location = [city, state].filter(Boolean).join(", ");

  const logoUrl = config?.logo_url || null;
  const heroImage = config?.hero_image_url || "https://iamclara.ai/og-dental.jpg";
  const ogImage = logoUrl || heroImage;

  // Build a compelling description from available config fields
  const differentiators: string = config?.practice_differentiators || "";
  const defaultDesc = location
    ? `Book a free consultation at ${practiceName} in ${location}. Advanced dental care — same-day results.`
    : `Book a free consultation at ${practiceName}. Advanced dental care — same-day results.`;
  const description = differentiators
    ? `${differentiators.split(".")[0].trim()}. Free consultation at ${practiceName}${location ? ` in ${location}` : ""}.`
    : defaultDesc;

  const canonicalUrl = `https://iamclara.ai/p/${slug}`;

  return {
    title: `${practiceName}${location ? ` — ${location}` : ""}`,
    description,
    openGraph: {
      title: practiceName,
      description,
      url: canonicalUrl,
      siteName: practiceName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${practiceName} — Book a Consultation`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: practiceName,
      description,
      images: [ogImage],
    },
    // Prevent search engines from indexing individual practice pages
    // (practices may not want their landing pages indexed under Clara's domain)
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function PracticeLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
