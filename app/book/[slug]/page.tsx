import type { Metadata } from "next";
import BookingClient from "./BookingClient";

const BACKEND = "https://mqxnyexmrk.us-east-1.awsapprunner.com";

const THEMES: Record<string, string> = {
  teal: "#0d9488", navy: "#1d4ed8", purple: "#7c3aed",
  green: "#15803d", slate: "#475569",
};

async function fetchPracticeInfo(slug: string) {
  try {
    const res = await fetch(
      `${BACKEND}/marketing/config/public?tenant_id=${encodeURIComponent(slug)}&procedure_id=general`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const cfg = await fetchPracticeInfo(params.slug);
  const name = cfg?.practice_name || params.slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title: `Book a Consultation | ${name}`,
    description: `Schedule your free consultation with ${name}. Pick a time that works for you — same-day options available.`,
  };
}

export default async function BookingPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const cfg = await fetchPracticeInfo(slug);
  const practiceName = cfg?.practice_name || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const primaryColor = THEMES[cfg?.theme || "teal"] || "#0d9488";

  return (
    <BookingClient
      slug={slug}
      practiceName={practiceName}
      primaryColor={primaryColor}
    />
  );
}
