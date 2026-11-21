import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * HeroAndOutcomes: Home hero plus the tabbed Before & After section (#before-after).
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */

interface Tab {
    label: string
    before: string
    after: string
}

interface Props {
    primaryColor: string
    accentColor: string
    creamColor: string
    eyebrow: string
    headline: string
    subhead: string
    promise: string
    credentials: string
    primaryCtaLabel: string
    primaryCtaUrl: string
    secondaryCtaLabel: string
    secondaryCtaUrl: string
    outcomesTitle: string
    outcomesIntro: string
    tabs: Tab[]
    outcomesCtaLabel: string
    outcomesCtaUrl: string
    style?: React.CSSProperties
}

const DEFAULT_TABS: Tab[] = [
    {
        label: "At work",
        before: "You spend Sunday night clearing your inbox and still start the week behind.",
        after: "AI drafts the replies, summarises the long threads and builds your week plan. You check, tweak and send in half the time.",
    },
    {
        label: "Writing",
        before: "Every draft from AI sounds like a robot, so you rewrite it from scratch.",
        after: "You give AI your own style guide and examples, so first drafts already sound like you.",
    },
    {
        label: "Research",
        before: "You open twenty tabs, lose track of sources and are not sure what to trust.",
        after: "You get source-linked answers, check the key facts with a simple routine and keep a clean summary.",
    },
    {
        label: "Images",
        before: "You need a visual for a slide or a post and end up with clip art.",
        after: "You describe what you want in plain words and get on-brand images you can actually use.",
    },
    {
        label: "Agents & automation",
        before: "The same copy and paste job eats an hour of your day, every day.",
        after: "A small assistant or automation does the repetitive steps and asks you before anything important happens.",
    },
    {
        label: "Home & family",
        before: "Meal plans, school forms and holiday planning live in your head at 11pm.",
        after: "AI turns them into lists, plans and reminders in minutes, so your evenings are yours again.",
    },
]

function shade(hex: string, factor: number) {
    const h = hex.replace("#", "")
    if (h.length !== 6) return hex
    const n = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * factor))
    return "#" + n.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
}

