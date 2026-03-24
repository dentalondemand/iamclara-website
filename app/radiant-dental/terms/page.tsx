"use client";
export default function RadiantTermsPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "#333", fontFamily: "system-ui, sans-serif", lineHeight: 1.8 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: "#1a1a1a", fontSize: 32, fontWeight: 700, marginBottom: 4 }}>Terms of Service</h1>
          <p style={{ color: "#555", fontSize: 14 }}>Radiant Dental Care · Last updated: March 24, 2026</p>
        </div>

        {[
          {
            title: "1. Agreement",
            body: `By contacting Radiant Dental Care, submitting a form on our website, or communicating with us via phone or text message, you agree to these Terms of Service.`
          },
          {
            title: "2. Services",
            body: `Radiant Dental Care provides dental services at our Chevy Chase, Maryland location. Our website and communications channels are used to:
- Answer inquiries about our services and scheduling
- Collect appointment requests
- Send appointment confirmations and reminders
- Follow up on dental care inquiries`
          },
          {
            title: "3. SMS Communications",
            body: `By providing your phone number and contacting us, you consent to receive SMS text messages from Radiant Dental Care related to your inquiry or appointment scheduling.

**Opt-out:** Reply STOP at any time to unsubscribe from text messages. No further messages will be sent.

**Help:** Reply HELP for assistance or call us at (301) 652-2222.

**Frequency:** Typically 1–3 messages per inquiry.

**Rates:** Message and data rates may apply.

We do not send promotional or marketing SMS messages. All texts are related to your dental care inquiry or appointment.`
          },
          {
            title: "4. AI Receptionist Disclosure",
            body: `Our practice uses Clara, an AI-powered receptionist, to answer incoming calls and follow up with appointment inquiries. Clara will identify itself as an AI at the beginning of every interaction. Calls may be recorded and summarized for our clinical team's review.

If you prefer to speak with a human staff member, you may call us during office hours: Monday–Thursday, 9:30 AM–3:00 PM ET.`
          },
          {
            title: "5. No Medical Advice",
            body: `Information provided through our website, phone system, or SMS messages does not constitute medical advice. For dental emergencies, please call our office directly or visit an emergency room. Do not rely on automated communications for urgent dental or medical situations.`
          },
          {
            title: "6. Privacy",
            body: `Your use of our communications channels is subject to our Privacy Policy, available at iamclara.ai/radiant-dental/privacy. We are committed to protecting your personal information in accordance with HIPAA and applicable privacy laws.`
          },
          {
            title: "7. Contact",
            body: `Questions about these terms:

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
          <a href="/radiant-dental/privacy" style={{ color: "#2563eb", textDecoration: "none" }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
