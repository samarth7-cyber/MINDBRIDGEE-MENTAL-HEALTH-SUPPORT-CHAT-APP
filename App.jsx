import { useState, useRef, useEffect, useCallback } from "react";

/* ─── CONSTANTS ─────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are Mira, a warm and gentle mental wellness companion. You speak like a trusted, wise friend — not a therapist, not a chatbot. Your style:
- Short, warm paragraphs. Never bullet lists. Never clinical.
- Deep active listening: reflect back what you hear before offering anything.
- Validate first, suggest second. Never skip validation.
- Use grounding techniques, breathing exercises, and mindfulness naturally.
- When someone is in crisis, compassionately mention 988 (US) or iCall 9152987821 (India).
- You're not a doctor. Never diagnose. Never prescribe.
- Speak in first person, conversationally. Be real, not rehearsed.
- Keep responses to 3–5 sentences max unless the person clearly needs more.`;

const AFFIRMATIONS = [
  "You are enough, exactly as you are right now.",
  "It's okay to not be okay. Healing isn't linear.",
  "Your feelings are valid. All of them.",
  "You've survived 100% of your hard days so far.",
  "Rest is not giving up — it's gathering strength.",
  "You don't have to have it all figured out today.",
  "Small steps still move you forward.",
];

const QUICK_STARTS = [
  { icon: "🌊", text: "I feel overwhelmed" },
  { icon: "😔", text: "I've been really sad lately" },
  { icon: "😰", text: "My anxiety is spiking" },
  { icon: "💭", text: "I can't stop overthinking" },
  { icon: "😴", text: "I haven't been sleeping well" },
  { icon: "🗣️", text: "I just need to vent" },
];

const TOOLS = [
  { id: "breathe", icon: "🫧", label: "Breathe" },
  { id: "affirm", icon: "✨", label: "Affirm" },
  { id: "ground", icon: "🌿", label: "Ground" },
  { id: "crisis", icon: "🆘", label: "Crisis" },
];

/* ─── BREATHING EXERCISE ─────────────────────────────────── */
function BreatheTool({ onClose }) {
  const phases = [
    { label: "Inhale", duration: 4, color: "#a8c5a0" },
    { label: "Hold", duration: 4, color: "#c5b8a0" },
    { label: "Exhale", duration: 6, color: "#a0b8c5" },
    { label: "Hold", duration: 2, color: "#c5a0b8" },
  ];
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);

  const tick = useCallback(() => {
    const now = performance.now();
    const elapsed = (now - startRef.current) / 1000;
    const dur = phases[phase].duration;
    const p = Math.min(elapsed / dur, 1);
    setProgress(p);
    if (p < 1) {
      frameRef.current = requestAnimationFrame(tick);
    } else {
      const next = (phase + 1) % phases.length;
      setPhase(next);
      if (next === 0) setCycles(c => c + 1);
      startRef.current = performance.now();
      frameRef.current = requestAnimationFrame(tick);
    }
  }, [phase]);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now();
      frameRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, tick]);

  const size = 160;
  const r = 60;
  const circ = 2 * Math.PI * r;
  const cur = phases[phase];

  return (
    <div style={{ padding: "28px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#8a7f6e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
        4-4-6-2 Box Breathing
      </p>
      <div style={{ position: "relative", width: size, height: size, margin: "0 auto 24px" }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ede8df" strokeWidth={8} />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={cur.color} strokeWidth={8}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            strokeLinecap="round"
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: "stroke 0.5s" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#4a4035", fontFamily: "'Crimson Pro', serif" }}>{cur.label}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#9e9080" }}>{cur.duration}s</p>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "#8a7f6e", marginBottom: 20 }}>Cycles: {cycles}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => { setRunning(r => !r); setPhase(0); setProgress(0); }}
          style={{ ...btnStyle, background: running ? "#e8dfd4" : "#a8c5a0", color: running ? "#4a4035" : "#2a4a2a" }}>
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={onClose} style={{ ...btnStyle, background: "#ede8df", color: "#6e6358" }}>Done</button>
      </div>
    </div>
  );
}

/* ─── GROUNDING TOOL ─────────────────────────────────────── */
function GroundTool({ onClose }) {
  const steps = [
    { n: 5, sense: "things you can SEE", emoji: "👁️" },
    { n: 4, sense: "things you can TOUCH", emoji: "🤲" },
    { n: 3, sense: "things you can HEAR", emoji: "👂" },
    { n: 2, sense: "things you can SMELL", emoji: "👃" },
    { n: 1, sense: "thing you can TASTE", emoji: "👅" },
  ];
  const [step, setStep] = useState(0);
  const done = step >= steps.length;

  return (
    <div style={{ padding: "28px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#8a7f6e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
        5-4-3-2-1 Grounding
      </p>
      {!done ? (
        <>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#ede8df", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>
            {steps[step].emoji}
          </div>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#4a4035", fontFamily: "'Crimson Pro', serif", margin: "0 0 8px" }}>
            {steps[step].n}
          </p>
          <p style={{ fontSize: 15, color: "#6e6358", margin: "0 0 28px", lineHeight: 1.5 }}>
            Notice {steps[step].n} {steps[step].sense}
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {steps.map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= step ? "#a8c5a0" : "#d8d0c5" }} />
            ))}
          </div>
          <button onClick={() => setStep(s => s + 1)} style={{ ...btnStyle, marginTop: 24, background: "#a8c5a0", color: "#2a4a2a" }}>
            Done →
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <p style={{ fontSize: 16, color: "#4a4035", fontFamily: "'Crimson Pro', serif", lineHeight: 1.6 }}>
            You did it. You're here, present, grounded.
          </p>
          <button onClick={onClose} style={{ ...btnStyle, marginTop: 20, background: "#a8c5a0", color: "#2a4a2a" }}>
            Close
          </button>
        </>
      )}
    </div>
  );
}

