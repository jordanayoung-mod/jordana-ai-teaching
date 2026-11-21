import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * AILevelQuiz: 12-question AI level check with a lead gate, scoring engine,
 * results screen and a webhook POST ({ event: "quiz_lead", ... }).
 *
 * Scoring: Q1 to Q10 score 0, 1, 2, 3 in the order listed (max 30).
 * Bands: 0 to 7 Beginner, 8 to 15 Intermediate, 16 to 23 Advanced, 24 to 30 Expert.
 * Cap rule: "I haven't tried it yet." on Q1 caps the result at Beginner.
 * Bump rule: "Agents and automation" on Q12 with a score of 12+ moves up one level.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */

type Level = "Beginner" | "Intermediate" | "Advanced" | "Expert"
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced", "Expert"]

interface Q {
    text: string
    options: string[]
}

export const QUESTIONS: Q[] = [
    { text: "Be honest, how often does AI show up in your day?", options: ["I haven't tried it yet.", "I've played with it once or twice.", "A few times a week.", "It's open in a tab all day."] },
    { text: "Which AI tools have you met so far?", options: ["None yet.", "One chat tool, like ChatGPT.", "A few, including image or meeting tools.", "Lots, including automation or agent tools."] },
    { text: "What do you actually use it for?", options: ["Nothing yet, that's why I'm here.", "Quick questions, like a smarter Google.", "Writing, summarising or making sense of information.", "It's part of how I work every day."] },
    { text: "When you ask AI for something, what does it look like?", options: ["What's a prompt?", "I type a question and hope for the best.", "I tell it who to be, what I need and how I want it.", "I have favourite prompts I reuse and tweak."] },
    { text: "Have you ever handed AI a file, like a PDF, spreadsheet or photo?", options: ["No, didn't know I could.", "Once.", "Sometimes.", "All the time, even for data analysis."] },
    { text: "Have you built your own assistant, like a custom GPT, Claude Project or Copilot agent?", options: ["No, and I'm not sure what that means.", "I've heard of it.", "I tried it once.", "I have a few and share them with others."] },
    { text: "Have you got AI talking to your other tools or doing tasks on its own?", options: ["No.", "I'm curious but haven't tried.", "I've set up one simple automation.", "Several are running right now."] },
    { text: "When AI gives you an answer, how sure are you that it's right?", options: ["I usually take it at face value.", "I have a hunch when something's off.", "I double-check the sources.", "I know exactly where it tends to get things wrong."] },
    { text: "How clear are you on what's safe to share with AI?", options: ["Not at all.", "I have a rough idea.", "I follow the rules at work.", "I could teach a colleague."] },
    { text: "When a new app lands on your phone or laptop, you...", options: ["need someone to walk me through it.", "get there with a bit of help.", "figure it out.", "dive in and click everything."] },
]
export const Q11 = "If AI could take one thing off your plate tomorrow, what would it be?"
export const Q12 = "Where would you love to start?"
export const TRACKS = ["Getting more done at work", "Writing that sounds like me", "Research and finding answers", "Creating images", "Agents and automation", "AI for home and family life"]

export function scoreQuiz(answers: number[], track: string) {
    const score = answers.slice(0, 10).reduce((s, a) => s + (a >= 0 ? a : 0), 0)
    let idx = score <= 7 ? 0 : score <= 15 ? 1 : score <= 23 ? 2 : 3
    const raw = LEVELS[idx]
    const capped = answers[0] === 0
    if (capped) idx = 0
    const bumped = !capped && track === "Agents and automation" && score >= 12 && idx < 3
    if (bumped) idx += 1
    return { score, level: LEVELS[idx], rawLevel: raw, capped, bumped }
}

const EXPLAIN: Record<Level, string> = {
    Beginner: "You're at the start, and that's a great place to be. You'll learn the basics properly, with no jargon and lots of practice on things you actually do every week.",
    Intermediate: "You already use AI, but results are hit and miss. The next step is structure: better prompts, reusable templates and one workflow you can rely on.",
    Advanced: "You're comfortable with AI and ready for files, data and your own custom assistants. The next step is building tools that save you real hours.",
    Expert: "You're well ahead of most people. The next step is agents and automation: AI that works across your tools, safely, with you in control.",
}

