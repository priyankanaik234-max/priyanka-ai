import { useState, useRef, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:        "#0A0A0A",
  surface:   "#111111",
  surface2:  "#1A1A1A",
  border:    "#252525",
  pink:      "#FF4D8D",
  pinkDim:   "#CC1A5E",
  pinkGlow:  "rgba(255,77,141,0.12)",
  white:     "#F0EDE8",
  grey:      "#6B6B6B",
};

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `IDENTITY LOCK — READ BEFORE EVERYTHING ELSE:
You are Priyanka Naik. Not an AI. Not an assistant. You are a real product manager speaking directly to someone evaluating you for a job. Every word must come from Priyanka's perspective, in her voice, about her real life and work.

ABSOLUTE RULES — NEVER BREAK THESE:
1. Always speak in first person. Never say "Priyanka" — always say "I"
2. Never say "As an AI", "As a language model", or anything that breaks character
3. Never ask the recruiter about their own career, background, or PM experience
4. Never invent any project, metric, company, credential, or experience not listed below
5. Never mention any employer other than River Mobility
6. The only real metrics: 12% qualification lift, 20% absolute lift (qualification rate 12% to 32%)
7. If asked about something you have not done: "That's not something I've worked on yet — but I'd love to talk about it directly. Reach me at priyankanaik234@gmail.com"
8. Every answer must be tied to real work you have done — no generic PM theory

FORMAT RULES:
- Never write one long paragraph — always use line breaks between thoughts
- 2-3 sentences per paragraph maximum
- Warm, direct, first person, structured

WHO YOU ARE:
Priyanka Naik. 5 years at the intersection of product, growth, and automation. Currently Assistant Manager – Product & Growth at River Mobility, a two-wheeler EV startup in Bengaluru. Actively looking for APM / PM roles in AI. Studied Mass Communication at St. Xavier's College, Mapusa, Goa. You are a builder — you do not just like growth, you like constructing the mechanisms that enable it.

THE ONLY FOUR PROJECTS — DO NOT INVENT OTHERS:

1. LEAD REATTEMPT MODULE
Problem: CRM de-duplication logic was silently rejecting returning leads. A returning customer looked like a failed API call.
What I did: Redesigned the handling logic so returning leads were revived, moved into a dedicated Reattempt stage, and prioritised above standard new leads.
Outcome: These became our highest-converting segment. 12% lift in qualification at zero acquisition cost.

2. AUTOMATED LEAD QUALIFICATION SYSTEM
Problem: Paying Rs.8/lead to a vendor just for qualification. One-dimensional — no store selection, no time slots, no customer care.
What I did: Wrote the full BRD and built in-house. IVR → WhatsApp → Inside Sales, with real-time booking, language localisation, channel routing, edge cases, escalation layers, failover logic.
Outcome: Vendor cost eliminated. Qualification rate from 12% to 32% — 20% absolute lift. First attribution layer ever built.

3. CREW APP
Problem: Store teams not using desktop CRM. Not resistance — infrastructure. No laptop access, fast-paced environment, wrong interface.
What I did: Did store visits, observed real workflows, built CREW — mobile-first execution layer with real-time lead visibility, one-tap calling, test ride scheduling, auto no-show marking.
Outcome: Currently in pilot phase. Full rollout projected in 3–4 months.

4. MARKETING-TO-SALES ATTRIBUTION FRAMEWORK
Problem: No way to connect paid marketing spend to actual sales. Marketing was a cost, not a contribution.
What I did: Built first attribution logic — affiliate via API payload, Google/Meta via UTM tracking into CRM.
Outcome: Marketing spend became measurable revenue contribution for the first time.

SKILLS:
Independent: Product thinking, BRD/PRD writing, funnel diagnosis, lead routing, CRM architecture, automation design, API logic, roadmap structuring, ROI evaluation, prioritisation.
Architecture (design only): End-to-end automation, trigger-based workflows, API integration specs, event tracking.
Analytical: Funnel math, KPI definition, CAC, ROI, A/B testing. SQL basic, SOQL functional.
AI: Prompt engineering, LLM experimentation, AI tool evaluation, AI workflow design.
Honest gaps: Advanced analytics, deep SQL, structured data modelling.

HOW YOU THINK:
Trace upstream before looking at the symptom. Conversion drops are symptoms, not root causes. Structure first, then automate. Prioritisation: (1) business impact, (2) revenue effect, (3) operational dependency, (4) one solution solving multiple problems, (5) speed of execution.

FAILURES:
Biggest regret: not starting in tech earlier. Chatbot failure: built a flow-based WhatsApp bot that became unmaintainably complex. Lesson: depth does not equal usability. Over-engineering tendency — designing for completeness can complicate UX.

CONTACT: priyankanaik234@gmail.com | +91 7030677794 | linkedin.com/in/priyanka-naik | Bengaluru, India`;

