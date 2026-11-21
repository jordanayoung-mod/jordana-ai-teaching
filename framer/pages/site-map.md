# Site map and page copy

All visible copy for the code components lives in the component files (and their property controls) in `../components/`. This page lists what each Framer page contains, in order.

Every page uses the **Site Layout** layout template: `SiteHeader` (sticky) at the top, the page content, then `SiteFooterAndLegal`.

## Home (`/`)
Single vertical stack, gap 0, 1200px desktop breakpoint, plus a 390px phone breakpoint.

1. `HeroAndOutcomes`: hero (headline "I help shape Microsoft's AI agent builder. Now I'll help you put AI to work.", subhead, core promise "Every engagement moves you a couple of steps further so you feel you got clear value for your money.", credentials line, CTAs) and the tabbed `#before-after` section.
2. `OfferingsAndCohorts` (cohorts section off): `#ways-to-work`, three offer cards.
3. Canvas section `#cohorts`: heading, intro and a CMS Collection List of the **Cohorts** collection, filtered to Visible = Yes (live Seats Remaining and Status).
4. `OfferingsAndCohorts` (header and cards off): the priority waitlist form, posts `waitlist_join`.
5. Section `#coaching`: `ScarcityTierWidget`.
6. Section `#quiz`: `AILevelQuiz`.
7. `WorkflowBuildsAndAbout`: `#workflows` (quote form, posts `b2b_quote`), `#about` (LinkedIn), `#faq`.
8. Reviews strip: CMS Collection List of **Reviews** filtered to Approved = Yes. Renders nothing while there are no approved reviews.

## Assessment (`/assessment`)
Section `#quiz` with `AILevelQuiz` (links point to /cohorts, /coaching, /company-builds).

## Cohorts (`/cohorts`)
Canvas `#cohorts` section with the CMS cohort cards (H1 "December 2026 cohorts"), then the `OfferingsAndCohorts` waitlist form.

## 1:1 Coaching (`/coaching`)
Section `#coaching` with `ScarcityTierWidget`: 5 tiers of 8 (400 / 600 / 750 / 950 / 1,200 ILS), hours Sunday to Thursday 11:00 to 20:00 IST, lunch 12:00 to 12:30 every open day and Mondays also blocked 16:30 to 18:30, bookings open the week of Sunday 29 November 2026.

## Company Builds (`/company-builds`)
`WorkflowBuildsAndAbout` with About and FAQ off: the builds pitch, LinkedIn link and the quote form (Name, Work email, Company, Team size, Workflow description).

## Playbook (`/playbook`)
Canvas section `#library`: H1 "The Playbook", intro, CMS grid of the **Playbook** collection (use case, level, title, summary, prompt template, read time), CTA "Check your AI level".

## About (`/about`)
`WorkflowBuildsAndAbout` with Builds and FAQ off: bio, "Check your AI level" and "Connect on LinkedIn".

## Privacy (`/privacy`) and Terms (`/terms`)
See `privacy.md` and `terms.md`. Both are drafts for an Israeli lawyer to review.
