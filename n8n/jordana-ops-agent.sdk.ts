import { workflow, node, trigger, sticky, ifElse, switchCase, languageModel, tool, fromAi, expr } from '@n8n/workflow-sdk';

const opsWebhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.2,
  config: {
    name: 'Framer and Payment Webhook',
    parameters: {
      httpMethod: 'POST',
      path: 'jordana-ops-agent',
      responseMode: 'responseNode',
      options: { allowedOrigins: 'https://jordanayoung-mod.github.io,https://REPLACE-WITH-FRAMER-SITE.framer.website' }
    }
  },
  output: [{ headers: { 'x-jordana-key': '' }, body: { event_type: 'quiz_lead', name: 'Dana', email: 'dana@example.com' } }]
});

const morningTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: {
    name: 'Daily 8AM IST Morning Check',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 8 * * 0-4' }] } }
  },
  output: [{ timestamp: '2026-11-29T08:00:00.000+02:00' }]
});

const normalizeEvent = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: "Normalize Event",
    parameters: { mode: 'manual', includeOtherFields: false, assignments: { assignments: [{ id: "a0", name: "event_type", value: expr("{{ $json.body?.event_type ?? $json.event_type ?? '' }}"), type: "string" }, { id: "a1", name: "payload", value: expr("{{ $json.body ?? {} }}"), type: "object" }, { id: "a2", name: "provided_key", value: expr("{{ $json.headers?.['x-jordana-key'] ?? '' }}"), type: "string" }] } }
  }
});

const routeEvent = switchCase({
  version: 3.2,
  config: {
    name: 'Route Event',
    parameters: {
      rules: {
        values: [
          { outputKey: 'payment', conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr("{{ $json.event_type }}"), operator: { type: 'string', operation: "equals" }, rightValue: "payment_confirmed" }], combinator: "and" } },
          { outputKey: 'form', conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr("{{ $json.event_type }}"), operator: { type: 'string', operation: "equals" }, rightValue: "quiz_lead" }, { leftValue: expr("{{ $json.event_type }}"), operator: { type: 'string', operation: "equals" }, rightValue: "waitlist_join" }, { leftValue: expr("{{ $json.event_type }}"), operator: { type: 'string', operation: "equals" }, rightValue: "b2b_quote" }], combinator: "or" } }
        ]
      },
      options: { fallbackOutput: 'extra', renameFallbackOutput: 'Unknown' }
    }
  }
});

const checkSecret = ifElse({
  version: 2.2,
  config: {
    name: 'Check Webhook Secret',
    parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr("{{ $json.provided_key }}"), operator: { type: 'string', operation: "notEmpty", singleValue: true } }, { leftValue: expr("{{ $json.provided_key }}"), operator: { type: 'string', operation: "equals" }, rightValue: expr("{{ $vars.JORDANA_WEBHOOK_KEY }}") }], combinator: "and" } }
  }
});

const checkHours = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: { name: 'Check Booking Hours', parameters: { mode: 'runOnceForEachItem', language: 'javaScript', jsCode: "const zone = 'Asia/Jerusalem';\nconst p = $json.payload || {};\nconst raw = String(p.session_start || p.start || '');\nconst mins = Number(p.duration_minutes || 60);\nconst reasons = [];\nconst result = { ...$json };\nconst start = DateTime.fromISO(raw, { zone }).setZone(zone);\nif (!raw || !start.isValid) {\n  reasons.push('missing or invalid session_start');\n} else {\n  const end = start.plus({ minutes: mins });\n  const wd = start.weekday;\n  const s = start.hour * 60 + start.minute;\n  const e = s + mins;\n  if (![7, 1, 2, 3, 4].includes(wd)) reasons.push('not Sunday to Thursday');\n  if (!start.hasSame(end, 'day')) reasons.push('runs past midnight');\n  if (s < 11 * 60 || e > 20 * 60) reasons.push('outside 11:00 to 20:00 Israel time');\n  if (s < 12 * 60 + 30 && e > 12 * 60) reasons.push('overlaps the 12:00 to 12:30 lunch break');\n  if (wd === 1 && s < 18 * 60 + 30 && e > 16 * 60 + 30) reasons.push('overlaps the Monday 16:30 to 18:30 block');\n  if (start < DateTime.fromISO('2026-11-29T00:00:00', { zone })) reasons.push('before bookings open (week of 29 November 2026)');\n  result.start_iso = start.toISO();\n  result.end_iso = end.toISO();\n}\nresult.within_hours = reasons.length === 0;\nresult.hours_problem = reasons.join('; ');\nreturn { json: result };" } },
  output: [{ event_type: 'payment_confirmed', payload: {}, start_iso: '2026-11-30T11:00:00.000+02:00', end_iso: '2026-11-30T12:00:00.000+02:00', within_hours: true, hours_problem: '' }]
});

