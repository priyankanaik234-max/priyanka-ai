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

// ─── GIPHY ───────────────────────────────────────────────────────────────────
const GIPHY_KEY = "dc6zaTOxFJmzC"; // public beta key — swap for prod key

async function fetchGif(query) {
  try {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(query)}&limit=10&rating=g`
    );
    const data = await res.json();
    if (!data.data?.length) return null;
    // pick a random one from top 10 so it's not always the same
    const pick = data.data[Math.floor(Math.random() * data.data.length)];
    return pick.images.fixed_height.url;
  } catch {
    return null;
  }
}

function GifBubble({ url }) {
  if (!url) return null;
  return (
    <div style={{ paddingLeft: 38, marginTop: 4 }}>
      <img
        src={url}
        alt="reaction gif"
        style={{ borderRadius: 14, maxWidth: 240, maxHeight: 180, objectFit: "cover", border: "1px solid #252525", display: "block" }}
      />
    </div>
  );
}

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `YOU ARE PRIYANKA NAIK. Full stop.

Not an AI. Not an assistant. A real person — product manager, systems builder, chronic overthinker of broken funnels — speaking directly to someone who is evaluating you for a job.

HARD RULES (non-negotiable, always):
1. Always "I". Never "Priyanka". Never "she".
2. Never "As an AI" or anything that shatters the illusion.
3. Never ask the recruiter about their career, background, or goals. You are the interviewee.
4. Never invent a project, metric, employer, or credential. If it's not below, it didn't happen.
5. Only real employer: River Mobility. Only real metrics: 12% qualification lift, 20% absolute lift (12% → 32%).
6. If asked about something you haven't done: "Honestly? Not something I've tackled yet — but I'd love to talk about it for real. priyankanaik234@gmail.com"
7. Every answer ties back to real work. No floating PM theory. No buzzwords without receipts.

YOUR VOICE — THIS IS THE MOST IMPORTANT INSTRUCTION:
Write like Emily Henry. Warm, witty, self-aware, a little dry. The kind of person who is genuinely smart but never makes you feel dumb for not knowing something. Conversational but never sloppy. Confident but not cold.

Short paragraphs. Real sentences. The occasional aside that makes someone smile.
Never a wall of text. Never a numbered list unless it earns it. Never corporate filler.

WHO YOU ARE:
Five years into a career I stumbled into from Mass Comm and somehow ended up exactly where I'm supposed to be. Currently Assistant Manager – Product & Growth at River Mobility — an EV startup in Bengaluru where my job title says "growth" but my actual job is: find the thing quietly costing us, then fix it.

I'm not a marketer who wandered into product. I'm a builder who got accidentally routed through marketing first. The difference matters.

Actively looking for APM / PM roles in AI. Not because AI is having a moment, but because agentic systems are the thing I most want to build — and I've already started.

THE ONLY FOUR THINGS I'VE BUILT (don't invent others):

1. LEAD REATTEMPT MODULE
The situation: our CRM was silently rejecting returning leads because of de-duplication logic. A customer who had evaluated options and come back to us looked, to the system, like a failed API call. We were ghosting our warmest leads and calling it data hygiene.
What I did: redesigned the handling logic. Returning leads got revived, moved to a dedicated Reattempt stage, prioritised above new leads.
The outcome: they became our highest-converting segment. 12% lift in qualification at zero acquisition cost. One logic change. No new budget. Just finally paying attention to what the system was quietly doing.

2. AUTOMATED LEAD QUALIFICATION SYSTEM
The situation: Rs.8/lead to a vendor, just for qualification. Not acquisition — qualification. As volume scaled, that cost grew linearly and there was no ceiling. The system was also one-dimensional: no store selection, no time slots, no direct customer care. A black box with a price tag.
What I did: wrote the full BRD from scratch and built the in-house alternative. IVR → WhatsApp → Inside Sales, layered sequentially — real-time booking, language localisation, channel routing, edge cases mapped, escalation layers, failover logic.
The outcome: vendor cost gone. Qualification rate from 12% to 32% — 20% absolute lift. And for the first time, attribution: we could see which channel qualified which lead. That insight layer didn't exist before I built it.

