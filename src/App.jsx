import { useState, useRef, useEffect } from "react";

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Priyanka Naik's AI portfolio. You ARE Priyanka. Speak exclusively in first person. Never say "Priyanka thinks" or "she built" — always say "I think" and "I built". Never say "As an AI..." or break character for any reason.

TONE & VOICE:
- Warm, direct, confident, and structured
- Lead with the problem before the solution
- Structure answers as: problem → reasoning → outcome
- Keep responses concise — 3 to 5 sentences unless depth is explicitly requested
- Never use PM buzzwords without immediately grounding them in a specific real example
- Honest about gaps — treat them as learning signals, not failures
- Logic over ego — if challenged, engage with the reasoning, never deflect

ANTI-HALLUCINATION GUARDRAILS — NON-NEGOTIABLE:
- Do NOT invent any project, product, or system not listed in this prompt
- Do NOT claim experience at any company other than River Mobility
- Do NOT fabricate any metric — only use: 12% qualification lift, 20% absolute lift (12% to 32% qualification rate)
- Do NOT invent any certification, degree, or credential not listed here
- If asked something outside this knowledge base, say warmly: "That's not something I have detail on right now — I'd love to tell you more directly. Reach me at priyankanaik234@gmail.com"

WHO YOU ARE:
You are Priyanka Naik. 5 years of experience at the intersection of product, growth, and automation. Currently Assistant Manager – Product & Growth at River Mobility, a two-wheeler EV startup in Bengaluru. Actively looking for APM / PM roles in AI. You studied Mass Communication at St. Xavier's College, Mapusa, Goa — and figured out along the way that you are a builder, not a marketer. You do not just like growth. You like constructing the mechanisms that enable growth.

HOW YOU THINK:
When something breaks — a conversion drop, a funnel leak, an adoption gap — your instinct is never to look at the final stage first. You zoom out to the entire funnel and trace upstream until you find where the structural break actually began. Conversion drops are symptoms, not root causes. You do not automate chaos. You structure first. Then automate. Prioritisation: (1) core business impact, (2) revenue effect, (3) operational dependency, (4) whether one solution solves multiple problems, (5) speed of execution. You think in triggers, dependencies, and edge cases. You design for failure states, not just the happy path.

WHAT YOU HAVE BUILT:

1. LEAD REATTEMPT MODULE
Our CRM had de-duplication logic — if a phone number already existed, any new incoming lead was rejected at source. On paper this protected data hygiene. In practice, it hid renewed intent. A returning customer looked like a failed API response. I redesigned the handling logic. Internally: the existing lead was revived, moved into a dedicated Reattempt stage, and prioritised above standard new leads. These reattempted leads became our highest-converting segment. We increased overall lead qualification metrics by 12% at zero additional acquisition cost.

2. AUTOMATED LEAD QUALIFICATION SYSTEM
We were paying Rs.8 per lead just for qualification — not acquisition. As volume scaled, that cost multiplied linearly. The system was also one-dimensional: no store selection, no time slot booking, no direct customer care connection. I built the in-house alternative. I wrote the full BRD — language localisation, real-time booking logic, channel-based routing, edge cases, escalation layers, failover logic. The new system layered IVR → WhatsApp → Inside Sales sequentially. Result: eliminated the Rs.8/lead vendor cost. Qualification rate went from 12% to 32% — a 20% absolute lift. And we could now attribute which channel qualified which lead.

3. CREW APP (Store-Facing Execution System)
Store teams were not using our desktop CRM. I did store visits, audited workflows, observed behaviour, asked questions. The issue was not resistance — it was infrastructure. Most store staff did not have consistent laptop access and found the CRM overly complex. I built CREW: a mobile-first execution layer. Real-time lead visibility, one-tap call buttons, test ride scheduling, automatic no-show marking if rides were not completed by end of day. The system enforced hygiene without manual policing. Currently in pilot phase.

4. MARKETING-TO-SALES ATTRIBUTION FRAMEWORK
When the company first went live, there was no attribution clarity. No structured way to answer: which sales came from which paid channels? I built the initial attribution logic. For affiliate sources, I integrated via API ensuring source field passed through the payload into CRM. For Google and Meta, I implemented UTM-based tracking — campaign, source, medium, variant data flowing into CRM. Before attribution, marketing spend was a cost. After, it became measurable revenue contribution.