const withinHours = ifElse({
  version: 2.2,
  config: {
    name: 'Within Bookable Hours?',
    parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr('{{ $json.within_hours }}'), operator: { type: 'boolean', operation: 'true', singleValue: true } }], combinator: 'and' } }
  }
});

const findClashes = node({
  type: 'n8n-nodes-base.googleCalendar',
  version: 1.4,
  config: {
    name: 'Find Clashing Events',
    alwaysOutputData: true,
    parameters: {
      resource: 'event',
      operation: 'getAll',
      calendar: { __rl: true, mode: 'id', value: 'primary' },
      returnAll: true,
      timeMin: expr('{{ $json.start_iso }}'),
      timeMax: expr('{{ $json.end_iso }}'),
      options: { recurringEventHandling: 'expand' }
    }
  },
  output: [{ id: 'abc123', summary: 'Busy', status: 'confirmed' }]
});

const countClashes = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: { name: 'Count Clashes', parameters: { mode: 'runOnceForAllItems', language: 'javaScript', jsCode: "const base = $('Check Booking Hours').first().json;\nconst clashes = $input.all().filter(i => i.json && i.json.id && i.json.status !== 'cancelled' && i.json.transparency !== 'transparent');\nreturn [{ json: { ...base, clash_count: clashes.length, clash_titles: clashes.map(c => c.json.summary || 'busy').join(', '), slot_free: clashes.length === 0 } }];" } },
  output: [{ slot_free: true, clash_count: 0, clash_titles: '' }]
});

const slotFree = ifElse({
  version: 2.2,
  config: {
    name: 'Slot Free?',
    parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr('{{ $json.slot_free }}'), operator: { type: 'boolean', operation: 'true', singleValue: true } }], combinator: 'and' } }
  }
});

const createBooking = node({
  type: 'n8n-nodes-base.googleCalendar',
  version: 1.4,
  config: {
    name: 'Create Calendar Booking',
    parameters: {
      resource: 'event',
      operation: 'create',
      calendar: { __rl: true, mode: 'id', value: 'primary' },
      start: expr('{{ $json.start_iso }}'),
      end: expr('{{ $json.end_iso }}'),
      additionalFields: {
        summary: expr("[{{ $json.payload.level ?? 'Client' }}] {{ $json.payload.name ?? $json.payload.email ?? 'New client' }}, AI 1:1"),
        description: expr("Client: {{ $json.payload.name ?? '' }} ({{ $json.payload.email ?? '' }})\nDate and time: {{ $json.start_iso }} IST\nLevel: {{ $json.payload.level ?? 'unknown' }} ({{ $json.payload.score ?? '?' }}/30)\nTrack: {{ $json.payload.q12 ?? '' }}\nNumber 1 goal: {{ $json.payload.q11 ?? '' }}\nPrice paid: {{ $json.payload.tier_price ?? '' }} ILS\nGame plan: first 10 minutes quick win, core 35 minutes build and test, final 15 minutes save the reusable prompt or workflow."),
        sendUpdates: 'none'
      }
    }
  },
  output: [{ id: 'evt1', htmlLink: 'https://calendar.google.com/event?eid=evt1' }]
});

const readInventoryRow = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Inventory Row',
    executeOnce: true,
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID' },
      sheetName: { __rl: true, mode: 'name', value: "Inventory" },
      filtersUI: { values: [{ lookupColumn: 'Item', lookupValue: '1:1 sessions' }] },
      options: { returnFirstMatch: true }
    }
  },
  output: [{ Item: '1:1 sessions', bookedCount: 0 }]
});
const incrementCount = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: "Increment Booked Count",
    parameters: { mode: 'manual', includeOtherFields: false, assignments: { assignments: [{ id: "a0", name: "Item", value: '1:1 sessions', type: "string" }, { id: "a1", name: "bookedCount", value: expr("{{ Number($json.bookedCount || 0) + 1 }}"), type: "number" }, { id: "a2", name: "Updated At", value: expr("{{ $now.setZone('Asia/Jerusalem').toISO() }}"), type: "string" }] } }
  }
});

