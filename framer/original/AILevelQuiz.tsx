import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

const QUESTIONS = [
    {
        q: "Be honest, how often does AI show up in your day?",
        options: [
            { text: "I haven't tried it yet", score: 0, capBeginner: true },
            { text: "I've played with it once or twice", score: 1 },
            { text: "A few times a week", score: 2 },
            { text: "It's open in a tab all day", score: 3 },
        ],
    },
    {
        q: "Which AI tools have you met so far?",
        options: [
            { text: "None yet", score: 0 },
            { text: "One chat tool, like ChatGPT", score: 1 },
            { text: "A few, including image or meeting tools", score: 2 },
            { text: "Lots, including automation or agent tools", score: 3 },
        ],
    },
    {
        q: "What do you actually use it for?",
        options: [
            { text: "Nothing yet, that's why I'm here", score: 0 },
            { text: "Quick questions, like a smarter Google", score: 1 },
            { text: "Writing, summarising or making sense of information", score: 2 },
            { text: "It's part of how I work every day", score: 3 },
        ],
    },
    {
        q: "When you ask AI for something, what does it look like?",
        options: [
            { text: "What's a prompt?", score: 0 },
            { text: "I type a question and hope for the best", score: 1 },
            { text: "I tell it who to be, what I need and how I want it", score: 2 },
            { text: "I have favourite prompts I reuse and tweak", score: 3 },
        ],
    },
    {
        q: "Have you ever handed AI a file, like a PDF, spreadsheet or photo?",
        options: [
            { text: "No, didn't know I could", score: 0 },
            { text: "Once", score: 1 },
            { text: "Sometimes", score: 2 },
            { text: "All the time, even for data analysis", score: 3 },
        ],
    },
    {
        q: "Have you built your own assistant, like a custom GPT, Claude Project or Copilot agent?",
        options: [
            { text: "No, and I'm not sure what that means", score: 0 },
            { text: "I've heard of it", score: 1 },
            { text: "I tried it once", score: 2 },
            { text: "I have a few and share them with others", score: 3 },
        ],
    },
    {
        q: "Have you got AI talking to your other tools or doing tasks on its own?",
        options: [
            { text: "No", score: 0 },
            { text: "I'm curious but haven't tried", score: 1 },
            { text: "I've set up one simple automation", score: 2 },
            { text: "Several are running right now", score: 3 },
        ],
    },
    {
        q: "When AI gives you an answer, how sure are you that it's right?",
        options: [
            { text: "I usually take it at face value", score: 0 },
            { text: "I have a hunch when something's off", score: 1 },
            { text: "I double-check the sources", score: 2 },
            { text: "I know exactly where it tends to get things wrong", score: 3 },
        ],
    },
    {
        q: "How clear are you on what's safe to share with AI?",
        options: [
            { text: "Not at all", score: 0 },
            { text: "I have a rough idea", score: 1 },
            { text: "I follow the rules at work", score: 2 },
            { text: "I could teach a colleague", score: 3 },
        ],
    },
    {
        q: "When a new app lands on your phone or laptop, you...",
        options: [
            { text: "need someone to walk me through it", score: 0 },
            { text: "get there with a bit of help", score: 1 },
            { text: "figure it out", score: 2 },
            { text: "dive in and click everything", score: 3 },
        ],
    },
]

const TRACKS = [
    "Getting more done at work",
    "Writing that sounds like me",
    "Research and finding answers",
    "Creating images",
    "Agents and automation",
    "AI for home and family life",
]

const OUTCOMES: Record<string, { summary: string; bullets: string[]; cohortNote: string }> = {
    Beginner: {
        summary: "You are at the starting line, and that is a great place to be. You just need a clear, practical tour of what AI can take off your plate each week.",
        bullets: [
            "Ask clear questions that get useful answers on the first try",
            "Draft emails, summaries, and everyday plans in half the time",
            "Know what information is safe to share and what to keep private",
            "Spot when AI is guessing before you rely on its answer",
        ],
        cohortNote: "Recommended: AI Starter (2 Sunday night cohorts opening December 2026, 600 ILS)",
    },
    Intermediate: {
        summary: "You have the basics down. Now it is time to stop starting from scratch and build consistent, repeatable habits at work.",
        bullets: [
            "Build a reusable personal prompt library tailored to your job",
            "Analyze PDFs, spreadsheets, and meeting notes accurately",
            "Train AI to match your exact writing tone without sounding robotic",
            "Build one reliable weekly workflow that saves 2+ hours every week",
        ],
        cohortNote: "Recommended: AI at Work (Wednesday night cohort opening December 2026, 600 ILS)",
    },
    Advanced: {
        summary: "You already use AI daily. Your next leap is building custom assistants grounded in your own files and workflows.",
        bullets: [
            "Build and test custom assistants tailored to your documents",
            "Set up guardrails so outputs stay accurate and safe",
            "Turn multi-step manual work into a documented workflow",
        ],
        cohortNote: "Group cohorts for Advanced open in early 2027. Book a 1:1 session or request a custom workflow build now.",
    },
    Expert: {
        summary: "You are ahead of the curve. Your biggest opportunity is connecting AI to real processes safely.",
        bullets: [
            "Design end-to-end automated workflows with human review gates",
            "Scale reliable AI processes across your organization or team",
        ],
        cohortNote: "Group cohorts for Expert open in early 2027. Book a 1:1 session or request a custom workflow build now.",
    },
}