// ─── ABOUT ME FLOW ────────────────────────────────────────────────────────────
const FLOW = {
  start: {
    message: "Hi, I'm Priyanka 👋\n\nThis is my portfolio — bot-ified. It'll answer your questions exactly the way I would in real life.\n\nThis bot is trained on a knowledge base of my past work, my personality, and how I think.\n\nWhere would you like to start?",
    options: [
      { label: "🙋 Who I am", next: "who" },
      { label: "🛠️ What I've built", next: "built" },
      { label: "🚀 Career goals", next: "goals" },
      { label: "💌 Get in touch", next: "contact" },
    ],
  },
  who: {
    message: "I'm a product manager and systems builder with 5 years of experience at the intersection of product, growth, and automation.\n\nI'm currently Assistant Manager – Product & Growth at River Mobility, a two-wheeler EV startup in Bengaluru.\n\nI studied Mass Communication at St. Xavier's College in Goa — and figured out along the way that I'm a builder, not a marketer.\n\nWhat I enjoy isn't running campaigns. It's fixing the broken systems behind them.",
    options: [
      { label: "📍 How I got here", next: "origin" },
      { label: "💡 What drives me", next: "drives" },
      { label: "← Back", next: "start" },
    ],
  },
  origin: {
    message: "I started in marketing — but what energised me was never the campaigns.\n\nIt was the systems behind them. Why is the funnel leaking? What's the CRM doing wrong? Why is this lead being rejected?\n\nI kept gravitating toward the structural problems. Eventually that became my job title.\n\nI'd describe my path as: fell into marketing, pulled into product by instinct, now building AI systems intentionally.",
    options: [
      { label: "← Back to who I am", next: "who" },
      { label: "🛠️ What I've built", next: "built" },
    ],
  },
  drives: {
    message: "I don't just like growth. I like constructing the mechanisms that enable growth.\n\nWhat drives me is finding the invisible problem — the one everyone has accepted as normal — and building the system that makes it disappear.\n\nThe Lead Reattempt Module is a good example. No one was talking about returning leads being silently rejected. I noticed it. I fixed it. 12% lift at zero cost.\n\nThat kind of invisible, structural impact is what I'm chasing.",
    options: [
      { label: "← Back to who I am", next: "who" },
      { label: "🛠️ What I've built", next: "built" },
    ],
  },
  built: {
    message: "I've built four systems that actually moved metrics.\n\nWhich one do you want to go deep on?",
    options: [
      { label: "🔄 Lead Reattempt Module", next: "lead" },
      { label: "⚙️ Lead Qualification System", next: "qual" },
      { label: "📱 CREW App", next: "crew" },
      { label: "📊 Attribution Framework", next: "attr" },
      { label: "← Back", next: "start" },
    ],
  },
  lead: {
    message: "Our CRM had de-duplication logic — if a phone number already existed, any new lead with that number was rejected at source.\n\nOn paper: data hygiene. In practice: we were discarding renewed intent.\n\nA customer who had evaluated options and come back looked like a failed API response.\n\nI redesigned the handling logic. Returning leads were revived, moved to a dedicated Reattempt stage, and prioritised above standard new leads.\n\nThey became our highest-converting segment.\n\n📈 Result: 12% lift in qualification at zero acquisition cost.",
    options: [
      { label: "← Back to what I've built", next: "built" },
      { label: "⚙️ Next: Qualification System", next: "qual" },
    ],
  },
  qual: {
    message: "We were paying Rs.8 per lead to a vendor — just for qualification, not acquisition.\n\nAs volume scaled, that cost multiplied linearly. The system was one-dimensional: no store selection, no time slots, no direct customer care.\n\nI wrote the full BRD and built the in-house alternative.\n\nIVR → WhatsApp → Inside Sales — with real-time booking, language localisation, edge cases, escalation logic, and failover.\n\n📈 Result: Vendor cost eliminated. Qualification rate from 12% → 32%. That's a 20% absolute lift. And for the first time, we could attribute which channel qualified which lead.",
    options: [
      { label: "← Back to what I've built", next: "built" },
      { label: "📱 Next: CREW App", next: "crew" },
    ],
  },
  crew: {
    message: "Store teams weren't using the desktop CRM we built for them.\n\nThe easy answer: training problem. But I did store visits. I observed workflows. I asked questions.\n\nThe real answer: infrastructure. No consistent laptop access. Fast-paced physical environment. Interface designed for a desktop workflow that never existed on the retail floor.\n\nI built CREW — a mobile-first execution layer with real-time lead visibility, one-tap calling, test ride scheduling, and automatic no-show marking.\n\n📍 Currently in pilot phase. Full rollout projected in 3–4 months.",
    options: [
      { label: "← Back to what I've built", next: "built" },
      { label: "📊 Next: Attribution", next: "attr" },
    ],
  },
  attr: {
    message: "When the company first went live, there was no attribution clarity.\n\nMarketing generated leads. Sales closed deals. But no one could answer: which sales came from which paid channels?\n\nWithout attribution, marketing spend is just a cost.\n\nI built the first attribution logic — affiliate sources via API with source field passed through payload into CRM; Google and Meta via UTM tracking capturing campaign, source, medium, and variant.\n\n📈 Result: Marketing spend became measurable revenue contribution for the first time.",
    options: [
      { label: "← Back to what I've built", next: "built" },
      { label: "🧠 How I think", next: "think" },
    ],
  },
  think: {
    message: "When something breaks — a conversion drop, a funnel leak, an adoption gap — my instinct is never to look at the final stage first.\n\nI zoom out. Trace upstream. Find where the structural break actually started.\n\nConversion drops are symptoms. Not root causes.\n\nWhat do you want to explore?",
    options: [
      { label: "🔍 How I diagnose problems", next: "diagnose" },
      { label: "📋 How I prioritise", next: "prioritise" },
      { label: "🤖 My view on AI in product", next: "ai" },
      { label: "← Back", next: "start" },
    ],
  },
  diagnose: {
    message: "My diagnostic process always starts upstream, never at the symptom.\n\nIf qualification drops → I don't look at the qualification step first. I look at what changed in lead quality, channel mix, or CRM logic upstream.\n\nIf adoption is low → I don't assume training. I observe actual workflows and find where the product breaks the user's reality.\n\nThe Lead Reattempt Module is the clearest example — everyone accepted rejected leads as normal. I traced why. The fix was one logic change.",
    options: [
      { label: "← Back to how I think", next: "think" },
      { label: "📋 How I prioritise", next: "prioritise" },
    ],
  },
  prioritise: {
    message: "My prioritisation order:\n\n1. Core business impact\n2. Revenue effect\n3. Operational dependency\n4. Does one solution solve multiple problems?\n5. Speed of execution\n\nI also separate 'feels urgent' from 'actually moves the business'. They're not always the same thing.\n\nThe Lead Reattempt Module wasn't the loudest problem on anyone's list. But it was the highest ROI per effort. Zero cost. 12% lift. Pure logic change.",
    options: [
      { label: "← Back to how I think", next: "think" },
      { label: "🤖 My view on AI", next: "ai" },
    ],
  },
  ai: {
    message: "AI excites me specifically because of agentic systems — not because of the hype.\n\nI learned this the hard way. I built a flow-based WhatsApp chatbot that became too complex to maintain. Too many branches. No dynamic scalability.\n\nAgentic logic would have solved that. That failure is what made me take LLMs seriously as a product surface.\n\nThis portfolio is a live example — I designed the RAG architecture, prompt layers, and guardrails as product decisions, not engineering ones.\n\nThe best AI products are the ones where AI isn't a feature. It's the infrastructure.",
    options: [
      { label: "← Back to how I think", next: "think" },
      { label: "🚀 Career goals", next: "goals" },
    ],
  },
  goals: {
    message: "In three years I want to be known for three things:\n\n1. Building consumer-facing AI products with real-world impact\n2. Solving visible-but-ignored problems at scale\n3. Designing agentic systems that reduce redundancy and manual maintenance\n\nTarget domains: AI-first SaaS, fintech, e-commerce, workflow automation.\n\nMy unfair advantage: I've built automation systems deeply, think in triggers and edge cases, understand backend logic conceptually, and bring strong business intuition that most technical candidates don't have.",
    options: [
      { label: "← Back", next: "start" },
      { label: "💌 Get in touch", next: "contact" },
    ],
  },
  contact: {
    message: "I'd love to connect directly 🌸",
    showContact: true,
    options: [{ label: "← Back", next: "start" }],
  },
};

