# Site map and page copy

All visible copy for the code components lives in the component files (and their property controls) in `../components/`. This page lists what each Framer page contains, in order.

Every page uses the **Site Layout** layout template: `SiteHeader` (sticky) at the top, the page content, then `SiteFooterAndLegal`.

## Home (`/`)
Single vertical stack, gap 0, 1200px desktop breakpoint, plus a 390px phone breakpoint.

1. `HeroAndOutcomes`: hero (`#top`, with the core promise line) and the tabbed `#before-after` section.
2. `OfferingsAndCohorts` (cards and waitlist off): `#ways-to-work` and the `#cohorts` heading.
3. CMS Collection List of **Cohorts**, filtered to Visible = Yes, styled like her cards.
4. `OfferingsAndCohorts` (waitlist only): priority waitlist form with a group picker, posts `waitlist_join`.
5. `ScarcityTierWidget`: its own `#coaching` section.
6. Canvas section `#quiz` with `AILevelQuiz` (component Section ID cleared to avoid a duplicate id).
7. `WorkflowBuildsAndAbout` (Playbook and FAQ off): `#workflows` (quote form, posts `b2b_quote`) and `#about`.
8. CMS Playbook section `#library` (6 modules).
9. `WorkflowBuildsAndAbout` (FAQ only): `#faq`.
10. Reviews strip: CMS **Reviews** filtered to Approved = Yes. Renders nothing while there are no approved reviews.

## Assessment (`/assessment`)
Section `#quiz` with `AILevelQuiz` (links point to /cohorts, /coaching, /company-builds).

## Cohorts (`/cohorts`)
Canvas `#cohorts` section with the CMS cohort cards (H1 "December 2026 cohorts", 32px on phone), then `OfferingsAndCohorts` in waitlist-only mode.

## 1:1 Coaching (`/coaching`)
`ScarcityTierWidget` (renders `#coaching`): 5 tiers of 8 (400 / 600 / 750 / 950 / 1,200 ILS), hours Sunday to Thursday 11:00 to 20:00 IST, lunch 12:00 to 12:30 every open day and Mondays also blocked 16:30 to 18:30, bookings open the week of Sunday 29 November 2026.

## Company Builds (`/company-builds`)
`WorkflowBuildsAndAbout` with About and Playbook off: the builds pitch, the quote form, then the FAQ.

## Playbook (`/playbook`)
Canvas section `#library`: H1 "The Playbook", intro, CMS grid of the **Playbook** collection (use case, level, title, summary, prompt template, read time), CTA "Check your AI level".

## About (`/about`)
`WorkflowBuildsAndAbout` with only About on: bio, level check button and LinkedIn.

## Privacy (`/privacy`) and Terms (`/terms`)
See `privacy.md` and `terms.md`. Both are drafts for an Israeli lawyer to review.