const OUTCOMES: Record<Level, string[]> = {
    Beginner: [
        "Open an AI chat tool on your laptop and phone and feel at home in it.",
        "Ask for what you need with a simple three-part ask (task, context, format) and improve answers with follow-ups.",
        "Use AI for at least five everyday tasks, like replying to an email, summarising an article or planning your week.",
        "Ask questions by voice or with a photo on your phone.",
        "Follow three safety rules and check one key fact before you act on an answer.",
    ],
    Intermediate: [
        "Write structured prompts with a six-part framework and know why a weak answer missed.",
        "Build a personal library of at least six prompt templates you reuse.",
        "Give AI a style guide built from your own writing, so drafts need fewer edits.",
        "Get source-linked research answers and check them with a repeatable checklist.",
        "Run one reliable 3 to 5 step workflow for a recurring task and measure the time it saves.",
    ],
    Advanced: [
        "Analyse a spreadsheet with AI and double-check every key number.",
        "Pull information from several documents into one comparison table.",
        "Build your own custom assistant with clear instructions and knowledge files.",
        "Test it with real cases and improve it to a version 2.",
        "Decide safely what to upload and who can use your assistant.",
    ],
    Expert: [
        "Pick the process most worth automating with a simple scoring method.",
        "Write a clear design spec with human checkpoints and a plan for failures.",
        "Build a working automation with an AI step in a no-code tool.",
        "Build or extend an agent that uses knowledge and actions.",
        "Test it, add guardrails and pilot it on the real process.",
    ],
}

interface Props {
    primaryColor: string
    accentColor: string
    creamColor: string
    title: string
    intro: string
    webhookUrl: string
    starterTitle: string
    starterSchedule: string
    starterSeatsA: number
    starterSeatsB: number
    starterStatus: string
    starterPaymentUrl: string
    workTitle: string
    workSchedule: string
    workSeats: number
    workStatus: string
    workPaymentUrl: string
    waitlistUrl: string
    coachingUrl: string
    buildQuoteUrl: string
    privacyUrl: string
    canvasPreview: string
    style?: React.CSSProperties
}

function shade(hex: string, factor: number) {
    const h = hex.replace("#", "")
    if (h.length !== 6) return hex
    const n = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * factor))
    return "#" + n.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TOTAL_STEPS = 12

