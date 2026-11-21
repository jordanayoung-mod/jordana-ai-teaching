# Jordana Young: AI teaching site

A static website for one-to-one AI sessions and for company workflow quotes. It is hosted by GitHub Pages from this repository.

Live site: https://jordanayoung-mod.github.io/jordana-ai-teaching/

You do not need to write code to run the site day to day. You edit one settings file and two data files, then commit and push to the `main` branch. Pages publishes that push.

## What visitors can do

1. Read the offer, the current price, and the hours.
2. Leave their name and contact details, then answer 12 questions.
3. See a level (Beginner, Intermediate, Advanced, or Expert) and a learning path. The level does not change the price.
4. Open the payment link, then the booking link. Name, email, and level are added to both links.
5. Read the prep page for their level and send a goals form.
6. Request a quote for a company build. That offer is not part of the 40-session price ladder.
7. Leave a review. It is not shown until you approve it.

Bookings are described as opening the week of Sunday 29 November 2026, Sunday to Thursday, 11:00 to 20:00 Israel time, with lunch 12:00 to 12:30 and Mondays also blocked 16:30 to 18:30. The booking tool itself has to be set to those hours. This site only explains them and links out.

## Edit the settings

Open `config.js`. Every external URL, form endpoint, and on/off switch is in that file.

After you save, commit, and push to `main`, the site updates when the Pages workflow finishes (usually a minute or two).

### Turn credential lines on or off

In `config.js`:

- `features.showMicrosoftNaming` stays `true`. The site describes Jordana as part of the Microsoft team building Copilot Studio. Do not add a job title from her day job.

The LetsGo badge is not on the site. Do not add it back. Review collection stays, including the optional checkbox to share a review with LetsGo.

### Update the sold count

Open `data/inventory.json`. Change `sold` to the number of sessions that have been paid for.

| `sold` | What the site shows |
| --- | --- |
| 0 | 8 of 8 left at ₪400. Next price: ₪600. |
| 7 | 1 of 8 left at ₪400. Next price: ₪600. |
| 8 | 8 of 8 left at ₪600. Next price: ₪750. |
| 16 | 8 of 8 left at ₪750. Next price: ₪950. |
| 24 | 8 of 8 left at ₪950. Next price: ₪1,200. |
| 32 | 8 of 8 left at ₪1,200. This is the last price. |
| 40 | Sold out. The booking buttons become a waitlist. |

Do not reorder the four steps. Push to `main` after you change the number. Do this when a payment is confirmed, and again if you refund someone (lower `sold` by one).

### Use a live count later

Leave `inventoryLiveUrl` in `config.js` empty to keep using `data/inventory.json`.

When you want the count to update without a code edit, paste a URL that returns the same JSON shape (`sold` plus `tiers` with `priceIls` and `slots`). If that URL fails, the site uses the file in this repo.

A practical path:

1. Keep the count in a Google Sheet or an Airtable base, with one row or one field for `sold`.
2. Publish that source as JSON. For a Google Sheet, a common route is a small Apps Script web app, or a published sheet read by a trusted JSON bridge you control. For Airtable, do not put a secret API key in `config.js`, because this file is public. Use a published view or a Make/Zapier webhook that writes a public JSON file instead.
3. Paste that public JSON URL into `inventoryLiveUrl`.
4. A payment success in your payment tool can also notify Make or Zapier, which updates the sheet and, if you still use the file, reminds you to change `sold`.

The website cannot decrease the counter by itself. Something you control has to change `sold` or the live JSON.

### Approve a review

Open `data/reviews.json`.

- The site shows a review only when `approved` is `true` and `sample` is not `true`.
- The two objects already in the file are samples. Leave `approved` as `false`. They are there so you can see the shape of a review. They are not testimonials.
- When a real review arrives in your form tool, add an object (or copy one out of the form tool) with `sample` omitted or `false`, the student's words unchanged, and `approved` set to `true`. Then push to `main`.
- Do not edit the reviewer's words. If something must change, ask them to send a new version.
- Decline a review only for a clear reason (abuse, personal data, spam, or not a real client) and keep that reason in your form tool.

LetsGo does not receive reviews from this website automatically. There is no public LetsGo reviews API in this setup. If `shareWithLetsGo` is `true` and you approve the review, send it to LetsGo by the email or form they give you, and set `letsgoSync` to `sent` or `manual` so you can see that you did it. When LetsGo offers an API or a CSV import, a Make/Zapier step can replace that handoff. Until then, the handoff is manual.

### Connect the forms

In `config.js`, `endpoints` holds one URL per form:

| Key | Form |
| --- | --- |
| `lead` | Name and contact details, before the questions |
| `questionnaire` | Answers, score, level, and path |
| `goals` | Prep goals form |
| `quote` | Company quote request |
| `review` | Leave a review |
| `contact` | Contact page |
| `waitlist` | Next-release list |