const updateInventory = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Update Inventory',
    parameters: {
      resource: 'sheet',
      operation: 'update',
      documentId: { __rl: true, mode: 'id', value: 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID' },
      sheetName: { __rl: true, mode: 'name', value: "Inventory" },
      columns: {
        mappingMode: 'defineBelow',
        value: { Item: expr('{{ $json.Item }}'), bookedCount: expr('{{ $json.bookedCount }}'), 'Updated At': expr('{{ $json["Updated At"] }}') },
        matchingColumns: ['Item'],
        schema: [{ id: "Item", displayName: "Item", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: "bookedCount", displayName: "bookedCount", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Updated At", displayName: "Updated At", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }]
      },
      options: {}
    }
  },
  output: [{ Item: '1:1 sessions', bookedCount: 1 }]
});
const markBooked = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: "Mark Booked",
    parameters: { mode: 'manual', includeOtherFields: false, assignments: { assignments: [{ id: "a0", name: "event_type", value: 'payment_confirmed', type: "string" }, { id: "a1", name: "payload", value: expr("{{ $('Normalize Event').item.json.payload }}"), type: "object" }, { id: "a2", name: "booking_status", value: 'booked', type: "string" }, { id: "a3", name: "booking_note", value: expr("{{ $('Check Booking Hours').item.json.start_iso }}"), type: "string" }, { id: "a4", name: "calendar_link", value: expr("{{ $('Create Calendar Booking').item.json.htmlLink ?? '' }}"), type: "string" }] } }
  }
});
const markOutsideHours = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: "Mark Outside Hours",
    parameters: { mode: 'manual', includeOtherFields: false, assignments: { assignments: [{ id: "a0", name: "event_type", value: 'payment_confirmed', type: "string" }, { id: "a1", name: "payload", value: expr("{{ $('Normalize Event').item.json.payload }}"), type: "object" }, { id: "a2", name: "booking_status", value: 'needs_reschedule', type: "string" }, { id: "a3", name: "booking_note", value: expr("{{ 'Requested time not bookable: ' + $json.hours_problem }}"), type: "string" }, { id: "a4", name: "calendar_link", value: '', type: "string" }] } }
  }
});
const markSlotTaken = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: "Mark Slot Taken",
    parameters: { mode: 'manual', includeOtherFields: false, assignments: { assignments: [{ id: "a0", name: "event_type", value: 'payment_confirmed', type: "string" }, { id: "a1", name: "payload", value: expr("{{ $('Normalize Event').item.json.payload }}"), type: "object" }, { id: "a2", name: "booking_status", value: 'needs_reschedule', type: "string" }, { id: "a3", name: "booking_note", value: expr("{{ 'Requested time clashes with: ' + $json.clash_titles }}"), type: "string" }, { id: "a4", name: "calendar_link", value: '', type: "string" }] } }
  }
});
const digestRequest = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: "Daily Digest Request",
    parameters: { mode: 'manual', includeOtherFields: false, assignments: { assignments: [{ id: "a0", name: "event_type", value: 'daily_digest', type: "string" }, { id: "a1", name: "payload", value: expr("{{ ({ date: $now.setZone('Asia/Jerusalem').toISODate() }) }}"), type: "object" }] } }
  }
});

const respondPayment = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: "Respond Payment Received", parameters: { respondWith: 'json', responseBody: expr("{{ JSON.stringify({ received: true, booking_status: $json.booking_status }) }}"), options: { responseCode: 200 } } }
});

const respondUnauthorized = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: "Respond Unauthorized", parameters: { respondWith: 'json', responseBody: "{\"error\":\"unauthorized\"}", options: { responseCode: 401 } } }
});

const respondUnknown = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: "Respond Unknown Event", parameters: { respondWith: 'json', responseBody: "{\"error\":\"unknown event_type\"}", options: { responseCode: 400 } } }
});

const respondFormOk = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: "Respond Form OK", parameters: { respondWith: 'json', responseBody: "{\"ok\":true}", options: { responseCode: 200 } } }
});
const buildInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: "Build Agent Input",
    parameters: { mode: 'manual', includeOtherFields: false, assignments: { assignments: [{ id: "a0", name: "agent_prompt", value: expr("Event type: {{ $json.event_type }}\nBooking status: {{ $json.booking_status ?? 'n/a' }}\nBooking note: {{ $json.booking_note ?? '' }}\nCalendar link: {{ $json.calendar_link ?? '' }}\nPayload: {{ JSON.stringify($json.payload ?? {}) }}"), type: "string" }] } }
  }
});