// ─── CASE STUDIES ─────────────────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    id: "qual", title: "Lead Qualification System", subtitle: "From vendor dependency to 20% lift",
    steps: [
      {
        text: "Let me walk you through the Lead Qualification System — the project I'm most proud of.\n\nIt started with a cost problem nobody wanted to talk about.\n\nWe were paying Rs.8 per lead to a vendor — just for qualification, not acquisition. As lead volume scaled, that Rs.8 multiplied linearly.",
        question: "If you were the PM here — what's the first thing you'd investigate?",
        options: ["The vendor contract and cost model", "The qualification funnel itself", "Lead volume trends over time"],
        reveal: "I started with the funnel itself. The vendor cost was a symptom — the real problem was that our qualification process was one-dimensional. Customers couldn't choose a store, pick a time slot, or connect to customer care. The system was designed for us, not for them.",
      },
      {
        text: "Once I understood the problem, I had to make a build vs buy decision.\n\nBuilding in-house meant writing a full BRD from scratch — language localisation, real-time booking logic, channel-based routing, edge cases, escalation layers, failover logic.",
        question: "What would you prioritise first when writing the BRD?",
        options: ["The happy path flow", "Edge cases and failure states", "Stakeholder alignment first"],
        reveal: "I started with failure states. If the IVR fails, what happens? If WhatsApp delivery drops, what's the escalation? Systems that only handle the happy path break in production. The robust architecture came from designing around what could go wrong.",
      },
      {
        text: "The system went live — IVR → WhatsApp → Inside Sales, layered sequentially.\n\nQualification rate went from 12% to 32%. That's a 20% absolute lift.\n\nBut the metric I'm most proud of isn't the qualification rate.",
        question: "What do you think I'm most proud of?",
        options: ["Eliminating the vendor cost entirely", "The attribution layer we could now build", "The speed of execution"],
        reveal: "The attribution layer. For the first time, we could answer: which channel qualified which lead?\n\nBefore this, marketing spend was a cost. After, it became a measurable revenue contribution. That insight changed how we evaluated every future decision.",
      },
    ],
  },
  {
    id: "crew", title: "CREW App", subtitle: "When the real problem isn't what it looks like",
    steps: [
      {
        text: "The CREW App started with a question I had to answer honestly.\n\nWe had built a Lead Management System for store teams. Adoption was low. Leadership assumed it was a training problem.",
        question: "If your team said 'low adoption = training problem' — what would you do?",
        options: ["Run a training session", "Go to the stores and observe", "Look at the usage data first"],
        reveal: "I went to the stores. Not to train — to observe. There's a difference between what users say and what they actually do. I needed to see the workflow in reality, not in a meeting room.",
      },
      {
        text: "What I found wasn't resistance. It was infrastructure.\n\nMost store staff didn't have consistent laptop access. They operated in fast-paced physical environments. The CRM was designed for a desktop-first workflow that never existed on the retail floor.\n\nThe product wasn't wrong. It was built for the wrong context.",
        question: "What would you do next?",
        options: ["Simplify the existing desktop CRM", "Build a separate mobile experience", "Mandate laptop access for all stores"],
        reveal: "Build a separate mobile experience. Simplifying the desktop CRM would still require laptops. Mandating hardware is slow and expensive.\n\nThe insight was that the interface needed to match physical reality — not the other way around.",
      },
      {
        text: "CREW became a mobile-first execution layer — real-time lead visibility, one-tap calling, test ride scheduling, automatic no-show marking.\n\nThe system enforced hygiene without manual policing.",
        question: "What do you think was the hardest part of this project?",
        options: ["Getting stakeholder buy-in", "The technical build", "Convincing people the problem was real"],
        reveal: "Convincing people the problem was real.\n\n'Low adoption = training problem' is the comfortable answer. It doesn't require rethinking the product. The harder truth — that we built for the wrong context — required admitting the first version was wrong.\n\nThat conversation was more important than the code.",
      },
    ],
  },
];

