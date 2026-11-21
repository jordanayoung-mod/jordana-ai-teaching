import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * ScarcityTierWidget: live counter for the 40-session 1:1 coaching release.
 * 5 tiers x 8 slots, sold in order: 400 / 600 / 750 / 950 / 1,200 ILS.
 * Booked count comes from the "Booked count" control, or from a JSON URL that
 * returns { "bookedCount": 12 } (the JSON value wins when it loads).
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */

interface Props {
    primaryColor: string
    accentColor: string
    creamColor: string
    title: string
    intro: string
    bookedCount: number
    jsonUrl: string
    tierPrices: number[]
    slotsPerTier: number
    bookingUrl: string
    payment1: string
    payment2: string
    payment3: string
    payment4: string
    payment5: string
    showHours: boolean
    opensLabel: string
    style?: React.CSSProperties
}

const HOURS = [
    { day: "Sunday", open: "11:00 to 20:00", breaks: "12:00 to 12:30 lunch" },
    { day: "Monday", open: "11:00 to 20:00", breaks: "12:00 to 12:30 lunch, and 16:30 to 18:30" },
    { day: "Tuesday", open: "11:00 to 20:00", breaks: "12:00 to 12:30 lunch" },
    { day: "Wednesday", open: "11:00 to 20:00", breaks: "12:00 to 12:30 lunch" },
    { day: "Thursday", open: "11:00 to 20:00", breaks: "12:00 to 12:30 lunch" },
]

function shade(hex: string, factor: number) {
    const h = hex.replace("#", "")
    if (h.length !== 6) return hex
    const n = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * factor))
    return "#" + n.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
}

