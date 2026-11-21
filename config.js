/* Jordana Young: site configuration
   Edit this file to connect forms, payment, booking, and optional features.
   Then commit and push to the main branch. GitHub Pages redeploys from that push.

   Leave a value as "" until you have the real link. The site stays usable:
   visitors can still read the pages and complete the questionnaire in the browser.
   Buttons that need a missing link explain that it is not connected yet.

   Search the README for "PLACEHOLDERS" for the full checklist.
*/
window.SITE_CONFIG = {
  siteUrl: "https://jordanayoung-mod.github.io/jordana-ai-teaching",

  business: {
    name: "Jordana Young",
    email: "",
    /* Digits only, country code included, no plus sign. Example: 972501234567 */
    phoneE164: "",
    /* Optional portrait. Put a file in assets/ and set the path, e.g. "assets/jordana.jpg".
       Leave "" to keep the monogram. No stock photo is used. */
    photo: "",
    photoAlt: "Jordana Young",
    /* Shown near prices once your accountant confirms it.
       Examples: "Prices include VAT." or "VAT is not added, because the business is an osek patur."
       Leave "" to keep the neutral sentence that is already on the page. */
    vatNote: "",
    /* Shown on the terms page and the FAQ. Replace this before 29 November 2026. */
    cancellationNote: "",
    /* Named on the privacy page. Update the name and purpose when you choose each tool. */
    processors: [
      {
        name: "Form host (not connected yet)",
        purpose: "Will store form submissions: name, email, phone, questionnaire answers, quote requests, reviews, and cohort waitlist requests."
      },
      {
        name: "Israeli payment provider (not connected yet)",
        purpose: "Will take payment in ILS by credit card and Bit, and email a payment confirmation. This website never receives the card number."
      },
      {
        name: "Booking tool, Cal.com or Calendly (not connected yet)",
        purpose: "Will let a student choose a time and will send the video-meeting link."
      },
      {
        name: "Google Calendar",
        purpose: "The booking tool adds each confirmed session to Jordana's calendar and checks that calendar so a busy time cannot be booked twice."
      }
    ]
  },

  /* Microsoft naming stays on. The LetsGo badge is not shown.
     No Microsoft logo is used. */
  features: {
    showMicrosoftNaming: true
  },

  linkedin: "https://www.linkedin.com/in/jordana-young",

  booking: {
    opensLabel: "Sunday 29 November 2026",
    /* Working placeholder until session length is confirmed. The public pages
       point people to the booking tool for the length, and do not treat this as final. */
    sessionLengthMinutes: 60,
    bufferMinutes: 15,
    minimumNoticeHours: 24,
    timezone: "Asia/Jerusalem",
    /* Paste the hosted payment page (Grow, PayPlus, Cardcom, or similar). */
    paymentUrl: "",
    /* Paste the Cal.com or Calendly event link. After payment, send people here. */
    schedulerUrl: "",
    /* Query parameter names added to BOTH the payment link and the booking link.
       Calendly prefills name and email, and uses a1, a2... for custom questions.
       Cal.com prefills name, email, and the slug of each booking question.
       Example for Calendly: level: "a1", path: "a2" */
    query: {
      name: "name",
      email: "email",
      phone: "phone",
      level: "level",
      path: "path",
      notes: "notes"
    },
    /* Adds a notes parameter such as "Level: Beginner. Path: Writing. Price: 400 ILS." */
    includeNotes: true
  },

  /* Where each form is sent.
     format "form"  = normal form post. Use this for Formspree (https://formspree.io/f/xxxx).
     format "json"  = JSON post. Use this for a Zapier, Make, or HubSpot webhook.
                      The webhook must allow browser requests (CORS) from this site.
                      If it does not, the site retries once as a simple form post.
     Leave a URL blank until it is real. Do not paste an example.com address. */
  endpoints: {
    format: "form",
    lead: "",
    questionnaire: "",
    quote: "",
    review: "",
    contact: "",
    waitlist: "",
    goals: ""
  },

  /* Analytics stays off until you set enabled to true AND paste a script URL.
     The cookie notice appears only when enabled is true. Nothing loads before Accept. */
  analytics: {
    enabled: false,
    src: "",
    /* Attributes copied onto the script tag. Plausible example:
       dataset: { domain: "jordanayoung-mod.github.io" } */
    dataset: {}
  },

  /* Leave inventoryLiveUrl empty to read data/inventory.json from this repo.
     To use a live source, paste a URL that returns the SAME JSON shape
     ({ "sold": number, "tiers": [ { "priceIls", "slots" }, ... ] }).
     If the live URL fails, the site falls back to data/inventory.json.
     See the README for a Google Sheet / Airtable path. */
  inventoryLiveUrl: "",

  /* Cohort waitlist form. Same rules as the other endpoints: a real https URL,
     or leave "" until the form service is connected.
     Each run's pay link is cohortPaymentUrl on that run in data/cohorts.json,
     not in this file, because the groups have different links. */
  cohortWaitlistEndpoint: ""
};