export default function AILevelQuiz(props: Props) {
    const {
        primaryColor = "#14213D",
        accentColor = "#C86D2D",
        creamColor = "#FAF8F5",
        title = "What's your AI level?",
        intro = "12 quick questions, about 3 minutes. There are no wrong answers. You'll get your level, what you'll be able to do after the course and the next group that fits you.",
        webhookUrl = "",
        starterTitle = "AI Starter (Beginner)",
        starterSchedule = "Sunday nights on Zoom, Israel time. 3 weekly sessions: 90 min, 90 min, then a 60 min live clinic. Starts December 2026, exact dates coming soon.",
        starterSeatsA = 15,
        starterSeatsB = 15,
        starterStatus = "Waitlist",
        starterPaymentUrl = "",
        workTitle = "AI at Work (Intermediate)",
        workSchedule = "Wednesday nights on Zoom, Israel time. 4 weekly sessions of 90 min. Starts December 2026, exact dates coming soon.",
        workSeats = 15,
        workStatus = "Waitlist",
        workPaymentUrl = "",
        waitlistUrl = "/#cohorts",
        coachingUrl = "/#coaching",
        buildQuoteUrl = "/#workflows",
        privacyUrl = "/privacy",
        canvasPreview = "Live",
        style,
    } = props
    const accentDark = shade(accentColor, 0.84)

    const [step, setStep] = React.useState(-1) // -1 intro, 0..11 questions, 12 gate, 13 results
    const [answers, setAnswers] = React.useState<number[]>(Array(10).fill(-1))
    const [q11, setQ11] = React.useState("")
    const [track, setTrack] = React.useState("")
    const [firstName, setFirstName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [consent, setConsent] = React.useState(false)
    const [gateError, setGateError] = React.useState("")
    const [sending, setSending] = React.useState(false)
    const headingRef = React.useRef<HTMLHeadingElement>(null)

    React.useEffect(() => {
        if (step >= 0) headingRef.current?.focus()
    }, [step])

    // Canvas preview: lets the editor show a results screen without clicking through.
    const PREVIEW: Record<string, number[]> = {
        "Results: Beginner": [1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
        "Results: Intermediate": [2, 1, 2, 1, 1, 1, 1, 1, 1, 1],
        "Results: Advanced": [3, 2, 2, 2, 2, 2, 1, 2, 2, 2],
        "Results: Expert": [3, 3, 3, 3, 3, 2, 2, 3, 3, 3],
    }
    const previewAnswers = PREVIEW[canvasPreview]
    const effAnswers = previewAnswers ?? answers
    const result = scoreQuiz(effAnswers, previewAnswers ? "Getting more done at work" : track)
    const viewStep = previewAnswers ? 13 : canvasPreview === "Lead gate" ? 12 : canvasPreview === "Question 1" ? 0 : step

    const canNext = step < 10 ? answers[step] >= 0 : step === 10 ? true : step === 11 ? !!track : true

    const submitGate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!firstName.trim()) return setGateError("Please add your first name.")
        if (!EMAIL_RE.test(email.trim())) return setGateError("Please check your email address.")
        setGateError("")
        if (webhookUrl) {
            setSending(true)
            const payload = {
                event: "quiz_lead",
                firstName: firstName.trim(),
                email: email.trim(),
                marketingConsent: consent,
                score: result.score,
                level: result.level,
                rawLevel: result.rawLevel,
                capRuleApplied: result.capped,
                bumpRuleApplied: result.bumped,
                answers: QUESTIONS.map((q, i) => ({ question: q.text, answer: q.options[answers[i]] ?? "", points: answers[i] })),
                q11: q11.trim(),
                track,
                submittedAt: new Date().toISOString(),
                timezone: "Asia/Jerusalem",
                page: typeof window !== "undefined" ? window.location.pathname : "",
            }
            try {
                await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
            } catch {
                // Results still show; the lead can be re-sent from the results screen in a later version.
            }
            setSending(false)
        }
        setStep(13)
    }

    const css = `
.jy-quiz { container-type: inline-size; }
.jy-quiz a:focus-visible, .jy-quiz button:focus-visible, .jy-quiz input:focus-visible, .jy-quiz textarea:focus-visible { outline: 3px solid ${accentColor}; outline-offset: 2px; }
.jy-opt { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; border: 1.5px solid rgba(20,33,61,0.2); background: #FFFFFF; cursor: pointer; font-size: 16.5px; }
.jy-opt:hover { border-color: ${primaryColor}; }
.jy-opt-on { border-color: ${primaryColor}; background: #EEF0F5; }
.jy-btn { display: inline-block; text-decoration: none; font-weight: 600; font-size: 16px; padding: 13px 22px; border-radius: 999px; border: 0; cursor: pointer; }
.jy-btn-primary { background: ${accentDark}; color: #FFFFFF; }
.jy-btn-primary:hover { background: ${primaryColor}; }
.jy-btn-primary:disabled { background: #9AA0AC; cursor: not-allowed; }
.jy-btn-ghost { background: transparent; color: ${primaryColor}; border: 1.5px solid ${primaryColor}; }
.jy-input { width: 100%; box-sizing: border-box; font-size: 16px; padding: 12px 14px; border-radius: 10px; border: 1.5px solid #6B7385; background: #FFFFFF; color: ${primaryColor}; font-family: inherit; }
.jy-two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@container (max-width: 700px) { .jy-two { grid-template-columns: 1fr; } .jy-quiz-card { padding: 22px !important; } }
`
    const card: React.CSSProperties = { background: "#FFFFFF", borderRadius: 20, padding: 36, border: "1px solid rgba(20,33,61,0.1)", boxShadow: "0 10px 30px rgba(20,33,61,0.06)" }
    const h: React.CSSProperties = { margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 28, lineHeight: 1.2, outline: "none" }
    const label: React.CSSProperties = { display: "block", fontSize: 14.5, fontWeight: 600, marginBottom: 6 }

    // Results helpers
    const lvl = result.level
    const isStarter = lvl === "Beginner"
    const isWork = lvl === "Intermediate"
    const hidden = lvl === "Advanced" || lvl === "Expert"
    const seats = isStarter ? Math.max(starterSeatsA, starterSeatsB) : workSeats
    const status = isStarter ? starterStatus : workStatus
    const payUrl = isStarter ? starterPaymentUrl : isWork ? workPaymentUrl : ""
    const full = status === "Full" || seats <= 0
    const waitlistHref = waitlistUrl

    return (
        <div className="jy-quiz" style={{ ...style, width: "100%", background: creamColor, color: primaryColor, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
            <style>{css}</style>
            <div style={{ maxWidth: 820, margin: "0 auto", padding: "80px 20px", boxSizing: "border-box" }}>
                <div className="jy-quiz-card" style={card}>
                    {viewStep === -1 && (
                        <div>
                            <h2 style={{ ...h, fontSize: 36 }}>{title}</h2>
                            <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.55, color: "#2B3550" }}>{intro}</p>
                            <button className="jy-btn jy-btn-primary" style={{ marginTop: 24 }} onClick={() => setStep(0)}>Start the level check</button>
                        </div>
                    )}

                    {viewStep >= 0 && viewStep <= 11 && (
                        <div>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#4A5468" }}>Question {viewStep + 1} of {TOTAL_STEPS}</p>
                            <div role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={TOTAL_STEPS} aria-valuenow={viewStep + 1} style={{ height: 6, background: "#E7E9EF", borderRadius: 3, marginTop: 8 }}>
                                <div style={{ width: `${((viewStep + 1) / TOTAL_STEPS) * 100}%`, height: 6, background: accentColor, borderRadius: 3 }} />
                            </div>
                            {viewStep < 10 && (
                                <fieldset style={{ border: 0, padding: 0, margin: "22px 0 0" }}>
                                    <legend style={{ padding: 0 }}>
                                        <h2 ref={headingRef} tabIndex={-1} style={h}>{QUESTIONS[viewStep].text}</h2>
                                    </legend>
                                    <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
                                        {QUESTIONS[viewStep].options.map((o, i) => (
                                            <label key={o} className={"jy-opt" + (answers[viewStep] === i ? " jy-opt-on" : "")}>
                                                <input
                                                    type="radio"
                                                    name={`q${viewStep}`}
                                                    checked={answers[viewStep] === i}
                                                    onChange={() => setAnswers((a) => a.map((v, j) => (j === viewStep ? i : v)))}
                                                    style={{ width: 18, height: 18 }}
                                                />
                                                {o}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            )}
                            {viewStep === 10 && (
                                <div style={{ marginTop: 22 }}>
                                    <h2 ref={headingRef} tabIndex={-1} style={h}><label htmlFor="jy-q11">{Q11}</label></h2>
                                    <p style={{ margin: "8px 0 12px", fontSize: 15, color: "#4A5468" }}>Optional, but it helps me tailor your session.</p>
                                    <textarea id="jy-q11" className="jy-input" rows={4} value={q11} onChange={(e) => setQ11(e.target.value)} />
                                </div>
                            )}
                            {viewStep === 11 && (
                                <fieldset style={{ border: 0, padding: 0, margin: "22px 0 0" }}>
                                    <legend style={{ padding: 0 }}>
                                        <h2 ref={headingRef} tabIndex={-1} style={h}>{Q12}</h2>
                                    </legend>
                                    <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
                                        {TRACKS.map((t) => (
                                            <label key={t} className={"jy-opt" + (track === t ? " jy-opt-on" : "")}>
                                                <input type="radio" name="q12" checked={track === t} onChange={() => setTrack(t)} style={{ width: 18, height: 18 }} />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 26 }}>
                                <button className="jy-btn jy-btn-ghost" onClick={() => setStep((s) => Math.max(-1, s - 1))}>Back</button>
                                <button className="jy-btn jy-btn-primary" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                                    {viewStep === 11 ? "See my result" : "Next"}
                                </button>
                            </div>
                        </div>
                    )}

                    {viewStep === 12 && (
                        <form onSubmit={submitGate} noValidate>
                            <h2 ref={headingRef} tabIndex={-1} style={h}>Your result is ready</h2>
                            <p style={{ margin: "10px 0 20px", fontSize: 17, lineHeight: 1.5, color: "#2B3550" }}>
                                Where should I send your personal roadmap? You'll see your result on the next screen straight away.
                            </p>
                            <div className="jy-two">
                                <div>
                                    <label htmlFor="jy-quiz-name" style={label}>First name</label>
                                    <input id="jy-quiz-name" className="jy-input" autoComplete="given-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="jy-quiz-email" style={label}>Email</label>
                                    <input id="jy-quiz-email" className="jy-input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, fontSize: 15, lineHeight: 1.45 }}>
                                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1 }} />
                                <span>Yes, also send me occasional AI tips and course news by email. Optional, and you can unsubscribe any time.</span>
                            </label>
                            {gateError && <p role="alert" style={{ margin: "12px 0 0", color: "#A1260F", fontWeight: 600 }}>{gateError}</p>}
                            <p style={{ margin: "14px 0 0", fontSize: 13.5, color: "#4A5468" }}>
                                I'll use your answers to send your roadmap and prepare any session you book. <a href={privacyUrl} style={{ color: primaryColor }}>Privacy policy</a>.
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 22 }}>
                                <button type="button" className="jy-btn jy-btn-ghost" onClick={() => setStep(11)}>Back</button>
                                <button type="submit" className="jy-btn jy-btn-primary" disabled={sending}>{sending ? "One moment..." : "Show my result"}</button>
                            </div>
                        </form>
                    )}

                    {viewStep === 13 && (
                        <div>
                            {/* 1. Assessed level, score and explanation */}
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accentDark }}>Your AI level</p>
                            <h2 ref={headingRef} tabIndex={-1} style={{ ...h, fontSize: 38, marginTop: 6 }}>
                                {firstName.trim() ? `${firstName.trim()}, you're ` : "You're "}{lvl === "Intermediate" || lvl === "Advanced" || lvl === "Expert" ? "at " : "a "}{lvl === "Beginner" ? "Beginner" : `${lvl} level`}
                            </h2>
                            <p style={{ margin: "8px 0 0", fontSize: 17, fontWeight: 600 }}>You scored {result.score} out of 30.</p>
                            <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.55, color: "#2B3550" }}>{EXPLAIN[lvl]}</p>

                            {/* 2. By the end of this course */}
                            <h3 style={{ margin: "28px 0 0", fontSize: 21 }}>By the end of this course, you will...</h3>
                            <ul style={{ margin: "12px 0 0", paddingLeft: 22, fontSize: 16.5, lineHeight: 1.6 }}>
                                {OUTCOMES[lvl].map((o) => (
                                    <li key={o}>{o}</li>
                                ))}
                            </ul>

                            {/* 3. Recommended cohort card */}
                            <div style={{ marginTop: 28, background: creamColor, borderRadius: 16, padding: 22, border: "1px solid rgba(20,33,61,0.12)" }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4A5468" }}>Your next group</p>
                                {hidden ? (
                                    <>
                                        <h3 style={{ margin: "6px 0 0", fontSize: 21 }}>{lvl === "Advanced" ? "AI Power User (Advanced)" : "Agents and Automation (Expert)"}</h3>
                                        <p style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.5 }}>The curriculum is ready and the first group opens in Q1 2027. Waitlist members hear first and get first pick of seats.</p>
                                        <p style={{ margin: "8px 0 0", fontWeight: 700 }}>Status: Priority waitlist open</p>
                                    </>
                                ) : (
                                    <>
                                        <h3 style={{ margin: "6px 0 0", fontSize: 21 }}>{isStarter ? starterTitle : workTitle}</h3>
                                        <p style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.5 }}>{isStarter ? starterSchedule : workSchedule}</p>
                                        <p style={{ margin: "8px 0 0", fontWeight: 700 }}>
                                            ₪600 per person · {full ? "Full, waitlist only" : `${seats} of 15 seats left`}{isStarter ? " · 2 Sunday groups" : ""} · {status}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* 4. Primary CTA */}
                            <div style={{ marginTop: 26 }}>
                                <h3 style={{ margin: 0, fontSize: 22, fontFamily: "Georgia, 'Times New Roman', serif" }}>Want to save your seat?</h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
                                    {payUrl && status === "Open" && !full ? (
                                        <a className="jy-btn jy-btn-primary" href={payUrl}>Yes, save my seat (₪600)</a>
                                    ) : (
                                        <a className="jy-btn jy-btn-primary" href={waitlistHref}>Join the priority waitlist</a>
                                    )}
                                </div>
                            </div>

                            {/* 5. Secondary CTAs */}
                            <p style={{ margin: "22px 0 0", fontSize: 15.5 }}>
                                Prefer one to one? <a href={coachingUrl} style={{ color: primaryColor, fontWeight: 600 }}>Book a private 1:1 session</a>.
                            </p>
                            {hidden && (
                                <p style={{ margin: "10px 0 0", fontSize: 15.5 }}>
                                    Want this built for your team? <a className="jy-btn jy-btn-ghost" style={{ marginLeft: 6, padding: "8px 16px", fontSize: 15 }} href={buildQuoteUrl}>Request a workflow build quote</a>
                                </p>
                            )}
                            <button
                                className="jy-btn jy-btn-ghost"
                                style={{ marginTop: 22, fontSize: 14, padding: "8px 14px" }}
                                onClick={() => {
                                    setAnswers(Array(10).fill(-1))
                                    setTrack("")
                                    setQ11("")
                                    setStep(-1)
                                }}
                            >
                                Retake the check
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

