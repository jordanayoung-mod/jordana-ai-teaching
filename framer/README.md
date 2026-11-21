# Framer build: Jordana Young AI Teaching

This folder holds the source for the Framer version of the site, so it can be rebuilt or reviewed outside Framer.

- Framer project: https://framer.com/projects/lTK8S4qQiYAep9vvRApl ("Jordana Young AI Teaching", in Jordana's Workspace)
- Not published yet. Publish from Framer when the links below are filled in.

## What's here

| Path | What it is |
|---|---|
| `components/*.tsx` | The 7 Framer code components, exactly as they are in the project |
| `cms/cohorts.json` | Seed rows for the **Cohorts** collection (3 December runs, plus hidden Advanced and Expert rows) |
| `cms/playbook.json` | Seed rows for the **Playbook** collection (one starter guide per use case) |
| `cms/reviews.json` | **Reviews** collection fields. Empty on purpose: add real reviews only |
| `pages/site-map.md` | Every page, its sections and anchors, in order |
| `pages/privacy.md`, `pages/terms.md` | Legal page copy (drafts for an Israeli lawyer to review) |

## Rebuild from scratch

1. Create a new Framer project. Add a **Site Layout** layout template: a vertical stack with gap 0 and cream fill (`#FAF8F5`), with `SiteHeader` on top (position sticky, top 0), the page placeholder, then `SiteFooterAndLegal`.
2. In Assets > Code, create one file per component in `components/` with the same file name and paste the source.
3. Create the CMS collections with these fields:
   - **Cohorts**: Title (text), Slug, Level (option: Beginner, Intermediate, Advanced, Expert), Day (text), Schedule Details (text), Price (number, 600), Seats Remaining (number, 15), Status (option: Waitlist, Open, Full), Visible (toggle), Promise (text), Payment Link (link).
   - **Playbook**: Title, Slug, Level (option), Use Case (option: Work Productivity, Writing, Research, Images, Agents & Automation, AI at Home), Summary, Prompt Template, Read Time (number).
   - **Reviews**: Student Name, Slug, Role, Quote, Approved (toggle, off by default).
   Then import the rows from `cms/`.
4. Build the pages listed in `pages/site-map.md`. Every page uses the Site Layout template and has a Desktop (1200px) and Phone (390px) breakpoint.

## Things to paste in before publishing

| Where | Property | What to paste |
|---|---|---|
| `AILevelQuiz` (Home and /assessment) | Webhook URL | n8n production webhook for `POST /jordana-ops-agent` |
| `OfferingsAndCohorts` (both waitlist instances, Home and /cohorts) | Webhook URL | same n8n webhook |
| `WorkflowBuildsAndAbout` (Home, /company-builds) | Webhook URL | same n8n webhook |
| `WorkflowBuildsAndAbout` | Discovery call URL | Cal.com or Calendly link for the 20 minute call (optional) |
| `ScarcityTierWidget` (Home, /coaching) | Booking URL, Pay link ₪400 to ₪1,200 | PayPlus, Grow or Cardcom payment pages, or the booking link |
| `ScarcityTierWidget` | Booked count or Count JSON URL | live number of 1:1 sessions sold (JSON shape `{"bookedCount": 0}`) |
| `AILevelQuiz` | Starter pay URL, Work pay URL, seats, status | cohort payment pages once dates are set |
| CMS **Cohorts** | Payment Link, Seats Remaining, Status, Schedule Details | per run, once dates and payment pages exist |
| `SiteFooterAndLegal` | Contact email | public email address |

Every webhook property is empty by default. While it's empty the forms still show their success message, so the site can be previewed safely.

## Webhook payloads

All forms send `POST` with a JSON body and `Content-Type: application/json`.

- `quiz_lead`: firstName, email, marketingConsent, score, level, rawLevel, capRuleApplied, bumpRuleApplied, answers[] (question, answer, points), q11, track, submittedAt, timezone, page
- `waitlist_join`: firstName, email, cohort, level, marketingConsent, submittedAt, timezone, page
- `b2b_quote`: name, workEmail, company, teamSize, workflowDescription, submittedAt, timezone, page

The waitlist and quote forms only show success when the POST returns 2xx (or when no webhook is set). Otherwise they show a friendly "please try again" message.

## Scoring (AILevelQuiz)

Q1 to Q10 score 0, 1, 2, 3 in the order listed (max 30). 0 to 7 Beginner, 8 to 15 Intermediate, 16 to 23 Advanced, 24 to 30 Expert. "I haven't tried it yet." on Q1 caps the result at Beginner. "Agents and automation" on Q12 with a score of 12 or more moves the result up one level. The **Preview** property shows any results screen on the canvas. Set it back to **Live** before publishing.

## Brand rules the copy follows

English only, prices in ILS (₪), times in Israel time. No em dashes or en dashes. None of the banned buzzwords. Never the titles "Senior Researcher" or "User Researcher". No LetsGo badge. The Microsoft independence disclaimer is in the footer and the Terms. Advanced and Expert cohorts stay hidden (Visible off) until Q1 2027.
