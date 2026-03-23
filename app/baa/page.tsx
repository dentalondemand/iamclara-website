import Link from 'next/link'

export const metadata = {
  title: 'Business Associate Agreement | Clara AI',
  description: 'Clara AI HIPAA Business Associate Agreement for dental practices.',
}

export default function BAAPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0F1823', color: '#fff', padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/clara-logo.png" alt="Clara AI" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Clara <span style={{ color: '#2DD4BF' }}>AI</span></span>
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8, fontSize: 14 }}>/ Business Associate Agreement</span>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)',
          borderRadius: 999, padding: '6px 14px', marginBottom: 24 }}>
          <span style={{ color: '#2DD4BF', fontSize: 13, fontWeight: 600 }}>🔒 HIPAA Compliant</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
          Business Associate Agreement
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 48 }}>
          Effective upon acceptance during onboarding. Last updated: March 2026.
        </p>

        {/* Agreement body */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '40px 40px' }}>
          {[
            {
              heading: 'Parties',
              body: `This Business Associate Agreement ("Agreement") is entered into as of the date accepted by the Covered Entity ("Effective Date"), between iamclara.ai ("Business Associate") and the enrolling dental practice ("Covered Entity"), a HIPAA-covered entity.`
            },
            {
              heading: '1. Definitions',
              body: `Terms used but not defined in this Agreement have the meanings given in HIPAA (45 C.F.R. Parts 160 and 164).\n\n"PHI" means Protected Health Information as defined under HIPAA.\n\n"Services" means the AI dental receptionist and related services provided by Business Associate to Covered Entity under a separately executed service agreement.`
            },
            {
              heading: '2. Obligations of Business Associate',
              body: `2.1 Use Limitations. Use or disclose PHI only as permitted by this Agreement or required by law — and only to the minimum extent necessary.\n\n2.2 Safeguards. Implement appropriate administrative, physical, and technical safeguards to protect the confidentiality, integrity, and availability of PHI, consistent with 45 C.F.R. § 164.308, 164.310, and 164.312. Specific measures include: AES-256 encryption at rest, TLS 1.2+ in transit, row-level security on all database tables, TOTP multi-factor authentication for staff access, automatic purge of call recordings after 90 days and stale PHI after configurable retention windows.\n\n2.3 Subcontractors. Ensure that any subcontractor that creates, receives, maintains, or transmits PHI on Business Associate's behalf agrees to the same restrictions and conditions applicable to Business Associate under this Agreement. Current subprocessors with PHI access: Amazon Web Services (RDS/S3, BAA in place).\n\n2.4 Breach Notification. Report to Covered Entity any Breach of Unsecured PHI without unreasonable delay and in no case later than 60 calendar days after discovery, and any Security Incident of which Business Associate becomes aware.\n\n2.5 Access and Amendment. To the extent Business Associate holds a Designated Record Set, make PHI available to Covered Entity or individuals as required by 45 C.F.R. § 164.524 and § 164.526.\n\n2.6 Accounting. Maintain and provide an accounting of disclosures of PHI as required by 45 C.F.R. § 164.528.\n\n2.7 Government Access. Make its internal practices, books, and records relating to PHI available to the Secretary of HHS for determining compliance.\n\n2.8 Return or Destruction. Upon termination, return or destroy all PHI received from, or created or received on behalf of, Covered Entity within 30 days.`
            },
            {
              heading: '3. Permitted Uses and Disclosures',
              body: `Business Associate may use and disclose PHI as necessary to perform the Services on behalf of Covered Entity, for proper management and administration of Business Associate, and to de-identify PHI in accordance with 45 C.F.R. § 164.514(b). Business Associate will not use PHI for marketing, model training, or any purpose beyond direct service delivery.`
            },
            {
              heading: '4. Obligations of Covered Entity',
              body: `Covered Entity agrees to: (a) notify Business Associate of any restriction on the use or disclosure of PHI it has agreed to with an individual, to the extent it may affect Business Associate's permitted uses; (b) not request Business Associate to use or disclose PHI in any manner that would violate HIPAA; (c) obtain any consents or authorizations required prior to furnishing PHI to Business Associate.`
            },
            {
              heading: '5. PHI Data Elements',
              body: `The following PHI may be received or processed by Business Associate in connection with the Services:\n\n• Patient first & last name — caller identification, scheduling (retained for duration of service agreement)\n• Phone number — callback coordination (retained for duration of service agreement)\n• Date of birth — patient matching in practice management system when integrated (retained for duration)\n• Reason for call — routing and lead scoring (retained for duration)\n• Call recordings (when enabled) — quality assurance and transcription (deleted after 90 days)\n• Appointment details — scheduling confirmation (retained for duration)\n\nBusiness Associate does NOT collect: SSN, insurance member IDs, payment card data, clinical notes, or radiographic data.`
            },
            {
              heading: '6. Term and Termination',
              body: `This Agreement is effective upon acceptance and remains in effect until terminated. Either party may terminate upon 30 days written notice for material breach that is not cured within the notice period. Covered Entity may terminate immediately if Business Associate has breached a material term and cure is not possible. Upon termination, Business Associate will return or destroy all PHI within 30 days.`
            },
            {
              heading: '7. Miscellaneous',
              body: `This Agreement shall be interpreted as broadly as necessary to implement and comply with HIPAA. Any ambiguity shall be resolved in favor of the meaning that best complies with HIPAA. Business Associate will amend this Agreement as necessary to remain in compliance with applicable law — continued use of the Services constitutes acceptance. This Agreement is governed by the laws of the State of Maryland and applicable federal law.`
            },
          ].map(({ heading, body }) => (
            <div key={heading} style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#2DD4BF' }}>{heading}</h2>
              {body.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, fontSize: 14,
                  marginBottom: 12, whiteSpace: 'pre-line' }}>{para}</p>
              ))}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 40, padding: '24px 32px', background: 'rgba(45,212,191,0.06)',
          border: '1px solid rgba(45,212,191,0.15)', borderRadius: 16, display: 'flex',
          flexDirection: 'column', gap: 12 }}>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: 16, margin: 0 }}>
            Ready to get started?
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>
            By completing the onboarding form, you acknowledge and accept this Business Associate Agreement on behalf of your practice.
          </p>
          <Link href="/get-started"
            style={{ display: 'inline-block', background: '#14B8A6', color: '#fff', fontWeight: 700,
              fontSize: 15, padding: '12px 28px', borderRadius: 50, textDecoration: 'none',
              alignSelf: 'flex-start', marginTop: 4 }}>
            Get Started →
          </Link>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 32, lineHeight: 1.6 }}>
          Questions about HIPAA compliance or this agreement? Contact us at{' '}
          <a href="mailto:hello@iamclara.ai" style={{ color: 'rgba(45,212,191,0.7)' }}>hello@iamclara.ai</a>
        </p>
      </div>
    </div>
  )
}
