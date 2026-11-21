import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * OfferingsAndCohorts: "Ways to work with me" (#ways-to-work) and the
 * December cohorts (#cohorts) with a priority waitlist form that POSTs
 * { event: "waitlist_join", ... } to webhookUrl.
 *
 * Cohort cards: on the live site the cards come from the Cohorts CMS collection
 * (a canvas Collection List filtered to Visible = Yes, placed just above a second
 * instance of this component that has "Cohort header" and "Cards" switched off).
 * Framer code components can't read CMS collections directly, so the built-in
 * COHORTS list below (editable in the "Cohorts (fallback)" control) is the fallback.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */

interface Cohort {
    title: string
    level: string
    day: string
    schedule: string
    price: number
    seatsRemaining: number
    status: string
    visible: boolean
    promise: string
    paymentUrl: string
}

interface Offering {
    title: string
    price: string
    body: string
    ctaLabel: string
    ctaUrl: string
}

interface Props {
    primaryColor: string
    accentColor: string
    creamColor: string
    showWaysToWork: boolean
    waysTitle: string
    offerings: Offering[]
    cohortsTitle: string
    cohortsIntro: string
    cohorts: Cohort[]
    showCohortsSection: boolean
    showCohortsHeader: boolean
    showCards: boolean
    webhookUrl: string
    privacyUrl: string
    style?: React.CSSProperties
}

export const COHORTS: Cohort[] = [
    {
        title: "AI Starter, Sunday Group A",
        level: "Beginner",
        day: "Sunday",
        schedule: "3 weekly Sunday evening sessions on Zoom: 90 min, 90 min, then a 60 min live clinic and wrap-up. Israel time. Starts December 2026, exact dates coming soon.",
        price: 600,
        seatsRemaining: 15,
        status: "Waitlist",
        visible: true,
        promise: "Go from \"where do I even start?\" to using AI with confidence for real tasks every week.",
        paymentUrl: "",
    },
    {
        title: "AI Starter, Sunday Group B",
        level: "Beginner",
        day: "Sunday",
        schedule: "3 weekly Sunday evening sessions on Zoom: 90 min, 90 min, then a 60 min live clinic and wrap-up. Israel time. Starts December 2026, exact dates coming soon.",
        price: 600,
        seatsRemaining: 15,
        status: "Waitlist",
        visible: true,
        promise: "Go from \"where do I even start?\" to using AI with confidence for real tasks every week.",
        paymentUrl: "",
    },
    {
        title: "AI at Work, Wednesday Group",
        level: "Intermediate",
        day: "Wednesday",
        schedule: "4 weekly Wednesday evening sessions on Zoom, 90 min each. Israel time. Starts December 2026, exact dates coming soon.",
        price: 600,
        seatsRemaining: 15,
        status: "Waitlist",
        visible: true,
        promise: "Turn hit-and-miss prompting into a personal prompt library and one reliable weekly workflow.",
        paymentUrl: "",
    },
]

const DEFAULT_OFFERINGS: Offering[] = [
    {
        title: "Small-group live courses",
        price: "₪600 per person",
        body: "Up to 15 people on Zoom, hands-on breakout rooms and a private group chat between sessions. December groups for Beginner and Intermediate.",
        ctaLabel: "See the cohorts",
        ctaUrl: "#cohorts",
    },
    {
        title: "Private 1:1 coaching",
        price: "From ₪400 per session",
        body: "One focused session on your own tasks and tools. Only 40 sessions this round, and the price steps up every 8 sessions.",
        ctaLabel: "See 1:1 coaching",
        ctaUrl: "/#coaching",
    },
    {
        title: "Workflow builds for teams",
        price: "Priced by quote",
        body: "I design and build an AI workflow or assistant around how your team already works, set up in your own accounts.",
        ctaLabel: "Ask for a quote",
        ctaUrl: "/#workflows",
    },
]

function shade(hex: string, factor: number) {
    const h = hex.replace("#", "")
    if (h.length !== 6) return hex
    const n = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * factor))
    return "#" + n.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function OfferingsAndCohorts(props: Props) {
    const {
        primaryColor = "#14213D",
        accentColor = "#C86D2D",
        creamColor = "#FAF8F5",
        showWaysToWork = true,
        waysTitle = "Ways to work with me",
        offerings = DEFAULT_OFFERINGS,
        cohortsTitle = "December 2026 cohorts",
        cohortsIntro = "Live online, small groups, Israel time. Exact dates are coming soon, so join the priority waitlist and you'll hear first, before seats open to everyone.",
        cohorts = COHORTS,
        showCohortsSection = true,
        showCohortsHeader = true,
        showCards = true,
        webhookUrl = "",
        privacyUrl = "/privacy",
        style,
    } = props
    const accentDark = shade(accentColor, 0.84)
    const list = (cohorts && cohorts.length ? cohorts : COHORTS).filter((c) => c.visible !== false)

    const [firstName, setFirstName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [cohortChoice, setCohortChoice] = React.useState(list[0]?.title ?? "")
    const [consent, setConsent] = React.useState(false)
    const [state, setState] = React.useState<"idle" | "sending" | "done" | "error">("idle")
    const [fieldError, setFieldError] = React.useState("")

    const pickCohort = (title: string) => {
        setCohortChoice(title)
        if (typeof document !== "undefined") document.getElementById("jy-waitlist-name")?.focus()
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!firstName.trim()) return setFieldError("Please add your first name.")
        if (!EMAIL_RE.test(email.trim())) return setFieldError("Please check your email address.")
        setFieldError("")
        const chosen = list.find((c) => c.title === cohortChoice)
        const payload = {
            event: "waitlist_join",
            firstName: firstName.trim(),
            email: email.trim(),
            cohort: cohortChoice,
            level: chosen?.level ?? "",
            marketingConsent: consent,
            submittedAt: new Date().toISOString(),
            timezone: "Asia/Jerusalem",
            page: typeof window !== "undefined" ? window.location.pathname : "",
        }
        if (!webhookUrl) {
            setState("done")
            return
        }
        setState("sending")
        try {
            const res = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
            setState(res.ok ? "done" : "error")
        } catch {
            setState("error")
        }
    }

    const css = `
.jy-oc { container-type: inline-size; }
.jy-oc a:focus-visible, .jy-oc button:focus-visible, .jy-oc input:focus-visible, .jy-oc select:focus-visible { outline: 3px solid ${accentColor}; outline-offset: 2px; }
.jy-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.jy-btn { display: inline-block; text-decoration: none; font-weight: 600; font-size: 15.5px; padding: 12px 20px; border-radius: 999px; border: 0; cursor: pointer; }
.jy-btn-primary { background: ${accentDark}; color: #FFFFFF; }
.jy-btn-primary:hover { background: ${primaryColor}; }
.jy-btn-ghost { border: 1.5px solid ${primaryColor}; color: ${primaryColor}; background: transparent; }
.jy-input { width: 100%; box-sizing: border-box; font-size: 16px; padding: 12px 14px; border-radius: 10px; border: 1.5px solid #6B7385; background: #FFFFFF; color: ${primaryColor}; }
.jy-form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
@container (max-width: 820px) {
  .jy-grid3, .jy-form-row { grid-template-columns: 1fr; }
  .jy-oc-inner { padding: 56px 20px !important; }
}
`
    const label: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }

    return (
        <div className="jy-oc" style={{ ...style, width: "100%", color: primaryColor, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
            <style>{css}</style>
            {showWaysToWork && (
                <section id="ways-to-work" aria-labelledby="jy-ways-title" style={{ background: creamColor }}>
                    <div className="jy-oc-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px", boxSizing: "border-box" }}>
                        <h2 id="jy-ways-title" style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 38 }}>{waysTitle}</h2>
                        <div className="jy-grid3" style={{ marginTop: 28 }}>
                            {(offerings && offerings.length ? offerings : DEFAULT_OFFERINGS).map((o) => (
                                <article key={o.title} style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, border: "1px solid rgba(20,33,61,0.1)", display: "flex", flexDirection: "column", gap: 10 }}>
                                    <h3 style={{ margin: 0, fontSize: 21 }}>{o.title}</h3>
                                    <p style={{ margin: 0, fontWeight: 700, color: accentDark }}>{o.price}</p>
                                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "#2B3550", flexGrow: 1 }}>{o.body}</p>
                                    <a className="jy-btn jy-btn-ghost" href={o.ctaUrl} style={{ alignSelf: "flex-start", marginTop: 6 }}>{o.ctaLabel}</a>
                                </article>
                            ))}
                        </div>
                        <p style={{ margin: "28px 0 0", fontSize: 16 }}>
                            Not sure which fits? <a href="/#quiz" style={{ color: primaryColor, fontWeight: 700 }}>Take the 3 minute AI level check</a> and I'll point you to the right one.
                        </p>
                    </div>
                </section>
            )}

            {showCohortsSection && (
            <section id={showCohortsHeader ? "cohorts" : "cohorts-waitlist"} aria-labelledby={showCohortsHeader ? "jy-cohorts-title" : "jy-waitlist-title"} style={{ background: "#FFFFFF" }}>
                <div className="jy-oc-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: showCohortsHeader ? "80px 24px" : "0 24px 80px", boxSizing: "border-box" }}>
                    {showCohortsHeader && (
                        <>
                            <h2 id="jy-cohorts-title" style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 38 }}>{cohortsTitle}</h2>
                            <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.55, maxWidth: 700, color: "#2B3550" }}>{cohortsIntro}</p>
                        </>
                    )}

                    {showCards && (
                    <div style={{ marginTop: 28 }}>
                            <div className="jy-grid3">
                                {list.map((c) => {
                                    const full = c.status === "Full" || c.seatsRemaining <= 0
                                    return (
                                        <article key={c.title} style={{ background: creamColor, borderRadius: 16, padding: 24, border: "1px solid rgba(20,33,61,0.1)", display: "flex", flexDirection: "column", gap: 10 }}>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accentDark }}>{c.level}, {c.day} nights</p>
                                            <h3 style={{ margin: 0, fontSize: 21 }}>{c.title}</h3>
                                            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.55 }}>{c.promise}</p>
                                            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: "#4A5468", flexGrow: 1 }}>{c.schedule}</p>
                                            <p style={{ margin: 0, fontWeight: 700 }}>
                                                ₪{c.price} per person · {full ? "Full, waitlist only" : `${c.seatsRemaining} of 15 seats left`} · {c.status}
                                            </p>
                                            {c.paymentUrl && c.status === "Open" && !full ? (
                                                <a className="jy-btn jy-btn-primary" href={c.paymentUrl} style={{ alignSelf: "flex-start" }}>Save my seat</a>
                                            ) : (
                                                <button type="button" className="jy-btn jy-btn-primary" onClick={() => pickCohort(c.title)} style={{ alignSelf: "flex-start" }}>
                                                    Join the priority waitlist
                                                </button>
                                            )}
                                        </article>
                                    )
                                })}
                            </div>
                    </div>
                    )}

                    <div style={{ marginTop: showCards || showCohortsHeader ? 40 : 0, background: primaryColor, color: "#FFFFFF", borderRadius: 20, padding: 28 }}>
                        <h3 id="jy-waitlist-title" style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 26 }}>Want to save your seat?</h3>
                        <p style={{ margin: "8px 0 20px", fontSize: 16, lineHeight: 1.5, color: "#E6E9F0" }}>
                            Join the priority waitlist. I'll email you the dates first, before seats open to everyone. No payment today.
                        </p>
                        {state === "done" ? (
                            <p role="status" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                                You're on the list, {firstName.trim() || "friend"}. Watch your inbox, I'll be in touch as soon as dates are set.
                            </p>
                        ) : (
                            <form onSubmit={submit} aria-labelledby="jy-waitlist-title" noValidate>
                                <div className="jy-form-row">
                                    <div>
                                        <label htmlFor="jy-waitlist-name" style={label}>First name</label>
                                        <input id="jy-waitlist-name" className="jy-input" aria-label="First name" autoComplete="given-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Dana" />
                                    </div>
                                    <div>
                                        <label htmlFor="jy-waitlist-email" style={label}>Email</label>
                                        <input id="jy-waitlist-email" className="jy-input" type="email" aria-label="Email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                                    </div>
                                    <div>
                                        <label htmlFor="jy-waitlist-cohort" style={label}>Cohort</label>
                                        <select id="jy-waitlist-cohort" className="jy-input" aria-label="Cohort" value={cohortChoice} onChange={(e) => setCohortChoice(e.target.value)}>
                                            {list.map((c) => (
                                                <option key={c.title} value={c.title}>{c.title}</option>
                                            ))}
                                            <option value="1:1 coaching">1:1 coaching</option>
                                            <option value="Not sure yet">Not sure yet</option>
                                        </select>
                                    </div>
                                </div>
                                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, fontSize: 14.5, lineHeight: 1.45, color: "#E6E9F0" }}>
                                    <input type="checkbox" aria-label="Marketing emails consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1 }} />
                                    <span>Yes, also send me occasional AI tips and course news. Optional, and you can unsubscribe any time.</span>
                                </label>
                                {fieldError && <p role="alert" style={{ margin: "12px 0 0", color: "#FFD7B8", fontWeight: 600 }}>{fieldError}</p>}
                                {state === "error" && (
                                    <p role="alert" style={{ margin: "12px 0 0", color: "#FFD7B8", fontWeight: 600 }}>
                                        Sorry, that didn't go through. Please try again in a moment.
                                    </p>
                                )}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 18 }}>
                                    <button type="submit" className="jy-btn jy-btn-primary" disabled={state === "sending"}>
                                        {state === "sending" ? "Sending..." : state === "error" ? "Try again" : "Join the priority waitlist"}
                                    </button>
                                    <span style={{ fontSize: 13.5, color: "#C9CFDB" }}>
                                        I use your details only for this. <a href={privacyUrl} style={{ color: "#FFFFFF" }}>Privacy policy</a>.
                                    </span>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
            )}
        </div>
    )
}