const claudeModel = languageModel({
  type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
  version: 1.6,
  config: { name: 'Anthropic Claude Brain', parameters: { model: { __rl: true, mode: 'id', value: 'claude-sonnet-4-20250514' }, options: {} } }
});

const readTodayCalendar = tool({
  type: 'n8n-nodes-base.googleCalendarTool',
  version: 1.4,
  config: {
    name: 'Read Today Calendar',
    parameters: {
      resource: 'event',
      operation: 'getAll',
      calendar: { __rl: true, mode: 'id', value: 'primary' },
      returnAll: true,
      timeMin: expr("{{ $now.setZone('Asia/Jerusalem').startOf('day').toISO() }}"),
      timeMax: expr("{{ $now.setZone('Asia/Jerusalem').endOf('day').toISO() }}"),
      options: { orderBy: 'startTime', recurringEventHandling: 'expand', timeZone: { __rl: true, mode: 'id', value: 'Asia/Jerusalem' } }
    }
  }
});

const sendGmail = tool({
  type: 'n8n-nodes-base.gmailTool',
  version: 2.2,
  config: {
    name: 'Send Gmail Message',
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: fromAi('recipient_email', 'Recipient email address'),
      subject: fromAi('email_subject', 'Plain English subject line with zero em dashes'),
      emailType: 'text',
      message: fromAi('email_body', 'Warm plain English email body with zero em dashes'),
      options: { appendAttribution: false }
    }
  }
});