export default function ScarcityTierWidget(props: Props) {
    const {
        primaryColor = "#14213D",
        accentColor = "#C86D2D",
        creamColor = "#FAF8F5",
        title = "Private 1:1 coaching",
        intro = "One focused session on your own tasks, tools and questions. This round has 40 sessions in total, sold in order. Every 8 sessions the price steps up, so the earlier you book, the less you pay.",
        bookedCount = 0,
        jsonUrl = "",
        tierPrices = [400, 600, 750, 950, 1200],
        slotsPerTier = 8,
        bookingUrl = "",
        payment1 = "",
        payment2 = "",
        payment3 = "",
        payment4 = "",
        payment5 = "",
        showHours = true,
        opensLabel = "Bookings open the week of Sunday 29 November 2026.",
        style,
    } = props
    const [remoteCount, setRemoteCount] = React.useState<number | null>(null)
    const accentDark = shade(accentColor, 0.84)

    React.useEffect(() => {
        if (!jsonUrl) return
        let cancelled = false
        fetch(jsonUrl, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                const n = d && Number(d.bookedCount)
                if (!cancelled && Number.isFinite(n)) setRemoteCount(n)
            })
            .catch(() => {})
        return () => {
            cancelled = true
        }
    }, [jsonUrl])

    const prices = tierPrices && tierPrices.length ? tierPrices : [400, 600, 750, 950, 1200]
    const total = prices.length * slotsPerTier
    const booked = Math.max(0, Math.min(total, Math.round(remoteCount ?? bookedCount ?? 0)))
    const currentTier = Math.min(prices.length - 1, Math.floor(booked / slotsPerTier))
    const soldOut = booked >= total
    const payments = [payment1, payment2, payment3, payment4, payment5]
    const ctaUrl = payments[currentTier] || bookingUrl
    const leftInTier = soldOut ? 0 : slotsPerTier - (booked % slotsPerTier)

    const css = `
.jy-tw { container-type: inline-size; }
.jy-tw a:focus-visible { outline: 3px solid ${accentColor}; outline-offset: 3px; }
.jy-tiers { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.jy-btn { display: inline-block; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 22px; border-radius: 999px; }
.jy-btn-primary { background: ${accentDark}; color: #FFFFFF; }
.jy-btn-primary:hover { background: ${primaryColor}; }
@container (max-width: 820px) {
  .jy-tiers { grid-template-columns: 1fr; }
  .jy-tw-inner { padding: 56px 20px !important; }
}
`
    const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid rgba(20,33,61,0.15)", fontSize: 14.5 }
    const td: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid rgba(20,33,61,0.08)", fontSize: 15 }

    return (
        <div className="jy-tw" style={{ ...style, width: "100%", background: creamColor, color: primaryColor, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
            <style>{css}</style>
            <div className="jy-tw-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px", boxSizing: "border-box" }}>
                <h2 style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 38 }}>{title}</h2>
                <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.55, maxWidth: 720, color: "#2B3550" }}>{intro}</p>

                <p aria-live="polite" style={{ margin: "24px 0 0", fontSize: 17, fontWeight: 700 }}>
                    {soldOut
                        ? "All 40 sessions in this round are booked. Join the waitlist for the next round."
                        : `${total - booked} of ${total} sessions left. ${leftInTier} left at ₪${prices[currentTier].toLocaleString("en-US")} before the price goes up.`}
                </p>

                <ol className="jy-tiers" aria-label="Price tiers" style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
                    {prices.map((p, i) => {
                        const start = i * slotsPerTier
                        const bookedHere = Math.max(0, Math.min(slotsPerTier, booked - start))
                        const done = bookedHere >= slotsPerTier
                        const isCurrent = i === currentTier && !soldOut
                        return (
                            <li
                                key={i}
                                aria-current={isCurrent ? "step" : undefined}
                                style={{
                                    borderRadius: 14,
                                    padding: 18,
                                    background: isCurrent ? primaryColor : "#FFFFFF",
                                    color: isCurrent ? "#FFFFFF" : primaryColor,
                                    border: `1.5px solid ${isCurrent ? primaryColor : "rgba(20,33,61,0.15)"}`,
                                    opacity: done ? 0.7 : 1,
                                }}
                            >
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                    Tier {i + 1} · Sessions {start + 1} to {start + slotsPerTier}
                                </p>
                                <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 700, textDecoration: done ? "line-through" : "none" }}>
                                    ₪{p.toLocaleString("en-US")}
                                </p>
                                <div aria-hidden="true" style={{ display: "flex", gap: 4, marginTop: 10 }}>
                                    {Array.from({ length: slotsPerTier }).map((_, s) => (
                                        <span
                                            key={s}
                                            style={{
                                                flex: 1,
                                                height: 8,
                                                borderRadius: 4,
                                                background: s < bookedHere ? (isCurrent ? "#F3C9A6" : accentColor) : isCurrent ? "rgba(255,255,255,0.3)" : "rgba(20,33,61,0.12)",
                                            }}
                                        />
                                    ))}
                                </div>
                                <p style={{ margin: "8px 0 0", fontSize: 14 }}>
                                    {done ? "Fully booked" : `${slotsPerTier - bookedHere} of ${slotsPerTier} left`}
                                </p>
                            </li>
                        )
                    })}
                </ol>

                {showHours && (
                    <div style={{ marginTop: 32 }}>
                        <h3 style={{ margin: 0, fontSize: 20 }}>When you can book</h3>
                        <p style={{ margin: "6px 0 12px", fontSize: 16 }}>{opensLabel} Sunday to Thursday, Israel time (IST). Friday and Saturday are closed.</p>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 640, background: "#FFFFFF", borderRadius: 12 }}>
                                <caption style={{ position: "absolute", left: -9999 }}>Coaching hours in Israel time</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" style={th}>Day</th>
                                        <th scope="col" style={th}>Open</th>
                                        <th scope="col" style={th}>Breaks (no sessions)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {HOURS.map((h) => (
                                        <tr key={h.day}>
                                            <th scope="row" style={{ ...td, textAlign: "left", fontWeight: 600 }}>{h.day}</th>
                                            <td style={td}>{h.open}</td>
                                            <td style={td}>{h.breaks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
                    {ctaUrl && !soldOut ? (
                        <a className="jy-btn jy-btn-primary" href={ctaUrl}>Book a session at ₪{prices[currentTier].toLocaleString("en-US")}</a>
                    ) : (
                        <a className="jy-btn jy-btn-primary" href="/#cohorts">Get notified when booking opens</a>
                    )}
                    <a href="/#quiz" style={{ color: primaryColor, fontWeight: 600 }}>Not sure what to focus on? Check your AI level first</a>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(ScarcityTierWidget, {
    bookedCount: { type: ControlType.Number, title: "Booked count", defaultValue: 0, min: 0, max: 40, step: 1, displayStepper: true },
    jsonUrl: { type: ControlType.String, title: "Count JSON URL", defaultValue: "", placeholder: "https://... returns {\"bookedCount\": 0}" },
    bookingUrl: { type: ControlType.String, title: "Booking URL", defaultValue: "", placeholder: "Cal.com or Calendly link" },
    payment1: { type: ControlType.String, title: "Pay link ₪400", defaultValue: "" },
    payment2: { type: ControlType.String, title: "Pay link ₪600", defaultValue: "" },
    payment3: { type: ControlType.String, title: "Pay link ₪750", defaultValue: "" },
    payment4: { type: ControlType.String, title: "Pay link ₪950", defaultValue: "" },
    payment5: { type: ControlType.String, title: "Pay link ₪1,200", defaultValue: "" },
    tierPrices: { type: ControlType.Array, title: "Tier prices", control: { type: ControlType.Number, min: 0, max: 10000 }, defaultValue: [400, 600, 750, 950, 1200] },
    slotsPerTier: { type: ControlType.Number, title: "Slots per tier", defaultValue: 8, min: 1, max: 20, step: 1 },
    title: { type: ControlType.String, title: "Title", defaultValue: "Private 1:1 coaching" },
    intro: { type: ControlType.String, title: "Intro", displayTextArea: true, defaultValue: "One focused session on your own tasks, tools and questions. This round has 40 sessions in total, sold in order. Every 8 sessions the price steps up, so the earlier you book, the less you pay." },
    showHours: { type: ControlType.Boolean, title: "Show hours", defaultValue: true },
    opensLabel: { type: ControlType.String, title: "Opens label", defaultValue: "Bookings open the week of Sunday 29 November 2026." },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#C86D2D" },
    creamColor: { type: ControlType.Color, title: "Cream", defaultValue: "#FAF8F5" },
})
