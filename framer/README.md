# Framer build: Jordana Young AI Teaching

This folder holds the source for the Framer version of the site, so it can be rebuilt or reviewed outside Framer.

- Framer project: https://framer.com/projects/lTK8S4qQiYAep9vvRApl ("Jordana Young AI Teaching", in Jordana's Workspace)
- Not published yet. Publish from Framer when the links below are filled in.

## What's here

| Path | What it is |
|---|---|
| `original/*.tsx` | Jordana's 7 components exactly as she wrote them |
| `components/*.tsx` | The same 7 components with the fixes listed below. This is what runs in the Framer project |
| `cms/cohorts.json` | **Cohorts** collection rows (3 December runs, plus hidden Advanced and Expert rows), copy aligned with `../docs/curricula-prep-playbook.md` |
| `cms/playbook.json` | **Playbook** collection rows: the 6 starter modules from the curricula doc |
| `cms/reviews.json` | **Reviews** collection fields. Empty on purpose: add real reviews only |
| `pages/site-map.md` | Every page, its sections and anchors, in order |
| `pages/privacy.md`, `pages/terms.md` | Legal page copy (drafts for an Israeli lawyer to review) |

## Changes made to Jordana's components

Her copy and design are kept. Only these changes were made:

- **All components:** amber stays `#C86D2D` for borders, bars and lines. Where amber sat behind white text or was used as small text on light backgrounds it failed WCAG AA (about 3.7:1), so those spots use a darker shade of the same amber (`#965222`, 5.9:1 with white). Input borders went from `#B8B4AC` to `#8A857C` so the field edges reach 3:1. `@framerSupportedLayoutWidth/Height` annotations added so instances can stretch to the page width.
- **SiteHeader:** below 768px the Menu button shows and the nav collapses; the open menu stacks the links, and tapping a link closes it. Links point at `/#section` (and `/playbook#library`) so they work from every page.
- **HeroAndOutcomes:** adds the core promise line, "Every engagement moves you a couple of steps further so you feel you got clear value for your money." (editable Core Promise property). Tabs get tab and tabpanel wiring for screen readers.
- **OfferingsAndCohorts:** new switches (Ways to Work, Cohorts Heading, Built-in Cohort Cards, Waitlist Form) so Home and /cohorts can show the CMS cohort cards on the canvas between her heading and her waitlist form. When her built-in cards are off, the waitlist form stays open with a "Which group?" picker. Fields have labels for screen readers, success shows only when the webhook answers OK (or no webhook is set), otherwise a "try again" message. Consent stays unchecked.
- **ScarcityTierWidget:** her tiers (400 / 600 / 750 / 950 / 1,200 ILS, 8 slots each) are unchanged. The hours line now also lists the breaks (12:00 to 12:30 every day, Mondays 16:30 to 18:30).
- **AILevelQuiz:** "unlock" in the lead form copy became "see". Results show seat counts from new properties (Beginner Seats Left, Intermediate Seats Left, Seats per Group). Advanced and Expert results also get a "Join the priority waitlist for the 2027 cohort" link. The lead form saves before showing results; if the webhook fails, answers are kept and a retry message shows. New Section ID property (cleared where a canvas section already carries `#quiz`) and a Canvas Preview property for checking the results screens (keep it on "Live quiz").
- **WorkflowBuildsAndAbout:** switches for each part (Workflow Builds, About, Built-in Playbook, FAQ). Adds an FAQ section (6 questions, built from facts already on the site) ending with a link to the level check. The quote form gets labels for screen readers and the same success/retry handling. `&nearr;` showed as raw text in Framer, so it's now the ↗ character.
- **SiteFooterAndLegal:** links point at `/#section` so they work from every page; the legal panels link to the full /privacy and /terms pages; the toggles report open/closed state; `&nearr;` fixed as above.

## Home order

SiteHeader (layout template), HeroAndOutcomes, OfferingsAndCohorts (ways to work and the `#cohorts` heading), CMS cohort cards, OfferingsAndCohorts (waitlist form), ScarcityTierWidget (`#coaching`), canvas section `#quiz` with AILevelQuiz, WorkflowBuildsAndAbout (`#workflows`, `#about`), CMS Playbook (`#library`), WorkflowBuildsAndAbout (`#faq`), Reviews strip (CMS, Approved only, empty until real reviews exist), SiteFooterAndLegal (layout template).

## Things to paste in before publishing

| Where | Property | What to paste |
|---|---|---|
| `AILevelQuiz`, `OfferingsAndCohorts`, `WorkflowBuildsAndAbout` (every instance) | n8n Webhook URL | the n8n production URL for `POST /jordana-ops-agent` (see `../n8n/README.md`) |
| `ScarcityTierWidget` (Home, /coaching) | Booking URL | booking or payment page (default `#book-calendar` is a placeholder) |
| `ScarcityTierWidget` | Booked Count or Live Inventory URL | number of 1:1 sessions sold so far, or a JSON URL |
| `AILevelQuiz` | Beginner / Intermediate Seats Left | seats left per group |
| CMS **Cohorts** | Payment Link, Seats Remaining, Status, Schedule Details | per run, once dates and payment pages exist |
| `SiteFooterAndLegal` | Contact Email | public email address (default is her Gmail) |

Every webhook property is empty for now. While it's empty the forms show their success message, so the site can be previewed safely.

## Webhook payloads (her field names)

All forms `POST` JSON with `Content-Type: application/json`, keyed by `event_type`:

- `quiz_lead`: name, email, level, score, q11, q12, marketingConsent
- `waitlist_join`: name, email, cohort, marketingConsent
- `b2b_quote`: name, email, company, teamSize, taskDescription, marketingConsent

`payment_confirmed` comes from the payment gateway into n8n, not from the site.

## Scoring (her AILevelQuiz)

Q1 to Q10 add up to a score out of 30: 0 to 7 Beginner, 8 to 15 Intermediate, 16 to 23 Advanced, 24 or more Expert. "Agents and automation" on Q12 with 12 or more moves the result up one level. The Q1 "haven't tried it" answer caps the result at Beginner, and the cap wins over the bump.

## Brand rules the copy follows

English only, prices in ILS, times in Israel time. No em dashes or en dashes. None of the banned buzzwords. Never the titles "Senior Researcher" or "User Researcher". No LetsGo badge. The Microsoft independence disclaimer is in the footer. Advanced and Expert cohorts stay hidden (Visible off) until Q1 2027.
