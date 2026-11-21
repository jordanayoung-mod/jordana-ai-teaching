import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * WorkflowBuildsAndAbout: Company workflow builds (#workflows) with a quote form
 * that POSTs { event: "b2b_quote", ... } to webhookUrl, the About section (#about)
 * with LinkedIn, and a short FAQ (#faq). Each part can be switched on or off so
 * the same component serves Home, Company Builds and About.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */

interface Faq {
    q: string
    a: string
}

interface Props {
    primaryColor: string
    accentColor: string
    creamColor: string
    showBuilds: boolean
    showAbout: boolean
    showFaq: boolean
    webhookUrl: string
    discoveryCallUrl: string
    linkedinUrl: string
    privacyUrl: string
    aboutBody: string
    faqs: Faq[]
    style?: React.CSSProperties
}

const DEFAULT_FAQS: Faq[] = [
    { q: "How do the live courses work?", a: "Each course is a small live group of up to 15 people. AI Starter is 3 weekly sessions (90 min, 90 min, then a 60 min live clinic). AI at Work is 4 weekly sessions of 90 min. You practise in small breakout rooms on your own real tasks, and there's a private group chat between sessions." },
    { q: "Where do the sessions happen?", a: "Live on Zoom, in English. All times are Israel time (IST). You'll need a laptop. A phone alone isn't enough for the hands-on parts." },
    { q: "What if I need to cancel?", a: "You can cancel a booking made on this site within 14 days, in line with the Israeli Consumer Protection Law rules for distance transactions. If something comes up, just write to me. Full details are in the Terms." },
    { q: "How does the level check work?", a: "It's 12 short questions and takes about 3 minutes. Your answers give a score out of 30 that places you at Beginner, Intermediate, Advanced or Expert, and you'll see the group that fits you right away." },
    { q: "Do you build things for companies?", a: "Yes. I design and build AI workflows and assistants for teams. We start with a free 20 minute discovery call, then you get a fixed quote. Everything is set up in your own accounts, so you own it." },
]

const DEFAULT_ABOUT =
    "I'm Jordana Young. I'm part of the Microsoft team building Copilot Studio, the tool companies use to build their own AI agents. Before that I spent 20+ years shaping products and customer experiences at Microsoft, Meta, HoneyBook and SodaStream. I've watched thousands of people try AI for the first time, and I know where they get stuck. My courses skip the jargon and focus on what you actually do every week, so every session moves you a couple of steps further."

function shade(hex: string, factor: number) {
    const h = hex.replace("#", "")
    if (h.length !== 6) return hex
    const n = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * factor))
    return "#" + n.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function WorkflowBuildsAndAbout(props: Props) {
    const {
        primaryColor = "#14213D",
        accentColor = "#C86D2D",
        creamColor = "#FAF8F5",
        showBuilds = true,
        showAbout = true,
        showFaq = true,
        webhookUrl = "",
        discoveryCallUrl = "",
        linkedinUrl = "https://www.linkedin.com/in/jordana-young",
        privacyUrl = "/privacy",
        aboutBody = DEFAULT_ABOUT,
        faqs = DEFAULT_FAQS,
        style,
    } = props
    const accentDark = shade(accentColor, 0.84)
    const [f, setF] = React.useState({ name: "", email: "", company: "", teamSize: "", description: "" })
    const [state, setState] = React.useState<"idle" | "sending" | "done" | "error">("idle")
    const [err, setErr] = React.useState("")
    const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value })

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!f.name.trim() || !f.company.trim() || !f.teamSize || !f.description.trim()) return setErr("Please fill in every field so I can prepare for our call.")
        if (!EMAIL_RE.test(f.email.trim())) return setErr("Please check your work email address.")
        setErr("")
        const payload = {
            event: "b2b_quote",
            name: f.name.trim(),
            workEmail: f.email.trim(),
            company: f.company.trim(),
            teamSize: f.teamSize,
            workflowDescription: f.description.trim(),
            submittedAt: new Date().toISOString(),
            timezone: "Asia/Jerusalem",
            page: typeof window !== "undefined" ? window.location.pathname : "",
        }
        if (!webhookUrl) return setState("done")
        setState("sending")
        try {
            const res = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
            setState(res.ok ? "done" : "error")
        } catch {
            setState("error")
        }
    }

    const css = `
.jy-wb { container-type: inline-size; }
.jy-wb a:focus-visible, .jy-wb button:focus-visible, .jy-wb input:focus-visible, .jy-wb select:focus-visible, .jy-wb textarea:focus-visible, .jy-wb summary:focus-visible { outline: 3px solid ${accentColor}; outline-offset: 2px; }
.jy-btn { display: inline-block; text-decoration: none; font-weight: 600; font-size: 16px; padding: 13px 22px; border-radius: 999px; border: 0; cursor: pointer; }
.jy-btn-primary { background: ${accentDark}; color: #FFFFFF; }
.jy-btn-primary:hover { background: ${primaryColor}; }
.jy-btn-ghost { border: 1.5px solid ${primaryColor}; color: ${primaryColor}; background: transparent; }
.jy-input { width: 100%; box-sizing: border-box; font-size: 16px; padding: 12px 14px; border-radius: 10px; border: 1.5px solid #6B7385; background: #FFFFFF; color: ${primaryColor}; font-family: inherit; }
.jy-split { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.jy-two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.jy-faq summary { cursor: pointer; font-weight: 600; font-size: 17.5px; padding: 16px 0; list-style-position: outside; }
@container (max-width: 820px) {
  .jy-split, .jy-two { grid-template-columns: 1fr; gap: 24px; }
  .jy-wb-inner { padding: 56px 20px !important; }
}
`
    const label: React.CSSProperties = { display: "block", fontSize: 14.5, fontWeight: 600, marginBottom: 6 }
    const h2: React.CSSProperties = { margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 38, lineHeight: 1.15 }

    return (
        <div className="jy-wb" style={{ ...style, width: "100%", color: primaryColor, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
            <style>{css}</style>

            {showBuilds && (
                <section id="workflows" aria-labelledby="jy-wb-title" style={{ background: "#FFFFFF" }}>
                    <div className="jy-wb-inner jy-split" style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px", boxSizing: "border-box" }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accentDark }}>For companies and organisations</p>
                            <h2 id="jy-wb-title" style={{ ...h2, marginTop: 10 }}>Custom AI workflow builds</h2>
                            <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.55, color: "#2B3550" }}>
                                I design and build AI workflows and assistants around how your team already works. Think an intake assistant that answers the same 30 questions, a weekly report that writes its own first draft, or a flow that turns meeting notes into tasks.
                            </p>
                            <ol style={{ margin: "20px 0 0", paddingLeft: 22, fontSize: 16.5, lineHeight: 1.65 }}>
                                <li>A free 20 minute discovery call about your process.</li>
                                <li>A fixed quote with the scope, timeline and what you'll get.</li>
                                <li>I build it in your own accounts, test it with your team and hand it over with a short guide.</li>
                            </ol>
                            <p style={{ margin: "18px 0 0", fontSize: 15.5 }}>
                                Want to know who you'd be working with? <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor, fontWeight: 600 }}>See my LinkedIn</a>.
                            </p>
                            {discoveryCallUrl && (
                                <a className="jy-btn jy-btn-ghost" href={discoveryCallUrl} style={{ marginTop: 18 }}>Book the 20 minute call</a>
                            )}
                        </div>
                        <div style={{ background: creamColor, borderRadius: 20, padding: 28, border: "1px solid rgba(20,33,61,0.1)" }}>
                            <h3 id="jy-quote-title" style={{ margin: 0, fontSize: 22 }}>Ask for a quote</h3>
                            {state === "done" ? (
                                <p role="status" style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.5, fontWeight: 600 }}>
                                    Thanks, {f.name.trim().split(" ")[0] || "and talk soon"}. I'll reply within 2 working days to set up our 20 minute call.
                                </p>
                            ) : (
                                <form onSubmit={submit} aria-labelledby="jy-quote-title" noValidate style={{ marginTop: 16, display: "grid", gap: 14 }}>
                                    <div className="jy-two">
                                        <div>
                                            <label htmlFor="jy-q-name" style={label}>Name</label>
                                            <input id="jy-q-name" className="jy-input" autoComplete="name" required value={f.name} onChange={set("name")} />
                                        </div>
                                        <div>
                                            <label htmlFor="jy-q-email" style={label}>Work email</label>
                                            <input id="jy-q-email" className="jy-input" type="email" autoComplete="email" required value={f.email} onChange={set("email")} />
                                        </div>
                                        <div>
                                            <label htmlFor="jy-q-company" style={label}>Company</label>
                                            <input id="jy-q-company" className="jy-input" autoComplete="organization" required value={f.company} onChange={set("company")} />
                                        </div>
                                        <div>
                                            <label htmlFor="jy-q-team" style={label}>Team size</label>
                                            <select id="jy-q-team" className="jy-input" required value={f.teamSize} onChange={set("teamSize")}>
                                                <option value="">Choose one</option>
                                                <option>1 to 5</option>
                                                <option>6 to 20</option>
                                                <option>21 to 50</option>
                                                <option>51 to 200</option>
                                                <option>200+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="jy-q-desc" style={label}>Workflow description</label>
                                        <textarea id="jy-q-desc" className="jy-input" rows={5} required value={f.description} onChange={set("description")} aria-describedby="jy-q-desc-hint" />
                                        <span id="jy-q-desc-hint" style={{ fontSize: 13.5, color: "#4A5468" }}>What happens today, who does it, and what would "done" look like?</span>
                                    </div>
                                    {err && <p role="alert" style={{ margin: 0, color: "#A1260F", fontWeight: 600 }}>{err}</p>}
                                    {state === "error" && <p role="alert" style={{ margin: 0, color: "#A1260F", fontWeight: 600 }}>Sorry, that didn't go through. Please try again in a moment.</p>}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                                        <button type="submit" className="jy-btn jy-btn-primary" disabled={state === "sending"}>{state === "sending" ? "Sending..." : state === "error" ? "Try again" : "Send my request"}</button>
                                        <span style={{ fontSize: 13.5, color: "#4A5468" }}>Used only to reply to you. <a href={privacyUrl} style={{ color: primaryColor }}>Privacy policy</a>.</span>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {showAbout && (
                <section id="about" aria-labelledby="jy-about-title" style={{ background: creamColor }}>
                    <div className="jy-wb-inner" style={{ maxWidth: 820, margin: "0 auto", padding: "80px 24px", boxSizing: "border-box" }}>
                        <h2 id="jy-about-title" style={h2}>Hi, I'm Jordana</h2>
                        <p style={{ margin: "16px 0 0", fontSize: 18, lineHeight: 1.65, color: "#2B3550" }}>{aboutBody}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
                            <a className="jy-btn jy-btn-primary" href="/#quiz">Check your AI level</a>
                            <a className="jy-btn jy-btn-ghost" href={linkedinUrl} target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
                        </div>
                    </div>
                </section>
            )}

            {showFaq && (
                <section id="faq" aria-labelledby="jy-faq-title" style={{ background: "#FFFFFF" }}>
                    <div className="jy-wb-inner" style={{ maxWidth: 820, margin: "0 auto", padding: "80px 24px", boxSizing: "border-box" }}>
                        <h2 id="jy-faq-title" style={h2}>Questions people ask</h2>
                        <div className="jy-faq" style={{ marginTop: 18 }}>
                            {(faqs && faqs.length ? faqs : DEFAULT_FAQS).map((item) => (
                                <details key={item.q} style={{ borderBottom: "1px solid rgba(20,33,61,0.15)" }}>
                                    <summary>{item.q}</summary>
                                    <p style={{ margin: "0 0 18px", fontSize: 16.5, lineHeight: 1.6, color: "#2B3550" }}>{item.a}</p>
                                </details>
                            ))}
                        </div>
                        <p style={{ margin: "24px 0 0", fontSize: 16.5 }}>
                            Still wondering? <a href="/#quiz" style={{ color: primaryColor, fontWeight: 700 }}>Start with the 3 minute level check</a>, it answers most of them.
                        </p>
                    </div>
                </section>
            )}
        </div>
    )
}

addPropertyControls(WorkflowBuildsAndAbout, {
    webhookUrl: { type: ControlType.String, title: "Webhook URL", defaultValue: "", placeholder: "Paste the n8n webhook URL" },
    discoveryCallUrl: { type: ControlType.String, title: "Discovery call URL", defaultValue: "", placeholder: "Cal.com or Calendly link" },
    linkedinUrl: { type: ControlType.String, title: "LinkedIn", defaultValue: "https://www.linkedin.com/in/jordana-young" },
    showBuilds: { type: ControlType.Boolean, title: "Builds", defaultValue: true },
    showAbout: { type: ControlType.Boolean, title: "About", defaultValue: true },
    showFaq: { type: ControlType.Boolean, title: "FAQ", defaultValue: true },
    aboutBody: { type: ControlType.String, title: "About text", displayTextArea: true, defaultValue: DEFAULT_ABOUT },
    faqs: {
        type: ControlType.Array,
        title: "FAQ",
        control: { type: ControlType.Object, controls: { q: { type: ControlType.String, title: "Question" }, a: { type: ControlType.String, title: "Answer", displayTextArea: true } } },
        defaultValue: DEFAULT_FAQS,
    },
    privacyUrl: { type: ControlType.String, title: "Privacy URL", defaultValue: "/privacy" },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#C86D2D" },
    creamColor: { type: ControlType.Color, title: "Cream", defaultValue: "#FAF8F5" },
})
