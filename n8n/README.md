# n8n: Jordana Ops Agent

| File | What it is |
|---|---|
| `jordana-ops-agent.json` | The fixed workflow, exported from n8n (workflow "Jordana Ops Agent", id `jURR7yFR0lGEtqWW`) |
| `jordana-ops-agent.sdk.ts` | The same workflow as n8n Workflow SDK code |
| `original/jordana-ops-agent.json` | Jordana's original workflow, unchanged |

- Editor: https://jordanaop.app.n8n.cloud/workflow/jURR7yFR0lGEtqWW
- Production webhook: `POST https://jordanaop.app.n8n.cloud/webhook/jordana-ops-agent` (only works once the workflow is published)
- Test webhook: `POST https://jordanaop.app.n8n.cloud/webhook-test/jordana-ops-agent` (only while "Listen for test event" is on in the editor)
- Workflow time zone: Asia/Jerusalem, so the `0 8 * * 0-4` schedule fires at 08:00 Israel time, Sunday to Thursday.
- Status: saved, not published, never run. No credentials were created.

## What changed from the original

1. **Google Sheets.** One tool per tab with real column mappings: `Log Student Pipeline` and `Log B2B Pipeline` (append or update, matched on `Email`), plus a `Read Inventory` tool. Paid bookings add one to `bookedCount` in fixed nodes (Read Inventory Row, Increment Booked Count, Update Inventory matched on `Item`), so the count doesn't depend on the AI.
2. **Calendar reads** are limited to today in Israel time (start of day to end of day, Asia/Jerusalem).
3. **Webhook secret.** `payment_confirmed` is only accepted when the `X-Jordana-Key` header matches the n8n Variable `JORDANA_WEBHOOK_KEY`. Otherwise the webhook answers 401 and nothing runs. The Framer forms (`quiz_lead`, `waitlist_join`, `b2b_quote`) don't send a key, because anything in browser code is public.
4. **Allowed origins** on the webhook: `https://jordanayoung-mod.github.io` and a placeholder `https://REPLACE-WITH-FRAMER-SITE.framer.website`.
5. **Hours and clash check before booking.** The requested slot must be Sunday to Thursday, 11:00 to 20:00 Israel time, not touch 12:00 to 12:30, not touch Monday 16:30 to 18:30, start on or after 29 November 2026, and not overlap anything already in the calendar. If it fails, nothing is booked: the agent emails Jordana the details so she can offer a new time.
6. The webhook now answers the browser straight away (`{"ok":true}`), and the AI work runs after that. Unknown `event_type` gets a 400.

## Sheet layout

| Tab | Header row |
|---|---|
| `Student Pipeline` | Email, Name, Stage, Level, Score, Q11 Goal, Q12 Track, Cohort, Marketing Consent, Updated At |
| `B2B Pipeline` | Email, Name, Company, Team Size, Task Description, Stage, Marketing Consent, Updated At |
| `Inventory` | Item, bookedCount, Updated At (one row: `1:1 sessions`, `0`) |

## Payment event shape

The payment gateway (or a small mapping step after it) should send:

```
POST /webhook/jordana-ops-agent
X-Jordana-Key: <your secret>
Content-Type: application/json

{ "event_type": "payment_confirmed", "name": "...", "email": "...", "level": "Beginner",
  "score": 6, "q11": "...", "q12": "...", "tier_price": 400,
  "session_start": "2026-12-01T11:00:00+02:00", "duration_minutes": 60 }
```

PayPlus, Grow and Cardcom each send their own format, so this usually needs a small mapping step that also checks the gateway's own signature.

## What Jordana must do in n8n

1. **Credentials** (Credentials > Add credential, then pick them on each node):
   - Google Sheets OAuth2: Log Student Pipeline, Log B2B Pipeline, Read Inventory, Read Inventory Row, Update Inventory
   - Google Calendar OAuth2: Read Today Calendar, Find Clashing Events, Create Calendar Booking
   - Gmail OAuth2: Send Gmail Message
   - Anthropic API key: Anthropic Claude Brain. When the workflow was created, n8n picked its "Gateway credits" credential for this node on its own. Switch it to your Anthropic key if you want usage billed to your own Anthropic account.
2. **Sheet ID:** create the Google Sheet with the three tabs above and replace `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID` in all five Sheets nodes.
3. **Secret:** make a long random value. Save it in n8n as the Variable `JORDANA_WEBHOOK_KEY` (Overview > Variables) and set the same value as the `X-Jordana-Key` header in the payment gateway's webhook settings. If Variables isn't available on your plan, put the value straight into the right-hand side of "Check Webhook Secret" in n8n, and don't commit that export to git.
4. **Allowed origins:** after publishing the Framer site, replace the `REPLACE-WITH-FRAMER-SITE.framer.website` placeholder in the webhook options with the real domain (and any custom domain).
5. **Test** with "Listen for test event" and the test URL, then **Publish**.
6. **Framer:** paste the production URL `https://jordanaop.app.n8n.cloud/webhook/jordana-ops-agent` into the **n8n Webhook URL** property of every `AILevelQuiz`, `OfferingsAndCohorts` and `WorkflowBuildsAndAbout` instance (Home, /assessment, /cohorts, /company-builds, /about).
