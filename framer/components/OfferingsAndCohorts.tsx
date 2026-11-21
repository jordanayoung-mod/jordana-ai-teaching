import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// WCAG AA: a darker shade of the accent for text and for backgrounds behind white text.
function shade(hex: string, factor: number) {
    const h = (hex || "").replace("#", "")
    if (h.length !== 6) return hex
    const n = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * factor))
    return "#" + n.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
}

const COHORTS = [
    {
        id: "ai-starter-sun-1",
        level: "Beginner",
        day: "Sunday Nights (Group A)",
        title: "AI Starter (Beginner)",
        schedule: "3 weekly sessions (Sessions 1 & 2: 90 mins; Session 3: 60 mins live clinic)",
        status: "Starts December 2026, exact dates coming soon",
        seats: "15 seats max",
        promise: "Go from 'where do I even start?' to using AI with confidence for real tasks every week.",
    },
    {
        id: "ai-starter-sun-2",
        level: "Beginner",
        day: "Sunday Nights (Group B)",
        title: "AI Starter (Beginner)",
        schedule: "3 weekly sessions (Sessions 1 & 2: 90 mins; Session 3: 60 mins live clinic)",
        status: "Starts December 2026, exact dates coming soon",
        seats: "15 seats max",
        promise: "Go from 'where do I even start?' to using AI with confidence for real tasks every week.",
    },
    {
        id: "ai-at-work-wed-1",
        level: "Intermediate",
        day: "Wednesday Nights",
        title: "AI at Work (Intermediate)",
        schedule: "4 weekly sessions (90 mins each)",
        status: "Starts December 2026, exact dates coming soon",
        seats: "15 seats max",
        promise: "Turn hit-and-miss prompting into a personal prompt library and one reliable weekly workflow.",
    },
]

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function OfferingsAndCohorts(props) {
    const {
        primaryColor,
        accentColor,
        webhookUrl,
        quizUrl,
        showWaysToWork = true,
        showCohortHeading = true,
        showCohortCards = true,
        showWaitlist = true,
    } = props
    const accentAA = shade(accentColor, 0.75)
    // When the cards come from the CMS on the canvas, the waitlist form stays open and gets a cohort picker.
    const standaloneWaitlist = !showCohortCards && showWaitlist
    const cohortOptions = COHORTS.map((c) => `${c.title}, ${c.day}`)
    const [selectedCohort, setSelectedCohort] = useState<string | null>(null)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [consent, setConsent] = useState(false)
    const [sent, setSent] = useState(false)

    const submitWaitlist = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const cohort = selectedCohort || (standaloneWaitlist ? cohortOptions[0] : null)
        // Success only when the webhook accepts the data (or when no webhook is set yet).
        if (webhookUrl) {
            setSending(true)
            try {
                const res = await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        event_type: "waitlist_join",
                        name,
                        email,
                        cohort,
                        marketingConsent: consent,
                    }),
                })
                if (!res.ok) throw new Error(`Status ${res.status}`)
            } catch (err) {
                console.error(err)
                setSending(false)
                setError("Sorry, that didn't go through. Please check your connection and try again in a moment.")
                return
            }
            setSending(false)
        }
        if (!selectedCohort && cohort) setSelectedCohort(cohort)
        setSent(true)
    }

    return (
        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1D2432" }}>
            {showWaysToWork && (
            <section id="ways-to-work" style={{ background: "#FFFFFF", padding: "72px 20px" }}>
                <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                    <div style={{ maxWidth: 680, marginBottom: 40 }}>
                        <h2 style={{ fontSize: 32, color: primaryColor, margin: "0 0 12px" }}>
                            Pick the format that fits what you need
                        </h2>
                        <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
                            Every engagement is built around one promise: it will move you a couple of steps further so you feel you got clear value for your money.
                        </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                        <div style={{ border: `2px solid ${primaryColor}`, borderRadius: 12, padding: 28, background: "#FFFFFF" }}>
                            <span style={{ background: "#FDF0E6", color: accentAA, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
                                MOST POPULAR
                            </span>
                            <h3 style={{ fontSize: 22, color: primaryColor, margin: "12px 0 8px" }}>Small-Group Live Courses</h3>
                            <p style={{ fontSize: 28, fontWeight: 800, color: primaryColor, margin: "0 0 12px" }}>
                                600 ILS <span style={{ fontSize: 15, fontWeight: 400, color: "#4A5568" }}>/ full course</span>
                            </p>
                            <p style={{ lineHeight: 1.6, color: "#4A5568" }}>
                                Learn alongside peers at your exact skill level. Live Zoom sessions, small hands-on breakout rooms, and a private group chat between classes.
                            </p>
                            <ul style={{ paddingLeft: 20, lineHeight: 1.7, marginBottom: 24 }}>
                                <li>Max 15 people per group</li>
                                <li>2 Beginner groups on Sundays</li>
                                <li>1 Intermediate group on Wednesdays</li>
                            </ul>
                            <a
                                href="#cohorts"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    background: accentAA,
                                    color: "#FFFFFF",
                                    padding: "13px 20px",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Explore December Courses
                            </a>
                        </div>

                        <div style={{ border: "1px solid #E2DFD9", borderRadius: 12, padding: 28, background: "#FFFFFF" }}>
                            <span style={{ background: "#FDF0E6", color: accentAA, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
                                LIMITED 40-SLOT RELEASE
                            </span>
                            <h3 style={{ fontSize: 22, color: primaryColor, margin: "12px 0 8px" }}>Private 1:1 Coaching</h3>
                            <p style={{ fontSize: 28, fontWeight: 800, color: primaryColor, margin: "0 0 12px" }}>
                                From 400 ILS <span style={{ fontSize: 15, fontWeight: 400, color: "#4A5568" }}>/ session</span>
                            </p>
                            <p style={{ lineHeight: 1.6, color: "#4A5568" }}>
                                One full hour tailored to your screen and work. Only 40 private sessions are released across five tiers (400, 600, 750, 950, and 1,200 ILS).
                            </p>
                            <ul style={{ paddingLeft: 20, lineHeight: 1.7, marginBottom: 24 }}>
                                <li>60-minute private Zoom session</li>
                                <li>Tailored prep checklist included</li>
                                <li>Opens week of Nov 29, 2026</li>
                            </ul>
                            <a
                                href="#coaching"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    background: "#FFFFFF",
                                    color: primaryColor,
                                    border: `2px solid ${primaryColor}`,
                                    padding: "11px 20px",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Book a 1:1 Session
                            </a>
                        </div>

                        <div style={{ border: "1px solid #E2DFD9", borderRadius: 12, padding: 28, background: "#FFFFFF" }}>
                            <span style={{ background: "#FDF0E6", color: accentAA, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
                                FOR ORGANIZATIONS & COMPANIES
                            </span>
                            <h3 style={{ fontSize: 22, color: primaryColor, margin: "12px 0 8px" }}>Custom Workflow Builds</h3>
                            <p style={{ fontSize: 28, fontWeight: 800, color: primaryColor, margin: "0 0 12px" }}>
                                Custom Quote <span style={{ fontSize: 15, fontWeight: 400, color: "#4A5568" }}>/ project</span>
                            </p>
                            <p style={{ lineHeight: 1.6, color: "#4A5568" }}>
                                Want me to build the workflow for you? I analyze your team's repetitive tasks, build a working AI workflow, and hand it over ready to use.
                            </p>
                            <ul style={{ paddingLeft: 20, lineHeight: 1.7, marginBottom: 24 }}>
                                <li>20-minute discovery call first</li>
                                <li>Custom assistants & automations</li>
                                <li>Team walkthrough & plain guide</li>
                            </ul>
                            <a
                                href="#workflows"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    background: "#FFFFFF",
                                    color: primaryColor,
                                    border: `2px solid ${primaryColor}`,
                                    padding: "11px 20px",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Contact Me for a Quote
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            )}

            {(showCohortHeading || showCohortCards || showWaitlist) && (
            <section
                id={showCohortHeading ? "cohorts" : "cohort-waitlist"}
                style={{
                    background: "#FAF8F5",
                    padding: `${showCohortHeading ? 72 : 40}px 20px ${showCohortCards || showWaitlist ? 72 : 16}px`,
                }}
            >
                <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                    {showCohortHeading && (
                    <div style={{ maxWidth: 680, marginBottom: showCohortCards ? 40 : 0 }}>
                        <h2 style={{ fontSize: 32, color: primaryColor, margin: "0 0 12px" }}>
                            December 2026 Small-Group Courses
                        </h2>
                        <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
                            Live online, capped at 15 people per group. Two Beginner cohorts on Sunday nights and one Intermediate cohort on Wednesday nights.
                        </p>
                    </div>
                    )}

                    {showCohortCards && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                        {COHORTS.map((c) => (
                            <div key={c.id} style={{ background: "#FFFFFF", border: "1px solid #E2DFD9", borderRadius: 12, padding: 28 }}>
                                <span style={{ background: "#FDF0E6", color: accentAA, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
                                    {c.day}
                                </span>
                                <h3 style={{ fontSize: 22, color: primaryColor, margin: "12px 0 8px" }}>{c.title}</h3>
                                <p style={{ fontSize: 26, fontWeight: 800, color: primaryColor, margin: "0 0 12px" }}>
                                    600 ILS <span style={{ fontSize: 14, fontWeight: 400, color: "#4A5568" }}>/ full course</span>
                                </p>
                                <p style={{ lineHeight: 1.6 }}>{c.promise}</p>
                                <p style={{ fontSize: 14, color: "#4A5568" }}>
                                    <strong>Format:</strong> {c.schedule}
                                </p>
                                <p style={{ fontSize: 14, color: "#4A5568", marginBottom: 20 }}>
                                    <strong>Status:</strong> {c.status} ({c.seats})
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCohort(`${c.title} (${c.day})`)
                                        setSent(false)
                                    }}
                                    style={{
                                        width: "100%",
                                        background: accentAA,
                                        color: "#FFFFFF",
                                        border: "none",
                                        padding: "13px 20px",
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        fontSize: 15,
                                        cursor: "pointer",
                                    }}
                                >
                                    Join Priority Waitlist
                                </button>
                            </div>
                        ))}
                    </div>
                    )}

                    {showWaitlist && (selectedCohort || standaloneWaitlist) && (
                        <div
                            id="waitlist"
                            style={{
                                marginTop: standaloneWaitlist ? 0 : 32,
                                background: "#FFFFFF",
                                border: `2px solid ${primaryColor}`,
                                borderRadius: 12,
                                padding: 28,
                                maxWidth: 560,
                            }}
                        >
                            {sent ? (
                                <div role="status">
                                    <h3 style={{ color: primaryColor, margin: "0 0 8px" }}>You're on the priority list!</h3>
                                    <p style={{ margin: 0 }}>
                                        I've saved your spot on the waitlist for <strong>{selectedCohort}</strong> and will email you as soon as exact December dates open.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={submitWaitlist} aria-label="Join the priority waitlist">
                                    <h3 style={{ color: primaryColor, margin: "0 0 8px" }}>
                                        {standaloneWaitlist ? "Join the Priority Waitlist" : `Join Waitlist: ${selectedCohort}`}
                                    </h3>
                                    <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 16 }}>
                                        Be first in line to claim one of the 15 seats when December dates go live.
                                    </p>
                                    {standaloneWaitlist && (
                                        <>
                                            <label htmlFor="jy-wl-cohort" style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                                                Which group? *
                                            </label>
                                            <select
                                                id="jy-wl-cohort"
                                                required
                                                aria-label="Which group would you like to join"
                                                value={selectedCohort || cohortOptions[0]}
                                                onChange={(e) => setSelectedCohort(e.target.value)}
                                                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #8A857C", marginBottom: 12, fontSize: 16, background: "#FFFFFF", color: "#1D2432" }}
                                            >
                                                {cohortOptions.map((o) => (
                                                    <option key={o} value={o}>{o}</option>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                    <input
                                        type="text"
                                        required
                                        aria-label="First name"
                                        autoComplete="given-name"
                                        placeholder="First Name *"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #8A857C", marginBottom: 12, fontSize: 16 }}
                                    />
                                    <input
                                        type="email"
                                        required
                                        aria-label="Email address"
                                        autoComplete="email"
                                        placeholder="Email Address *"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #8A857C", marginBottom: 14, fontSize: 16 }}
                                    />
                                    <label style={{ display: "flex", gap: 10, fontSize: 14, color: "#4A5568", marginBottom: 16 }}>
                                        <input type="checkbox" aria-label="Send me occasional practical AI tips and updates on future courses" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
                                        <span>Yes, send me occasional practical AI tips and updates on future courses.</span>
                                    </label>
                                    {error && (
                                        <p role="alert" style={{ color: "#9B1C1C", fontSize: 14, margin: "0 0 12px" }}>{error}</p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        style={{
                                            width: "100%",
                                            background: accentAA,
                                            color: "#FFFFFF",
                                            padding: 13,
                                            border: "none",
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            fontSize: 16,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {sending ? "Saving..." : error ? "Try Again" : "Save My Waitlist Spot"}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {(showCohortCards || showWaitlist) && (
                    <div style={{ marginTop: 32 }}>
                        <a href={quizUrl} style={{ color: primaryColor, fontWeight: 700, fontSize: 17 }}>
                            Not sure which group matches your level? Take the 2-Minute Check &rarr;
                        </a>
                    </div>
                    )}
                </div>
            </section>
            )}
        </div>
    )
}

addPropertyControls(OfferingsAndCohorts, {
    primaryColor: { type: ControlType.Color, title: "Primary Navy", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent Amber", defaultValue: "#C86D2D" },
    webhookUrl: { type: ControlType.String, title: "n8n Webhook URL", defaultValue: "" },
    quizUrl: { type: ControlType.String, title: "Quiz Anchor or URL", defaultValue: "#quiz" },
    showWaysToWork: { type: ControlType.Boolean, title: "Ways to Work", defaultValue: true },
    showCohortHeading: { type: ControlType.Boolean, title: "Cohorts Heading", defaultValue: true },
    showCohortCards: { type: ControlType.Boolean, title: "Built-in Cohort Cards", description: "Turn off when the CMS cohort cards sit on the canvas.", defaultValue: true },
    showWaitlist: { type: ControlType.Boolean, title: "Waitlist Form", defaultValue: true },
})
