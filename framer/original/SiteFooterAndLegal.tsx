import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

export default function SiteFooterAndLegal(props) {
    const { showMicrosoftAffiliation, primaryColor, linkedinUrl, contactEmail } = props
    const [legalView, setLegalView] = useState<"privacy" | "terms" | null>(null)

    return (
        <footer
            style={{
                background: primaryColor,
                color: "#FFFFFF",
                padding: "56px 20px 36px",
                fontFamily: "Inter, -apple-system, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: 1120,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 32,
                    marginBottom: 32,
                }}
            >
                <div>
                    <p style={{ fontWeight: 700, fontSize: 18, margin: "0 0 10px" }}>Jordana Young | Practical AI</p>
                    <p style={{ color: "#CBD5E1", lineHeight: 1.6, fontSize: 15 }}>
                        Practical AI training and custom workflow builds in Israel. All prices in ILS (₪). All session times in Israel Time (IST).
                    </p>
                    <p style={{ marginTop: 12 }}>
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#FFFFFF", fontWeight: 600 }}>
                            Connect on LinkedIn &nearr;
                        </a>
                    </p>
                </div>

                <div>
                    <p style={{ fontWeight: 700, margin: "0 0 10px" }}>Explore</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
                        <li><a href="#cohorts" style={{ color: "#DCE4F5" }}>December Courses</a></li>
                        <li><a href="#coaching" style={{ color: "#DCE4F5" }}>1:1 Coaching</a></li>
                        <li><a href="#workflows" style={{ color: "#DCE4F5" }}>Custom Workflow Builds</a></li>
                        <li><a href="#library" style={{ color: "#DCE4F5" }}>Free Playbook</a></li>
                    </ul>
                </div>

                <div>
                    <p style={{ fontWeight: 700, margin: "0 0 10px" }}>Legal & Policies</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
                        <li>
                            <button
                                type="button"
                                onClick={() => setLegalView(legalView === "privacy" ? null : "privacy")}
                                style={{ background: "none", border: "none", color: "#DCE4F5", textDecoration: "underline", cursor: "pointer", padding: 0, fontSize: 15 }}
                            >
                                Privacy Policy
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setLegalView(legalView === "terms" ? null : "terms")}
                                style={{ background: "none", border: "none", color: "#DCE4F5", textDecoration: "underline", cursor: "pointer", padding: 0, fontSize: 15 }}
                            >
                                Terms & Cancellation Policy
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {legalView && (
                <div
                    style={{
                        maxWidth: 1120,
                        margin: "0 auto 28px",
                        background: "#FFFFFF",
                        color: "#1D2432",
                        borderRadius: 10,
                        padding: 24,
                        lineHeight: 1.6,
                        fontSize: 15,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <strong>{legalView === "privacy" ? "Privacy Policy (Israeli Law Compliant)" : "Terms & Cancellation Policy"}</strong>
                        <button type="button" onClick={() => setLegalView(null)} style={{ cursor: "pointer", fontWeight: 700 }}>
                            Close
                        </button>
                    </div>
                    {legalView === "privacy" ? (
                        <p style={{ margin: 0 }}>
                            We comply with the Israeli Protection of Privacy Law, 5741-1981, and Amendment 40 (anti-spam). Personal details collected through forms are used solely to deliver assessments, coaching, and course logistics. Marketing messages are sent only if you explicitly tick the opt-in box. To inspect or delete your records, email {contactEmail}.
                        </p>
                    ) : (
                        <p style={{ margin: 0 }}>
                            All prices are in ILS. 1:1 sessions may be rescheduled free of charge with 24 hours' notice. Cancellations follow the Israeli Consumer Protection Law, 5741-1981: within 14 days of purchase and at least 2 business days before a 1:1 session (or 7 business days before a group cohort start date), subject to the statutory cancellation fee (5% or 100 ILS, whichever is lower).
                        </p>
                    )}
                </div>
            )}

            <div style={{ maxWidth: 1120, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 20, fontSize: 14, color: "#CBD5E1" }}>
                {showMicrosoftAffiliation && (
                    <p style={{ margin: "0 0 10px" }}>
                        Jordana Young works at Microsoft on the Copilot Studio team. All courses, coaching sessions, and workflow build services offered on this website are independent personal ventures and are not affiliated with, sponsored by, or endorsed by Microsoft Corporation.
                    </p>
                )}
                <p style={{ margin: 0 }}>&copy; 2026 Jordana Young. All rights reserved.</p>
            </div>
        </footer>
    )
}

addPropertyControls(SiteFooterAndLegal, {
    showMicrosoftAffiliation: { type: ControlType.Boolean, title: "Show MS Disclaimer", defaultValue: true },
    primaryColor: { type: ControlType.Color, title: "Primary Navy", defaultValue: "#14213D" },
    linkedinUrl: { type: ControlType.String, title: "LinkedIn URL", defaultValue: "https://www.linkedin.com/in/jordana-young" },
    contactEmail: { type: ControlType.String, title: "Contact Email", defaultValue: "jordanayoung@gmail.com" },
})