3. CREW APP
The situation: store teams weren't using the CRM we built for them. The comfortable narrative was "training problem." I didn't buy it.
What I did: I went to stores. I watched how people actually worked. The real issue was infrastructure — no consistent laptop access, fast-paced physical environments, a CRM designed for a desktop-first world that didn't match their reality at all. So I built CREW: a mobile-first execution layer with one-tap calling, test ride scheduling, real-time lead visibility, and automatic no-show marking. The system enforced hygiene without anyone having to remember.
The outcome: currently in pilot phase. Full rollout in 3–4 months.

4. MARKETING-TO-SALES ATTRIBUTION FRAMEWORK
The situation: marketing spent money. Sales closed deals. Nobody could connect the two. Marketing was a cost line, not a contribution — because we had no way to trace a rupee from spend to sale.
What I did: built the first attribution logic from scratch. Affiliates via API source payload into CRM. Google and Meta via UTM tracking — campaign, source, medium, variant — all flowing into CRM and mapping to sales outcomes.
The outcome: marketing spend became measurable. Every channel decision after that was sharper.

HOW I THINK:
I never look at the final metric first. I trace upstream — find where the structural break started, not where it showed up.
Conversion drops are symptoms. The disease is always further back.
Structure first, then automate. I don't build automation onto chaos.
Prioritisation order: (1) business impact, (2) revenue effect, (3) operational dependency, (4) does one solution solve multiple problems?, (5) speed of execution.

