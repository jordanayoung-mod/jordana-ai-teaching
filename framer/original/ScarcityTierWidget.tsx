import * as React from "react"
import { useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

const TIERS = [
    { tier: 1, price: 400, slots: 8, label: "Sessions 1 to 8" },
    { tier: 2, price: 600, slots: 8, label: "Sessions 9 to 16" },
    { tier: 3, price: 750, slots: 8, label: "Sessions 17 to 24" },
    { tier: 4, price: 950, slots: 8, label: "Sessions 25 to 32" },
    { tier: 5, price: 1200, slots: 8, label: "Sessions 33 to 40" },
]

export default function ScarcityTierWidget(props) {
    const { bookedCountProp, liveInventoryUrl, bookingUrl, primaryColor, accentColor } = props
    const [bookedCount, setBookedCount] = useState<number>(bookedCountProp)

    useEffect(() => {
        setBookedCount(bookedCountProp)
    }, [bookedCountProp])

    useEffect(() => {
        if (!liveInventoryUrl) return
        fetch(liveInventoryUrl)
            .then((r) => r.json())
            .then((data) => {
                if (typeof data.bookedCount === "number") {
                    setBookedCount(data.bookedCount)
                }
            })
            .catch(() => {})
    }, [liveInventoryUrl])

    const getActiveTier = () => {
        let cumulative = 0
        for (const t of TIERS) {
            if (bookedCount < cumulative + t.slots) {
                const remaining = cumulative + t.slots - bookedCount
                const nextTier = TIERS.find((x) => x.tier === t.tier + 1)
                return { ...t, remaining, nextPrice: nextTier ? nextTier.price : null }
            }
            cumulative += t.slots
        }
        return null
    }

    const active = getActiveTier()

    return (
        <section id="coaching" style={{ background: "#FFFFFF", padding: "72px 20px", fontFamily: "Inter, -apple-system, sans-serif", color: "#1D2432" }}>
            <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                <div style={{ maxWidth: 680, marginBottom: 32 }}>
                    <h2 style={{ fontSize: 32, color: primaryColor, margin: "0 0 12px" }}>Private 1:1 AI Coaching</h2>
                    <p style={{ fontSize: 17, color: "#4A5568", margin: 0 }}>
                        Bookings open the week of Sunday, November 29, 2026. Available Sunday to Thursday, 11:00 to 20:00 Israel Time.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 28,
                        background: "#FAF8F5",
                        border: "1px solid #E2DFD9",
                        borderRadius: 12,
                        padding: 32,
                    }}
                >
                    <div>
                        <h3 style={{ fontSize: 22, color: primaryColor, margin: "0 0 10px" }}>
                            How the 40-session release works
                        </h3>
                        <p style={{ color: "#4A5568", lineHeight: 1.6, marginBottom: 20 }}>
                            Only 40 private 1:1 sessions are available so calendar space stays open for group courses and company builds. Every 8 sessions booked, the price steps up automatically.
                        </p>
                        <div style={{ display: "grid", gap: 8 }}>
                            {TIERS.map((t) => {
                                const isCurrent = active && active.tier === t.tier
                                const isSoldOut = !active || t.tier < active.tier
                                return (
                                    <div
                                        key={t.tier}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "12px 16px",
                                            background: "#FFFFFF",
                                            borderRadius: 8,
                                            border: isCurrent ? `2px solid ${accentColor}` : "1px solid #E2DFD9",
                                            fontWeight: isCurrent ? 700 : 400,
                                            opacity: isSoldOut ? 0.55 : 1,
                                            textDecoration: isSoldOut ? "line-through" : "none",
                                        }}
                                    >
                                        <span>{t.label}</span>
                                        <span>
                                            {t.price} ILS {isCurrent ? `(${active.remaining} of ${t.slots} left)` : isSoldOut ? "(Sold out)" : ""}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div
                        style={{
                            background: "#FFFFFF",
                            border: "1px solid #E2DFD9",
                            borderRadius: 12,
                            padding: 28,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                        }}
                    >
                        {active ? (
                            <>
                                <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: accentColor, letterSpacing: "0.05em" }}>
                                    Current Active Price
                                </span>
                                <div style={{ fontSize: 44, fontWeight: 800, color: primaryColor, margin: "8px 0" }}>
                                    {active.price} ILS
                                </div>
                                <p style={{ fontWeight: 600, margin: "0 0 6px" }}>
                                    {active.remaining} of {active.slots} spots left at this price
                                </p>
                                {active.nextPrice && (
                                    <p style={{ fontSize: 14, color: "#4A5568", margin: "0 0 22px" }}>
                                        Price moves to {active.nextPrice} ILS once these {active.remaining} spots fill.
                                    </p>
                                )}
                                <a
                                    href={bookingUrl}
                                    style={{
                                        display: "block",
                                        background: accentColor,
                                        color: "#FFFFFF",
                                        padding: "14px 22px",
                                        borderRadius: 8,
                                        textDecoration: "none",
                                        fontWeight: 600,
                                        fontSize: 16,
                                    }}
                                >
                                    Reserve Your 1:1 Spot
                                </a>
                                <p style={{ fontSize: 13, color: "#4A5568", marginTop: 14 }}>
                                    Pay by Israeli credit card or Bit. Official tax invoice issued automatically.
                                </p>
                            </>
                        ) : (
                            <>
                                <h4 style={{ fontSize: 22, color: primaryColor }}>All 40 Sessions Booked</h4>
                                <p style={{ color: "#4A5568" }}>Join the waitlist or explore our December group courses.</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ScarcityTierWidget, {
    bookedCountProp: {
        type: ControlType.Number,
        title: "Sessions Booked",
        defaultValue: 0,
        min: 0,
        max: 40,
        step: 1,
    },
    liveInventoryUrl: {
        type: ControlType.String,
        title: "Live JSON URL (Optional)",
        defaultValue: "",
    },
    bookingUrl: {
        type: ControlType.String,
        title: "Booking Calendar Link",
        defaultValue: "#book-calendar",
    },
    primaryColor: { type: ControlType.Color, title: "Primary Navy", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent Amber", defaultValue: "#C86D2D" },
})
