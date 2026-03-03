"use client";
export default function SmsTermsPage() {
  const sections = [
    {
      title: "1. Program Description",
      body: `Clara by Dental on Demand LLC ("Clara," "we," "us") operates an SMS messaging program on behalf of dental practices ("Practices") that use our platform. When you inquire about dental services or request to be contacted, you may receive text messages from the dental practice's Clara number regarding appointment scheduling, follow-up on your inquiry, and related dental care communications.`
    },
    {
      title: "2. How You Opt In",
      body: `You may receive SMS messages from Clara if you:

• Submitted an inquiry form (online, Facebook, or other) requesting to be contacted by a dental practice
• Called a Clara-powered dental office and provided your phone number
• Explicitly replied YES or similar affirmation to a Clara text message

By opting in, you consent to receive recurring automated text messages related to appointment scheduling and dental care follow-up from the applicable dental practice. Message frequency varies based on your inquiry status — typically 1–3 messages per inquiry.`
    },
    {
      title: "3. How to Opt Out",
      body: `You can opt out of SMS messages at any time by replying STOP to any message you receive. You will receive a confirmation message and no further messages will be sent.

To re-enable messages after opting out, reply START.

For help, reply HELP to any message or contact us at hello@iamclara.ai.`
    },
    {
      title: "4. Message & Data Rates",
      body: `Message and data rates may apply. Charges are billed by your mobile carrier. Clara is not responsible for charges applied by your carrier. Contact your mobile carrier for details about your plan's messaging rates.`
    },
    {
      title: "5. Supported Carriers",
      body: `Messages are supported by most major U.S. carriers including AT&T, Verizon, T-Mobile, Sprint, and others. Delivery is not guaranteed for all carriers. Clara is not liable for delayed or undelivered messages.`
    },
    {
      title: "6. Privacy",
      body: `Your phone number and messaging data are handled in accordance with our Privacy Policy at iamclara.ai/privacy. We do not sell or share your phone number with third parties for marketing purposes. Your information is used solely to provide appointment scheduling and dental care follow-up services on behalf of the dental practice.`
    },
    {
      title: "7. Nature of Messages",
      body: `SMS messages from Clara are transactional and service-related in nature. They are sent on behalf of dental practices to help you schedule appointments and follow up on your dental care inquiries. Clara does not send promotional marketing messages unrelated to your inquiry.`
    },
    {
      title: "8. Contact Us",
      body: `If you have questions about this SMS program, contact us at:

Dental on Demand LLC
hello@iamclara.ai
iamclara.ai

To opt out: Reply STOP to any message.
For help: Reply HELP or email hello@iamclara.ai.`
    },
  ];

  return (
    <div style={{ background: "#0F1923", minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "rgba(255,255,255,0.8)", fontFamily: "system-ui, sans-serif", lineHeight: 1.7 }}>
        <a href="/" style={{ color: "#2DD4BF", textDecoration: "none", fontSize: 14 }}>← Back to iamclara.ai</a>
        <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>SMS Terms & Conditions</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 48 }}>Last updated: March 3, 2026</p>

        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{s.title}</h2>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, whiteSpace: "pre-wrap" }}>{s.body}</div>
          </div>
        ))}

        {/* Quick reference box */}
        <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 12, padding: "20px 24px", marginTop: 48 }}>
          <h3 style={{ color: "#2DD4BF", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Quick Reference</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            {[
              ["Program", "Clara Appointment Scheduling SMS"],
              ["Message types", "Appointment scheduling & dental care follow-up"],
              ["Frequency", "1–3 messages per inquiry (varies)"],
              ["To opt out", "Reply STOP"],
              ["To re-enable", "Reply START"],
              ["For help", "Reply HELP or email hello@iamclara.ai"],
              ["Cost", "Message & data rates may apply"],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <td style={{ padding: "8px 0", color: "rgba(255,255,255,0.5)", width: "40%" }}>{label}</td>
                <td style={{ padding: "8px 0", color: "rgba(255,255,255,0.85)" }}>{value}</td>
              </tr>
            ))}
          </table>
        </div>

        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 48, textAlign: "center" }}>
          © 2026 Dental on Demand LLC · <a href="/privacy" style={{ color: "#2DD4BF" }}>Privacy Policy</a> · <a href="/terms" style={{ color: "#2DD4BF" }}>Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