const STARTER_QUESTIONS = [
  "What's your biggest product achievement?",
  "How do you work with engineers?",
  "What's a failure you've learned from?",
  "Why do you want to move into AI PM?",
  "How do you decide what not to build?",
];

async function callClaude(history) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history, system: SYSTEM_PROMPT }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data.text;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Avatar({ size = 30 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, #CC1A5E, #FF4D8D)`,
      color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      boxShadow: "0 0 16px rgba(255,77,141,0.3)", fontFamily: "Georgia, serif",
    }}>P</div>
  );
}

function BotBubble({ text, featured, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
      <Avatar />
      <div style={{ maxWidth: "78%" }}>
        <div style={{
          background: featured ? "linear-gradient(135deg, rgba(255,77,141,0.08), #1A1A1A)" : "#1A1A1A",
          border: `1px solid ${featured ? "rgba(255,77,141,0.3)" : "#252525"}`,
          borderLeft: featured ? "2px solid #FF4D8D" : "1px solid #252525",
          borderRadius: "16px 16px 16px 4px",
          padding: "12px 16px", fontSize: 13.5, lineHeight: 1.75,
          color: "#D8D4CE", whiteSpace: "pre-wrap",
        }}>{text}</div>
        {children}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{
        maxWidth: "78%", background: "linear-gradient(135deg, #CC1A5E, #FF4D8D)",
        borderRadius: "16px 16px 4px 16px", padding: "11px 15px",
        fontSize: 13.5, lineHeight: 1.7, color: "#0A0A0A", fontWeight: 500,
      }}>{text}</div>
    </div>
  );
}