addPropertyControls(OfferingsAndCohorts, {
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#C86D2D" },
    creamColor: { type: ControlType.Color, title: "Cream", defaultValue: "#FAF8F5" },
    webhookUrl: { type: ControlType.String, title: "Webhook URL", defaultValue: "", placeholder: "Paste the n8n webhook URL" },
    showWaysToWork: { type: ControlType.Boolean, title: "Ways to work", defaultValue: true },
    waysTitle: { type: ControlType.String, title: "Ways title", defaultValue: "Ways to work with me", hidden: (p: any) => !p.showWaysToWork },
    offerings: {
        type: ControlType.Array,
        title: "Offerings",
        hidden: (p: any) => !p.showWaysToWork,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String },
                price: { type: ControlType.String },
                body: { type: ControlType.String, displayTextArea: true },
                ctaLabel: { type: ControlType.String },
                ctaUrl: { type: ControlType.String },
            },
        },
        defaultValue: DEFAULT_OFFERINGS,
    },
    cohortsTitle: { type: ControlType.String, title: "Cohorts title", defaultValue: "December 2026 cohorts" },
    cohortsIntro: { type: ControlType.String, title: "Cohorts intro", displayTextArea: true, defaultValue: "Live online, small groups, Israel time. Exact dates are coming soon, so join the priority waitlist and you'll hear first, before seats open to everyone." },
    showCohortsSection: { type: ControlType.Boolean, title: "Cohorts section", defaultValue: true },
    showCohortsHeader: { type: ControlType.Boolean, title: "Cohort header", defaultValue: true, hidden: (p: any) => !p.showCohortsSection },
    showCards: { type: ControlType.Boolean, title: "Cards", defaultValue: true, hidden: (p: any) => !p.showCohortsSection },
    cohorts: {
        type: ControlType.Array,
        title: "Cohorts (fallback)",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String },
                level: { type: ControlType.Enum, options: ["Beginner", "Intermediate", "Advanced", "Expert"] },
                day: { type: ControlType.String },
                schedule: { type: ControlType.String, displayTextArea: true },
                price: { type: ControlType.Number, min: 0, max: 10000 },
                seatsRemaining: { type: ControlType.Number, min: 0, max: 15, step: 1 },
                status: { type: ControlType.Enum, options: ["Waitlist", "Open", "Full"] },
                visible: { type: ControlType.Boolean },
                promise: { type: ControlType.String, displayTextArea: true },
                paymentUrl: { type: ControlType.String, title: "Payment URL" },
            },
        },
        defaultValue: COHORTS,
    },
    privacyUrl: { type: ControlType.String, title: "Privacy URL", defaultValue: "/privacy" },
})
