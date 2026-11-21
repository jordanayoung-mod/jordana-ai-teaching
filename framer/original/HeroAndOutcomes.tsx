import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

const TABS = [
    {
        id: "notes",
        label: "Messy Meeting Notes",
        before: "You paste a 40-minute transcript and type 'summarize this.' You get five paragraphs of vague filler that you still have to read twice.",
        after: "You run a 3-line saved instruction. In 10 seconds, you get a clean table of decisions made, who owns each task, and what is still unresolved.",
    },
    {
        id: "emails",
        label: "Emails in Your Voice",
        before: "You ask AI to write a client follow-up. It spits out stiff, robotic sentences full of exclamation marks that you would never say.",
        after: "You feed AI three examples of your real writing first. It drafts a warm, direct reply in your exact voice that needs almost zero editing.",
    },
    {
        id: "files",
        label: "Heavy PDFs & Data",
        before: "You spend two hours manually reading a 30-page PDF report or comparing vendor quotes across three spreadsheets.",
        after: "You upload the files safely and ask targeted questions. You pull out the five numbers that matter and spot a pricing error in under three minutes.",
    },
]

export default function HeroAndOutcomes(props) {
    const { showMicrosoftAffiliation, primaryColor, accentColor, quizUrl } = props
    const [activeTab, setActiveTab] = useState(0)

    return (
        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1D2432" }}>
            <section id="top" style={{ background: "#FFFFFF", padding: "76px 20px 68px" }}>
                <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                    <div style={{ maxWidth: 760 }}>
                        {showMicrosoftAffiliation && (
                            <p
                                style={{
                                    display: "inline-block",
                                    background: "#FAF8F5",
                                    border: "1px solid #E2DFD9",
                                    color: primaryColor,
                                    fontWeight: 600,
                                    fontSize: 14,
                                    padding: "6px 14px",
                                    borderRadius: 999,
                                    marginBottom: 18,
                                }}
                            >
                                Part of the Microsoft team building Copilot Studio
                            </p>
                        )}
                        <h1
                            style={{
                                fontSize: "clamp(32px, 4.5vw, 48px)",
                                lineHeight: 1.18,
                                color: primaryColor,
                                margin: "0 0 20px",
                                fontWeight: 800,
                            }}
                        >
                            I help shape Microsoft's AI agent builder. Now I'll help you put AI to work.
                        </h1>
                        <p style={{ fontSize: 19, lineHeight: 1.6, color: "#4A5568", marginBottom: 30 }}>
                            Skip the tech jargon and endless tutorials. Whether you have never opened ChatGPT, want personal 1:1 coaching, or need custom AI workflows built for your company, I'll help you use AI on real tasks every week.
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 22 }}>
                            <a
                                href={quizUrl}
                                style={{
                                    background: accentColor,
                                    color: "#FFFFFF",
                                    padding: "15px 28px",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    fontSize: 17,
                                    textDecoration: "none",
                                }}
                            >
                                Take the 2-Minute AI Level Check
                            </a>
                            <a
                                href="#cohorts"
                                style={{
                                    background: "#FFFFFF",
                                    color: primaryColor,
                                    border: `2px solid ${primaryColor}`,
                                    padding: "13px 26px",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    fontSize: 17,
                                    textDecoration: "none",
                                }}
                            >
                                See December Courses
                            </a>
                        </div>
                        <p style={{ fontSize: 15, color: "#4A5568", margin: 0 }}>
                            20+ years shaping products and customer experiences at Microsoft, Meta, HoneyBook, and SodaStream.
                        </p>
                    </div>
                </div>
            </section>

            <section id="before-after" style={{ background: "#FAF8F5", padding: "72px 20px" }}>
                <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                    <div style={{ maxWidth: 680, marginBottom: 36 }}>
                        <h2 style={{ fontSize: 32, color: primaryColor, margin: "0 0 12px" }}>
                            What changes when you know how to ask
                        </h2>
                        <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
                            Click a real everyday task below to see the difference between guessing at a prompt and having a simple system.
                        </p>
                    </div>

                    <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                        {TABS.map((tab, idx) => {
                            const selected = activeTab === idx
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => setActiveTab(idx)}
                                    style={{
                                        padding: "11px 18px",
                                        borderRadius: 8,
                                        border: selected ? `1px solid ${primaryColor}` : "1px solid #E2DFD9",
                                        background: selected ? primaryColor : "#FFFFFF",
                                        color: selected ? "#FFFFFF" : "#1D2432",
                                        fontWeight: 600,
                                        fontSize: 15,
                                        cursor: "pointer",
                                    }}
                                >
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: 24,
                        }}
                    >
                        <div style={{ background: "#FFFFFF", border: "1px solid #E2DFD9", borderRadius: 10, padding: 28 }}>
                            <span
                                style={{
                                    display: "inline-block",
                                    background: "#EDF0F5",
                                    color: "#4A5568",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    marginBottom: 12,
                                }}
                            >
                                Before: Guessing
                            </span>
                            <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>{TABS[activeTab].before}</p>
                        </div>

                        <div
                            style={{
                                background: "#FFFFFF",
                                border: "1px solid #E2DFD9",
                                borderLeft: `5px solid ${accentColor}`,
                                borderRadius: 10,
                                padding: 28,
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    background: "#FDF0E6",
                                    color: accentColor,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    marginBottom: 12,
                                }}
                            >
                                After: A Simple System
                            </span>
                            <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>{TABS[activeTab].after}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 28 }}>
                        <a href={quizUrl} style={{ color: primaryColor, fontWeight: 700, fontSize: 17 }}>
                            Not sure where to start? Find your level in 2 minutes &rarr;
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

addPropertyControls(HeroAndOutcomes, {
    showMicrosoftAffiliation: { type: ControlType.Boolean, title: "Show MS Copilot Tag", defaultValue: true },
    primaryColor: { type: ControlType.Color, title: "Primary Navy", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent Amber", defaultValue: "#C86D2D" },
    quizUrl: { type: ControlType.String, title: "Quiz Anchor or URL", defaultValue: "#quiz" },
})
