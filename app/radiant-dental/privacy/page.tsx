"use client";
export default function RadiantPrivacyPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "#333", fontFamily: "system-ui, sans-serif", lineHeight: 1.8 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: "#1a1a1a", fontSize: 32, fontWeight: 700, marginBottom: 4 }}>Privacy Policy</h1>
          <p style={{ color: "#555", fontSize: 14 }}>Radiant Dental Care · Last updated: March 24, 2026</p>
        </div>

        {[
          {
            title: "Who We Are",
            body: `Radiant Dental Care ("we," "us," or "our") is a dental practice located in Chevy Chase, Maryland. We are committed to protecting your privacy and handling your personal information with care and transparency. This Privacy Policy explains how we collect, use, and protect information when you interact with our practice — including through phone calls, web forms, and SMS messages.`
          },
          {
            title: "Information We Collect",
            body: `We collect information in the following ways:

**When you contact us:**
- Name, phone number, and email address
- Reason for your inquiry (e.g., appointment request, question about services)
- Preferred callback times and communication preferences

**When you submit a form on our website:**
- Contact information and inquiry details
- Any optional information you choose to provide (insurance, procedure interest)

**When you call our office:**
- Calls may be answered by Clara, our AI receptionist. Calls may be recorded and summarized for our team's review. Clara will identify itself as an AI at the start of the call.

**Automatically:**
- Basic website analytics (pages visited, general location) — no personally identifiable tracking`
          },
          {
            title: "How We Use Your Information",
            body: `We use your information to:
- Respond to your inquiry and schedule appointments
- Send appointment confirmations and reminders via phone or text
- Follow up on your dental care questions
- Improve our patient experience

We do not sell your information to third parties. We do not use your information for advertising purposes without your explicit consent.`
          },
          {
            title: "SMS Text Messages",
            body: `If you contact us and provide your phone number, we may send you SMS messages related to your inquiry or appointment. All SMS communications are:

**Opt-in:** You consent to receive texts by contacting us, submitting a form, or verbally agreeing during a call. Clara will confirm your consent before any texts are sent.

**Opt-out:** Reply STOP at any time to unsubscribe. No further messages will be sent after you opt out.

**Frequency:** Typically 1–3 messages per inquiry, depending on scheduling status.

**Content:** Appointment-related only — confirmations, reminders, and follow-ups. No promotional or marketing messages.

**Rates:** Standard message and data rates may apply depending on your carrier.

Your phone number is used solely for communication with Radiant Dental Care. It is never sold or shared with third-party marketers.`
          },
          {
            title: "How We Share Your Information",
            body: `We work with trusted technology partners to operate our practice:

- **Clara (iamclara.ai)** — our AI receptionist platform, which handles call answering and appointment follow-up on our behalf. Clara is operated by Dental on Demand LLC and is bound by a Business Associate Agreement.
- **NexHealth** — appointment scheduling and patient communication platform
- **Google** — calendar and scheduling integration

All partners are contractually required to protect your information and may not use it for their own purposes.`
          },
          {
            title: "HIPAA & Patient Records",
            body: `Radiant Dental Care complies with the Health Insurance Portability and Accountability Act (HIPAA). Protected Health Information (PHI) — including your medical history, treatment records, and insurance information — is handled in accordance with our HIPAA Notice of Privacy Practices, which you will receive at your first appointment.

The information collected through our website and phone inquiries (name, phone, reason for inquiry) is pre-appointment contact information and is handled with the same care as PHI.`
          },
          {
            title: "Data Retention",
            body: `- Pre-appointment inquiry data: retained for 12 months or until you become an active patient
- Patient records: retained as required by Maryland law (minimum 7 years for adults)
- Call summaries: retained for 90 days
- SMS opt-out records: retained indefinitely to honor your preferences

You may request deletion of your pre-appointment inquiry data by contacting us below.`
          },
          {
            title: "Your Rights",
            body: `You have the right to:
- Request access to information we hold about you
- Request correction of inaccurate information
- Request deletion of your pre-appointment data
- Opt out of SMS communications at any time (reply STOP)
- Request that we not follow up with outbound calls

To exercise any of these rights, contact us at the information below.`
          },
          {
            title: "Security",
            body: `We use industry-standard security measures to protect your information, including encrypted storage and secure transmission. Our technology partners maintain SOC 2 and HIPAA-compliant security practices.`
          },
          {
            title: "Contact Us",
            body: `Questions about this Privacy Policy or your personal information:

**Radiant Dental Care**
5454 Wisconsin Ave, Suite 1605
Chevy Chase, MD 20815
Phone: (301) 652-2222
Email: info@radiant-dental.com`
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: 36 }}>
            <h2 style={{ color: "#1a1a1a", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
            <div style={{ color: "#444", fontSize: 15, whiteSpace: "pre-line" }}>
              {body.split("**").map((part, i) =>
                i % 2 === 1
                  ? <strong key={i} style={{ color: "#1a1a1a" }}>{part}</strong>
                  : part
              )}
            </div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid #eee", paddingTop: 24, marginTop: 16,
          color: "#999", fontSize: 13, textAlign: "center" }}>
          © 2026 Radiant Dental Care ·{" "}
          <a href="/radiant-dental/terms" style={{ color: "#2563eb", textDecoration: "none" }}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
