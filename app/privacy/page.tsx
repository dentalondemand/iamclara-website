"use client";
export default function PrivacyPage() {
  return (
    <div style={{ background: "#0F1923", minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "rgba(255,255,255,0.8)", fontFamily: "system-ui, sans-serif", lineHeight: 1.7 }}>
        <a href="/" style={{ color: "#2DD4BF", textDecoration: "none", fontSize: 14 }}>← Back to iamclara.ai</a>
        <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 48 }}>Last updated: March 3, 2026</p>

        {[
          {
            title: "1. Who We Are",
            body: `Clara is an AI-powered dental receptionist and marketing platform operated by Dental on Demand LLC ("we," "us," or "our"). We provide AI phone answering, lead capture, outbound calling, and marketing automation services to dental practices ("Practices"). Our website is iamclara.ai.`
          },
          {
            title: "2. Information We Collect",
            body: `We collect information in the following ways:

**From Practices (our customers):**
- Business contact information (name, email, phone, practice address)
- Billing information processed securely through Stripe
- Practice configuration data (hours, services, staff contacts)
- Social media account handles (Instagram, Facebook, TikTok, Google Business)

**From Patients (callers to Clara-powered practices):**
- Name, phone number, and callback preferences provided during calls
- Reason for calling and appointment preferences
- Voice recordings of calls (where permitted by applicable law and with notice)
- Any other information volunteered during the call

**From Lead Forms:**
- Name, phone number, email, and inquiry details submitted through web forms or Facebook Lead Ads
- Communication preferences

**Automatically:**
- Usage data and logs (IP addresses, browser type, pages visited)
- Call metadata (call duration, timestamps, call status)`
          },
          {
            title: "3. How We Use Information",
            body: `We use collected information to:
- Operate and improve the Clara platform
- Route calls, capture messages, and follow up with leads on behalf of Practices
- Send call summaries and alerts to Practice staff
- Schedule and post social media content on behalf of Practices
- Process payments and manage Practice subscriptions
- Send operational emails (receipts, alerts, onboarding)
- Comply with legal obligations

We do not sell personal information to third parties.`
          },
          {
            title: "4. Call Recording & Transcription",
            body: `Calls handled by Clara may be recorded and transcribed for quality assurance, summarization, and training purposes. Practices are responsible for providing required disclosures to callers in accordance with their state's wiretapping and consent laws (e.g., two-party consent states). Clara announces its AI nature at the beginning of each call. Recordings are retained for 30 days by default and may be deleted upon Practice request.`
          },
          {
            title: "5. Data Sharing",
            body: `We share data only as necessary to operate our service:
- **Twilio** — call routing, phone number management, SMS
- **Google** — calendar integration, Google Sheets for lead data
- **ElevenLabs** — AI voice synthesis
- **Stripe** — payment processing
- **Meta (Facebook/Instagram)** — social media posting and lead form integration (Growth plan)
- **Gemini (Google AI)** — AI conversation, caption generation, image analysis

These providers are contractually bound to protect your data and may not use it for their own purposes.`
          },
          {
            title: "6. Data Retention",
            body: `- Call records and transcripts: 90 days (configurable per Practice)
- Call recordings: 30 days
- Lead records: retained for the life of the Practice's account
- Practice account data: retained for 60 days after account termination
- Billing records: 7 years (tax compliance)

You may request deletion of your data by contacting us at privacy@iamclara.ai.`
          },
          {
            title: "7. Patient & Caller Rights",
            body: `Patients who interact with Clara-powered practices may request:
- Access to information we hold about them
- Correction of inaccurate information
- Deletion of their data
- Opt-out of outbound follow-up calls

To exercise these rights, contact the dental practice directly or email us at privacy@iamclara.ai with the practice name and your phone number.`
          },
          {
            title: "8. SMS Messaging",
            body: `When dental practices use Clara's SMS follow-up feature, we may send text messages to patient phone numbers on behalf of those practices. These messages are transactional in nature — related to appointment scheduling and follow-up on dental care inquiries.

**Opt-in:** SMS messages are sent only after you have submitted an inquiry, called a Clara-powered practice, or explicitly replied YES to a Clara text message.

**Opt-out:** Reply STOP at any time to opt out. No further messages will be sent.

**Data use:** Your phone number is used solely for appointment-related communication with the dental practice. We do not sell phone numbers or use them for third-party marketing.

**Message frequency:** 1–3 messages per inquiry, depending on scheduling status.

**Rates:** Message and data rates may apply.

For full SMS terms, see iamclara.ai/sms-terms.`
          },
          {
            title: "9. Facebook & Meta Data",
            body: `Clara integrates with Meta's platforms (Facebook, Instagram) for social media posting and lead form data. Lead information received through Facebook Lead Ads is used solely to follow up with prospective patients on behalf of the Practice. We do not use Meta lead data for advertising or share it with other parties. We comply with Meta's Platform Terms and Data Policy.`
          },
          {
            title: "10. Security",
            body: `We use industry-standard security measures including TLS encryption for data in transit, encrypted storage for credentials, JWT-based authentication with short expiry, and role-based access controls. No method of transmission or storage is 100% secure. We will notify affected Practices promptly in the event of a data breach.`
          },
          {
            title: "11. Cookies",
            body: `Our marketing website (iamclara.ai) uses minimal cookies for basic functionality and analytics. We do not use advertising or tracking cookies. The Clara dashboard uses local storage to maintain your login session.`
          },
          {
            title: "12. Children's Privacy",
            body: `Clara is designed for use by dental practices and their adult patients. We do not knowingly collect information from children under 13. If you believe a child has submitted information through our platform, contact us at privacy@iamclara.ai and we will delete it promptly.`
          },
          {
            title: "13. Changes to This Policy",
            body: `We may update this Privacy Policy from time to time. We will notify Practices of material changes by email or in-app notice. Continued use of Clara after changes constitutes acceptance of the updated policy.`
          },
          {
            title: "14. Contact Us",
            body: `Questions about this Privacy Policy or your data:

**Email:** privacy@iamclara.ai
**Mailing address:** Dental on Demand LLC, Bethesda, MD`
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
          © 2026 Dental on Demand LLC · <a href="/terms" style={{ color: "#2DD4BF", textDecoration: "none" }}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
