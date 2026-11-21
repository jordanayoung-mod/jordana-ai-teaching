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

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function SiteHeader(props) {
    const { primaryColor, accentColor, onOpenQuizUrl } = props
    const [mobileOpen, setMobileOpen] = useState(false)
    const accentAA = shade(accentColor, 0.75)
    const close = () => setMobileOpen(false)

    const navLinks = [
        { label: "How It Works", href: "/#before-after" },
        { label: "Small-Group Courses", href: "/#cohorts" },
        { label: "1:1 Coaching", href: "/#coaching" },
        { label: "Workflow Builds", href: "/#workflows" },
        { label: "Playbook", href: "/playbook#library" },
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
                containerType: "inline-size",
            } as React.CSSProperties}
        >
            <style>{`
.jy-mobile-toggle { display: none; }
@media (max-width: 768px) {
  .jy-header-bar .jy-mobile-toggle { display: inline-block !important; }
  .jy-header-bar .jy-nav { display: none !important; }
  .jy-header-bar .jy-nav.jy-open { display: flex !important; flex-direction: column; align-items: stretch; width: 100%; gap: 4px !important; padding: 8px 0 16px; }
  .jy-header-bar .jy-nav.jy-open a { padding: 12px 4px; font-size: 17px !important; }
  .jy-header-bar .jy-nav.jy-open a.jy-cta { text-align: center; margin-top: 8px; }
}
@container (max-width: 768px) {
  .jy-header-bar .jy-mobile-toggle { display: inline-block !important; }
  .jy-header-bar .jy-nav { display: none !important; }
  .jy-header-bar .jy-nav.jy-open { display: flex !important; flex-direction: column; align-items: stretch; width: 100%; gap: 4px !important; padding: 8px 0 16px; }
  .jy-header-bar .jy-nav.jy-open a { padding: 12px 4px; font-size: 17px !important; }
  .jy-header-bar .jy-nav.jy-open a.jy-cta { text-align: center; margin-top: 8px; }
}
.jy-header-bar a:focus-visible, .jy-header-bar button:focus-visible { outline: 3px solid ${accentColor}; outline-offset: 3px; }
`}</style>
            <div
                className="jy-header-bar"
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
                    href="/"
                    onClick={close}
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
                    aria-controls="jy-main-nav"
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
                    id="jy-main-nav"
                    className={"jy-nav" + (mobileOpen ? " jy-open" : "")}
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
                            onClick={close}
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
                        className="jy-cta"
                        onClick={close}
                        style={{
                            background: accentAA,
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
    onOpenQuizUrl: { type: ControlType.String, title: "Quiz Anchor or URL", defaultValue: "/#quiz" },
})