addPropertyControls(AILevelQuiz, {
    webhookUrl: { type: ControlType.String, title: "Webhook URL", defaultValue: "", placeholder: "Paste the n8n webhook URL" },
    title: { type: ControlType.String, title: "Title", defaultValue: "What's your AI level?" },
    intro: { type: ControlType.String, title: "Intro", displayTextArea: true, defaultValue: "12 quick questions, about 3 minutes. There are no wrong answers. You'll get your level, what you'll be able to do after the course and the next group that fits you." },
    starterTitle: { type: ControlType.String, title: "Starter title", defaultValue: "AI Starter (Beginner)" },
    starterSchedule: { type: ControlType.String, title: "Starter schedule", displayTextArea: true, defaultValue: "Sunday nights on Zoom, Israel time. 3 weekly sessions: 90 min, 90 min, then a 60 min live clinic. Starts December 2026, exact dates coming soon." },
    starterSeatsA: { type: ControlType.Number, title: "Starter A seats", defaultValue: 15, min: 0, max: 15, step: 1 },
    starterSeatsB: { type: ControlType.Number, title: "Starter B seats", defaultValue: 15, min: 0, max: 15, step: 1 },
    starterStatus: { type: ControlType.Enum, title: "Starter status", options: ["Waitlist", "Open", "Full"], defaultValue: "Waitlist" },
    starterPaymentUrl: { type: ControlType.String, title: "Starter pay URL", defaultValue: "" },
    workTitle: { type: ControlType.String, title: "Work title", defaultValue: "AI at Work (Intermediate)" },
    workSchedule: { type: ControlType.String, title: "Work schedule", displayTextArea: true, defaultValue: "Wednesday nights on Zoom, Israel time. 4 weekly sessions of 90 min. Starts December 2026, exact dates coming soon." },
    workSeats: { type: ControlType.Number, title: "Work seats", defaultValue: 15, min: 0, max: 15, step: 1 },
    workStatus: { type: ControlType.Enum, title: "Work status", options: ["Waitlist", "Open", "Full"], defaultValue: "Waitlist" },
    workPaymentUrl: { type: ControlType.String, title: "Work pay URL", defaultValue: "" },
    waitlistUrl: { type: ControlType.String, title: "Waitlist URL", defaultValue: "/#cohorts" },
    coachingUrl: { type: ControlType.String, title: "1:1 URL", defaultValue: "/#coaching" },
    buildQuoteUrl: { type: ControlType.String, title: "Build quote URL", defaultValue: "/#workflows" },
    privacyUrl: { type: ControlType.String, title: "Privacy URL", defaultValue: "/privacy" },
    canvasPreview: { type: ControlType.Enum, title: "Preview", options: ["Live", "Question 1", "Lead gate", "Results: Beginner", "Results: Intermediate", "Results: Advanced", "Results: Expert"], defaultValue: "Live", description: "For checking the design only. Set back to Live before publishing." },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#C86D2D" },
    creamColor: { type: ControlType.Color, title: "Cream", defaultValue: "#FAF8F5" },
})