const logStudent = tool({
  type: 'n8n-nodes-base.googleSheetsTool',
  version: 4.7,
  config: {
    name: 'Log Student Pipeline',
    parameters: {
      resource: 'sheet',
      operation: 'appendOrUpdate',
      documentId: { __rl: true, mode: 'id', value: 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID' },
      sheetName: { __rl: true, mode: 'name', value: "Student Pipeline" },
      columns: { mappingMode: 'defineBelow', value: { "Email": fromAi("email", "Client email address, used to find their row"), "Name": fromAi("name", "Client first name"), "Stage": fromAi("stage", "Assessed, Waitlist or Booked"), "Level": fromAi("level", "Beginner, Intermediate, Advanced or Expert"), "Score": fromAi("score", "Quiz score out of 30, empty if unknown"), "Q11 Goal": fromAi("q11_goal", "Their answer to question 11"), "Q12 Track": fromAi("q12_track", "Their answer to question 12"), "Cohort": fromAi("cohort", "Chosen cohort, empty if none"), "Marketing Consent": fromAi("marketing_consent", "true or false"), "Updated At": fromAi("updated_at", "Current date and time in Israel time, ISO 8601") }, matchingColumns: ['Email'], schema: [{ id: "Email", displayName: "Email", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: "Name", displayName: "Name", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Stage", displayName: "Stage", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Level", displayName: "Level", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Score", displayName: "Score", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Q11 Goal", displayName: "Q11 Goal", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Q12 Track", displayName: "Q12 Track", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Cohort", displayName: "Cohort", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Marketing Consent", displayName: "Marketing Consent", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Updated At", displayName: "Updated At", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }] },
      options: {}
    }
  }
});

const logB2b = tool({
  type: 'n8n-nodes-base.googleSheetsTool',
  version: 4.7,
  config: {
    name: 'Log B2B Pipeline',
    parameters: {
      resource: 'sheet',
      operation: 'appendOrUpdate',
      documentId: { __rl: true, mode: 'id', value: 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID' },
      sheetName: { __rl: true, mode: 'name', value: "B2B Pipeline" },
      columns: { mappingMode: 'defineBelow', value: { "Email": fromAi("email", "Work email address, used to find their row"), "Name": fromAi("name", "Contact name"), "Company": fromAi("company", "Company or organization"), "Team Size": fromAi("team_size", "Team size range"), "Task Description": fromAi("task_description", "The workflow they want built"), "Stage": fromAi("stage", "Inquiry"), "Marketing Consent": fromAi("marketing_consent", "true or false"), "Updated At": fromAi("updated_at", "Current date and time in Israel time, ISO 8601") }, matchingColumns: ['Email'], schema: [{ id: "Email", displayName: "Email", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: "Name", displayName: "Name", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Company", displayName: "Company", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Team Size", displayName: "Team Size", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Task Description", displayName: "Task Description", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Stage", displayName: "Stage", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Marketing Consent", displayName: "Marketing Consent", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }, { id: "Updated At", displayName: "Updated At", required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }] },
      options: {}
    }
  }
});

const readInventoryTool = tool({
  type: 'n8n-nodes-base.googleSheetsTool',
  version: 4.7,
  config: {
    name: 'Read Inventory',
    parameters: { resource: 'sheet', operation: 'read', documentId: { __rl: true, mode: 'id', value: 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID' }, sheetName: { __rl: true, mode: 'name', value: "Inventory" }, options: {} }
  }
});

const opsAgent = node({
  type: '@n8n/n8n-nodes-langchain.agent',
  version: 3.1,
  config: {
    name: 'Jordana Ops Agent',
    parameters: { promptType: 'define', text: expr('{{ $json.agent_prompt }}'), options: { systemMessage: "You are Jordana Young's business operations agent.\n\nBrand and communication rules:\n- Write in warm, plain English. Zero em dashes or en dashes. Zero AI buzzwords.\n- Prices are in ILS. All session times are in Israel time (Asia/Jerusalem).\n- Never use the titles 'Senior Researcher' or 'User Researcher'. Describe Jordana as part of the Microsoft team building Copilot Studio.\n- Send operational alerts and the morning digest to jordanayoung@gmail.com.\n- Only email a client the confirmation, roadmap or prep package described below. Never promise a time that is not already booked.\n\nTools you can use: 'Log Student Pipeline', 'Log B2B Pipeline', 'Read Inventory', 'Read Today Calendar', 'Send Gmail Message'.\n\nWhat to do for each event type:\n1. quiz_lead: use 'Log Student Pipeline' with Stage 'Assessed' (Name, Email, Level, Score, Q11 Goal, Q12 Track, Marketing Consent). Then use 'Send Gmail Message' to email the client their level roadmap.\n2. waitlist_join: use 'Log Student Pipeline' with Stage 'Waitlist' and the Cohort. Then email the client a confirmation for their chosen December 2026 cohort.\n3. b2b_quote: use 'Log B2B Pipeline' with Stage 'Inquiry'. Email Jordana a 1-page discovery call brief and email the client that she'll reply within one business day.\n4. payment_confirmed with booking status 'booked': the calendar event is already created and the inventory count already increased. Use 'Log Student Pipeline' with Stage 'Booked', email the client their level-tailored prep package, and email Jordana the 1-page pre-session brief.\n5. payment_confirmed with booking status 'needs_reschedule': nothing was booked. Email Jordana the client details and the booking note so she can offer a new time. Do not email the client.\n6. daily_digest: use 'Read Today Calendar' and email Jordana a short morning summary of today's sessions with a prep note for each one. If there are none, say so in one line.\n\nUse 'Read Inventory' only when you need the current 1:1 booked count.", maxIterations: 8 } },
    subnodes: { model: claudeModel, tools: [readTodayCalendar, sendGmail, logStudent, logB2b, readInventoryTool] }
  }
});

const setupNote = sticky("## Setup before activating\n1. Connect credentials: Google Calendar, Gmail, Google Sheets, Anthropic.\n2. Replace REPLACE_WITH_YOUR_GOOGLE_SHEET_ID in the Sheets nodes.\n3. Create the n8n Variable JORDANA_WEBHOOK_KEY. Payment calls must send it in the X-Jordana-Key header.\n4. Replace the framer.website placeholder in the webhook Allowed Origins with the real site domain.", [opsWebhook, normalizeEvent, routeEvent], { color: 4 });

export default workflow('jordana-ops-agent', 'Jordana Ops Agent (fixed)')
  .add(opsWebhook)
  .to(normalizeEvent)
  .to(routeEvent
    .onCase(0, checkSecret
      .onTrue(checkHours.to(withinHours
        .onTrue(findClashes.to(countClashes.to(slotFree
          .onTrue(createBooking.to(readInventoryRow.to(incrementCount.to(updateInventory.to(markBooked.to(respondPayment.to(buildInput.to(opsAgent))))))))
          .onFalse(markSlotTaken.to(respondPayment)))))
        .onFalse(markOutsideHours.to(respondPayment))))
      .onFalse(respondUnauthorized))
    .onCase(1, respondFormOk.to(buildInput))
    .onCase(2, respondUnknown))
  .add(morningTrigger)
  .to(digestRequest)
  .to(buildInput)
  .add(setupNote);