`format` is `"form"` for Formspree (paste the `https://formspree.io/f/xxxx` address). Use `"json"` for a Zapier, Make, or HubSpot webhook. The webhook must allow browser requests from `https://jordanayoung-mod.github.io`. If it does not, the site tries a second time as a normal form post and tells the visitor it could not read a receipt.

Until a URL is filled in, the visitor sees a short note that the form is not connected, and the questionnaire still runs in the browser so they can see their level.

Turn on the form tool's own email notification so you hear about each submission, and its auto-reply where you want one (especially the quote form: thank them, say what happens next, and give a response time). This static site cannot send email by itself.

Each submission includes the time, the page URL, and the consent wording that was on the checkbox.

Marketing consent is a separate checkbox and it starts unticked. Do not merge it with the required privacy checkbox.

### Connect payment

1. Choose an Israeli provider that offers Bit and credit cards (Grow, PayPlus, Cardcom, or similar).
2. Create a payment page for the current price. Because the price steps up, you will either use one page whose amount you can pass in, or replace `booking.paymentUrl` when the step changes (₪400, then ₪600, then ₪750, then ₪950, then ₪1,200).
3. Paste the full `https://` link into `booking.paymentUrl`.
4. In the provider, set the success redirect to your booking link (`booking.schedulerUrl`). The site also shows a "Choose a time" button with the same destination, so a visitor who is not redirected can continue.
5. Connect invoicing (Morning / Green Invoice, iCount, or the provider's own receipts) so a receipt or tax invoice is emailed. This site never sees the card number.
6. A booking counts as sold only after payment succeeds. Then update `sold` in `data/inventory.json`.

The "Book and pay" buttons add query parameters from `booking.query`. Defaults are `name`, `email`, `phone`, `level`, `path`, and `notes`. `notes` looks like: `Level: Beginner. Path: Writing. Price: 400 ILS.`

### Connect booking and Google Calendar

1. Create the event in Cal.com or Calendly.
2. Time zone: Asia/Jerusalem.
3. Hours: Sunday, Tuesday, Wednesday, and Thursday 11:00 to 12:00 and 12:30 to 20:00. Monday 11:00 to 12:00, 12:30 to 16:30, and 18:30 to 20:00. Friday and Saturday unavailable.
4. First bookable day: Sunday 29 November 2026. Block earlier dates.
5. Buffer after the session (15 minutes until you decide otherwise) and a minimum notice (24 hours until you decide otherwise).
6. Connect Google Calendar twice in the tool's settings: add new events to your calendar, and check that calendar for conflicts. Then a busy event, including a LetsGo booking on the same calendar, blocks the slot. A reschedule moves the event. A cancellation clears it.
7. Ask the tool to title the event with the name and level fields, for example `AI Session: Dana Cohen (Beginner)`. If the tool cannot read those fields, use the `notes` parameter and a Make/Zapier step that updates the event title after the booking arrives.
8. Add the video meeting (Zoom, Google Meet, or Teams) on the event type.
9. Paste the event link into `booking.schedulerUrl`.

Calendly prefills `name` and `email`, and uses `a1`, `a2`, and so on for custom questions. If your first custom question is the level, set `booking.query.level` to `"a1"`. Cal.com uses the slug of each booking question. Match the keys in `booking.query` to those slugs.

Company discovery calls, if you add them in the same tool, must use a separate event type. They should not reduce `sold`.

### Analytics and the cookie notice

`analytics.enabled` is `false`. No analytics script loads, and the cookie notice stays hidden.

To turn it on, set `enabled` to `true` and paste the script URL into `analytics.src`. For Plausible, also set `dataset.domain`. The notice appears, and the script loads only after the visitor presses Accept.

### VAT, cancellation, email, WhatsApp, photo

Still in `config.js`:

- `business.email`: public address. Until this is set, the site does not invent one.
- `business.phoneE164`: digits only, country code, no plus sign, for the WhatsApp link. Example shape: `972501234567`.
- `business.vatNote`: replaces the neutral price sentence. Example: `Prices include VAT.`
- `business.cancellationNote`: replaces the cancellation paragraph on the FAQ and the Terms page. Write the final rule before 29 November 2026.
- `business.photo`: optional path such as `assets/jordana.jpg`. Leave it empty to keep the monogram. Do not use a stock photo.
- `business.processors`: the list on the Privacy Policy. Rename each tool when you choose it.

## Change the questionnaire

Edit `data/questions.json`. Each scored answer is worth 0 to 3. The maximum is 30.

| Score | Level |
| --- | --- |
| 0 to 7 | Beginner |
| 8 to 15 | Intermediate |
| 16 to 23 | Advanced |
| 24 to 30 | Expert |

If question 1 is "I haven't tried it yet.", the level stays Beginner. If question 12 is "Agents and automation" and the score is 12 or more, the level moves up one band, unless the Beginner cap already applied. Question 2 is a single choice, scored 0 to 3 in the order the answers are listed. Push to `main` after you edit the file.

You can check the scoring on your own computer with `node tests/logic.test.js`.

## Cohorts

December 2026 groups in `data/cohorts.json`:

- Beginner, AI Starter, Sunday nights: two separate groups (Sunday cohort A and Sunday cohort B). Three weekly sessions: 90 minutes, 90 minutes, then a 60-minute live clinic and wrap-up.
- Intermediate, AI at Work, Wednesday nights: one group. Four weekly 90-minute sessions.
- Advanced and Expert stay `"visible": false` until Q1 2027. They stay off the Cohorts page. On the questionnaire result, those levels see a note that the cohort opens soon, a waitlist link, the one-to-one option, and the custom-build quote. Set `visible` to `true` only after you add their `runs`.

Each person pays ₪600. Each run holds 15 people. Sessions are live online via Zoom, with small hands-on breakout rooms and a private group chat between sessions. A run with `startDate` null shows "Starts December 2026, exact dates coming soon" and offers the waitlist. A sign-up button appears only after that run has a date and seats left.

To open dates for a run:

1. Set `startDate` to the first session, as `YYYY-MM-DD`.
2. Set each session's `date` the same way, and `start` to the Israel time, such as `"18:00"`.
3. Paste the payment page into that run's `cohortPaymentUrl`.
4. Push to `main`.

To record a paid seat, add 1 to that run's `enrolled`. At 15, or if you set `status` to `full` or `waitlist`, the button becomes "Join the waitlist". Lower `enrolled` if someone drops out.

The waitlist form posts to `cohortWaitlistEndpoint` in `config.js`. Leave it empty until the form service is connected.

Course names and session topics are placeholders. Replace them in the same file when the curriculum is ready.

## Change a sentence on a page

Edit the HTML file (for example `faq.html`) and push to `main`.

`scripts/build-pages.mjs` can rebuild every page from one template. Do not run it unless you mean to overwrite those HTML files.

## PLACEHOLDERS still to fill in

The site is usable before these are done. Buttons that need a missing link say they are not connected yet.

1. `business.email`
2. `business.phoneE164` for WhatsApp
3. `business.vatNote` after your accountant confirms VAT
4. `business.cancellationNote` before 29 November 2026
5. Business registration number and address, on `terms.html`, once the business is registered
6. Lawyer review of `privacy.html`, `terms.html`, and `accessibility.html` (they are marked as drafts)
7. `features.showMicrosoftNaming`: confirm Microsoft's policy. It is on, so the approved About copy is visible. Turn it off if you must publish without Microsoft names.
8. LinkedIn is already set to https://www.linkedin.com/in/jordana-young. The LetsGo badge stays off the site.
9. `booking.paymentUrl` (Grow, PayPlus, Cardcom, or similar, with Bit and cards)
10. `booking.schedulerUrl` (Cal.com or Calendly)
11. `booking.query` keys, if your booking tool uses different field names (for example Calendly `a1`)
12. Payment-provider success redirect to the booking link
13. Google Calendar connected inside the booking tool, including conflict checking
14. Video meeting link on the booking event
15. Invoicing (Morning, iCount, or the provider's receipts)
16. `endpoints.lead`
17. `endpoints.questionnaire`
18. `endpoints.goals`
19. `endpoints.quote`, plus the form tool's auto-reply
20. `endpoints.review`
21. `endpoints.contact`
22. `endpoints.waitlist`
23. Session length, buffer, and minimum notice inside the booking tool (60 minutes, 15 minutes, and 24 hours are planning numbers only)
24. A portrait at `business.photo`, if you want one
25. Analytics, only if you want it (`analytics.enabled` and `analytics.src`)
26. The first real value of `sold` stays 0 until someone pays
27. `cohortWaitlistEndpoint` in `config.js`
28. Each open run's `cohortPaymentUrl` in `data/cohorts.json`
29. December dates and start times on those runs (`startDate`, and each session `date` and `start`)
30. Beginner session 3 length (`durationMinutes` is null until you decide it)
31. `enrolled` on each run, after someone pays
32. Advanced and Expert: add runs and set `visible` to `true` when those cohorts should appear

## How publishing works

Pushes to `main` run `.github/workflows/pages.yml`. That workflow uploads the site and deploys it with GitHub Actions.

Pages is not on yet. The workflow tried to turn it on (`actions/configure-pages` with `enablement: true`, and a direct API call). Both were refused with "Resource not accessible by integration", so this token cannot change Pages settings.

Turn it on yourself:

1. Open the repository on GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab, select **Deploy to GitHub Pages**, and re-run the latest workflow.

After that run is green, the site is at https://jordanayoung-mod.github.io/jordana-ai-teaching/

## Check the price maths locally

From this folder:

```bash
node tests/logic.test.js
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080/`.
