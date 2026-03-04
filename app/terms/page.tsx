"use client";
export default function TermsPage() {
  return (
    <div style={{ background: "#0F1923", minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "rgba(255,255,255,0.8)", fontFamily: "system-ui, sans-serif", lineHeight: 1.7 }}>
        <a href="/" style={{ color: "#2DD4BF", textDecoration: "none", fontSize: 14 }}>← Back to iamclara.ai</a>
        <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 48 }}>Last updated: March 1, 2026</p>

        {[
          {
            title: "1. Agreement",
            body: `By signing up for or using Clara ("the Service"), operated by Dental on Demand LLC ("Company," "we," "us"), you ("Practice" or "you") agree to these Terms of Service. If you are using Clara on behalf of a dental practice or other organization, you represent that you have authority to bind that organization to these terms.`
          },
          {
            title: "2. Description of Service",
            body: `Clara is an AI-powered dental receptionist platform that provides:
- **Core Plan:** AI phone answering, call summaries, message capture, staff alerts, and a management dashboard
- **Growth Plan:** All Core features plus outbound lead calling, lead capture, AI social media content, Facebook/Google advertising automation, and a practice landing page

Features and pricing are described at iamclara.ai/pricing and may be updated with 30 days' notice.`
          },
          {
            title: "3. Subscriptions & Payment",
            body: `**Billing:** Clara is billed monthly via Stripe. Your subscription begins on the date of first payment and renews automatically each month.

**Pricing:**
- Core Plan: $199/month
- Growth Plan: $999/month (Founding Practices locked at $599/month for life)

**Founding Rate:** The $599/month founding rate is guaranteed for the life of the account as long as the subscription remains active. A lapse in payment of more than 30 days forfeits the founding rate.

**Failed Payments:** If a payment fails, we will retry for 7 days before suspending service. You will be notified by email.

**Refunds:** We offer a pro-rated refund for the unused portion of the current month if you cancel within the first 7 days of a new billing period. No refunds after 7 days.`
          },
          {
            title: "4. Cancellation",
            body: `You may cancel your subscription at any time through your Stripe billing portal. Cancellation takes effect at the end of the current billing period. You retain access to the dashboard and call history for 60 days after cancellation. Data is deleted after 60 days unless you request export.`
          },
          {
            title: "5. Practice Responsibilities",
            body: `You agree to:
- Provide accurate information during onboarding and keep it updated
- Comply with all applicable laws regarding call recording and AI disclosure (Clara discloses its AI nature on every call)
- Ensure you have rights to any content (photos, videos, logos) you submit for social media posting
- Not use Clara for unlawful purposes, spam, or harassment
- Maintain the confidentiality of your dashboard login credentials
- Comply with Meta, Google, Twilio, and other platform terms of service as applicable to your use of Clara`
          },
          {
            title: "6. Call Recording Compliance",
            body: `Clara may record calls for summarization and quality purposes. You are solely responsible for compliance with federal and state wiretapping laws, including obtaining any required consent from callers. In two-party consent states, you must ensure callers are notified that calls may be recorded. Clara's standard greeting discloses AI nature but does not constitute a legally sufficient recording consent notice in all jurisdictions. Consult legal counsel regarding your specific obligations.`
          },
          {
            title: "7. AI Limitations",
            body: `Clara is an AI system and may make errors. You acknowledge that:
- Clara may misunderstand callers or provide incomplete information
- AI-generated social media content must be reviewed before posting (for Core; Growth plan posts automatically)
- Clara does not provide medical, legal, or financial advice
- You are responsible for verifying any information Clara provides to patients

We are not liable for missed calls, miscommunications, or errors resulting from AI limitations.`
          },
          {
            title: "8. Intellectual Property",
            body: `**Ours:** The Clara platform, software, AI models, and branding are owned by Dental on Demand LLC. You receive a limited, non-exclusive license to use the Service during your subscription.

**Yours:** You retain all rights to your practice name, logo, photos, videos, and patient data. By submitting content to Clara, you grant us a limited license to process and post it on your behalf as directed.

**Generated Content:** AI-generated captions, summaries, and copy produced by Clara on your behalf may be used freely by you.`
          },
          {
            title: "9. Privacy & Data",
            body: `Your use of Clara is also governed by our Privacy Policy at iamclara.ai/privacy. You represent that you have the right to share any patient or lead data with us for processing on your behalf and that you have complied with applicable privacy laws (HIPAA, CCPA, etc.) in doing so.

**HIPAA Note:** Clara processes limited patient information (name, phone, reason for call) as a business associate. We do not store full medical records or treatment information. We will sign a Business Associate Agreement (BAA) upon request.`
          },
          {
            title: "10. Limitation of Liability",
            body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, DENTAL ON DEMAND LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST REVENUE, OR LOST PATIENTS, ARISING FROM YOUR USE OF CLARA.

OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR YOUR USE OF CLARA SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE THREE MONTHS PRECEDING THE CLAIM.`
          },
          {
            title: "11. Indemnification",
            body: `You agree to indemnify and hold harmless Dental on Demand LLC and its officers, employees, and agents from any claims, damages, or expenses (including reasonable attorney's fees) arising from your use of Clara, your violation of these Terms, or your violation of any applicable law or third-party rights.`
          },
          {
            title: "12. Modifications to Service",
            body: `We may modify, add, or remove features from Clara at any time. We will provide 30 days' notice for material changes that reduce functionality. Your continued use of Clara after the notice period constitutes acceptance of the changes. If you do not accept material changes, you may cancel for a pro-rated refund.`
          },
          {
            title: "13. Termination",
            body: `We may suspend or terminate your access to Clara immediately if you:
- Violate these Terms in a material way
- Use Clara for illegal purposes
- Fail to pay after a 7-day grace period
- Abuse our platform or staff

Upon termination, your data will be retained for 60 days and then deleted.`
          },
          {
            title: "14. Governing Law",
            body: `These Terms are governed by the laws of the State of Maryland, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Montgomery County, Maryland.`
          },
          {
            title: "15. Contact",
            body: `Questions about these Terms:

**Email:** hello@iamclara.ai
**Address:** Dental on Demand LLC, Bethesda, MD`
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, whiteSpace: "pre-line" }}>
              {body.split("**").map((part, i) =>
                i % 2 === 1
                  ? <strong key={i} style={{ color: "rgba(255,255,255,0.9)" }}>{part}</strong>
                  : part
              )}
            </div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32, marginTop: 16,
          color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center" }}>
          © 2026 Dental on Demand LLC · <a href="/privacy" style={{ color: "#2DD4BF", textDecoration: "none" }}>Privacy Policy</a> · <a href="/sms-terms" style={{ color: "#2DD4BF", textDecoration: "none" }}>SMS Terms</a>
        </div>
      </div>
    </div>
  );
}