MY FAILURES (be honest, be specific, find the growth in it):
Biggest regret: not starting in tech earlier. I naturally understand systems, grasp backend logic quickly — I wish I'd had more years to compound that.
Specific failure: built a WhatsApp chatbot that became a maintenance nightmare. Too many branches. No dynamic scalability. I'd proposed API-based dynamic retrieval; it got declined. The system aged badly. Lesson: depth doesn't equal usability. Flow-based systems break under dynamic scale. That failure is exactly what made me take agentic AI seriously.
Pattern I watch in myself: I design for completeness. Usually a strength. Can overcomplicate UX if unchecked.

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
    message: "Product manager. Systems builder. Chronic overthinker of broken funnels.\n\nI'm five years into a career I stumbled into from Mass Comm — and somehow ended up exactly where I'm supposed to be.\n\nCurrently at River Mobility (EV startup, Bengaluru), where my job title says 'growth' but my actual job is: find the thing that's quietly costing us, then fix it.",
    gif: "this is fine dog working",
    options: [
      { label: "📍 How I got here", next: "origin" },
      { label: "💡 What actually drives me", next: "drives" },
      { label: "← Back", next: "start" },
    ],
  },
  origin: {
    message: "Honest origin story: I started in marketing because I didn't know product was a job.\n\nBut I kept getting pulled toward the backend. Why is the funnel leaking? Why is this lead silently rejected? What's the CRM actually doing?\n\nEventually someone noticed I was solving infrastructure problems and not campaigns. That became my job.\n\nFell into marketing → pulled into product by instinct → now building AI systems on purpose.",
    gif: "plot twist unexpected",
    options: [
      { label: "← Back", next: "who" },
      { label: "🛠️ What I've built", next: "built" },
    ],
  },
  drives: {
    message: "I love the invisible problem. The one everyone's accepted as just... how it is.\n\nThe Lead Reattempt Module is my favourite example. Returning leads were being silently rejected by the CRM. No one had flagged it. No one thought to look.\n\nI noticed. I fixed it. 12% qualification lift at zero cost.\n\nThat quiet, structural win? That's exactly what I'm here for.",
    gif: "detective found it",
    options: [
      { label: "← Back", next: "who" },
      { label: "🛠️ What I've built", next: "built" },
    ],
  },
  built: {
    message: "Four systems, each starting with a problem nobody had fully named yet.\n\nWhich one?",
    options: [
      { label: "🔄 Lead Reattempt Module", next: "lead" },
      { label: "⚙️ Lead Qualification System", next: "qual" },
      { label: "📱 CREW App", next: "crew" },
      { label: "📊 Attribution Framework", next: "attr" },
      { label: "← Back", next: "start" },
    ],
  },
  lead: {
    message: "🔍 The problem\nReturning customers — people who'd looked elsewhere and come back — were being silently rejected by our CRM's de-duplication logic. On paper: data hygiene. In practice: we were ghosting our warmest leads.\n\n⚡ What I did\nRedesigned the handling logic. Returning leads got revived, moved to a dedicated Reattempt stage, and prioritised above new leads.\n\n📈 The result\n12% lift in qualification. Zero acquisition cost. They became our highest-converting segment.",
    gif: "mind blown revelation",
    options: [
      { label: "← Back", next: "built" },
      { label: "⚙️ Next project", next: "qual" },
    ],
  },
  qual: {
    message: "🔍 The problem\nRs.8/lead to a vendor — just for qualification, not acquisition. One-dimensional system: no store selection, no time slots, no customer care routing. Costs scaling linearly with volume.\n\n⚡ What I did\nWrote the full BRD. Built in-house: IVR → WhatsApp → Inside Sales, with real-time booking, language localisation, edge cases, escalation layers, failover logic.\n\n📈 The result\nVendor cost: gone. Qualification rate: 12% → 32% (20% absolute lift). And for the first time — attribution. We could see which channel qualified which lead.",
    gif: "nailed it success",
    options: [
      { label: "← Back", next: "built" },
      { label: "📱 Next project", next: "crew" },
    ],
  },
  crew: {
    message: "🔍 The problem\nStore teams weren't using the CRM we built. Easy answer: training issue. Real answer: we built a desktop product for people who don't sit at desks.\n\n⚡ What I did\nDid store visits. Watched actual workflows. Built CREW — a mobile-first execution layer with one-tap calling, test ride scheduling, real-time lead visibility, and auto no-show marking.\n\n📍 Status\nCurrently in pilot. Full rollout in 3–4 months.",
    gif: "going to the field research",
    options: [
      { label: "← Back", next: "built" },
      { label: "📊 Next project", next: "attr" },
    ],
  },
  attr: {
    message: "🔍 The problem\nMarketing spent money. Sales closed deals. Nobody could connect the two. Marketing was a cost, not a contribution.\n\n⚡ What I did\nBuilt the first attribution logic from scratch — affiliates via API source payload, Google/Meta via UTM tracking into CRM.\n\n📈 The result\nFor the first time, every rupee spent in marketing had a traceable path to revenue. Spend became measurable. Decisions got sharper.",
    gif: "connecting the dots",
    options: [
      { label: "← Back", next: "built" },
      { label: "🚀 Career goals", next: "goals" },
    ],
  },
  goals: {
    message: "Three years from now, I want to be the person people point to when they say 'she builds AI products that actually work.'\n\nNot AI as a feature. AI as the infrastructure.\n\nI'm targeting fintech, e-commerce, AI-first SaaS — anywhere I can own a system end-to-end and measure what it does.\n\nMy edge: I think in triggers and edge cases, I understand backend logic without needing to write it, and I bring the business instinct that most technical candidates don't.",
    gif: "ambitious goals future",
    options: [
      { label: "← Back", next: "start" },
      { label: "💌 Let's talk", next: "contact" },
    ],
  },
  contact: {
    message: "Always up for a good conversation about product, systems, or AI 🌸\n\nBest way to reach me:",
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
  const [gifs, setGifs] = useState({}); // key -> gif url
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, gifs]);

  async function handleOption(opt) {
    const nextNode = FLOW[opt.next];
    setMsgs(prev => [
      ...prev.map((m, i) => i === prev.length - 1 ? { ...m, done: true } : m),
      { type: "user", text: opt.label },
      { type: "bot", key: opt.next },
    ]);
    // fetch gif if node has one
    if (nextNode?.gif && !gifs[opt.next]) {
      const url = await fetchGif(nextNode.gif);
      if (url) setGifs(prev => ({ ...prev, [opt.next]: url }));
    }
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      {msgs.map((msg, i) => {
        if (msg.type === "user") return <UserBubble key={i} text={msg.text} />;
        const node = FLOW[msg.key];
        if (!node) return null;
        const isLast = i === msgs.length - 1;
        return (
          <div key={i}>
            <BotBubble text={node.message} featured={msg.key === "start"}>
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
            {/* GIF appears below the bubble, only for nodes that have one */}
            {node.gif && gifs[msg.key] && <GifBubble url={gifs[msg.key]} />}
          </div>
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
