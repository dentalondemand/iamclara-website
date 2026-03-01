import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clara — AI Dental Receptionist',
  description: 'Clara answers every call, captures every lead, and books consultations automatically. Replace your answering service for $149/month.',
  openGraph: {
    title: 'Clara — AI Dental Receptionist',
    description: 'Never miss a patient call again. Clara AI handles inbound calls 24/7, sends instant summaries, and follows up on leads automatically.',
    url: 'https://iamclara.ai',
    siteName: 'Clara AI',
    images: [{ url: 'https://iamclara.ai/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clara — AI Dental Receptionist',
    description: 'Never miss a patient call again.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