export default function AILevelQuiz(props) {
    const { accentColor, primaryColor, webhookUrl, cohortsUrl, coachingUrl, workflowsUrl } = props
    const [step, setStep] = useState(0)
    const [scores, setScores] = useState<number[]>([])
    const [capBeginner, setCapBeginner] = useState(false)
    const [q11, setQ11] = useState("")
    const [q12, setQ12] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [consent, setConsent] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const calculateResult = () => {
        const total = scores.reduce((a, b) => a + b, 0)
        const levels = ["Beginner", "Intermediate", "Advanced", "Expert"]
        let idx = total >= 24 ? 3 : total >= 16 ? 2 : total >= 8 ? 1 : 0
        if (q12 === "Agents and automation" && total >= 12 && idx < 3) idx += 1
        if (capBeginner) idx = 0
        return { total, level: levels[idx] }
    }

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = calculateResult()
        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        event_type: "quiz_lead",
                        name,
                        email,
                        level: res.level,
                        score: res.total,
                        q11,
                        q12,
                        marketingConsent: consent,
                    }),
                })
            } catch (err) {
                console.error("Webhook error", err)
            }
        }
        setSubmitted(true)
    }

    const cardStyle: React.CSSProperties = {
        background: "#FFFFFF",
        border: "1px solid #E2DFD9",
        borderRadius: 12,
        padding: 32,
        maxWidth: 680,
        margin: "0 auto",
        fontFamily: "Inter, -apple-system, sans-serif",
        color: "#1D2432",
    }

    const btnOptionStyle: React.CSSProperties = {
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "14px 18px",
        marginBottom: 10,
        background: "#FAF8F5",
        border: "1px solid #E2DFD9",
        borderRadius: 8,
        fontSize: 16,
        cursor: "pointer",
        color: "#1D2432",
    }

    const progress = Math.round(((step + 1) / 13) * 100)

    return (
        <section id="quiz" style={{ background: "#FFFFFF", padding: "72px 20px" }}>
            <div style={{ maxWidth: 680, margin: "0 auto 28px", textAlign: "center", fontFamily: "Inter, -apple-system, sans-serif" }}>
                <h2 style={{ fontSize: 32, color: primaryColor, margin: "0 0 10px" }}>Where do you really stand with AI?</h2>
                <p style={{ fontSize: 17, color: "#4A5568", margin: 0 }}>
                    Answer 12 quick, honest questions. You'll get your exact level and the right next step.
                </p>
            </div>

            {submitted ? (
                (() => {
                    const { total, level } = calculateResult()
                    const info = OUTCOMES[level]
                    const isGroupOpen = level === "Beginner" || level === "Intermediate"
                    return (
                        <div style={cardStyle}>
                            <span style={{ background: "#FDF0E6", color: accentColor, fontWeight: 700, padding: "4px 12px", borderRadius: 6, fontSize: 13 }}>
                                Level: {level} ({total} / 30)
                            </span>
                            <h3 style={{ fontSize: 24, color: primaryColor, margin: "14px 0 10px" }}>
                                Great to meet you, {name}! You placed at {level}.
                            </h3>
                            <p style={{ lineHeight: 1.6, color: "#4A5568" }}>{info.summary}</p>
                            <h4 style={{ marginTop: 20, marginBottom: 10 }}>By the end of this course, you will:</h4>
                            <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
                                {info.bullets.map((b, i) => (
                                    <li key={i} style={{ marginBottom: 6 }}>{b}</li>
                                ))}
                            </ul>
                            <div style={{ background: "#FAF8F5", padding: 20, borderRadius: 8, borderLeft: `4px solid ${accentColor}`, marginTop: 20 }}>
                                <p style={{ fontWeight: 600, margin: "0 0 12px" }}>{info.cohortNote}</p>
                                <a
                                    href={isGroupOpen ? cohortsUrl : workflowsUrl}
                                    style={{ display: "inline-block", background: accentColor, color: "#FFF", padding: "12px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}
                                >
                                    {isGroupOpen ? "Want to save your seat? Join December Waitlist" : "Get a Quote for a Custom Build"}
                                </a>
                            </div>
                            <p style={{ marginTop: 18, textAlign: "center" }}>
                                <a href={coachingUrl} style={{ color: primaryColor, fontWeight: 600 }}>
                                    Or book a private 1:1 coaching session &rarr;
                                </a>
                            </p>
                        </div>
                    )
                })()
            ) : (
                <div style={cardStyle}>
                    <div style={{ height: 8, background: "#E2DFD9", borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: accentColor, transition: "width 0.2s" }} />
                    </div>

                    {step < 10 && (
                        <>
                            <p style={{ fontSize: 14, color: "#4A5568", margin: "0 0 8px" }}>Question {step + 1} of 12</p>
                            <h3 style={{ fontSize: 22, color: primaryColor, margin: "0 0 20px" }}>{QUESTIONS[step].q}</h3>
                            {QUESTIONS[step].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    style={btnOptionStyle}
                                    onClick={() => {
                                        const nextScores = [...scores]
                                        nextScores[step] = opt.score
                                        setScores(nextScores)
                                        if (step === 0) setCapBeginner(Boolean(opt.capBeginner))
                                        setStep(step + 1)
                                    }}
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </>
                    )}

                    {step === 10 && (
                        <>
                            <p style={{ fontSize: 14, color: "#4A5568", margin: "0 0 8px" }}>Question 11 of 12</p>
                            <h3 style={{ fontSize: 22, color: primaryColor, margin: "0 0 16px" }}>
                                If AI could take one thing off your plate tomorrow, what would it be?
                            </h3>
                            <textarea
                                rows={3}
                                value={q11}
                                onChange={(e) => setQ11(e.target.value)}
                                placeholder="For example: summarizing long client calls, drafting weekly updates, or planning meals..."
                                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #B8B4AC", fontSize: 16, marginBottom: 16 }}
                            />
                            <button
                                type="button"
                                onClick={() => setStep(11)}
                                style={{ width: "100%", background: accentColor, color: "#FFF", padding: 14, borderRadius: 8, border: "none", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
                            >
                                Next Question
                            </button>
                        </>
                    )}

                    {step === 11 && (
                        <>
                            <p style={{ fontSize: 14, color: "#4A5568", margin: "0 0 8px" }}>Question 12 of 12</p>
                            <h3 style={{ fontSize: 22, color: primaryColor, margin: "0 0 20px" }}>Where would you love to start?</h3>
                            {TRACKS.map((track, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    style={btnOptionStyle}
                                    onClick={() => {
                                        setQ12(track)
                                        setStep(12)
                                    }}
                                >
                                    {track}
                                </button>
                            ))}
                        </>
                    )}

                    {step === 12 && (
                        <form onSubmit={handleLeadSubmit}>
                            <h3 style={{ fontSize: 22, color: primaryColor, margin: "0 0 8px" }}>Your AI level is ready!</h3>
                            <p style={{ color: "#4A5568", marginBottom: 18 }}>Enter your details below to unlock your score and recommended next step.</p>
                            <input
                                type="text"
                                required
                                placeholder="First Name *"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #B8B4AC", marginBottom: 12, fontSize: 16 }}
                            />
                            <input
                                type="email"
                                required
                                placeholder="Email Address *"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #B8B4AC", marginBottom: 14, fontSize: 16 }}
                            />
                            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, marginBottom: 18, color: "#4A5568" }}>
                                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
                                <span>Yes, send me occasional practical AI tips and updates on new courses.</span>
                            </label>
                            <button
                                type="submit"
                                style={{ width: "100%", background: accentColor, color: "#FFF", padding: 14, borderRadius: 8, border: "none", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
                            >
                                Show My AI Level
                            </button>
                        </form>
                    )}
                </div>
            )}
        </section>
    )
}

addPropertyControls(AILevelQuiz, {
    primaryColor: { type: ControlType.Color, title: "Primary Navy", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent Amber", defaultValue: "#C86D2D" },
    webhookUrl: { type: ControlType.String, title: "n8n Webhook URL", defaultValue: "" },
    cohortsUrl: { type: ControlType.String, title: "Cohorts Link", defaultValue: "#cohorts" },
    coachingUrl: { type: ControlType.String, title: "1:1 Coaching Link", defaultValue: "#coaching" },
    workflowsUrl: { type: ControlType.String, title: "Workflows Link", defaultValue: "#workflows" },
})