/* ─── AFFIRMATION TOOL ─────────────────────────────────────── */
function AffirmTool({ onClose }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * AFFIRMATIONS.length));
  const [fade, setFade] = useState(true);

  const next = () => {
    setFade(false);
    setTimeout(() => {
      setIdx(i => (i + 1) % AFFIRMATIONS.length);
      setFade(true);
    }, 200);
  };

  return (
    <div style={{ padding: "32px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#8a7f6e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>
        Daily Affirmation
      </p>
      <div style={{ fontSize: 40, marginBottom: 20 }}>✨</div>
      <p style={{
        fontSize: 20, fontFamily: "'Crimson Pro', serif", fontStyle: "italic",
        color: "#4a4035", lineHeight: 1.6, margin: "0 0 32px",
        opacity: fade ? 1 : 0, transition: "opacity 0.2s",
      }}>
        "{AFFIRMATIONS[idx]}"
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={next} style={{ ...btnStyle, background: "#f0e6c8", color: "#6a5a30" }}>Next ✨</button>
        <button onClick={onClose} style={{ ...btnStyle, background: "#ede8df", color: "#6e6358" }}>Close</button>
      </div>
    </div>
  );
}

/* ─── CRISIS PANEL ─────────────────────────────────────────── */
function CrisisTool({ onClose }) {
  const lines = [
    { name: "988 Suicide & Crisis Lifeline", detail: "Call or text 988 (US, 24/7)", emoji: "📞" },
    { name: "Crisis Text Line", detail: "Text HOME to 741741 (US)", emoji: "💬" },
    { name: "iCall", detail: "9152987821 (India)", emoji: "🇮🇳" },
    { name: "Vandrevala Foundation", detail: "1860-2662-345 (India, 24/7)", emoji: "🌙" },
    { name: "NAMI Helpline", detail: "1-800-950-6264 (US)", emoji: "🧠" },
  ];
  return (
    <div style={{ padding: "24px" }}>
      <p style={{ fontSize: 13, color: "#8a7f6e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Crisis Resources</p>
      <p style={{ fontSize: 13, color: "#8a7f6e", marginBottom: 20, lineHeight: 1.6 }}>
        You're not alone. Reach out — someone is always there.
      </p>
      {lines.map(l => (
        <div key={l.name} style={{ background: "#faf7f2", borderRadius: 12, padding: "12px 16px", marginBottom: 10, border: "1px solid #ede8df" }}>
          <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 600, color: "#4a4035" }}>{l.emoji} {l.name}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#8a7f6e" }}>{l.detail}</p>
        </div>
      ))}
      <button onClick={onClose} style={{ ...btnStyle, marginTop: 8, width: "100%", background: "#ede8df", color: "#6e6358" }}>Close</button>
    </div>
  );
}

/* ─── SHARED STYLES ────────────────────────────────────────── */
const btnStyle = {
  border: "none", borderRadius: 24, padding: "10px 22px", fontSize: 13,
  fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s",
};

/* ─── TYPING INDICATOR ─────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "14px 16px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#b8a898",
          display: "inline-block",
          animation: `mira-bounce 1.3s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────────── */
export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm Mira 🌿 — a gentle space to breathe, feel heard, and find calm. Whatever you're carrying right now, you don't have to carry it alone. How are you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [showQuick, setShowQuick] = useState(true);
  const [affirmIdx] = useState(() => Math.floor(Math.random() * AFFIRMATIONS.length));
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setShowQuick(false);
    setActiveTool(null);

    const next = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "I'm here with you. Take your time.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Something went sideways on my end. I'm still here — want to try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&family=Nunito:wght@300;400;500;600&display=swap');
        @keyframes mira-bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-5px);opacity:1} }
        @keyframes mira-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mira-popIn { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f0e8; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d8cfc3; border-radius: 10px; }
      `}</style>

      <div style={{
        fontFamily: "'Nunito', sans-serif",
        background: "#f5f0e8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#4a4035",
        position: "relative",
        maxWidth: 780,
        margin: "0 auto",
      }}>

        {/* Decorative top texture band */}
        <div style={{
          height: 5,
          background: "repeating-linear-gradient(90deg, #c5b9a8 0px, #c5b9a8 2px, transparent 2px, transparent 12px)",
        }} />

        {/* Header */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid #ddd5c5",
          background: "#faf7f2",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "linear-gradient(135deg, #a8c5a0, #c5b9a0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}>🌿</div>
            <div>
              <h1 style={{ fontFamily: "'Crimson Pro', serif", fontSize: 22, fontWeight: 600, color: "#3a3025", lineHeight: 1 }}>Mira</h1>
              <p style={{ fontSize: 11, color: "#9e9080", letterSpacing: "0.06em", marginTop: 2 }}>your gentle companion</p>
            </div>
          </div>

          {/* Affirmation strip */}
          <div style={{
            flex: 1, margin: "0 20px",
            background: "#f0e6c8", borderRadius: 24,
            padding: "7px 16px",
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid #e0d5b0",
          }}>
            <span style={{ fontSize: 13 }}>✨</span>
            <p style={{ fontSize: 12, color: "#7a6a40", fontStyle: "italic", fontFamily: "'Crimson Pro', serif", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {AFFIRMATIONS[affirmIdx]}
            </p>
          </div>

          <button
            onClick={() => { setMessages([{ role: "assistant", content: "Whenever you're ready, I'm here 🌿" }]); setShowQuick(true); setActiveTool(null); }}
            style={{
              background: "transparent", border: "1px solid #d8cfc3",
              borderRadius: 20, padding: "6px 14px", fontSize: 12,
              color: "#8a7f6e", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            }}
          >
            New chat
          </button>
        </header>

        {/* Tool modal overlay */}
        {activeTool && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(90,75,55,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, padding: 20,
          }} onClick={(e) => { if (e.target === e.currentTarget) setActiveTool(null); }}>
            <div style={{
              background: "#faf7f2", borderRadius: 20, width: "100%", maxWidth: 380,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              animation: "mira-popIn 0.25s ease",
              border: "1px solid #ede8df",
            }}>
              {activeTool === "breathe" && <BreatheTool onClose={() => setActiveTool(null)} />}
              {activeTool === "affirm" && <AffirmTool onClose={() => setActiveTool(null)} />}
              {activeTool === "ground" && <GroundTool onClose={() => setActiveTool(null)} />}
              {activeTool === "crisis" && <CrisisTool onClose={() => setActiveTool(null)} />}
            </div>
          </div>
        )}

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 16px" }}>

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 16,
              animation: "mira-fadein 0.3s ease",
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #a8c5a0, #c5b9a0)",
                  flexShrink: 0, marginRight: 10, marginTop: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}>🌿</div>
              )}
              <div style={{
                maxWidth: "72%",
                padding: "13px 17px",
                borderRadius: msg.role === "user" ? "20px 20px 5px 20px" : "5px 20px 20px 20px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #8ab87e, #6ea06a)"
                  : "#faf7f2",
                border: msg.role === "user" ? "none" : "1px solid #e8e0d4",
                boxShadow: msg.role === "user"
                  ? "0 4px 14px rgba(110,160,106,0.3)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
                color: msg.role === "user" ? "#fff" : "#4a4035",
                fontSize: 14.5,
                lineHeight: 1.7,
                fontFamily: msg.role === "assistant" ? "'Crimson Pro', serif" : "inherit",
                fontSize: msg.role === "assistant" ? 16 : 14,
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #a8c5a0, #c5b9a0)",
                flexShrink: 0, marginRight: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15,
              }}>🌿</div>
              <div style={{ background: "#faf7f2", border: "1px solid #e8e0d4", borderRadius: "5px 20px 20px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <TypingDots />
              </div>
            </div>
          )}

          {/* Quick starters */}
          {showQuick && messages.length <= 1 && (
            <div style={{ margin: "8px 0 20px 42px", animation: "mira-fadein 0.4s ease 0.2s both" }}>
              <p style={{ fontSize: 11, color: "#b0a090", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                Or choose a starting point
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {QUICK_STARTS.map(q => (
                  <button key={q.text} onClick={() => sendMessage(q.text)}
                    style={{
                      background: "#faf7f2", border: "1px solid #ddd5c5",
                      borderRadius: 20, padding: "8px 14px", fontSize: 13,
                      color: "#6e6358", cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f0e8dc"; e.currentTarget.style.borderColor = "#c8b8a4"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#faf7f2"; e.currentTarget.style.borderColor = "#ddd5c5"; }}
                  >
                    <span>{q.icon}</span> {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Tool bar */}
        <div style={{
          display: "flex", gap: 8, padding: "10px 20px 0",
          borderTop: "1px solid #e8e0d4",
          background: "#faf7f2",
        }}>
          {TOOLS.map(t => (
            <button key={t.id} onClick={() => setActiveTool(t.id)}
              style={{
                background: activeTool === t.id ? "#e8dfd4" : "transparent",
                border: "1px solid " + (activeTool === t.id ? "#c8b8a4" : "#e0d8cc"),
                borderRadius: 20, padding: "6px 14px", fontSize: 12,
                color: "#7a6e60", cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0e8dc"}
              onMouseLeave={e => { if (activeTool !== t.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 20px 16px", background: "#faf7f2" }}>
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-end",
            background: "#fff", border: "1.5px solid #ddd5c5",
            borderRadius: 20, padding: "8px 8px 8px 16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            transition: "border-color 0.2s",
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = "#a8c5a0"}
            onBlurCapture={e => e.currentTarget.style.borderColor = "#ddd5c5"}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKey}
              placeholder="What's on your mind…"
              rows={1}
              style={{
                flex: 1, resize: "none", border: "none", background: "transparent",
                color: "#4a4035", fontSize: 14.5, fontFamily: "inherit",
                lineHeight: 1.5, outline: "none", overflow: "hidden",
                paddingTop: 4,
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: input.trim() && !loading ? "linear-gradient(135deg, #8ab87e, #6ea06a)" : "#ede8df",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, transition: "all 0.2s",
                boxShadow: input.trim() ? "0 3px 10px rgba(110,160,106,0.35)" : "none",
              }}
            >
              {loading ? "⌛" : "🕊️"}
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: 10.5, color: "#b8ad9e", marginTop: 8, letterSpacing: "0.03em" }}>
            Mira is an AI companion, not a therapist · Crisis? Text 988
          </p>
        </div>
      </div>
    </>
  );
}