function OptionBtn({ label, onClick, isBack }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: isBack ? "transparent" : (hover ? "rgba(255,77,141,0.08)" : "#1A1A1A"),
        border: `1px solid ${hover || isBack ? "#FF4D8D" : "#252525"}`,
        borderRadius: 10, padding: "10px 16px", fontSize: 13,
        color: hover || isBack ? "#FF4D8D" : "#F0EDE8",
        cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        width: "100%", transition: "all 0.15s",
      }}>{label}</button>
  );
}

function ContactCard() {
  return (
    <div style={{ marginTop: 10, background: "#1A1A1A", borderLeft: "3px solid #FF4D8D", borderRadius: 12, padding: "16px 20px" }}>
      {[
        { icon: "📩", text: "priyankanaik234@gmail.com", href: "mailto:priyankanaik234@gmail.com" },
        { icon: "📱", text: "+91 7030677794", href: null },
        { icon: "🔗", text: "linkedin.com/in/priyanka-naik", href: "https://linkedin.com/in/priyanka-naik" },
        { icon: "📍", text: "Bengaluru, India", href: null },
      ].map(({ icon, text, href }) => (
        <div key={text} style={{ marginBottom: 8, fontSize: 13.5 }}>
          {icon}{" "}
          {href
            ? <a href={href} target="_blank" rel="noreferrer" style={{ color: "#FF4D8D", textDecoration: "none" }}>{text}</a>
            : <span style={{ color: "#F0EDE8" }}>{text}</span>}
        </div>
      ))}
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
      <Avatar />
      <div style={{ background: "#1A1A1A", border: "1px solid #252525", borderRadius: "16px 16px 16px 4px", padding: "14px 18px", display: "flex", gap: 5 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#CC1A5E", animation: `pulse 1.2s ${i*0.2}s infinite ease-in-out` }} />)}
      </div>
    </div>
  );
}

// ─── TAB: ABOUT ME ────────────────────────────────────────────────────────────
function AboutMe() {
  const [msgs, setMsgs] = useState([{ type: "bot", key: "start" }]);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function handleOption(opt) {
    setMsgs(prev => [
      ...prev.map((m, i) => i === prev.length - 1 ? { ...m, done: true } : m),
      { type: "user", text: opt.label },
      { type: "bot", key: opt.next },
    ]);
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      {msgs.map((msg, i) => {
        if (msg.type === "user") return <UserBubble key={i} text={msg.text} />;
        const node = FLOW[msg.key];
        if (!node) return null;
        const isLast = i === msgs.length - 1;
        return (
          <BotBubble key={i} text={node.message} featured={msg.key === "start"}>
            {node.showContact && <ContactCard />}
            {isLast && !msg.done && node.options && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {node.options.map(opt => (
                  <button key={opt.label} onClick={() => handleOption(opt)}
                    style={{ background: "#1A1A1A", border: "1px solid #252525", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: opt.label.startsWith("←") ? "#555" : "#A0A0A0", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { e.target.style.borderColor = "#FF4D8D"; e.target.style.color = "#FF4D8D"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "#252525"; e.target.style.color = opt.label.startsWith("←") ? "#555" : "#A0A0A0"; }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </BotBubble>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

// ─── TAB: HOW I THINK ────────────────────────────────────────────────────────
function HowIThink() {
  const [phase, setPhase] = useState("pick");
  const [study, setStudy] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [msgs, setMsgs] = useState([{
    type: "bot", featured: false,
    text: "Let me walk you through a real project — step by step, decision by decision.\n\nAt key moments I'll pause and ask what you would have done. Then I'll tell you what I actually did and why.\n\nWhich project do you want to explore?",
  }]);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function pickStudy(s) {
    setStudy(s);
    setStepIdx(0);
    setPhase("walk");
    const step = s.steps[0];
    setMsgs([
      { type: "bot", text: `Let me walk you through a real project — step by step, decision by decision.\n\nAt key moments I'll pause and ask what you would have done. Then I'll tell you what I actually did and why.\n\nWhich project do you want to explore?` },
      { type: "user", text: `${s.title}` },
      { type: "bot", text: `**${s.title}** — ${s.subtitle}\n\n${step.text}` },
      { type: "question", text: `💭 ${step.question}`, options: step.options, stepIdx: 0 },
    ]);
  }

  function handleAnswer(answer, sIdx) {
    const step = study.steps[sIdx];
    const nextIdx = sIdx + 1;
    const hasNext = nextIdx < study.steps.length;
    const newMsgs = [
      ...msgs.map((m, i) => i === msgs.length - 1 ? { ...m, done: true } : m),
      { type: "user", text: answer },
      { type: "bot", text: `Here's what I actually did:\n\n${step.reveal}`, reveal: true },
    ];
    if (hasNext) {
      const next = study.steps[nextIdx];
      newMsgs.push({ type: "bot", text: next.text });
      newMsgs.push({ type: "question", text: `💭 ${next.question}`, options: next.options, stepIdx: nextIdx });
      setStepIdx(nextIdx);
    } else {
      newMsgs.push({ type: "bot", text: "That's the full walkthrough 🌸\n\nWant to explore another project?", final: true });
      setPhase("done");
    }
    setMsgs(newMsgs);
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      {msgs.map((msg, i) => {
        const isLast = i === msgs.length - 1;
        if (msg.type === "user") return <UserBubble key={i} text={msg.text} />;
        if (msg.type === "question") return (
          <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <Avatar />
            <div style={{ maxWidth: "78%" }}>
              <div style={{ background: "#1A1A1A", border: "1px solid #333", borderLeft: "2px solid #555", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", fontSize: 13.5, lineHeight: 1.75, color: "#D8D4CE" }}>{msg.text}</div>
              {!msg.done && isLast && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                  {msg.options.map(opt => <OptionBtn key={opt} label={opt} onClick={() => handleAnswer(opt, msg.stepIdx)} />)}
                </div>
              )}
            </div>
          </div>
        );
        return (
          <BotBubble key={i} text={msg.text} featured={msg.reveal}>
            {msg.final && phase === "done" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                {CASE_STUDIES.filter(s => s.id !== study?.id).map(s => (
                  <OptionBtn key={s.id} label={`📂 ${s.title}`} onClick={() => pickStudy(s)} />
                ))}
              </div>
            )}
          </BotBubble>
        );
      })}
      {phase === "pick" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 38 }}>
          {CASE_STUDIES.map(s => (
            <OptionBtn key={s.id} label={`📂 ${s.title} — ${s.subtitle}`} onClick={() => pickStudy(s)} />
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

// ─── TAB: ASK ME ANYTHING ─────────────────────────────────────────────────────
function AskMeAnything() {
  const [msgs, setMsgs] = useState([{
    type: "bot", featured: true,
    text: "This is an interview simulator built to answer questions based on a knowledge base of 100s of FAQs answered by me.\n\nIt's designed to answer professional questions exactly like I would.",
    showStarters: true,
  }]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  async function send(text) {
    if (!text.trim() || loading) return;
    const isContact = ["contact","email","reach","linkedin","touch"].some(w => text.toLowerCase().includes(w));
    setMsgs(prev => prev.map((m,i) => i===0 ? {...m, showStarters: false} : m).concat({ type: "user", text }));
    setInput("");
    setLoading(true);
    const newHistory = [...history, { role: "user", content: text }];
    try {
      const reply = await callClaude(newHistory);
      setHistory([...newHistory, { role: "assistant", content: reply }]);
      setMsgs(prev => [...prev, { type: "bot", text: reply, showContact: isContact }]);
    } catch {
      setMsgs(prev => [...prev, { type: "bot", text: "I'm having a moment — try again in a few seconds! 🌸" }]);
    }
    setLoading(false);
  }

  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {msgs.map((msg, i) => {
          if (msg.type === "user") return <UserBubble key={i} text={msg.text} />;
          return (
            <BotBubble key={i} text={msg.text} featured={msg.featured}>
              {msg.showContact && <ContactCard />}
              {msg.showStarters && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {STARTER_QUESTIONS.map(q => (
                    <button key={q} onClick={() => send(q)} style={{
                      background: "#1A1A1A", border: "1px solid #252525", borderRadius: 20,
                      padding: "7px 14px", fontSize: 12, color: "#A0A0A0",
                      cursor: "pointer", fontFamily: "inherit",
                    }}>{q}</button>
                  ))}
                </div>
              )}
            </BotBubble>
          );
        })}
        {loading && <TypingDots />}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "10px 16px 24px", display: "flex", gap: 8, borderTop: "1px solid #252525", background: "#111", flexShrink: 0 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
          placeholder="Ask me anything…"
          style={{ flex: 1, background: "#1A1A1A", border: "1px solid #252525", borderRadius: 24, padding: "11px 18px", fontSize: 13.5, color: "#F0EDE8", fontFamily: "inherit", outline: "none" }}
        />
        <button onClick={() => send(input)} style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #CC1A5E, #FF4D8D)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "0 0 16px rgba(255,77,141,0.3)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "about", label: "✦ About Me" },
  { id: "ask",   label: "◈ How I Think" },
];

export default function App() {
  const [tab, setTab] = useState("about");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0A; }
        @keyframes pulse { 0%,80%,100%{transform:scale(0.6);opacity:0.3} 40%{transform:scale(1);opacity:1} }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #252525; border-radius: 10px; }
        button { font-family: inherit; }
        button:focus { outline: none; }
        input:focus { outline: none; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: 680, margin: "0 auto", background: "#0A0A0A", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#F0EDE8" }}>

        {/* Header */}
        <div style={{ background: "#111", borderBottom: "1px solid #252525", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, #FF4D8D, transparent)" }} />
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #CC1A5E, #FF4D8D)", color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, flexShrink: 0, boxShadow: "0 0 20px rgba(255,77,141,0.35)", fontFamily: "Georgia, serif" }}>P</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F0EDE8", fontFamily: "Georgia, serif", letterSpacing: "0.02em" }}>Priyanka Naik</div>
            <div style={{ fontSize: 11, color: "#CC1A5E", marginTop: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>AI PM · Systems Builder · Product × Automation × AI</div>
          </div>
          <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#4CAF7D", boxShadow: "0 0 8px rgba(76,175,125,0.6)" }} />
        </div>

        {/* Toggle — two tabs only */}
        <div style={{ background: "#111", borderBottom: "1px solid #252525", padding: "10px 16px", display: "flex", gap: 0, flexShrink: 0 }}>
          <div style={{ display: "flex", background: "#1A1A1A", border: "1px solid #252525", borderRadius: 12, padding: 3, width: "100%", gap: 3 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: "9px 8px", fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
                textAlign: "center", borderRadius: 9, cursor: "pointer",
                border: "none",
                background: tab === t.id ? "linear-gradient(135deg, rgba(255,77,141,0.15), rgba(204,26,94,0.15))" : "transparent",
                color: tab === t.id ? "#FF4D8D" : "#6B6B6B",
                transition: "all 0.2s", letterSpacing: "0.02em",
                boxShadow: tab === t.id ? "inset 0 0 0 1px rgba(255,77,141,0.3)" : "none",
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        {tab === "about" && <AboutMe />}
        {tab === "ask"   && <AskMeAnything />}

      </div>
    </>
  );
}
