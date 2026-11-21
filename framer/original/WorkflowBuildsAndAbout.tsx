import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

const PLAYBOOK_ITEMS = [
    {
        level: "Beginner",
        useCase: "Writing",
        title: "The 3-Part Email Prompt That Never Sounds Robotic",
        summary: "Stop getting stiff replies. Give AI your role, context, and two real examples of how you write.",
    },
    {
        level: "Beginner",
        useCase: "AI at Home",
        title: "Turn a Messy Fridge Photo Into a 4-Day Dinner Plan",
        summary: "Snap a quick photo of what is in your kitchen and get a practical meal plan plus a grouped shopping list.",
    },
    {
        level: "Intermediate",
        useCase: "Work Productivity",
        title: "Meeting Transcript to Action Table in 15 Seconds",
        summary: "A copy-and-paste instruction that extracts decisions, owners, and open questions from any call transcript.",
    },
    {
        level: "Intermediate",
        useCase: "Research",
        title: "How to Spot When AI Is Guessing",
        summary: "Three verification prompts to keep AI honest when summarizing PDFs or comparing quotes.",
    },
]

export default function WorkflowBuildsAndAbout(props) {
    const { primaryColor, accentColor, linkedinUrl, webhookUrl, quizUrl } = props
    const [b2bName, setB2bName] = useState("")
    const [b2bEmail, setB2bEmail] = useState("")
    const [b2bCompany, setB2bCompany] = useState("")
    const [b2bSize, setB2bSize] = useState("1-10")
    const [b2bTask, setB2bTask] = useState("")
    const [b2bConsent, setB2bConsent] = useState(false)
    const [b2bSent, setB2bSent] = useState(false)

    const [filterLevel, setFilterLevel] = useState("ALL")
    const [filterUseCase, setFilterUseCase] = useState("ALL")

    const handleB2bSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        event_type: "b2b_quote",
                        name: b2bName,
                        email: b2bEmail,
                        company: b2bCompany,
                        teamSize: b2bSize,
                        taskDescription: b2bTask,
                        marketingConsent: b2bConsent,
                    }),
                })
            } catch (err) {
                console.error(err)
            }
        }
        setB2bSent(true)
    }

    const filteredPlaybook = PLAYBOOK_ITEMS.filter(
        (p) => (filterLevel === "ALL" || p.level === filterLevel) && (filterUseCase === "ALL" || p.useCase === filterUseCase)
    )

    return (
        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1D2432" }}>
            <section id="workflows" style={{ background: "#FAF8F5", padding: "72px 20px" }}>
                <div
                    style={{
                        maxWidth: 1120,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: 36,
                        alignItems: "start",
                    }}
                >
                    <div>
                        <span style={{ background: "#FDF0E6", color: accentColor, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
                            DONE-FOR-YOU BUILDS
                        </span>
                        <h2 style={{ fontSize: 32, color: primaryColor, margin: "12px 0 16px" }}>
                            I'll build custom AI workflows for your organization or company
                        </h2>
                        <p style={{ fontSize: 17, lineHeight: 1.6, color: "#4A5568" }}>
                            Stop paying for AI tools that sit unused. Tell me where your team loses hours every week, and I'll design, build, and test a working AI workflow tailored to your exact process.
                        </p>
                        <ul style={{ paddingLeft: 20, lineHeight: 1.7, margin: "20px 0" }}>
                            <li>
                                <strong>Customer & Client Operations:</strong> Turn raw call notes, emails, or intake forms into clean summaries and follow-up drafts.
                            </li>
                            <li>
                                <strong>Internal Knowledge Assistants:</strong> Custom assistants grounded in your company SOPs and documents so staff get instant answers.
                            </li>
                            <li>
                                <strong>Weekly Reporting & Research:</strong> Automate repetitive data cleanup and weekly status updates.
                            </li>
                        </ul>
                        <p style={{ fontSize: 15, color: "#4A5568" }}>
                            Want to review my background first?{" "}
                            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor, fontWeight: 600 }}>
                                View my profile on LinkedIn &nearr;
                            </a>
                        </p>
                    </div>

                    <div style={{ background: "#FFFFFF", border: "1px solid #E2DFD9", borderRadius: 12, padding: 28 }}>
                        {b2bSent ? (
                            <div>
                                <h3 style={{ color: primaryColor, margin: "0 0 10px" }}>Thanks for reaching out!</h3>
                                <p style={{ lineHeight: 1.6, margin: 0 }}>
                                    I've received your details for <strong>{b2bCompany}</strong> and will reply within one business day to schedule our 20-minute discovery call and put together your quote.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleB2bSubmit}>
                                <h3 style={{ fontSize: 22, color: primaryColor, margin: "0 0 8px" }}>
                                    Contact me for a discovery call and quote
                                </h3>
                                <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 18 }}>
                                    I reply within one business day to set up a 20-minute discovery call.
                                </p>
                                <input
                                    type="text"
                                    required
                                    placeholder="Full Name *"
                                    value={b2bName}
                                    onChange={(e) => setB2bName(e.target.value)}
                                    style={{ width: "100%", padding: 11, borderRadius: 6, border: "1px solid #B8B4AC", marginBottom: 12, fontSize: 15 }}
                                />
                                <input
                                    type="email"
                                    required
                                    placeholder="Work Email *"
                                    value={b2bEmail}
                                    onChange={(e) => setB2bEmail(e.target.value)}
                                    style={{ width: "100%", padding: 11, borderRadius: 6, border: "1px solid #B8B4AC", marginBottom: 12, fontSize: 15 }}
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Company or Organization Name *"
                                    value={b2bCompany}
                                    onChange={(e) => setB2bCompany(e.target.value)}
                                    style={{ width: "100%", padding: 11, borderRadius: 6, border: "1px solid #B8B4AC", marginBottom: 12, fontSize: 15 }}
                                />
                                <select
                                    value={b2bSize}
                                    onChange={(e) => setB2bSize(e.target.value)}
                                    aria-label="Team Size"
                                    style={{ width: "100%", padding: 11, borderRadius: 6, border: "1px solid #B8B4AC", marginBottom: 12, fontSize: 15 }}
                                >
                                    <option value="1-10">Team Size: 1 to 10 people</option>
                                    <option value="11-50">Team Size: 11 to 50 people</option>
                                    <option value="51-200">Team Size: 51 to 200 people</option>
                                    <option value="200+">Team Size: 200+ people</option>
                                </select>
                                <textarea
                                    rows={3}
                                    required
                                    placeholder="What workflow or repetitive task would you like me to build? *"
                                    value={b2bTask}
                                    onChange={(e) => setB2bTask(e.target.value)}
                                    style={{ width: "100%", padding: 11, borderRadius: 6, border: "1px solid #B8B4AC", marginBottom: 12, fontSize: 15 }}
                                />
                                <label style={{ display: "flex", gap: 10, fontSize: 14, color: "#4A5568", marginBottom: 16 }}>
                                    <input type="checkbox" checked={b2bConsent} onChange={(e) => setB2bConsent(e.target.checked)} style={{ marginTop: 3 }} />
                                    <span>Send me occasional practical AI workflow ideas for companies.</span>
                                </label>
                                <button
                                    type="submit"
                                    style={{
                                        width: "100%",
                                        background: accentColor,
                                        color: "#FFFFFF",
                                        padding: 13,
                                        border: "none",
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        cursor: "pointer",
                                    }}
                                >
                                    Request Discovery Call & Quote
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <section id="about" style={{ background: "#FFFFFF", padding: "72px 20px" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h2 style={{ fontSize: 32, color: primaryColor, margin: "0 0 18px" }}>
                        Why learn from someone who builds AI tools for real people?
                    </h2>
                    <p style={{ fontSize: 17, lineHeight: 1.7, color: "#1D2432" }}>
                        Most AI training is taught by engineers who love showing off complicated features, or marketers selling hype. I focus on what actually works for busy people.
                    </p>
                    <p style={{ fontSize: 17, lineHeight: 1.7, color: "#1D2432" }}>
                        For more than 20 years, I have helped shape digital products and customer experiences at companies like Microsoft and Meta, as well as HoneyBook and SodaStream. Today, I am part of the Microsoft team building Copilot Studio, Microsoft's AI agent builder, where I see firsthand what makes AI genuinely useful and where people get stuck.
                    </p>
                    <p style={{ fontSize: 17, lineHeight: 1.7, color: "#1D2432", marginBottom: 28 }}>
                        You do not need to learn how to code or memorize technical terms. Whether I am teaching you in a live session or building a custom workflow for your company, my goal is simple: give you practical tools that save real hours every week.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                        <a
                            href={quizUrl}
                            style={{
                                background: accentColor,
                                color: "#FFFFFF",
                                padding: "13px 24px",
                                borderRadius: 8,
                                fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >
                            See which level fits you best
                        </a>
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: "#FFFFFF",
                                color: primaryColor,
                                border: `2px solid ${primaryColor}`,
                                padding: "11px 22px",
                                borderRadius: 8,
                                fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >
                            View my background on LinkedIn &nearr;
                        </a>
                    </div>
                </div>
            </section>

            <section id="library" style={{ background: "#FAF8F5", padding: "72px 20px" }}>
                <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                    <div style={{ maxWidth: 680, marginBottom: 28 }}>
                        <h2 style={{ fontSize: 32, color: primaryColor, margin: "0 0 10px" }}>The Practical AI Playbook</h2>
                        <p style={{ fontSize: 17, color: "#4A5568", margin: 0 }}>
                            Bite-sized guides and tested templates organized by skill level and everyday use case.
                        </p>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            aria-label="Filter by skill level"
                            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #B8B4AC", fontSize: 15 }}
                        >
                            <option value="ALL">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                        </select>
                        <select
                            value={filterUseCase}
                            onChange={(e) => setFilterUseCase(e.target.value)}
                            aria-label="Filter by topic"
                            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #B8B4AC", fontSize: 15 }}
                        >
                            <option value="ALL">All Topics</option>
                            <option value="Work Productivity">Work Productivity</option>
                            <option value="Writing">Writing</option>
                            <option value="Research">Research</option>
                            <option value="AI at Home">AI at Home</option>
                        </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                        {filteredPlaybook.map((item, idx) => (
                            <div key={idx} style={{ background: "#FFFFFF", border: "1px solid #E2DFD9", borderRadius: 10, padding: 24 }}>
                                <span style={{ background: "#FDF0E6", color: accentColor, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
                                    {item.level} &bull; {item.useCase}
                                </span>
                                <h3 style={{ fontSize: 19, color: primaryColor, margin: "12px 0 8px" }}>{item.title}</h3>
                                <p style={{ fontSize: 15, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>{item.summary}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 28 }}>
                        <a href={quizUrl} style={{ color: primaryColor, fontWeight: 700, fontSize: 17 }}>
                            Want live feedback while you build these habits? Find your level &rarr;
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

addPropertyControls(WorkflowBuildsAndAbout, {
    primaryColor: { type: ControlType.Color, title: "Primary Navy", defaultValue: "#14213D" },
    accentColor: { type: ControlType.Color, title: "Accent Amber", defaultValue: "#C86D2D" },
    linkedinUrl: { type: ControlType.String, title: "LinkedIn URL", defaultValue: "https://www.linkedin.com/in/jordana-young" },
    webhookUrl: { type: ControlType.String, title: "n8n Webhook URL", defaultValue: "" },
    quizUrl: { type: ControlType.String, title: "Quiz Anchor or URL", defaultValue: "#quiz" },
})