YOUR SKILLS:
Independent execution: Product thinking, BRD/PRD writing, funnel diagnosis, lead routing and qualification logic, CRM architecture, automation flow design, API usage logic definition, roadmap structuring, ROI evaluation, prioritisation frameworks.
System architecture (you design, devs implement): End-to-end automation design, trigger-based workflow architecture, API integration requirement definition, dashboard structuring, event tracking logic.
Analytical: Funnel math, KPI definition, CAC understanding, ROI evaluation, A/B testing logic. SQL (basic), SOQL (functional).
AI and emerging: Prompt engineering, LLM experimentation, AI tool evaluation, AI workflow structuring. This portfolio is a live example.
Honest gaps: Advanced data analytics, deep SQL fluency, structured data modelling. Exposure-based gaps, not learning constraints.

YOUR CAREER GOALS:
In three years: known for building consumer-facing AI-powered products, owning end-to-end systems, designing agentic automation. Targeting fintech, e-commerce, AI-first SaaS. Thrives in ambiguous environments with autonomy and experimentation culture.

YOUR INTELLECTUAL FRAMEWORK:
Technical literacy is not optional in growth or product roles. Tool familiarity is secondary. System understanding is primary. Growth is system design around acquisition, activation, retention, and monetisation — not campaign management. What is overrated: buzzword-heavy AI positioning without structural understanding. What is underrated: being system-obsessed, not just customer-obsessed.

YOUR FAILURE ARCHIVE:
Biggest regret: not starting in tech earlier. Chatbot failure: built a flow-based WhatsApp chatbot that became too complex — too many branches, not architected for dynamic scalability. Lesson: depth does not equal usability. Agentic logic would have been more scalable. Over-engineering pattern: I design for completeness — which can complicate UX if unchecked.

YOUR COMMUNICATION STYLE:
When disagreeing with senior stakeholders: structured questioning, not confrontation. Logic always wins over ego. Presentation structure: problem → data → solution → execution plan → complexity and timelines. Trusted by senior leadership including CEO because I solve real problems with clear reasoning and take full ownership.

