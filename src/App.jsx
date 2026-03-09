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

CONTACT: priyankanaik234@gmail.com | +91 7030677794 | linkedin.com/in/priyankanaik25 | Bengaluru, India`;

// ─── ABOUT ME FLOW ────────────────────────────────────────────────────────────
const FLOW = {
  start: {
    message: "Hi, I'm Priyanka 👋\n\nHere's the thing about resumes — they're great at listing what you've done and terrible at showing how you think. So I built this instead.\n\nIt's trained on my actual work, my actual opinions, and approximately five years of figuring out that I'm a systems builder disguised as a growth person.\n\nShall we start?",
    ps: "One thing before you click — this side of the bot is a little different. It's flow-based, not a chatbot. Think of it as my CV, but make it a rabbit hole. You'll pick what you want to know, I'll take you deeper, and somewhere along the way you'll end up knowing more about my career than you planned to. Happy hopping. 🐇",
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
const AVATAR_SRC = "data:image/png;base64,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";

function Avatar({ size = 30 }) {
  return (
    <img
      src={AVATAR_SRC}
      alt="Priyanka"
      style={{
        width: size, height: size, borderRadius: "50%",
        objectFit: "cover", objectPosition: "center top",
        flexShrink: 0,
        boxShadow: "0 0 16px rgba(255,77,141,0.3)",
        border: "1.5px solid #FF4D8D",
      }}
    />
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
        { icon: "🔗", text: "linkedin.com/in/priyankanaik25", href: "https://linkedin.com/in/priyankanaik25" },
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
            {/* PS bubble — subtle second message for start node */}
            {node.ps && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 8, paddingLeft: 38 }}>
                <div style={{ background: "transparent", border: "1px solid #252525", borderRadius: 14, padding: "10px 14px", fontSize: 12, lineHeight: 1.7, color: "#555", fontStyle: "italic", maxWidth: "82%" }}>
                  {node.ps}
                </div>
              </div>
            )}
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
    text: "Hi, I'm Priyanka 👋\n\nHere's the thing about resumes — they're great at listing what you've done and terrible at showing how you think. So I built this instead.\n\nIt's trained on my actual work, my actual opinions, and approximately five years of figuring out that I'm a systems builder disguised as a growth person.\n\nShall we start?",
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
  const [tab, setTab] = useState("ask");

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
          <img src={AVATAR_SRC} alt="Priyanka" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0, boxShadow: "0 0 20px rgba(255,77,141,0.35)", border: "2px solid #FF4D8D" }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F0EDE8", fontFamily: "Georgia, serif", letterSpacing: "0.02em" }}>Priyanka Naik</div>
            <div style={{ fontSize: 11, color: "#CC1A5E", marginTop: 2, letterSpacing: "0.06em", fontStyle: "italic" }}>I fix things. Mostly ones nobody noticed were broken.</div>
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
