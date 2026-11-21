import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

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

export default function OfferingsAndCohorts(props) {
    const { primaryColor, accentColor, webhookUrl, quizUrl } = props
    const [selectedCohort, setSelectedCohort] = useState<string | null>(null)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [consent, setConsent] = useState(false)
    const [sent, setSent] = useState(false)

    const submitWaitlist = async (e: React.FormEvent) => {
        e.preventDefault()
        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        event_type: "waitlist_join",
                        name,
                        email,
                        cohort: selectedCohort,
                        marketingConsent: consent,
                    }),
                })
            } catch (err) {
                console.error(err)
            }
        }
        setSent(true)
    }

    return (
        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1D2432" }}>
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
                            <span style={{ background: "#FDF0E6", color: accentColor, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
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
                                    background: accentColor,
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
                            <span style={{ background: "#FDF0E6", color: accentColor, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
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
                            <span style={{ background: "#FDF0E6", color: accentColor, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
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

            <section id="cohorts" style={{ background: "#FAF8F5", padding: "72px 20px" }}>
                <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                    <div style={{ maxWidth: 680, marginBottom: 40 }}>
                        <h2 style={{ fontSize: 32, color: primaryColor, margin: "0 0 12px" }}>
                            December 2026 Small-Group Courses
                        </h2>
                        <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
                            Live online, capped at 15 people per group. Two Beginner cohorts on Sunday nights and one Intermediate cohort on Wednesday nights.
                        </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                        {COHORTS.map((c) => (
                            <div key={c.id} style={{ background: "#FFFFFF", border: "1px solid #E2DFD9", borderRadius: 12, padding: 28 }}>
                                <span style={{ background: "#FDF0E6", color: accentColor, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
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
                                        background: accentColor,
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

                    {selectedCohort && (
                        <div
                            style={{
                                marginTop: 32,
                                background: "#FFFFFF",
                                border: `2px solid ${primaryColor}`,
                                borderRadius: 12,
                                padding: 28,
                                maxWidth: 560,
                            }}
                        >
                            {sent ? (
                                <div>
                                    <h3 style={{ color: primaryColor, margin: "0 0 8px" }}>You're on the priority list!</h3>
                                    <p style={{ margin: 0 }}>
                                        I've saved your spot on the waitlist for <strong>{selectedCohort}</strong> and will email you as soon as exact December dates open.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={submitWaitlist}>
                                    <h3 style={{ color: primaryColor, margin: "0 0 8px" }}>Join Waitlist: {selectedCohort}</h3>
                                    <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 16 }}>
                                        Be first in line to claim one of the 15 seats when December dates go live.
                                    </p>
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
                                    <label style={{ display: "flex", gap: 10, fontSize: 14, color: "#4A5568", marginBottom: 16 }}>
                                        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
                                        <span>Yes, send me occasional practical AI tips and updates on future courses.</span>
                                    </label>
                                    <button
                                        type="submit"
                                        style={{
                                            width: "100%",
                                            background: accentColor,
                                            color: "#FFFFFF",
                                            padding: 13,
                                            border: "none",
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            fontSize: 16,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Save My Waitlist Spot
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: 32 }}>
                        <a href={quizUrl} style={{ color: primaryColor, fontWeight: 700, fontSize: 17 }}>
                            Not sure which group matches your level? Take the 2-Minute Check &rarr;
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

addPropertyControls(OfferingsAndCohorts, {
    primaryColor: { type: ControlType.Color, title: "Primary Navy", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent Amber", defaultValue: "#C86D2D" },
    webhookUrl: { type: ControlType.String, title: "n8n Webhook URL", defaultValue: "" },
    quizUrl: { type: ControlType.String, title: "Quiz Anchor or URL", defaultValue: "#quiz" },
})
