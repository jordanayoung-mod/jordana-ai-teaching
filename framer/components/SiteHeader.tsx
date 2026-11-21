import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * SiteHeader: sticky site header for Jordana Young AI Teaching.
 * Desktop shows the links in a row. Below 768px the toggle button appears,
 * the nav collapses, and opening it stacks the links vertically.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */

interface NavLink {
    label: string
    href: string
}

interface Props {
    primaryColor: string
    accentColor: string
    backgroundColor: string
    brandName: string
    brandTagline: string
    links: NavLink[]
    ctaLabel: string
    onOpenQuizUrl: string
    style?: React.CSSProperties
}

const DEFAULT_LINKS: NavLink[] = [
    { label: "Before & After", href: "/#before-after" },
    { label: "Cohorts", href: "/#cohorts" },
    { label: "1:1 Coaching", href: "/#coaching" },
    { label: "Workflow Builds", href: "/#workflows" },
    { label: "Playbook", href: "/playbook#library" },
]

function shade(hex: string, factor: number) {
    const h = hex.replace("#", "")
    if (h.length !== 6) return hex
    const n = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * factor))
    return "#" + n.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
}

export default function SiteHeader(props: Props) {
    const {
        primaryColor = "#14213D",
        accentColor = "#C86D2D",
        backgroundColor = "#FAF8F5",
        brandName = "Jordana Young",
        brandTagline = "AI teaching and workflow builds",
        links = DEFAULT_LINKS,
        ctaLabel = "Check your AI level",
        onOpenQuizUrl = "/#quiz",
        style,
    } = props
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const navLinks = links && links.length ? links : DEFAULT_LINKS
    const accentDark = shade(accentColor, 0.84)
    const close = () => setMobileOpen(false)

    React.useEffect(() => {
        if (!mobileOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [mobileOpen])

    const css = `
.jy-header { container-type: inline-size; }
.jy-header a:focus-visible, .jy-header button:focus-visible { outline: 3px solid ${accentColor}; outline-offset: 3px; border-radius: 6px; }
.jy-nav-link { color: ${primaryColor}; text-decoration: none; font-size: 15px; font-weight: 500; padding: 8px 4px; border-bottom: 2px solid transparent; }
.jy-nav-link:hover { border-bottom-color: ${accentColor}; }
.jy-cta { background: ${accentDark}; color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 15px; padding: 11px 18px; border-radius: 999px; white-space: nowrap; }
.jy-cta:hover { background: ${primaryColor}; }
.jy-mobile-toggle { display: none; }
@media (max-width: 768px) {
  .jy-mobile-toggle { display: inline-flex; }
  .jy-nav { display: none !important; }
  .jy-nav.jy-open { display: flex !important; flex-direction: column; align-items: stretch; width: 100%; gap: 4px; padding: 8px 0 16px; }
  .jy-nav.jy-open .jy-nav-link { padding: 12px 4px; font-size: 17px; border-bottom: 1px solid rgba(20,33,61,0.12); }
  .jy-nav.jy-open .jy-cta { text-align: center; margin-top: 8px; padding: 14px 18px; }
  .jy-bar { flex-wrap: wrap; }
}
@container (max-width: 768px) {
  .jy-mobile-toggle { display: inline-flex; }
  .jy-nav { display: none !important; }
  .jy-nav.jy-open { display: flex !important; flex-direction: column; align-items: stretch; width: 100%; gap: 4px; padding: 8px 0 16px; }
  .jy-nav.jy-open .jy-nav-link { padding: 12px 4px; font-size: 17px; border-bottom: 1px solid rgba(20,33,61,0.12); }
  .jy-nav.jy-open .jy-cta { text-align: center; margin-top: 8px; padding: 14px 18px; }
  .jy-bar { flex-wrap: wrap; }
}
`

    return (
        <header
            className="jy-header"
            style={{
                ...style,
                width: "100%",
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: backgroundColor,
                borderBottom: "1px solid rgba(20,33,61,0.12)",
                fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
            }}
        >
            <style>{css}</style>
            <a
                href="#main"
                style={{ position: "absolute", left: -9999, top: 0 }}
                onFocus={(e) => ((e.currentTarget.style.left = "12px"), (e.currentTarget.style.top = "12px"))}
                onBlur={(e) => (e.currentTarget.style.left = "-9999px")}
            >
                Skip to content
            </a>
            <div
                className="jy-bar"
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    boxSizing: "border-box",
                }}
            >
                <a href="/" onClick={close} style={{ textDecoration: "none", color: primaryColor, display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em" }}>
                        {brandName}
                    </span>
                    <span style={{ fontSize: 12.5, color: "#4A5468" }}>{brandTagline}</span>
                </a>
                <button
                    type="button"
                    className="jy-mobile-toggle"
                    aria-expanded={mobileOpen}
                    aria-controls="jy-site-nav"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMobileOpen((o) => !o)}
                    style={{
                        alignItems: "center",
                        gap: 8,
                        background: "transparent",
                        border: `1.5px solid ${primaryColor}`,
                        color: primaryColor,
                        borderRadius: 999,
                        padding: "8px 14px",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>{mobileOpen ? "×" : "☰"}</span>
                    {mobileOpen ? "Close" : "Menu"}
                </button>
                <nav
                    id="jy-site-nav"
                    aria-label="Main"
                    className={"jy-nav" + (mobileOpen ? " jy-open" : "")}
                    style={{ display: "flex", alignItems: "center", gap: 22 }}
                >
                    {navLinks.map((l) => (
                        <a key={l.label + l.href} className="jy-nav-link" href={l.href} onClick={close}>
                            {l.label}
                        </a>
                    ))}
                    <a className="jy-cta" href={onOpenQuizUrl} onClick={close}>
                        {ctaLabel}
                    </a>
                </nav>
            </div>
        </header>
    )
}

addPropertyControls(SiteHeader, {
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#C86D2D" },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#FAF8F5" },
    brandName: { type: ControlType.String, title: "Brand", defaultValue: "Jordana Young" },
    brandTagline: { type: ControlType.String, title: "Tagline", defaultValue: "AI teaching and workflow builds" },
    links: {
        type: ControlType.Array,
        title: "Links",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                href: { type: ControlType.String, title: "Link" },
            },
        },
        defaultValue: DEFAULT_LINKS,
    },
    ctaLabel: { type: ControlType.String, title: "CTA label", defaultValue: "Check your AI level" },
    onOpenQuizUrl: { type: ControlType.String, title: "Quiz URL", defaultValue: "/#quiz" },
})