export default function HeroAndOutcomes(props: Props) {
    const {
        primaryColor = "#14213D",
        accentColor = "#C86D2D",
        creamColor = "#FAF8F5",
        eyebrow = "Live AI courses, 1:1 coaching and workflow builds",
        headline = "I help shape Microsoft's AI agent builder. Now I'll help you put AI to work.",
        subhead = "Small, friendly live groups and private sessions in plain English. You bring your real tasks, and you leave with things that work.",
        promise = "Every engagement moves you a couple of steps further so you feel you got clear value for your money.",
        credentials = "Part of the Microsoft team building Copilot Studio. 20+ years shaping products and customer experiences at Microsoft, Meta, HoneyBook and SodaStream.",
        primaryCtaLabel = "Check your AI level (3 minutes)",
        primaryCtaUrl = "/#quiz",
        secondaryCtaLabel = "See the December cohorts",
        secondaryCtaUrl = "/#cohorts",
        outcomesTitle = "Before & After",
        outcomesIntro = "Here's what changes when AI becomes a normal part of your week. Pick the one that sounds most like you.",
        tabs = DEFAULT_TABS,
        outcomesCtaLabel = "Find your starting point",
        outcomesCtaUrl = "/#quiz",
        style,
    } = props
    const list = tabs && tabs.length ? tabs : DEFAULT_TABS
    const [active, setActive] = React.useState(0)
    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])
    const accentDark = shade(accentColor, 0.84)
    const current = list[Math.min(active, list.length - 1)]

    const onKeyDown = (e: React.KeyboardEvent, i: number) => {
        let next = -1
        if (e.key === "ArrowRight") next = (i + 1) % list.length
        if (e.key === "ArrowLeft") next = (i - 1 + list.length) % list.length
        if (e.key === "Home") next = 0
        if (e.key === "End") next = list.length - 1
        if (next >= 0) {
            e.preventDefault()
            setActive(next)
            tabRefs.current[next]?.focus()
        }
    }

    const css = `
.jy-hero { container-type: inline-size; }
.jy-hero a:focus-visible, .jy-hero button:focus-visible { outline: 3px solid ${accentColor}; outline-offset: 3px; }
.jy-btn { display: inline-block; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 22px; border-radius: 999px; }
.jy-btn-primary { background: ${accentDark}; color: #FFFFFF; }
.jy-btn-primary:hover { background: ${primaryColor}; }
.jy-btn-secondary { border: 1.5px solid ${primaryColor}; color: ${primaryColor}; }
.jy-btn-secondary:hover { background: ${primaryColor}; color: #FFFFFF; }
.jy-ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.jy-h1 { font-size: 56px; }
@container (max-width: 760px) {
  .jy-ba-grid { grid-template-columns: 1fr; }
  .jy-h1 { font-size: 36px; }
  .jy-hero-inner { padding: 56px 20px 48px !important; }
  .jy-ba-inner { padding: 56px 20px !important; }
}
`

    return (
        <div
            className="jy-hero"
            id="main"
            style={{
                ...style,
                width: "100%",
                background: creamColor,
                color: primaryColor,
                fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
            }}
        >
            <style>{css}</style>
            <section aria-labelledby="jy-hero-title">
                <div className="jy-hero-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: "96px 24px 80px", boxSizing: "border-box" }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: accentDark }}>
                        {eyebrow}
                    </p>
                    <h1
                        id="jy-hero-title"
                        className="jy-h1"
                        style={{
                            margin: "18px 0 0",
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            lineHeight: 1.08,
                            letterSpacing: "-0.02em",
                            maxWidth: 900,
                            fontWeight: 700,
                        }}
                    >
                        {headline}
                    </h1>
                    <p style={{ margin: "24px 0 0", fontSize: 20, lineHeight: 1.55, maxWidth: 720, color: "#2B3550" }}>{subhead}</p>
                    <p
                        style={{
                            margin: "20px 0 0",
                            fontSize: 18,
                            lineHeight: 1.5,
                            maxWidth: 720,
                            paddingLeft: 16,
                            borderLeft: `4px solid ${accentColor}`,
                            fontStyle: "italic",
                        }}
                    >
                        {promise}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
                        <a className="jy-btn jy-btn-primary" href={primaryCtaUrl}>{primaryCtaLabel}</a>
                        <a className="jy-btn jy-btn-secondary" href={secondaryCtaUrl}>{secondaryCtaLabel}</a>
                    </div>
                    <p style={{ margin: "32px 0 0", fontSize: 14.5, lineHeight: 1.5, color: "#4A5468", maxWidth: 720 }}>{credentials}</p>
                </div>
            </section>

            <section id="before-after" aria-labelledby="jy-ba-title" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(20,33,61,0.08)" }}>
                <div className="jy-ba-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px", boxSizing: "border-box" }}>
                    <h2 id="jy-ba-title" style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 38, lineHeight: 1.15 }}>
                        {outcomesTitle}
                    </h2>
                    <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.55, maxWidth: 680, color: "#2B3550" }}>{outcomesIntro}</p>
                    <div role="tablist" aria-label="Before and after examples" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
                        {list.map((t, i) => {
                            const selected = i === active
                            return (
                                <button
                                    key={t.label}
                                    ref={(el) => { tabRefs.current[i] = el }}
                                    role="tab"
                                    id={`jy-tab-${i}`}
                                    aria-selected={selected}
                                    aria-controls="jy-tabpanel"
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => setActive(i)}
                                    onKeyDown={(e) => onKeyDown(e, i)}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        padding: "10px 16px",
                                        borderRadius: 999,
                                        border: `1.5px solid ${selected ? primaryColor : "rgba(20,33,61,0.25)"}`,
                                        background: selected ? primaryColor : "transparent",
                                        color: selected ? "#FFFFFF" : primaryColor,
                                    }}
                                >
                                    {t.label}
                                </button>
                            )
                        })}
                    </div>
                    <div id="jy-tabpanel" role="tabpanel" aria-labelledby={`jy-tab-${active}`} className="jy-ba-grid" style={{ marginTop: 20 }}>
                        <div style={{ background: creamColor, borderRadius: 16, padding: 24, border: "1px solid rgba(20,33,61,0.1)" }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4A5468" }}>Before</p>
                            <p style={{ margin: "10px 0 0", fontSize: 18, lineHeight: 1.55 }}>{current?.before}</p>
                        </div>
                        <div style={{ background: primaryColor, color: "#FFFFFF", borderRadius: 16, padding: 24 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F3C9A6" }}>After</p>
                            <p style={{ margin: "10px 0 0", fontSize: 18, lineHeight: 1.55 }}>{current?.after}</p>
                        </div>
                    </div>
                    <div style={{ marginTop: 32 }}>
                        <a className="jy-btn jy-btn-primary" href={outcomesCtaUrl}>{outcomesCtaLabel}</a>
                    </div>
                </div>
            </section>
        </div>
    )
}

addPropertyControls(HeroAndOutcomes, {
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#C86D2D" },
    creamColor: { type: ControlType.Color, title: "Cream", defaultValue: "#FAF8F5" },
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "Live AI courses, 1:1 coaching and workflow builds" },
    headline: { type: ControlType.String, title: "Headline", displayTextArea: true, defaultValue: "I help shape Microsoft's AI agent builder. Now I'll help you put AI to work." },
    subhead: { type: ControlType.String, title: "Subhead", displayTextArea: true, defaultValue: "Small, friendly live groups and private sessions in plain English. You bring your real tasks, and you leave with things that work." },
    promise: { type: ControlType.String, title: "Promise", displayTextArea: true, defaultValue: "Every engagement moves you a couple of steps further so you feel you got clear value for your money." },
    credentials: { type: ControlType.String, title: "Credentials", displayTextArea: true, defaultValue: "Part of the Microsoft team building Copilot Studio. 20+ years shaping products and customer experiences at Microsoft, Meta, HoneyBook and SodaStream." },
    primaryCtaLabel: { type: ControlType.String, title: "CTA 1 label", defaultValue: "Check your AI level (3 minutes)" },
    primaryCtaUrl: { type: ControlType.String, title: "CTA 1 link", defaultValue: "/#quiz" },
    secondaryCtaLabel: { type: ControlType.String, title: "CTA 2 label", defaultValue: "See the December cohorts" },
    secondaryCtaUrl: { type: ControlType.String, title: "CTA 2 link", defaultValue: "/#cohorts" },
    outcomesTitle: { type: ControlType.String, title: "B&A title", defaultValue: "Before & After" },
    outcomesIntro: { type: ControlType.String, title: "B&A intro", displayTextArea: true, defaultValue: "Here's what changes when AI becomes a normal part of your week. Pick the one that sounds most like you." },
    tabs: {
        type: ControlType.Array,
        title: "Tabs",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                before: { type: ControlType.String, title: "Before", displayTextArea: true },
                after: { type: ControlType.String, title: "After", displayTextArea: true },
            },
        },
        defaultValue: DEFAULT_TABS,
    },
    outcomesCtaLabel: { type: ControlType.String, title: "B&A CTA", defaultValue: "Find your starting point" },
    outcomesCtaUrl: { type: ControlType.String, title: "B&A CTA link", defaultValue: "/#quiz" },
})
