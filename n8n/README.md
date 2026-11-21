# n8n: Jordana ops agent

`jordana-ops-agent.json` is Jordana's workflow, unchanged. It hasn't been imported anywhere yet.

## What to set after importing

1. **Google Sheet ID:** replace `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID` in the "Google Sheets CRM & Inventory" node. The sheet needs the tabs `Student Pipeline`, `B2B Pipeline` and `Inventory`.
2. **Credentials:** connect Google Calendar (both calendar nodes), Gmail ("Send Gmail Message"), Google Sheets ("Google Sheets CRM & Inventory") and Anthropic ("Anthropic Claude Brain").
3. **Time zone:** in Workflow Settings set the time zone to `Asia/Jerusalem`, so the `0 8 * * 0-4` schedule fires at 08:00 Israel time, Sunday to Thursday. Without it the cron uses the n8n instance's default zone.
4. **Webhook URL:** activate the workflow, copy the production URL of "Framer & Payment Webhook" (`POST /jordana-ops-agent`) and paste it into the **n8n Webhook URL** property of every `AILevelQuiz`, `OfferingsAndCohorts` and `WorkflowBuildsAndAbout` instance in Framer.

## Things to check before going live

- **Google Sheets tool** has no column mapping and no "column to match on" for `appendOrUpdate`, so it can't reliably write a row or update `bookedCount`. Map the columns (Name, Email, Level, Score, Q11, Q12, Marketing Consent, Stage, and so on) or add a separate read tool so the agent can increment the count.
- **Read Calendar Events** has no time range (`returnAll` with no start or end), so the 08:00 digest reads every event on the calendar. Set "After" to the start of today and "Before" to the end of today (Israel time).
- **Webhook is open:** anyone who finds the URL can post `payment_confirmed` and create a booking. Payment events should come from the gateway with its signature checked (or a secret header), separate from the public form events.
- **Browser calls (CORS):** the Framer forms post from the browser with `Content-Type: application/json`. Set the webhook's Allowed Origins to the site's domain or the browser will block the request and the forms will show their retry message.
- **Booking hours** (Sunday to Thursday 11:00 to 20:00, breaks at 12:00 to 12:30 and Mondays 16:30 to 18:30) are only in the agent's instructions. Nothing checks for clashes with existing events before "Create Calendar Booking" runs.
- The site's 1:1 price widget reads a booked count (or a JSON URL). Nothing in this workflow publishes the Inventory count back to the site yet.
