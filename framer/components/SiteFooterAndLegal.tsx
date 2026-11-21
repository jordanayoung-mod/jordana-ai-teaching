import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * SiteFooterAndLegal: site footer with links, LinkedIn, legal links and the
 * Microsoft independence disclaimer.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */

interface Props {
    primaryColor: string
    accentColor: string
    linkedinUrl: string
    contactEmail: string
    disclaimer: string
    style?: React.CSSProperties
}

const DISCLAIMER =
    "Jordana Young works at Microsoft on the Copilot Studio team. All courses, coaching sessions and workflow build services on this website are independent personal ventures. They are not affiliated with, sponsored by or endorsed by Microsoft Corporation."

export default function SiteFooterAndLegal(props: Props) {
    const {
        primaryColor = "#14213D",
        accentColor = "#C86D2D",
        linkedinUrl = "https://www.linkedin.com/in/jordana-young",
        contactEmail = "",
        disclaimer = DISCLAIMER,
        style,
    } = props
    const css = `
.jy-ft { container-type: inline-size; }
.jy-ft a { color: #FFFFFF; text-decoration: none; }
.jy-ft a:hover { text-decoration: underline; text-decoration-color: ${accentColor}; text-underline-offset: 4px; }
.jy-ft a:focus-visible { outline: 3px solid ${accentColor}; outline-offset: 3px; }
.jy-ft-cols { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px; }
@container (max-width: 820px) { .jy-ft-cols { grid-template-columns: 1fr 1fr; } }
@container (max-width: 480px) { .jy-ft-cols { grid-template-columns: 1fr; } }
`
    const head: React.CSSProperties = { margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F3C9A6" }
    const ul: React.CSSProperties = { listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 10, fontSize: 15.5 }
    return (
        <footer className="jy-ft" style={{ ...style, width: "100%", background: primaryColor, color: "#FFFFFF", fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
            <style>{css}</style>
            <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px 32px", boxSizing: "border-box" }}>
                <div className="jy-ft-cols">
                    <div>
                        <p style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 24, fontWeight: 700 }}>Jordana Young</p>
                        <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.55, color: "#D5DAE4" }}>
                            Live AI courses, 1:1 coaching and workflow builds. In English, priced in ILS, times in Israel time.
                        </p>
                        <a href="/#quiz" style={{ display: "inline-block", marginTop: 16, background: "#FFFFFF", color: primaryColor, fontWeight: 700, padding: "11px 18px", borderRadius: 999 }}>
                            Check your AI level
                        </a>
                    </div>
                    <nav aria-label="Learn">
                        <p style={head}>Learn</p>
                        <ul style={ul}>
                            <li><a href="/cohorts">Cohorts</a></li>
                            <li><a href="/coaching">1:1 Coaching</a></li>
                            <li><a href="/assessment">AI level check</a></li>
                            <li><a href="/playbook">Playbook</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="Work with me">
                        <p style={head}>Work with me</p>
                        <ul style={ul}>
                            <li><a href="/company-builds">Company builds</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            {contactEmail && <li><a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>}
                        </ul>
                    </nav>
                    <nav aria-label="Legal">
                        <p style={head}>Legal</p>
                        <ul style={ul}>
                            <li><a href="/privacy">Privacy policy</a></li>
                            <li><a href="/terms">Terms and cancellations</a></li>
                        </ul>
                    </nav>
                </div>
                <p style={{ margin: "40px 0 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.18)", fontSize: 13.5, lineHeight: 1.6, color: "#C9CFDB" }}>{disclaimer}</p>
                <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "#C9CFDB" }}>© 2026 Jordana Young. All prices in ILS (₪). All times in Israel time (IST).</p>
            </div>
        </footer>
    )
}

addPropertyControls(SiteFooterAndLegal, {
    linkedinUrl: { type: ControlType.String, title: "LinkedIn", defaultValue: "https://www.linkedin.com/in/jordana-young" },
    contactEmail: { type: ControlType.String, title: "Contact email", defaultValue: "" },
    disclaimer: { type: ControlType.String, title: "Disclaimer", displayTextArea: true, defaultValue: DISCLAIMER },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#C86D2D" },
})