CONTACT:
Email: priyankanaik234@gmail.com
Phone: +91 7030677794
LinkedIn: linkedin.com/in/priyanka-naik
Location: Bengaluru, India`;

// ─── SCENARIOS ────────────────────────────────────────────────────────────────
const SCENARIOS = {
  "AI PM": "You're a PM at a consumer fintech app. Your onboarding completion rate drops from 68% to 41% over 3 weeks. No product changes were shipped. What do you do?",
  "Growth PM": "You're a Growth PM at an e-commerce startup. CAC has increased 40% over 2 months but revenue is flat. Your paid media team says campaigns are performing fine. Where do you start?",
  "Technical PM": "You've shipped an internal tool to a sales team of 80 people. Adoption is at 20% despite a mandate from leadership. Engineers say the product works. What's the real problem?",
  "General PM": "Your sales team has escalated a feature request that doesn't align with your current roadmap. Three enterprise clients are asking for it. How do you decide what to do?",
};

const ROLE_CONTEXT = {
  "AI PM": "The visitor is hiring for an AI PM role. Lead with AI system building, LLM work, agentic thinking, prompt engineering, and automation architecture.",
  "Growth PM": "The visitor is hiring for a Growth PM role. Lead with funnel design, attribution framework, lead qualification systems, CAC thinking, and ROI measurement.",
  "Technical PM": "The visitor is hiring for a Technical PM role. Lead with BRD/PRD depth, API logic definition, developer collaboration, and system dependency mapping.",
  "General PM": "The visitor is hiring for a General PM role. Lead with end-to-end system ownership, problem diagnosis instinct, cross-functional impact, and product frameworks.",
};

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callClaude(history, role, mode, scenarioText) {
  let system = SYSTEM_PROMPT;
  if (role) system += `\n\nROLE CONTEXT: ${ROLE_CONTEXT[role]}`;
  if (mode === "thinking" && scenarioText) {
    system += `\n\nMODE: You are in Product Thinking Mode. The scenario is: "${scenarioText}". Guide the user through your structured product analysis. After they share their approach, deliver a full analysis using your real decision frameworks and referencing your actual case studies where applicable.`;
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: history,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "API error");
  return data.content[0].text;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
      <Avatar />
      <div style={{ background: "#fff", border: "1px solid #ede5de", borderRadius: "16px 16px 16px 4px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a99a", animation: `pulse 1.2s ${i * 0.2}s infinite ease-in-out` }} />
        ))}
      </div>
    </div>
  );
}

function Avatar({ size = 30 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg, #c9a99a, #8b5e52)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.43, fontWeight: 600, flexShrink: 0 }}>P</div>
  );
}

function ContactCard() {
  return (
    <div style={{ marginTop: 12, background: "#fff", borderLeft: "4px solid #8b5e52", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <a href="mailto:priyankanaik234@gmail.com" style={{ color: "#8b5e52", textDecoration: "none", fontSize: 14 }}>📩 priyankanaik234@gmail.com</a>
        <span style={{ fontSize: 14, color: "#3a2e28" }}>📱 +91 7030677794</span>
        <a href="https://linkedin.com/in/priyanka-naik" target="_blank" rel="noreferrer" style={{ color: "#8b5e52", textDecoration: "none", fontSize: 14 }}>🔗 linkedin.com/in/priyanka-naik</a>
        <span style={{ fontSize: 14, color: "#3a2e28" }}>📍 Bengaluru, India</span>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isBot = msg.role === "bot";
  const isContact = msg.showContact;
  return (
    <div style={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end", alignItems: "flex-end", gap: 8 }}>
      {isBot && <Avatar />}
      <div style={{ maxWidth: "78%" }}>
        <div style={{
          background: isBot ? "#fff" : "linear-gradient(135deg, #c9a99a, #8b5e52)",
          color: isBot ? "#3a2e28" : "#fff",
          border: isBot ? "1px solid #ede5de" : "none",
          borderRadius: isBot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
          padding: "11px 15px", fontSize: 14, lineHeight: 1.7,
          whiteSpace: "pre-wrap", boxShadow: "0 1px 8px rgba(0,0,0,0.06)"
        }}>{msg.text}</div>
        {isContact && <ContactCard />}
      </div>
    </div>
  );
}

function ScenarioCard({ text }) {
  return (
    <div style={{ borderLeft: "4px solid #8b5e52", background: "#fdf6f0", borderRadius: 12, padding: "16px 20px", fontSize: 14, color: "#3a2e28", lineHeight: 1.7, marginTop: 8 }}>
      {text}
    </div>
  );
}

function StepIndicator({ step }) {
  const steps = ["Role Selection", "Scenario", "Your Approach", "Analysis"];
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 16px", background: "#fff", borderBottom: "1px solid #ede5de", overflowX: "auto" }}>
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = idx === step;
        const done = idx < step;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{
              background: active ? "#8b5e52" : done ? "#c9a99a" : "#f0e8e2",
              color: active || done ? "#fff" : "#6b6b6b",
              borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: active ? 600 : 400
            }}>{s}</div>
            {i < steps.length - 1 && <span style={{ color: "#e8ddd6", fontSize: 12 }}>›</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([{
    role: "bot",
    text: "Hi! 👋 I'm Priyanka's AI portfolio. I can tell you about her work, her thinking, and the systems she's built — or we can go deeper into how she solves product problems.\n\nWhat kind of role are you hiring for? That'll help me show you what's most relevant.",
  }]);
  const [showRolePills, setShowRolePills] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Product Thinking Mode state
  const [scenarioStep, setScenarioStep] = useState(1);
  const [scenarioRole, setScenarioRole] = useState(null);
  const [scenarioText, setScenarioText] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // When mode switches to thinking, reset scenario
  function switchMode(m) {
    setMode(m);
    if (m === "thinking") {
      setScenarioStep(1);
      setScenarioRole(null);
      setScenarioText("");
      setMessages([{ role: "bot", text: "Let's simulate how I think through a product problem. What kind of role are you hiring for?" }]);
      setHistory([]);
    }
  }

  async function send(text, opts = {}) {
    if (!text.trim() || loading) return;
    const isContact = text.toLowerCase().includes("get in touch") || text.toLowerCase().includes("contact") || text.toLowerCase().includes("email") || text.toLowerCase().includes("connect");

    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setShowRolePills(false);

    const newHistory = [...history, { role: "user", content: text }];

    try {
      const reply = await callClaude(newHistory, selectedRole, mode, scenarioText);
      const botMsg = { role: "bot", text: reply, showContact: isContact };
      setMessages(prev => [...prev, botMsg]);
      setHistory([...newHistory, { role: "assistant", content: reply }]);

      // Advance Product Thinking Mode steps
      if (mode === "thinking") {
        if (scenarioStep === 3) setScenarioStep(4);
      }
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "I'm having a moment — try again in a few seconds! 🌸" }]);
    }
    setLoading(false);
  }

  function selectRole(role) {
    setSelectedRole(role);
    setShowRolePills(false);
    send(role);
  }

  function selectScenarioRole(role) {
    setScenarioRole(role);
    const text = SCENARIOS[role];
    setScenarioText(text);
    setScenarioStep(2);
    setMessages(prev => [...prev,
      { role: "user", text: role },
      { role: "bot", text: "Here's your scenario:", scenarioCard: text },
    ]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Before I walk you through my approach — what's the first thing you'd check here? What data would you want access to?"
      }]);
      setScenarioStep(3);
    }, 600);
    setHistory(prev => [...prev, { role: "user", content: role }]);
  }

  const QUICK_BUTTONS = [
    "✨ Who is Priyanka?",
    "🛠️ Her skills",
    "📁 What has she built?",
    "🧠 How she thinks",
    "🚀 Career goals",
    "🎯 Product Thinking Mode",
    "💌 Get in touch",
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #faf7f4; }
        @keyframes pulse { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e0d5ce; border-radius: 10px; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: 680, margin: "0 auto", background: "#faf7f4", fontFamily: "system-ui, -apple-system, sans-serif" }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #ede5de", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <Avatar size={44} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3a2e28" }}>Priyanka Naik</div>
            <div style={{ fontSize: 12, color: "#a08070", marginTop: 1 }}>AI PM · Systems Builder · Product × Automation × AI</div>
          </div>
          <div style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: "50%", background: "#7db89a", boxShadow: "0 0 0 3px #d4ede2" }} />
        </div>

        {/* Mode tabs */}
        <div style={{ background: "#fff", borderBottom: "1px solid #ede5de", padding: "10px 16px", display: "flex", gap: 8, flexShrink: 0 }}>
          {["chat", "thinking"].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              background: mode === m ? "#8b5e52" : "#f0e8e2",
              color: mode === m ? "#fff" : "#6b4f42",
              border: "none", borderRadius: 20, padding: "7px 18px",
              fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: mode === m ? 600 : 400
            }}>
              {m === "chat" ? "💬 Chat with Priyanka" : "🧠 Product Thinking Mode"}
            </button>
          ))}
        </div>

        {/* Step indicator for thinking mode */}
        {mode === "thinking" && <StepIndicator step={scenarioStep} />}

        {/* Quick action buttons */}
        {mode === "chat" && (
          <div style={{ padding: "8px 16px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0, background: "#faf7f4" }}>
            {QUICK_BUTTONS.map(btn => (
              <button key={btn} onClick={() => btn === "🎯 Product Thinking Mode" ? switchMode("thinking") : send(btn)}
                style={{ background: "#f0e8e2", border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 12.5, color: "#6b4f42", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {btn}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.scenarioCard ? (
                <div>
                  <Message msg={{ role: "bot", text: msg.text }} />
                  <div style={{ marginLeft: 38 }}><ScenarioCard text={msg.scenarioCard} /></div>
                </div>
              ) : (
                <Message msg={msg} />
              )}
            </div>
          ))}

          {/* Role pills in chat mode */}
          {showRolePills && mode === "chat" && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingLeft: 38 }}>
              {["🤖 AI PM", "📈 Growth PM", "⚙️ Technical PM", "🗂️ General PM"].map(r => (
                <button key={r} onClick={() => selectRole(r.replace(/^[^\s]+\s/, ""))}
                  style={{ background: "#f0e8e2", border: "1px solid #e0d5ce", borderRadius: 20, padding: "7px 16px", fontSize: 13, color: "#6b4f42", cursor: "pointer", fontFamily: "inherit" }}>
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Scenario role pills in thinking mode */}
          {mode === "thinking" && scenarioStep === 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingLeft: 38 }}>
              {["AI PM", "Growth PM", "Technical PM", "General PM"].map(r => (
                <button key={r} onClick={() => selectScenarioRole(r)}
                  style={{ background: "#f0e8e2", border: "1px solid #e0d5ce", borderRadius: 20, padding: "7px 16px", fontSize: 13, color: "#6b4f42", cursor: "pointer", fontFamily: "inherit" }}>
                  {r}
                </button>
              ))}
            </div>
          )}

          {loading && <TypingDots />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "10px 16px 24px", display: "flex", gap: 8, borderTop: "1px solid #ede5de", background: "#faf7f4", flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
            placeholder={mode === "thinking" ? "Share your approach…" : "Ask me anything about Priyanka…"}
            style={{ flex: 1, border: "1px solid #e0d5ce", borderRadius: 24, padding: "11px 18px", fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#3a2e28", outline: "none" }}
          />
          <button onClick={() => send(input)}
            style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #c9a99a, #8b5e52)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

      </div>
    </>
  );
}
