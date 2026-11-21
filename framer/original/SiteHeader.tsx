import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

export default function SiteHeader(props) {
    const { primaryColor, accentColor, onOpenQuizUrl } = props
    const [mobileOpen, setMobileOpen] = useState(false)

    const navLinks = [
        { label: "How It Works", href: "#before-after" },
        { label: "Small-Group Courses", href: "#cohorts" },
        { label: "1:1 Coaching", href: "#coaching" },
        { label: "Workflow Builds", href: "#workflows" },
        { label: "Playbook", href: "#library" },
    ]

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                background: "#FFFFFF",
                borderBottom: "1px solid #E2DFD9",
                fontFamily: "Inter, -apple-system, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: 1120,
                    margin: "0 auto",
                    padding: "0 20px",
                    minHeight: 72,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}
            >
                <a
                    href="#top"
                    style={{
                        fontWeight: 700,
                        fontSize: 19,
                        color: primaryColor,
                        textDecoration: "none",
                    }}
                >
                    Jordana Young <span style={{ fontWeight: 400, color: "#4A5568" }}>| Practical AI</span>
                </a>

                <button
                    type="button"
                    aria-expanded={mobileOpen}
                    aria-label="Toggle navigation menu"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{
                        display: "none",
                        background: "#FAF8F5",
                        border: "1px solid #E2DFD9",
                        padding: "8px 14px",
                        borderRadius: 6,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                    className="jy-mobile-toggle"
                >
                    {mobileOpen ? "Close" : "Menu"}
                </button>

                <nav
                    aria-label="Main Navigation"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 22,
                        flexWrap: "wrap",
                    }}
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            style={{
                                color: "#1D2432",
                                textDecoration: "none",
                                fontSize: 15,
                                fontWeight: 500,
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href={onOpenQuizUrl}
                        style={{
                            background: accentColor,
                            color: "#FFFFFF",
                            padding: "10px 18px",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 15,
                            textDecoration: "none",
                        }}
                    >
                        Find Your Level
                    </a>
                </nav>
            </div>
        </header>
    )
}

addPropertyControls(SiteHeader, {
    primaryColor: { type: ControlType.Color, title: "Primary Navy", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent Amber", defaultValue: "#C86D2D" },
    onOpenQuizUrl: { type: ControlType.String, title: "Quiz Anchor or URL", defaultValue: "#quiz" },
})
