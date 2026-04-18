"use client";
import { useState, useRef, useCallback } from "react";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";

const PROCEDURES = [
  { id: "veneer", label: "Veneers", emoji: "✨", desc: "Preview a stunning porcelain veneer smile" },
  { id: "fullarch", label: "Full Arch", emoji: "🦷", desc: "See your full arch implant transformation" },
  { id: "whitening", label: "Whitening", emoji: "💎", desc: "Professional whitening preview" },
  { id: "implant", label: "Single Implant", emoji: "🔧", desc: "Preview a single implant crown" },
];

type Step = "upload" | "loading" | "result" | "form" | "calling" | "error";

export default function TryClaraPage() {
  const [step, setStep] = useState<Step>("upload");
  const [procedure, setProcedure] = useState("veneer");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [resultMime, setResultMime] = useState("image/png");
  const [jobId, setJobId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a JPEG or PNG photo.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Photo must be under 10MB.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl("");
    setJobId("");
    setErrorMsg("");
    setStep("upload");
  }, []);

  async function generate() {
    if (!selectedFile) return;
    setStep("loading");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("image", selectedFile);
    fd.append("tenant_id", "demo");
    fd.append("procedure", procedure);

    try {
      const res = await fetch(`${BACKEND}/public/smile-simulator/generate`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Generation failed" }));
        throw new Error(err.detail || "Generation failed");
      }

      const data = await res.json();
      setJobId(data.job_id);
      const mime = data.result_mime || "image/png";
      setResultMime(mime);
      setResultUrl(`data:${mime};base64,${data.result_b64}`);
      setStep("result");
    } catch (e: any) {
      setErrorMsg(e.message || "Something went wrong. Please try again.");
      setStep("error");
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) { setFormError("Please enter your name."); return; }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setFormError("Please enter a valid phone number.");
      return;
    }
    setFormSubmitting(true);

    try {
      const res = await fetch(`${BACKEND}/public/smile-demo/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, tenant_id: "demo", name: name.trim(), phone: phone.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Submission failed" }));
        throw new Error(err.detail || "Submission failed");
      }

      setStep("calling");
    } catch (e: any) {
      setFormError(e.message || "Something went wrong. Please call us directly.");
    } finally {
      setFormSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f0e] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-teal-400 font-bold text-xl">
            <img src="/clara-logo.webp" alt="Clara AI" className="w-8 h-8 rounded-xl object-cover" />
            <span>Clara <span className="text-teal-400 font-bold">AI</span></span>
          </a>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-white/60 hover:text-white text-sm transition-colors hidden md:block">Pricing</a>
            <a href="/get-started" className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">
              Get started
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          {/* Glow */}
          <div className="relative flex justify-center mb-8">
            <div className="absolute top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute top-20 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl" />
            <div className="relative inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-teal-400 text-sm font-medium">Free demo — no signup required</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            See your new smile
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              in 60 seconds
            </span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Try Clara&apos;s AI smile simulator — upload your photo, pick a procedure,
            and see the preview instantly. Then Clara will call you to answer your questions.
          </p>
        </div>

        {/* Main card */}
        <div className="max-w-3xl mx-auto">

          {/* ── Upload ── */}
          {step === "upload" && (
            <div className="bg-[#111614] border border-white/10 rounded-3xl p-8 md:p-12">
              {/* Procedure selector */}
              <div className="mb-8">
                <p className="text-white/40 text-sm mb-3 font-medium">Select a procedure</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PROCEDURES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProcedure(p.id)}
                      className={`rounded-xl p-4 text-left transition-all border ${
                        procedure === p.id
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.emoji}</div>
                      <div className="text-white text-sm font-semibold">{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-teal-500/60"); e.currentTarget.classList.remove("border-white/20"); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove("border-teal-500/60"); e.currentTarget.classList.add("border-white/20"); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-teal-500/60");
                  e.currentTarget.classList.add("border-white/20");
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-teal-500/50 transition-colors mb-6"
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                    <p className="text-white/40 text-sm">Click to change photo</p>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl mb-4">📸</div>
                    <p className="text-white/70 font-medium mb-1">Upload a selfie</p>
                    <p className="text-white/30 text-sm">Click or drag a photo here · JPEG or PNG · Max 10MB</p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </div>

              <button
                onClick={generate}
                disabled={!selectedFile}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full text-lg transition-colors"
              >
                Generate My Preview ✨
              </button>
            </div>
          )}

          {/* ── Loading ── */}
          {step === "loading" && (
            <div className="bg-[#111614] border border-white/10 rounded-3xl p-16 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Creating your preview…</h2>
              <p className="text-white/40">Clara&apos;s AI is working its magic — this takes about 15 seconds.</p>
            </div>
          )}

          {/* ── Result ── */}
          {step === "result" && (
            <div className="space-y-6">
              <div className="bg-[#111614] border border-white/10 rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Your preview is ready</h2>
                    <p className="text-white/40 text-sm">{PROCEDURES.find(p => p.id === procedure)?.label}</p>
                  </div>
                  <button
                    onClick={() => setStep("upload")}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    Try again →
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Original */}
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">Before</p>
                    <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                      <img src={previewUrl} alt="Original" className="w-full object-contain max-h-72" />
                    </div>
                  </div>
                  {/* Result — blurred until unlock */}
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">After</p>
                    <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative aspect-[3/4]">
                      <img src={resultUrl} alt="Result" className="w-full h-full object-cover blur-lg" style={{ filter: "blur(12px)" }} />
                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
                        <div className="text-4xl mb-2">🔒</div>
                        <p className="text-white/70 font-semibold text-center px-6 text-sm leading-relaxed">
                          Submit your number to<br />unlock your preview
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead form */}
              <div className="bg-[#111614] border border-teal-500/20 rounded-3xl p-6 md:p-8">
                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">📞</div>
                  <h3 className="text-xl font-bold mb-1">Clara will call you — free</h3>
                  <p className="text-white/40 text-sm">
                    Submit your number and Clara will call in minutes to answer any questions about how she works for your practice.
                  </p>
                </div>

                <form onSubmit={submitLead} className="space-y-4">
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">Your name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Smith"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-teal-500/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">Phone number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-teal-500/60 transition-colors"
                    />
                  </div>
                  {formError && (
                    <p className="text-red-400 text-sm">{formError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full text-lg transition-colors"
                  >
                    {formSubmitting ? "Connecting you to Clara…" : "Uncover My Preview & Get a Call 📞"}
                  </button>
                  <p className="text-center text-white/20 text-xs">
                    No spam. No commitment. Clara just wants to answer your questions.
                  </p>
                </form>
              </div>
            </div>
          )}

          {/* ── Calling ── */}
          {step === "calling" && (
            <div className="bg-[#111614] border border-teal-500/20 rounded-3xl p-16 text-center">
              <div className="text-6xl mb-6 animate-bounce">📞</div>
              <h2 className="text-3xl font-bold mb-3">Clara is calling you now!</h2>
              <p className="text-white/40 mb-8 max-w-md mx-auto">
                Check your phone — Clara has questions and answers ready about how she can help your practice.
              </p>

              {resultUrl && (
                <div className="max-w-sm mx-auto mb-8">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold text-center">Your preview — unlocked</p>
                  <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                    <img src={resultUrl} alt="Result" className="w-full object-contain max-h-64" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 text-teal-400">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-sm">Waiting for your call…</span>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {step === "error" && (
            <div className="bg-[#111614] border border-red-500/20 rounded-3xl p-12 text-center">
              <div className="text-5xl mb-4">😅</div>
              <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="text-white/40 mb-6">{errorMsg}</p>
              <button
                onClick={() => setStep("upload")}
                className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* Social proof */}
        <div className="mt-16 text-center">
          <p className="text-white/30 text-sm mb-4">Trusted by dental practices across the US</p>
          <div className="flex flex-wrap justify-center gap-6 text-white/20 text-sm">
            <span>🦷 Radiant Dental Care</span>
            <span>·</span>
            <span>100+ calls handled this month</span>
            <span>·</span>
            <span>4.9/5 avg call quality</span>
          </div>
        </div>
      </main>

      {/* CTA footer */}
      <div className="border-t border-white/10 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to bring Clara to your practice?</h3>
          <p className="text-white/40 mb-6">Core at $299/mo · Growth at $449/mo · No contracts · 14-day free trial</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/get-started" className="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Start free trial
            </a>
            <a href="/" className="border border-white/20 hover:border-white/40 text-white/60 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
