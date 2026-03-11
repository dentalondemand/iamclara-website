"use client";
import { useEffect, useRef, useState } from "react";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";

interface Message { role: "user" | "assistant"; content: string; }

export default function ClaraChat({
  tenantId,
  practiceName,
  primaryColor = "#0d9488",
  accentColor = "#2DD4BF",
  openingMessage,
}: {
  tenantId: string;
  practiceName: string;
  primaryColor?: string;
  accentColor?: string;
  openingMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [collected, setCollected] = useState<Record<string, any>>({});
  const [leadCreated, setLeadCreated] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greeting = openingMessage ||
    `👋 Thinking about implants or a smile makeover? I'm Clara — ${practiceName}'s AI receptionist. I can answer any questions or help you schedule a free consultation. What brings you in today?`;

  // Open chat → show greeting
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: greeting }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/public/${tenantId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          collected,
          session_id: sessionId,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      if (data.collected) setCollected(data.collected);
      if (data.lead_created) setLeadCreated(true);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had a connection issue. Please try again or call us directly!" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 60, height: 60, borderRadius: "50%", border: "none",
          background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          color: "#fff", fontSize: 26, cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
        aria-label="Chat with Clara"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 24, zIndex: 9998,
          width: Math.min(380, window.innerWidth - 32),
          maxHeight: "70vh",
          background: "#0a1628",
          border: `1px solid ${primaryColor}40`,
          borderRadius: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: `linear-gradient(135deg, ${primaryColor}20, ${accentColor}10)`,
            borderBottom: `1px solid ${primaryColor}30`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>🦷</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Clara</div>
              <div style={{ color: accentColor, fontSize: 11 }}>
                {leadCreated ? "✅ We'll call you shortly!" : `AI Receptionist · ${practiceName}`}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 4px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user"
                    ? `linear-gradient(135deg, ${primaryColor}, ${accentColor})`
                    : "rgba(255,255,255,0.07)",
                  color: "#fff",
                  fontSize: 14,
                  lineHeight: 1.5,
                  border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 16px", borderRadius: "16px 16px 16px 4px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)", fontSize: 20, letterSpacing: 4,
                }}>···</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!leadCreated ? (
            <div style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex", gap: 8,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type a message..."
                disabled={loading}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${primaryColor}40`,
                  borderRadius: 12, padding: "10px 14px",
                  color: "#fff", fontSize: 14, outline: "none",
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  padding: "10px 16px", borderRadius: 12, border: "none",
                  background: !input.trim() ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                  color: "#fff", fontWeight: 700, fontSize: 14, cursor: input.trim() ? "pointer" : "default",
                }}
              >→</button>
            </div>
          ) : (
            <div style={{
              padding: "14px 18px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
              color: accentColor, fontSize: 13, fontWeight: 600,
            }}>
              🎉 Got it! Our team will call you shortly.
            </div>
          )}
        </div>
      )}
    </>
  );
}
