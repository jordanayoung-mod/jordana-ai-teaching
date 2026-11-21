import fs from "fs";
import path from "path";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = "https://jordanayoung-mod.github.io/jordana-ai-teaching";
const LINKEDIN = "https://www.linkedin.com/in/jordana-young";
const DISCLAIMER = "Jordana works at Microsoft on the Copilot Studio team. All courses, coaching sessions and workflow build services on this site are independent personal ventures not affiliated with, sponsored by, or endorsed by Microsoft Corporation.";

const NAV = [
  ["sessions.html", "Sessions"],
  ["cohorts.html", "Cohorts"],
  ["how-it-works.html", "How it works"],
  ["about.html", "About"],
  ["companies.html", "For companies"],
  ["faq.html", "FAQ"]
];

function hoursTable() {
  return `<div class="table-scroll">
    <table>
      <caption>When you can book, in Israel time</caption>
      <thead>
        <tr><th scope="col">Day</th><th scope="col">Open</th><th scope="col">Blocked</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Sunday</th><td>11:00 to 20:00</td><td>12:00 to 12:30 lunch</td></tr>
        <tr><th scope="row">Monday</th><td>11:00 to 20:00</td><td>12:00 to 12:30 lunch, and 16:30 to 18:30</td></tr>
        <tr><th scope="row">Tuesday</th><td>11:00 to 20:00</td><td>12:00 to 12:30 lunch</td></tr>
        <tr><th scope="row">Wednesday</th><td>11:00 to 20:00</td><td>12:00 to 12:30 lunch</td></tr>
        <tr><th scope="row">Thursday</th><td>11:00 to 20:00</td><td>12:00 to 12:30 lunch</td></tr>
        <tr><th scope="row">Friday</th><td>Closed</td><td>Not bookable</td></tr>
        <tr><th scope="row">Saturday</th><td>Closed</td><td>Not bookable</td></tr>
      </tbody>
    </table>
  </div>`;
}

function credStrip() {
  return `<ul class="cred-strip">
    <li>Part of the Microsoft team building Copilot Studio</li>
    <li>20+ years shaping products and customer experiences at Microsoft, Meta, HoneyBook, and SodaStream</li>
    <li>21 published studies on AI agents</li>
    <li>Microsoft 2026 Innovation Catalyst Award</li>
  </ul>`;
}

function priceCard(h, cta, label) {
  return `<div class="price-card">
    <p class="kicker">Current price</p>
    <p class="price-amount" data-price-amount>Loading</p>
    <p class="visually-hidden" data-price-status role="status">Loading the current price.</p>
    <p class="price-left" data-price-left>Loading how many are left.</p>
    <p data-price-next></p>
    <p class="muted" data-price-sold></p>
    <div data-when="available"><a class="button button-solid" href="${h(cta)}">${label}</a></div>
    <div data-when="soldout" hidden>
      <p>All 40 sessions in this release are sold.</p>
      <a class="button button-solid" href="${h("waitlist.html")}">Join the waitlist</a>
    </div>
  </div>`;
}

function honeypot(id) {
  return `<div class="hp"><label for="${id}">Leave this field empty</label><input id="${id}" name="company_website" type="text" tabindex="-1" autocomplete="off"></div>`;
}

function alertBox() {
  return `<div class="form-alert" data-alert tabindex="-1" hidden></div>`;
}

function shell(file, { title, description, active, body, scripts }) {
  const nested = file.includes("/");
  const h = (target) => (nested ? "../" + target : target);
  const canonical = file === "index.html" ? SITE + "/" : SITE + "/" + file;
  const nav = NAV.map(([href, label]) => {
    const current = active === href ? ` aria-current="page"` : "";
    return `<li><a href="${h(href)}"${current}>${label}</a></li>`;
  }).join("");
  const extra = (scripts || []).map((src) => `<script src="${h(src)}"></script>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en" data-root="${nested ? ".." : "."}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#1e463a">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <link rel="icon" href="${h("assets/favicon.svg")}" type="image/svg+xml">
  <link rel="stylesheet" href="${h("css/styles.css")}">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="logo" href="${h("index.html")}"><span class="logo-mark" aria-hidden="true">JY</span><span>Jordana Young</span></a>
      <a class="header-find" href="${h("assess.html")}">Find your level</a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-panel">Menu</button>
      <nav class="nav-panel" id="nav-panel" aria-label="Primary">
        <ul class="nav-list">${nav}</ul>
        <div class="nav-ctas">
          <a class="button button-line" href="${h("quote.html")}">Get a quote for a custom build</a>
          <a class="button button-solid" href="${h("assess.html")}">Find your level</a>
        </div>
      </nav>
    </div>
  </header>
  <noscript>
    <div class="wrap" style="padding-top:1rem">
      <p class="note" style="padding:0.8rem 1rem">JavaScript is off, so the live price and the questionnaire will not run. You can still read every page. Use the contact page and I will tell you the current price.</p>
    </div>
  </noscript>
  <main id="main">
${body(h)}
  </main>
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <p class="serif" style="font-size:1.6rem;margin:0 0 0.4rem">Jordana Young</p>
        <p>One-to-one AI sessions, online, in English.</p>
        <p><a data-email-link data-keep-label hidden href="">Email me</a></p>
        <p data-email-missing>The public email address will appear here once it is added.</p>
        <p><a data-whatsapp-link hidden href="" target="_blank" rel="noopener noreferrer">WhatsApp<span class="visually-hidden"> (opens in a new tab)</span></a></p>
        <p><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn<span class="visually-hidden"> (opens in a new tab)</span></a></p>
      </div>
      <div>
        <p><strong>On this site</strong></p>
        <ul class="footer-links">
          <li><a href="${h("sessions.html")}">Sessions and pricing</a></li>
          <li><a href="${h("cohorts.html")}">Group cohorts</a></li>
          <li><a href="${h("how-it-works.html")}">How it works</a></li>
          <li><a href="${h("after-booking.html")}">After you book</a></li>
          <li><a href="${h("companies.html")}">Workflow builds for companies</a></li>
          <li><a href="${h("reviews.html")}">Reviews</a></li>
          <li><a href="${h("faq.html")}">FAQ</a></li>
          <li><a href="${h("contact.html")}">Contact</a></li>
        </ul>
      </div>
      <div>
        <p><strong>Policies</strong></p>
        <ul class="footer-links">
          <li><a href="${h("privacy.html")}">Privacy Policy</a></li>
          <li><a href="${h("terms.html")}">Terms</a></li>
          <li><a href="${h("accessibility.html")}">Accessibility statement</a></li>
          <li><a href="${h("review.html")}">Leave a review</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap disclaimer">
      <p>${DISCLAIMER}</p>
      <p>© <span data-year>2026</span> Jordana Young</p>
    </div>
  </footer>
  <div id="cookie-banner" class="cookie" hidden role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text">
    <p id="cookie-text"><strong id="cookie-title">Analytics cookies.</strong> I use an analytics tool only after you accept. If you reject it, the site still works and no analytics script loads.</p>
    <button type="button" class="button button-solid" id="cookie-accept">Accept analytics</button>
    <button type="button" class="button button-line" id="cookie-reject">Reject</button>
    <a href="${h("privacy.html")}">Read the Privacy Policy</a>
  </div>
  <script src="${h("config.js")}"></script>
  <script src="${h("js/logic.js")}"></script>
  <script src="${h("js/site.js")}"></script>
  <script src="${h("js/forms.js")}"></script>
  ${extra}
</body>
</html>
`;
}

function write(file, opts) {
  const html = shell(file, opts);
  const dest = path.join(rootDir, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}

const pages = [];

pages.push(["index.html", {
  title: "Jordana Young · One-to-one AI sessions and group cohorts",
  description: "One-to-one AI sessions and small-group cohorts, online in English. Find your level, then book a session or join a December group.",
  active: "",
  scripts: ["js/cohorts.js"],
  body: (h) => `
  <section class="hero">
    <div class="wrap">
      <p class="kicker">Courses, coaching, and company builds</p>
      <h1>I help shape Microsoft's AI agent builder. Now I'll help you put AI to work.</h1>
      <p class="lede">Every engagement moves you a couple of steps further so you feel you got clear value for your money.</p>
      <p>I'm part of the Microsoft team building Copilot Studio, with 20+ years shaping products and customer experiences at Microsoft, Meta, HoneyBook, and SodaStream.</p>
      <div class="actions">
        <a class="button button-solid" href="${h("assess.html")}">Find your level</a>
        <a class="button button-line" href="${h("sessions.html")}">See the current price</a>
      </div>
    </div>
  </section>
  <section class="section" aria-labelledby="cred-heading" style="padding-top:0">
    <div class="wrap">
      <h2 id="cred-heading" class="visually-hidden">Credentials</h2>
      ${credStrip(h)}
    </div>
  </section>
  <section class="section" aria-labelledby="price-heading" style="padding-top:0">
    <div class="wrap">
      <div class="section-head">
        <h2 id="price-heading">The current price</h2>
        <p>I'm releasing 40 private coaching sessions, sold in order. Eight cost ₪400, the next eight cost ₪600, then ₪750, then ₪950, then ₪1,200. The price depends on how many are already sold. It doesn't depend on your level.</p>
      <p class="actions"><a class="button button-line" href="${h("sessions.html")}">See the five prices</a></p>
      </div>
      <div class="price-layout">
        ${priceCard(h, "assess.html", "Find your level")}
        <div>
          <ol class="ladder" data-price-ladder></ol>
          <p class="muted" data-vat-note>Prices are in Israeli shekels (ILS). The figure on the payment page is the figure you pay.</p>
          <p><a href="${h("sessions.html")}">See what a session includes</a></p>
        </div>
      </div>
    </div>
  </section>
  <section class="section" aria-labelledby="how-heading">
    <div class="wrap">
      <div class="section-head">
        <h2 id="how-heading">How a session happens</h2>
        <p>Five steps. You do the first two on this site, then you pay, then you choose a time.</p>
      </div>
      <div class="steps">
        <article class="step"><span class="step-num">1</span><h3>Tell me how to reach you</h3><p>Name, email, and phone, plus a separate choice about marketing messages.</p></article>
        <article class="step"><span class="step-num">2</span><h3>Answer 12 questions</h3><p>They take a few minutes. The score recommends a level and a learning path.</p></article>
        <article class="step"><span class="step-num">3</span><h3>See your level</h3><p>Beginner, Intermediate, Advanced, or Expert. The price on the page stays the current price.</p></article>
        <article class="step"><span class="step-num">4</span><h3>Pay, then book</h3><p>Pay in ILS by card or Bit. Then choose a time. Bookings open the week of Sunday 29 November 2026.</p></article>
        <article class="step"><span class="step-num">5</span><h3>Prepare, then meet</h3><p>Do the short prep for your level. We meet online and you leave with an artifact and a next step.</p></article>
      </div>
      <p class="actions"><a class="button button-solid" href="${h("assess.html")}">Start with the questionnaire</a> <a class="button button-line" href="${h("how-it-works.html")}">Read the full steps</a></p>
    </div>
  </section>
  <section class="section" aria-labelledby="paths-heading">
    <div class="wrap">
      <div class="section-head">
        <h2 id="paths-heading">What we can work on</h2>
        <p>The last question asks which area you want. We use that path in the session, on your own task.</p>
      </div>
      <div class="use-grid">
        <article class="use-card"><h3>Work productivity</h3><p>Email, meeting notes, and updates you have to write again next week.</p></article>
        <article class="use-card"><h3>Writing</h3><p>Drafts, rewrites, and a voice you want the tool to keep.</p></article>
        <article class="use-card"><h3>Research</h3><p>Sharper questions, and a way to check the answer.</p></article>
        <article class="use-card"><h3>Images</h3><p>Pictures you can use, with prompts you can change.</p></article>
        <article class="use-card"><h3>Agents and automation</h3><p>One repeated process, built as an assistant or an automation.</p></article>
        <article class="use-card"><h3>AI at home</h3><p>Planning, learning, or organising information you actually use.</p></article>
      </div>
      <p class="actions"><a class="button button-solid" href="${h("assess.html")}">Find your level</a></p>
    </div>
  </section>
  <section class="section" aria-labelledby="cohorts-heading">
    <div class="wrap">
      <div class="section-head">
        <h2 id="cohorts-heading">Learn with a small group</h2>
        <p>December 2026 has two Beginner AI Starter groups on Sunday nights, and one Intermediate AI at Work group on Wednesday nights. Each group is live online via Zoom, with small hands-on breakout rooms and a private group chat between sessions. ₪600 per person, 15 seats. Exact dates are coming soon.</p>
      </div>
      <div class="cohort-grid" data-cohort-teaser aria-busy="true"></div>
      <p class="actions"><a class="button button-solid" href="${h("cohorts.html")}">See the cohorts</a></p>
    </div>
  </section>
  <section class="band-dark" aria-labelledby="companies-heading">
    <div class="wrap band-inner">
      <h2 id="companies-heading">Workflow builds for companies</h2>
      <p>I also build AI workflows for teams. The price is a quote after a 20-minute discovery call, so it doesn't use the coaching prices above.</p>
      <p>Typical work: sorting customer inquiries and drafting replies, turning meeting notes into CRM updates, or a knowledge assistant over documents your team already has.</p>
      <p class="actions"><a class="button button-light" href="${h("quote.html")}">Get a quote for a custom build</a> <a class="button button-line" href="${h("companies.html")}">See how a build runs</a></p>
    </div>
  </section>
  <section class="section" aria-labelledby="reviews-heading">
    <div class="wrap">
      <div class="section-head">
        <h2 id="reviews-heading">Reviews</h2>
        <p>I publish a review only after I have read it, and only if you agreed to that. I don't change your words.</p>
      </div>
      <div data-reviews></div>
      <p class="actions"><a href="${h("review.html")}">Leave a review</a></p>
    </div>
  </section>
  <section class="section" aria-labelledby="next-heading" style="padding-top:0">
    <div class="wrap">
      <h2 id="next-heading">Start with the questionnaire.</h2>
      <p>It recommends a level and a path. You can pay and book straight after, while places at the current price are still open.</p>
      <p class="actions"><a class="button button-solid" href="${h("assess.html")}">Find your level</a> <a class="button button-line" href="${h("faq.html")}">Read the FAQ</a></p>
    </div>
  </section>`
}]);

pages.push(["about.html", {
  title: "About · Jordana Young",
  description: "Jordana Young is part of the Microsoft team building Copilot Studio. She teaches people to use AI, one to one and in small groups.",
  active: "about.html",
  body: (h) => `
  <section class="section">
    <div class="wrap about-top">
      <div>
        <p class="kicker">About</p>
        <h1><span data-ms="on">I help shape Microsoft's AI agent builder. Now I'll help you put AI to work.</span><span data-ms="off" hidden>I study the moments where people stall with AI. Then I help you get past them.</span></h1>
      </div>
      <div class="portrait" data-portrait><span class="monogram" aria-hidden="true">JY</span></div>
    </div>
    <div class="wrap" style="padding-top:1.5rem">
      <p>I'm part of the Microsoft team building Copilot Studio, with 20+ years shaping products and customer experiences at Microsoft, Meta, HoneyBook, and SodaStream.</p>
      <p>I sit with the people building AI agents, see exactly where they get stuck, and work with product, design, and engineering to fix it. I've published 21 studies on AI agents, tested with builders in four countries, and received the Microsoft 2026 Innovation Catalyst Award.</p>
      <p>So I know the moments where people stall with AI, and I know how to get them past those moments. Every engagement moves you a couple of steps further so you feel you got clear value for your money.</p>
      <p><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">See my LinkedIn profile<span class="visually-hidden"> (opens in a new tab)</span></a></p>
      <h2 id="credentials">Credentials</h2>
      ${credStrip(h)}
      <h2>How I teach</h2>
      <p>I meet you where you are. We pick one or two goals tied to a real task, and you do the hands-on work while I guide you. You leave with an artifact, such as a prompt you can reuse, a custom assistant, or a workflow, plus a short plan for what to do next.</p>
      <p>Coaching is live and one to one, online. Cohorts are live on Zoom, in small breakout rooms, with a private group chat between sessions.</p>
      <p class="actions"><a class="button button-solid" href="${h("assess.html")}">Find your level</a> <a class="button button-line" href="${h("cohorts.html")}">See December groups</a></p>
      <div class="note" style="padding:1rem;margin-top:1rem">
        <p>${DISCLAIMER}</p>
      </div>
    </div>
  </section>`
}]);

pages.push(["sessions.html", {
  title: "Sessions and pricing · Jordana Young",
  description: "40 private coaching sessions, sold in order: ₪400, ₪600, ₪750, ₪950, then ₪1,200. Eight seats at each price.",
  active: "sessions.html",
  body: (h) => `
  <section class="section">
    <div class="wrap">
      <p class="kicker">Sessions</p>
      <h1>One session. The price steps up as places sell.</h1>
      <p class="lede">Each booking is a single live session. There are 40 in this release. They sell in order, so earlier bookings pay less. Your level changes the prep and the work we do. It doesn't change the price.</p>
      <div class="price-layout">
        ${priceCard(h, "assess.html", "Find your level, then book")}
        <div>
          <h2>The five price steps</h2>
          <ol class="ladder" data-price-ladder></ol>
          <p class="muted" data-vat-note>Prices are in Israeli shekels (ILS). The figure on the payment page is the figure you pay.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section" style="padding-top:0">
    <div class="wrap">
      <h2>What you get, at every level</h2>
      <ul class="check">
        <li>A live, one-to-one session online, in English.</li>
        <li>A level and a learning path from the questionnaire, so we start from where you are.</li>
        <li>You drive. I guide. You leave with an artifact and three next steps.</li>
        <li>A prep page for your level, and a short goals form I read before we meet.</li>
        <li>A calendar invite on my Google Calendar, with your name and level in the title once the booking tool is connected.</li>
        <li>Payment in ILS by credit card or Bit, on the payment provider's page. Then you choose the time.</li>
      </ul>
      <p>The booking page shows how long the session is. There is a short gap after each one so sessions don't run into each other.</p>
      <h2>How the level changes the session</h2>
      <div class="level-grid">
        <article class="level-card"><h3>Beginner</h3><p>New or occasional. We set up an account and get a first useful result on an everyday task.</p><p><a href="${h("prep/beginner.html")}">Beginner prep</a></p></article>
        <article class="level-card"><h3>Intermediate</h3><p>You already use a chat tool. We build a prompt you can run again on real work.</p><p><a href="${h("prep/intermediate.html")}">Intermediate prep</a></p></article>
        <article class="level-card"><h3>Advanced</h3><p>You use AI often. We start a custom assistant, a file-based task, or a simple automation.</p><p><a href="${h("prep/advanced.html")}">Advanced prep</a></p></article>
        <article class="level-card"><h3>Expert</h3><p>You want an agent or a multi-step automation, connected to tools you already use.</p><p><a href="${h("prep/expert.html")}">Expert prep</a></p></article>
      </div>
      <h2 id="credentials">Credentials</h2>
      ${credStrip(h)}
      <p class="actions"><a class="button button-solid" href="${h("assess.html")}">Find your level</a> <a class="button button-line" href="${h("how-it-works.html")}">See hours and how booking works</a></p>
    </div>
  </section>`
}]);

pages.push(["how-it-works.html", {
  title: "How it works · Jordana Young",
  description: "Find your level, pay the current price, then book a time. Sessions run Sunday to Thursday, Israel time, from 29 November 2026.",
  active: "how-it-works.html",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">How it works</p>
      <h1>Pay first. Then choose a time.</h1>
      <p class="lede">The questionnaire tells us your level. You pay the step that's open, then you pick a time. That time goes straight onto my Google Calendar.</p>
      <h2>The steps</h2>
      <ol class="check">
        <li>You leave your name, email, and phone, and you choose whether I may send marketing messages. Service messages about your booking are separate.</li>
        <li>You answer 12 questions. Ten are scored. One asks what you want help with. One chooses a path.</li>
        <li>You see a level: Beginner, Intermediate, Advanced, or Expert, plus a path such as writing or research.</li>
        <li>You pay the current price on a secure page. I never see your card number. Bit and Israeli credit cards are the intended methods.</li>
        <li>You open the booking page and choose a time. Put your name and level in the form if they are not already filled in, so the calendar title can read like this: AI Session: Dana Cohen (Beginner).</li>
        <li>You get a video link, a prep page for your level, and a goals form. I read the form before we meet.</li>
      </ol>
      <p class="actions"><a class="button button-solid" href="${h("assess.html")}">Find your level</a></p>
      <h2>When you can book</h2>
      <p>Bookings open the week of Sunday 29 November 2026. No times are offered before that date. The booking page shows times in your time zone, and the confirmation also states the Israel time.</p>
      ${hoursTable()}
      <p>Friday and Saturday are closed. Lunch is blocked every open day, so a session cannot overlap 12:00 to 12:30. Monday afternoons are also blocked from 16:30 to 18:30.</p>
      <h2>Google Calendar</h2>
      <p>When a booking is confirmed, it is added to my Google Calendar. Busy times on that calendar are blocked on the booking page, including sessions booked through other tools, so we don't double-book. A reschedule moves the event. A cancellation clears it. I connect the calendar inside the booking tool (Cal.com or Calendly).</p>
      <p class="actions"><a class="button button-line" href="${h("book.html")}">Go to book and pay</a> <a class="button button-line" href="${h("after-booking.html")}">See what happens after you book</a></p>
    </div>
  </section>`
}]);

pages.push(["assess.html", {
  title: "Find your level · Jordana Young",
  description: "Leave your contact details, then answer 12 questions to get a recommended AI level and learning path.",
  active: "",
  scripts: ["js/assess.js"],
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Questionnaire</p>
      <h1>Find your level</h1>
      <p class="lede">First I need a way to reach you. Then there are 12 short questions. Most people finish in under 4 minutes. You'll see a level and a path. The one-to-one price stays whatever step is open.</p>
      <form id="lead-form" novalidate>
        <p class="hint">Required fields are marked. The marketing box is optional and starts unticked.</p>
        ${alertBox()}
        ${honeypot("lead-hp")}
        <div class="field"><label for="firstName">First name (required)</label><input id="firstName" name="firstName" autocomplete="given-name" required><span class="field-error" data-error-for="firstName"></span></div>
        <div class="field"><label for="lastName">Last name (required)</label><input id="lastName" name="lastName" autocomplete="family-name" required><span class="field-error" data-error-for="lastName"></span></div>
        <div class="field"><label for="email">Email (required)</label><input id="email" name="email" type="email" autocomplete="email" inputmode="email" required><span class="field-error" data-error-for="email"></span></div>
        <div class="field"><label for="phone">Mobile phone (required)</label><input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required><span class="hint">Include the country code, for example +972.</span><span class="field-error" data-error-for="phone"></span></div>
        <fieldset>
          <legend>Can I message this number on WhatsApp? (required)</legend>
          <label class="choice" for="wa-yes"><input id="wa-yes" type="radio" name="whatsapp" value="yes" required> Yes</label>
          <label class="choice" for="wa-no"><input id="wa-no" type="radio" name="whatsapp" value="no" required> No</label>
          <span class="field-error" data-error-for="whatsapp"></span>
        </fieldset>
        <div class="field">
          <label for="heard">How did you hear about me? (required)</label>
          <select id="heard" name="heard" required>
            <option value="">Choose one</option>
            <option>LetsGo</option><option>LinkedIn</option><option>Instagram</option><option>Facebook</option><option>WhatsApp</option><option>A friend</option><option>Search</option><option>Other</option><option>Prefer not to say</option>
          </select>
          <span class="field-error" data-error-for="heard"></span>
        </div>
        <div class="choice">
          <input id="privacyConsent" name="privacyConsent" type="checkbox" value="yes" required>
          <label for="privacyConsent">I have read the <a href="${h("privacy.html")}">Privacy Policy</a> and I agree to be contacted about arranging a session. (required)</label>
        </div>
        <span class="field-error" data-error-for="privacyConsent"></span>
        <div class="choice">
          <input id="marketingConsent" name="marketingConsent" type="checkbox" value="yes">
          <label for="marketingConsent">You may send me occasional tips and offers by email or WhatsApp. This is optional, and I can opt out at any time.</label>
        </div>
        <div class="actions">
          <button type="submit" class="button button-solid">Continue to the questions</button>
          <button type="button" class="button button-line" id="lead-continue" hidden>Continue in this browser anyway</button>
        </div>
      </form>
      <form id="quiz-form" hidden>
        <p id="quiz-note" class="note" style="padding:0.8rem 1rem" hidden></p>
        <p id="quiz-progress" class="quiz-progress">Question 1 of 12</p>
        <div id="quiz-bar" class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="12" aria-valuenow="1" aria-label="Questionnaire progress"><span></span></div>
        <div id="quiz-slot"></div>
        <div class="quiz-actions">
          <button type="button" class="button button-line" id="quiz-back">Back</button>
          <button type="submit" class="button button-solid" id="quiz-next">Next</button>
        </div>
      </form>
    </div>
  </section>`
}]);

pages.push(["results.html", {
  title: "Your level · Jordana Young",
  description: "Your recommended AI level and learning path, and the current session price.",
  active: "",
  scripts: ["js/results.js"],
  body: (h) => `
  <section class="section">
    <div class="wrap">
      <div id="result-empty">
        <h1>Take the questionnaire first.</h1>
        <p>Your level is calculated in this browser after the questions, so this page is empty until then.</p>
        <p><a class="button button-solid" href="${h("assess.html")}">Find your level</a></p>
      </div>
      <div id="result" hidden>
        <p class="kicker">Your result</p>
        <h1 id="result-level">Your level</h1>
        <p id="result-summary" class="lede"></p>
        <p id="result-score"></p>
        <p id="result-adjust" hidden></p>
        <h2>Learning path: <span id="result-path"></span></h2>
        <p id="result-path-summary"></p>
        <h2>By the end of this course you will…</h2>
        <ul id="result-outcomes" class="check"></ul>
        <section id="cohort-offer" aria-live="polite">
          <h2>The next groups</h2>
          <div id="cohort-offer-body"><p>Loading the groups for your level.</p></div>
        </section>
        <aside id="session-cta" class="quiet-offer">
          <h2>Prefer a one-to-one session?</h2>
          <p>That's a single live session at the current price. It's separate from the cohort, and your level doesn't change that price.</p>
          <p class="actions"><a class="button button-line" href="${h("book.html")}">Book a one-to-one session</a> <a id="result-prep" href="${h("prep/beginner.html")}">Read the prep for this level</a></p>
        </aside>
        <aside id="company-cta" class="note" style="padding:1rem;margin-top:1.2rem" hidden>
          <h2>Building this for a team?</h2>
          <p>A workflow for a company is a separate quote. It doesn't use this session price, or the cohort price.</p>
          <p><a class="button button-accent" href="${h("quote.html")}">Get a quote for a custom build</a></p>
        </aside>
      </div>
    </div>
  </section>`
}]);

pages.push(["cohorts.html", {
  title: "Group cohorts · Jordana Young",
  description: "December 2026: two Beginner AI Starter groups on Sunday nights, and one Intermediate AI at Work group on Wednesday nights. ₪600, 15 seats.",
  active: "cohorts.html",
  scripts: ["js/cohorts.js"],
  body: (h) => `
  <section class="section">
    <div class="wrap">
      <p class="kicker">Cohorts</p>
      <h1>Sunday starters, and a Wednesday group for work.</h1>
      <p class="lede">December 2026 has two Beginner AI Starter cohorts on Sunday nights, and one Intermediate AI at Work cohort on Wednesday nights. Sessions are live online via Zoom, with small hands-on breakout rooms and a private group chat between sessions. ₪600 per person, 15 seats in each group.</p>
      <p>Beginner is three weekly sessions: 90 minutes, 90 minutes, then a 60-minute live clinic and wrap-up. Intermediate is four weekly 90-minute sessions. Exact dates are coming soon. Advanced and Expert groups open in Q1 2027.</p>
      <div class="cohort-grid" data-cohort-list aria-busy="true"></div>
      <noscript><p>JavaScript is off, so the seat count can't load. Use the form below, or the contact page, and tell me your level.</p></noscript>
    </div>
  </section>
  <section class="section" style="padding-top:0" aria-labelledby="cohort-waitlist">
    <div class="wrap-narrow">
      <h2 id="cohort-waitlist">Join the waitlist</h2>
      <p>Use this if a cohort is full, or if the next date isn't set yet. I'll email you about that cohort. Other notes only go out if you tick the optional box.</p>
      <p id="cohort-prefill" class="hint" hidden></p>
      <form id="cohort-waitlist-form" class="form-card" data-endpoint="cohortWaitlist" data-success="You're on the waitlist. I'll email you when a date is set or a seat opens for this level. I'll only send other notes if you ticked the optional box." data-unconfigured="The cohort waitlist isn't connected yet. Please use the contact page, name the level, and I'll add you by hand." novalidate>
        ${alertBox()}
        ${honeypot("cohort-hp")}
        <div class="field"><label for="cohort-name">Name (required)</label><input id="cohort-name" name="name" autocomplete="name" required><span class="field-error" data-error-for="name"></span></div>
        <div class="field"><label for="cohort-email">Email (required)</label><input id="cohort-email" name="email" type="email" autocomplete="email" inputmode="email" required><span class="field-error" data-error-for="email"></span></div>
        <div class="field"><label for="cohort-phone">Phone (optional)</label><input id="cohort-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"><span class="hint">Include the country code if you add a number, for example +972.</span></div>
        <div class="field"><label for="cohort-level">Level (required)</label>
          <select id="cohort-level" name="level" required>
            <option value="">Choose one</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced (opens later)</option>
            <option value="expert">Expert (opens later)</option>
          </select>
          <span class="field-error" data-error-for="level"></span>
        </div>
        <div class="field"><label for="cohort-run">Group</label>
          <select id="cohort-run" name="runId">
            <option value="">I'm flexible</option>
            <option value="beginner-sunday-a">Beginner, Sunday cohort A</option>
            <option value="beginner-sunday-b">Beginner, Sunday cohort B</option>
            <option value="intermediate-wednesday">Intermediate, Wednesday cohort</option>
          </select>
          <span class="hint">The two Sunday groups are separate. Start times aren't set yet.</span>
        </div>
        <div class="field"><label for="cohort-path">Preferred path</label>
          <select id="cohort-path" name="path">
            <option value="">Not sure yet</option>
            <option value="work">Work productivity</option>
            <option value="writing">Writing</option>
            <option value="research">Research</option>
            <option value="images">Images</option>
            <option value="agents">Agents and automation</option>
            <option value="home">AI at home</option>
          </select>
        </div>
        <div class="choice">
          <input id="cohort-privacy" name="privacyConsent" type="checkbox" value="yes" required>
          <label for="cohort-privacy">I have read the <a href="${h("privacy.html")}">Privacy Policy</a> and I agree to be contacted about this cohort. (required)</label>
        </div>
        <span class="field-error" data-error-for="privacyConsent"></span>
        <div class="choice">
          <input id="cohort-marketing" name="marketingConsent" type="checkbox" value="yes">
          <label for="cohort-marketing">You may send me occasional tips and offers by email or WhatsApp. This is optional, and I can opt out at any time.</label>
        </div>
        <button class="button button-solid" type="submit">Join the waitlist</button>
      </form>
    </div>
  </section>`
}]);

pages.push(["book.html", {
  title: "Book and pay · Jordana Young",
  description: "Pay the current session price, then choose a time. Sunday to Thursday, Israel time, from 29 November 2026.",
  active: "",
  scripts: ["js/book.js"],
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Book</p>
      <h1>Book and pay</h1>
      <p class="lede">Pay first, on the payment provider's page. Then choose a time. I don't store your card number.</p>
      <div data-when="soldout" hidden>
        <p>All 40 sessions in this release are sold, so booking is closed until the next release.</p>
        <p><a class="button button-solid" href="${h("waitlist.html")}">Join the waitlist</a></p>
      </div>
      <div data-when="available">
        <div id="book-gate">
          <p>If you haven't done the questionnaire in this browser, add your details here so the booking link can carry your name and level.</p>
          <form id="book-gate-form" class="form-card" novalidate>
            ${alertBox()}
            <div class="field"><label for="firstName">First name (required)</label><input id="firstName" name="firstName" autocomplete="given-name" required><span class="field-error" data-error-for="firstName"></span></div>
            <div class="field"><label for="lastName">Last name (required)</label><input id="lastName" name="lastName" autocomplete="family-name" required><span class="field-error" data-error-for="lastName"></span></div>
            <div class="field"><label for="email">Email (required)</label><input id="email" name="email" type="email" autocomplete="email" required><span class="field-error" data-error-for="email"></span></div>
            <div class="field"><label for="phone">Mobile phone</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
            <div class="field"><label for="level">Level (required)</label>
              <select id="level" name="level" required>
                <option value="">Choose one</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <span class="field-error" data-error-for="level"></span>
            </div>
            <button class="button button-solid" type="submit">Continue to payment</button>
          </form>
        </div>
        <div id="book-flow">
          <p id="book-who"></p>
          <p class="price-left" data-price-left>Loading how many are left.</p>
          <p data-price-next></p>
          <h2>1. Pay</h2>
          <p>You pay the current price in ILS. Card and Bit are the intended methods. After a successful payment you should get a confirmation by email, and a receipt or tax invoice once invoicing is connected.</p>
          <p><a class="button button-solid" id="pay-link" data-label="Pay" href="${h("contact.html")}">Pay</a></p>
          <p class="hint" data-link-note hidden>The payment link is not connected yet. Use the contact page and I will send it.</p>
          <h2>2. Choose a time</h2>
          <p>Set the payment provider to send people to the booking link after payment. The button below opens that same link, with your name, email, and level added as parameters.</p>
          <p><a class="button button-line" id="schedule-link" href="${h("contact.html")}">Choose a time</a></p>
          <p class="hint" data-link-note hidden>The booking link is not connected yet. Use the contact page and I will send times.</p>
          <h2>Hours</h2>
          <p>Bookings open the week of Sunday 29 November 2026. Times on the booking page appear in your time zone. The confirmation also states the Israel time.</p>
          ${hoursTable()}
          <h2>Google Calendar</h2>
          <p>The booking tool adds the session to my Google Calendar and blocks times that are already busy. The title should include your name and level, for example AI Session: Dana Cohen (Beginner).</p>
          <p><a id="book-prep" href="${h("after-booking.html")}">See what to prepare</a></p>
        </div>
      </div>
    </div>
  </section>`
}]);

pages.push(["after-booking.html", {
  title: "After you book · Jordana Young",
  description: "What happens after you pay and book: calendar invite, level prep, goals form, the session, and a follow-up.",
  active: "",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">After booking</p>
      <h1>What happens after you book</h1>
      <p class="lede">Once you've paid and chosen a time, you'll have a video link. Do the prep for your level before we meet, so we can start on your task.</p>
      <ol class="check">
        <li>You pay on the provider's page and keep the confirmation. A formal Israeli receipt or tax invoice is emailed once the invoicing tool is connected.</li>
        <li>You choose a time. Bookings open the week of Sunday 29 November 2026, Sunday to Thursday, 11:00 to 20:00 Israel time, with lunch 12:00 to 12:30 and Mondays also blocked 16:30 to 18:30.</li>
        <li>The booking is added to my Google Calendar. A busy event on that calendar blocks the same time here.</li>
        <li>Open the prep page for your level and fill in the goals form. I read it before the session.</li>
        <li>We meet. We check the starting point, agree one or two goals, you build while I guide, you save an artifact, and we write three next steps.</li>
        <li>After the session I send a recap with the artifact, a short feedback note, and an invitation to leave a review.</li>
      </ol>
      <p>Some of those emails may be sent by hand until the automations are connected. The prep pages are ready now.</p>
      <h2>Prep by level</h2>
      <ul class="plain-list">
        <li><a href="${h("prep/beginner.html")}">Beginner prep</a></li>
        <li><a href="${h("prep/intermediate.html")}">Intermediate prep</a></li>
        <li><a href="${h("prep/advanced.html")}">Advanced prep</a></li>
        <li><a href="${h("prep/expert.html")}">Expert prep</a></li>
      </ul>
      <p class="actions"><a class="button button-solid" href="${h("assess.html")}">Find your level</a> <a class="button button-line" href="${h("book.html")}">Book and pay</a></p>
    </div>
  </section>`
}]);

function prep({ slug, label, intro, items, reading }) {
  pages.push([`prep/${slug}.html`, {
    title: `${label} prep · Jordana Young`,
    description: `What to set up before a ${label.toLowerCase()} AI session with Jordana Young.`,
    active: "",
    body: (h) => `
    <section class="section">
      <div class="wrap-narrow">
        <p class="kicker">${label} prep</p>
        <h1>Before your ${label.toLowerCase()} session</h1>
        <p class="lede">${intro}</p>
        <h2>Setup checklist</h2>
        <ul class="check">${items.map((item) => `<li>${item}</li>`).join("")}</ul>
        <h2>A short read</h2>
        ${reading}
        <h2>Safety</h2>
        <p>Do not paste passwords, identity numbers, health details, or confidential work files into an AI tool. If you want to use something from work, check your employer's AI rules first, and bring a non-confidential sample if you are unsure.</p>
        <h2>Tell me your goals</h2>
        <p>The goals form takes a few minutes. I use it to walk in knowing your task, your tools, and anything that will help you take part.</p>
        <p class="actions"><a class="button button-solid" href="${h("goals.html")}?level=${slug}">Open the goals form</a></p>
        <p><a href="${h("after-booking.html")}">Back to what happens after you book</a></p>
      </div>
    </section>`
  }]);
}

prep({
  slug: "beginner",
  label: "Beginner",
  intro: "Do these three things before we meet, so we don't spend the session creating an account or testing the video call.",
  items: [
    "Create a free ChatGPT or Claude account, and log in on the device you will use in the session.",
    "Check that video calls and screen sharing work on that device.",
    "Write down 2 or 3 everyday tasks you would like help with."
  ],
  reading: `<p>AI tools predict a likely next answer from your prompt and from patterns in their training. They are useful for drafts, lists, explanations, and first versions. They can also be confidently wrong, so we will check anything that matters. You don't need to memorise how the model works before we meet.</p>`
});

prep({
  slug: "intermediate",
  label: "Intermediate",
  intro: "Bring real work you are allowed to share, and a note of where you got stuck. A paid AI plan is optional.",
  items: [
    "Have the AI account you already use ready on the device you will use. A paid plan is optional.",
    "Bring 2 or 3 real work tasks or documents. Keep them non-confidential.",
    "Note what you have tried and where you got stuck.",
    "Optional: try one extra tool before we meet, such as a second chat tool or a meeting-notes tool, and jot down what it did."
  ],
  reading: `<p>A reliable prompt has four parts: the context (who you are and what the task is), the task itself, the format you want back, and a check (what would make the answer wrong). We will turn one of your tasks into a prompt you can reuse.</p>`
});

prep({
  slug: "advanced",
  label: "Advanced",
  intro: "Come with the tools installed and one workflow you want to build or improve. We will spend the session on that workflow.",
  items: [
    "Have the relevant tools ready. Examples: ChatGPT or Claude, custom GPTs or Projects, an automation tool such as Zapier or Make, or an agent builder.",
    "Prepare one concrete workflow or use case to build or improve in the session.",
    "Share sample inputs ahead if you can, through the goals form. Keep them non-confidential."
  ],
  reading: `<p>A custom assistant is a saved set of instructions, plus any files or tools you attach, so you don't re-explain the job every time. We will decide what the assistant must do, what it must refuse, and how you will check its output.</p>`
});

prep({
  slug: "expert",
  label: "Expert",
  intro: "Same setup as an advanced session, plus access to the systems you want to connect and a non-sensitive sample of the data.",
  items: [
    "Have the relevant tools ready: chat tools, custom assistants, an automation tool such as Zapier or Make, or an agent builder.",
    "Prepare one concrete workflow to build or improve.",
    "Bring logins or permissions for the systems you want to connect, and check you can sign in before we meet.",
    "Have non-sensitive sample data ready. Do not bring live customer data or secrets."
  ],
  reading: `<p>A useful agent pattern has a trigger, written instructions, one or two tools it may call, and a check before anything is sent or saved. We will build the smallest version of that pattern that still does the job.</p>`
});

pages.push(["goals.html", {
  title: "Goals form · Jordana Young",
  description: "Tell Jordana your goals, the task you are bringing, and anything that will help you take part in the session.",
  active: "",
  scripts: ["js/goals.js"],
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Goals</p>
      <h1>What do you want from the session?</h1>
      <p class="lede">Six short answers. I read them before we meet. If this form is not connected yet, the page will say so and you can send the same notes from the contact page.</p>
      <form id="goals-form" class="form-card" data-endpoint="goals" data-success="Thank you. I have your goals and I will read them before the session." data-unconfigured="The goals form is not connected yet. Please send the same notes from the contact page, with the email you used to book." novalidate>
        ${alertBox()}
        ${honeypot("goals-hp")}
        <div class="field"><label for="firstName">First name (required)</label><input id="firstName" name="firstName" autocomplete="given-name" required><span class="field-error" data-error-for="firstName"></span></div>
        <div class="field"><label for="lastName">Last name (required)</label><input id="lastName" name="lastName" autocomplete="family-name" required><span class="field-error" data-error-for="lastName"></span></div>
        <div class="field"><label for="email">Email you used to book (required)</label><input id="email" name="email" type="email" autocomplete="email" required><span class="field-error" data-error-for="email"></span></div>
        <div class="field"><label for="level">Level</label>
          <select id="level" name="level">
            <option value="">Not sure yet</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        <div class="field"><label for="goals">Your top 1 or 2 goals (required)</label><textarea id="goals" name="goals" required></textarea><span class="field-error" data-error-for="goals"></span></div>
        <div class="field"><label for="task">A real task to work on (required)</label><textarea id="task" name="task" required></textarea><span class="hint">Use a non-confidential example.</span><span class="field-error" data-error-for="task"></span></div>
        <div class="field"><label for="tools">Tools you already use</label><textarea id="tools" name="tools"></textarea></div>
        <div class="field"><label for="frustrations">Where you get stuck</label><textarea id="frustrations" name="frustrations"></textarea></div>
        <div class="field"><label for="accessNeeds">Anything that will help you take part</label><textarea id="accessNeeds" name="accessNeeds"></textarea><span class="hint">For example captions, a slower pace, or a break.</span></div>
        <fieldset>
          <legend>May I record the session?</legend>
          <label class="choice" for="rec-yes"><input id="rec-yes" type="radio" name="recording" value="yes"> Yes, and I understand the recording is shared only with me</label>
          <label class="choice" for="rec-no"><input id="rec-no" type="radio" name="recording" value="no"> No</label>
          <label class="choice" for="rec-later"><input id="rec-later" type="radio" name="recording" value="decide-in-session"> Let us decide in the session</label>
        </fieldset>
        <div class="choice">
          <input id="privacyConsent" name="privacyConsent" type="checkbox" value="yes" required>
          <label for="privacyConsent">I have read the <a href="${h("privacy.html")}">Privacy Policy</a> and I agree to these notes being used to prepare my session. (required)</label>
        </div>
        <span class="field-error" data-error-for="privacyConsent"></span>
        <button class="button button-solid" type="submit">Send my goals</button>
      </form>
    </div>
  </section>`
}]);

pages.push(["companies.html", {
  title: "Workflow builds for companies · Jordana Young",
  description: "Custom AI workflow builds for teams. Quoted per project, separate from the one-to-one session prices.",
  active: "companies.html",
  body: (h) => `
  <section class="band-dark">
    <div class="wrap band-inner">
      <p class="kicker" style="color:#f3e6cc">For companies</p>
      <h1><span data-ms="on">I help shape Microsoft's AI agent builder. Now I'll help you put AI to work.</span><span data-ms="off" hidden>I study how people get stuck with a process. Then I help you automate the right part of it.</span></h1>
      <p data-ms="on">So I know the exact moments where people stall with AI, and I know how to get them past those moments quickly.</p>
      <p data-ms="off" hidden>I spend my research time watching where a workflow breaks, then I help a team get past that point.</p>
      <p>A company build is priced by quote after a 20-minute discovery call. It doesn't use the coaching prices or the ₪600 cohort price.</p>
      <p><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn<span class="visually-hidden"> (opens in a new tab)</span></a></p>
      <p class="actions"><a class="button button-light" href="${h("quote.html")}">Get a quote for a custom build</a></p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      ${credStrip(h)}
      <h2>Who it is for</h2>
      <p>Operations leads, founders, and small teams who already know the process and want less manual copying, sorting, or drafting. If you are one person learning AI for your own work, the <a href="${h("sessions.html")}">teaching sessions</a> are the right place.</p>
      <h2>Problems I can build for</h2>
      <div class="use-grid">
        <article class="use-card"><h3>Customer inquiries</h3><p>Triage what comes in, and draft replies a person still approves.</p></article>
        <article class="use-card"><h3>Meeting notes</h3><p>Turn notes into the CRM update, the task list, or the follow-up email.</p></article>
        <article class="use-card"><h3>Knowledge assistant</h3><p>Answers drawn from documents your team already trusts, with a way to check the source.</p></article>
        <article class="use-card"><h3>Reports</h3><p>A first draft of a summary or a status report from material you provide.</p></article>
        <article class="use-card"><h3>Lead qualification</h3><p>A first pass on incoming leads, with the rules your team already uses.</p></article>
        <article class="use-card"><h3>Onboarding</h3><p>Checklists and reminders so a new person, or a new client, doesn't depend on memory.</p></article>
      </div>
      <h2>How a build runs</h2>
      <ol class="check">
        <li>A 20-minute discovery call, so I can see the process and the constraint. The quote comes after that call.</li>
        <li>Scoping and a written proposal.</li>
        <li>Build.</li>
        <li>Testing with your team.</li>
        <li>Handover and training.</li>
        <li>Optional support after that.</li>
      </ol>
      <p>The 20-minute discovery call can go on the same calendar as coaching, but it doesn't use one of the 40 session places.</p>
      <p class="actions"><a class="button button-line" href="${h("quote.html")}">Request the discovery call</a></p>
      <h2>What you need to provide</h2>
      <p>A person who knows the process, sample inputs that are safe to share, and access to the tools we connect. I will ask what must never be sent to an AI tool before anything is built.</p>
      <h2>Questions that usually come up</h2>
      <div class="faq">
        <details><summary>How long does a build take?</summary><p>It depends on the process. A single draft-and-route workflow is often a few weeks. I will put a range in the proposal after the discovery call, rather than guess here.</p></details>
        <details><summary>Who owns the build?</summary><p>You should own the accounts, the prompts, and the workflows in your own tools. The proposal will say that in writing.</p></details>
        <details><summary>What about our data?</summary><p>We use non-sensitive samples while building. Live customer data, secrets, and regulated data stay out unless we have agreed a specific control and your own policy allows it.</p></details>
      </div>
      <p class="actions"><a class="button button-accent" href="${h("quote.html")}">Get a quote for a custom build</a></p>
      <div class="note" style="padding:1rem;margin-top:1rem">
        <p>${DISCLAIMER}</p>
      </div>
    </div>
  </section>`
}]);

pages.push(["quote.html", {
  title: "Get a quote for a custom build · Jordana Young",
  description: "Request a quote for a custom AI workflow. This is separate from the one-to-one teaching sessions.",
  active: "companies.html",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Companies</p>
      <h1>Get a quote for a custom build</h1>
      <p class="lede">Tell me the process, the tools, and the rough timing. The price is a quote after a 20-minute discovery call. This isn't a coaching booking, and it doesn't use the 40-session prices.</p>
      <form class="form-card" data-endpoint="quote" data-success="Thank you. I have the request. I will reply with the next step and a realistic time to hear back. If you want a short discovery call, say so in the description and I will send times." data-unconfigured="The quote form is not connected yet. Please use the contact page and include the word quote, your company, and the process you want to change." novalidate>
        ${alertBox()}
        ${honeypot("quote-hp")}
        <div class="field"><label for="name">Your name (required)</label><input id="name" name="name" autocomplete="name" required><span class="field-error" data-error-for="name"></span></div>
        <div class="field"><label for="company">Company (required)</label><input id="company" name="company" autocomplete="organization" required><span class="field-error" data-error-for="company"></span></div>
        <div class="field"><label for="role">Your role (required)</label><input id="role" name="role" autocomplete="organization-title" required><span class="field-error" data-error-for="role"></span></div>
        <div class="field"><label for="email">Email (required)</label><input id="email" name="email" type="email" autocomplete="email" required><span class="field-error" data-error-for="email"></span></div>
        <div class="field"><label for="phone">Phone (required)</label><input id="phone" name="phone" type="tel" autocomplete="tel" required><span class="field-error" data-error-for="phone"></span></div>
        <div class="field"><label for="need">The process you want to change (required)</label><textarea id="need" name="need" required></textarea><span class="field-error" data-error-for="need"></span></div>
        <div class="field"><label for="tools">Tools you use today (required)</label><textarea id="tools" name="tools" required></textarea><span class="field-error" data-error-for="tools"></span></div>
        <div class="field"><label for="teamSize">Team size (required)</label>
          <select id="teamSize" name="teamSize" required><option value="">Choose one</option><option>Just me</option><option>2 to 10</option><option>11 to 50</option><option>51 to 200</option><option>More than 200</option></select>
          <span class="field-error" data-error-for="teamSize"></span>
        </div>
        <div class="field"><label for="timeline">Timeline (required)</label>
          <select id="timeline" name="timeline" required><option value="">Choose one</option><option>As soon as we can start</option><option>This month</option><option>This quarter</option><option>I am exploring</option></select>
          <span class="field-error" data-error-for="timeline"></span>
        </div>
        <div class="field"><label for="budget">Budget range (required)</label>
          <select id="budget" name="budget" required><option value="">Choose one</option><option>Under 5,000 ILS</option><option>5,000 to 15,000 ILS</option><option>15,000 to 40,000 ILS</option><option>40,000 ILS or more</option><option>Not sure yet</option></select>
          <span class="hint">Ranges are a guide so I can tell you quickly if I am the right person. The quote itself is written after we talk.</span>
          <span class="field-error" data-error-for="budget"></span>
        </div>
        <div class="field"><label for="heard">How did you hear about me?</label>
          <select id="heard" name="heard"><option value="">Choose one</option><option>LetsGo</option><option>LinkedIn</option><option>A colleague</option><option>Search</option><option>I booked a teaching session</option><option>Other</option></select>
        </div>
        <div class="choice">
          <input id="privacyConsent" name="privacyConsent" type="checkbox" value="yes" required>
          <label for="privacyConsent">I have read the <a href="${h("privacy.html")}">Privacy Policy</a> and I agree to be contacted about this quote. (required)</label>
        </div>
        <span class="field-error" data-error-for="privacyConsent"></span>
        <div class="choice">
          <input id="marketingConsent" name="marketingConsent" type="checkbox" value="yes">
          <label for="marketingConsent">You may send me occasional notes about teaching and builds. This is optional, and I can opt out at any time.</label>
        </div>
        <button class="button button-accent" type="submit">Request a quote</button>
      </form>
    </div>
  </section>`
}]);

pages.push(["reviews.html", {
  title: "Reviews · Jordana Young",
  description: "Published reviews from Jordana Young's AI sessions. A review appears only after it is approved.",
  active: "",
  body: (h) => `
  <section class="section">
    <div class="wrap">
      <p class="kicker">Reviews</p>
      <h1>What students say</h1>
      <p class="lede">A review is published here only if you agreed, and only after I have read it. I don't rewrite your words. I decline a review only for a clear reason, such as abuse, personal data, spam, or a note that did not come from a session.</p>
      <div data-reviews></div>
      <p class="actions"><a class="button button-solid" href="${h("review.html")}">Leave a review</a></p>
    </div>
  </section>`
}]);

pages.push(["review.html", {
  title: "Leave a review · Jordana Young",
  description: "Leave a review of your AI session. It is published only with your consent and after Jordana approves it.",
  active: "",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Review</p>
      <h1>Leave a review</h1>
      <p class="lede">Use the email you booked with, so I can match the review to a session. Nothing goes on the site until I approve it. Two consent boxes are separate: one for this website, one for LetsGo.</p>
      <form class="form-card" data-endpoint="review" data-success="Thank you. I have the review. I will read it before anything is published. If you did not tick the website box, I will not publish it here." data-unconfigured="The review form is not connected yet. Please send the review from the contact page, with your display name, a rating from 1 to 5, the session level, and whether I may publish it." novalidate>
        ${alertBox()}
        ${honeypot("review-hp")}
        <div class="field"><label for="email">Email you used to book (required)</label><input id="email" name="email" type="email" autocomplete="email" required><span class="field-error" data-error-for="email"></span></div>
        <div class="field"><label for="displayName">Name to show publicly (required)</label><input id="displayName" name="displayName" required><span class="hint">This can be a first name, or a first name and initial.</span><span class="field-error" data-error-for="displayName"></span></div>
        <fieldset>
          <legend>Rating (required)</legend>
          ${[1, 2, 3, 4, 5].map((n) => `<label class="choice" for="rating-${n}"><input id="rating-${n}" type="radio" name="rating" value="${n}" required> ${n} out of 5</label>`).join("")}
          <span class="field-error" data-error-for="rating"></span>
        </fieldset>
        <div class="field"><label for="sessionType">Session level (required)</label>
          <select id="sessionType" name="sessionType" required>
            <option value="">Choose one</option>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option><option>Not sure</option>
          </select>
          <span class="field-error" data-error-for="sessionType"></span>
        </div>
        <div class="field"><label for="text">Your review (required)</label><textarea id="text" name="text" required></textarea><span class="field-error" data-error-for="text"></span></div>
        <div class="choice">
          <input id="consentToPublish" name="consentToPublish" type="checkbox" value="yes">
          <label for="consentToPublish">I agree that Jordana may publish this review on her website, with my display name, rating, and session level.</label>
        </div>
        <div class="choice">
          <input id="shareWithLetsGo" name="shareWithLetsGo" type="checkbox" value="yes">
          <label for="shareWithLetsGo">I agree that Jordana may share this review with LetsGo for her coach profile.</label>
        </div>
        <p class="hint">You can ask me to remove a published review later, from the contact page. I pass that request to LetsGo as well if it was shared there.</p>
        <button class="button button-solid" type="submit">Send my review</button>
      </form>
    </div>
  </section>`
}]);

pages.push(["faq.html", {
  title: "FAQ · Jordana Young",
  description: "Prices, levels, tools, language, payment, booking hours, receipts, privacy, and accessibility.",
  active: "faq.html",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">FAQ</p>
      <h1>Questions before you book</h1>
      <div class="faq">
        <details open><summary>Does my level change the one-to-one price?</summary><p>No. Everyone pays the price that's open when they pay: eight sessions at ₪400, then eight at ₪600, then ₪750, then ₪950, then ₪1,200. The questionnaire changes your prep and what we work on. <a href="${h("sessions.html")}">See the current price</a>.</p></details>
        <details><summary>What's a cohort?</summary><p>A small group, live on Zoom, with breakout rooms and a private group chat. December 2026 has two Beginner groups on Sunday nights (three sessions: 90, 90, then a 60-minute clinic) and one Intermediate group on Wednesday nights (four weekly 90-minute sessions). ₪600 per person, 15 seats. Exact dates are coming soon, so <a href="${h("cohorts.html")}">join the waitlist</a>.</p></details>
        <details><summary>Which level am I?</summary><p>Answer the 12 questions. The score maps to Beginner, Intermediate, Advanced, or Expert. If you haven't tried an AI tool yet, the result stays at Beginner. <a href="${h("assess.html")}">Find your level</a>.</p></details>
        <details><summary>What tools do I need?</summary><p>A laptop, a video call that can share a screen, and an AI account. Beginners can use a free ChatGPT or Claude account. Other levels bring the tools they already use. Each <a href="${h("after-booking.html")}">prep page</a> lists the exact setup.</p></details>
        <details><summary>What language is the session?</summary><p>English. The site, the forms, and the session are in English.</p></details>
        <details><summary>Is it online or in person?</summary><p>Online, one to one. The video link is in the calendar invite. Zoom, Google Meet, or Teams is set in the booking tool.</p></details>
        <details><summary>How do I pay?</summary><p>You pay first, in Israeli shekels, on a page run by an Israeli payment provider. Credit cards and Bit are the intended methods. Then you choose a time. This website doesn't see your card number. <a href="${h("book.html")}">Book and pay</a>.</p></details>
        <details><summary>When can I book?</summary><p>The week of Sunday 29 November 2026, then ongoing. Sunday to Thursday, 11:00 to 20:00 Israel time. Lunch is 12:00 to 12:30. Mondays are also blocked 16:30 to 18:30. Friday and Saturday are closed. <a href="${h("how-it-works.html")}">See the hours</a>.</p></details>
        <details><summary>What if I need to cancel?</summary><p data-cancellation-note>The written cancellation rules are not final yet. The working plan is a free reschedule up to 24 hours before the session. Ask me for the rule in writing before you pay if you need it. The final text will be on the <a href="${h("terms.html")}">Terms page</a> before bookings open.</p></details>
        <details><summary>Will I get a receipt?</summary><p>The payment provider emails a confirmation. A formal Israeli receipt or tax invoice is sent once the invoicing tool is connected to that provider. Keep the confirmation either way.</p></details>
        <details><summary>How is my data used?</summary><p>To reply to you, prepare your session, take payment, and book the time. Marketing messages are sent only if you tick the optional box. Details are in the <a href="${h("privacy.html")}">Privacy Policy</a>.</p></details>
        <details><summary>Is the site accessible?</summary><p>It is built to Israeli Standard 5568, based on WCAG 2.0 Level AA. The <a href="${h("accessibility.html")}">accessibility statement</a> tells you how to ask for help.</p></details>
        <details><summary>Do you build workflows for companies?</summary><p>Yes. That work is quoted separately and doesn't use these session prices. <a href="${h("quote.html")}">Get a quote for a custom build</a>.</p></details>
        <details><summary>What if the 40 sessions sell out?</summary><p>The price card switches to a waitlist for the next release. <a href="${h("waitlist.html")}">Join the waitlist</a>.</p></details>
      </div>
      <p class="actions"><a class="button button-solid" href="${h("assess.html")}">Find your level</a> <a class="button button-line" href="${h("contact.html")}">Ask a question</a></p>
    </div>
  </section>`
}]);

pages.push(["contact.html", {
  title: "Contact · Jordana Young",
  description: "Contact Jordana Young about an AI teaching session or a company workflow.",
  active: "",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Contact</p>
      <h1>Contact</h1>
      <p class="lede">Write to me about a session, a prep question, or a company build. If you already know you want a quote, use the quote form so I get the project details in one place.</p>
      <p><a data-email-link data-keep-label hidden href="">Email me</a></p>
      <p data-email-missing>A public email address is not listed yet. Use the form and I will reply.</p>
      <p><a class="button button-line" data-whatsapp-link hidden href="" target="_blank" rel="noopener noreferrer">WhatsApp<span class="visually-hidden"> (opens in a new tab)</span></a></p>
      <form class="form-card" data-endpoint="contact" data-success="Thank you. I have your message and I will reply." data-unconfigured="The contact form is not connected yet. If an email address is shown above, use that. Otherwise check back once the form service is added." novalidate>
        ${alertBox()}
        ${honeypot("contact-hp")}
        <div class="field"><label for="name">Name (required)</label><input id="name" name="name" autocomplete="name" required><span class="field-error" data-error-for="name"></span></div>
        <div class="field"><label for="email">Email (required)</label><input id="email" name="email" type="email" autocomplete="email" required><span class="field-error" data-error-for="email"></span></div>
        <div class="field"><label for="message">Message (required)</label><textarea id="message" name="message" required></textarea><span class="field-error" data-error-for="message"></span></div>
        <div class="choice">
          <input id="privacyConsent" name="privacyConsent" type="checkbox" value="yes" required>
          <label for="privacyConsent">I have read the <a href="${h("privacy.html")}">Privacy Policy</a> and I agree to be contacted about this message. (required)</label>
        </div>
        <span class="field-error" data-error-for="privacyConsent"></span>
        <button class="button button-solid" type="submit">Send</button>
      </form>
      <p class="actions"><a href="${h("quote.html")}">Get a quote for a custom build</a></p>
    </div>
  </section>`
}]);

pages.push(["waitlist.html", {
  title: "Waitlist · Jordana Young",
  description: "Join the list for the next release of Jordana Young's one-to-one AI sessions.",
  active: "",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Next release</p>
      <h1>Join the list for the next release</h1>
      <p class="lede" data-price-left>If this release still has places, you can book at the current price instead of waiting.</p>
      <p data-when="available">Places are still open. <a href="${h("assess.html")}">Find your level and book</a> if you want one of them. Use this form only if you want to hear about the next release as well.</p>
      <p data-when="soldout" hidden>All 40 sessions in this release are sold. Leave your details and I will write when the next release opens. I will only send that note, plus marketing, if you tick the box below.</p>
      <form class="form-card" data-endpoint="waitlist" data-success="You are on the list. I will write when the next release opens, if you ticked the box. If you did not, I will only use these details to reply if you asked a question in the note." data-unconfigured="The waitlist form is not connected yet. Please use the contact page and write Waitlist in the message." novalidate>
        ${alertBox()}
        ${honeypot("wait-hp")}
        <div class="field"><label for="name">Name (required)</label><input id="name" name="name" autocomplete="name" required><span class="field-error" data-error-for="name"></span></div>
        <div class="field"><label for="email">Email (required)</label><input id="email" name="email" type="email" autocomplete="email" required><span class="field-error" data-error-for="email"></span></div>
        <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="note">Anything you want me to know</label><textarea id="note" name="note"></textarea></div>
        <div class="choice">
          <input id="privacyConsent" name="privacyConsent" type="checkbox" value="yes" required>
          <label for="privacyConsent">I have read the <a href="${h("privacy.html")}">Privacy Policy</a>. (required)</label>
        </div>
        <span class="field-error" data-error-for="privacyConsent"></span>
        <div class="choice">
          <input id="marketingConsent" name="marketingConsent" type="checkbox" value="yes">
          <label for="marketingConsent">You may email or WhatsApp me when the next release opens, and with occasional related notes. This is optional.</label>
        </div>
        <button class="button button-solid" type="submit">Join the waitlist</button>
      </form>
    </div>
  </section>`
}]);

pages.push(["privacy.html", {
  title: "Privacy Policy · Jordana Young",
  description: "Draft privacy policy for Jordana Young's AI teaching site: what is collected, why, and how to ask for a change.",
  active: "",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Privacy</p>
      <h1>Privacy Policy</h1>
      <div class="draft-banner"><p>Draft, dated 20 November 2026. This is not legal advice. It will be checked against the Israeli Privacy Protection Law, 1981, including Amendment 13, and replaced if counsel changes it. Bookings are due to open the week of 29 November 2026.</p></div>
      <p>This site is run by Jordana Young as a personal business. It is not a Microsoft site. The contact form is the way to make a privacy request until a public email address is published. <a data-email-link data-keep-label hidden href="">Email me</a></p>
      <h2>What I collect</h2>
      <ul class="check">
        <li>Identity and contact details you type into a form: name, email, phone, company, and role.</li>
        <li>Your questionnaire answers, score, level, and learning path.</li>
        <li>Booking details you give the booking tool, and the fact that a payment succeeded. Card numbers stay on the payment provider's page.</li>
        <li>Goals, reviews, and messages you send.</li>
        <li>The consent boxes you ticked, the wording next to them, and the time you sent the form.</li>
        <li>If you accept analytics, the analytics tool's usage data. If you reject it, that script doesn't load.</li>
      </ul>
      <h2>Why</h2>
      <p>To answer you, recommend a level, take payment, book a time, prepare the session, and publish a review you agreed to. Marketing email or WhatsApp is sent only if you tick the optional box. That box is separate from the box that lets me contact you about the session or the quote. You can opt out of marketing by writing to me, and I will stop.</p>
      <h2>Who else processes it</h2>
      <p>These are the tools named in the site configuration. When a tool is still "not connected", it is not receiving data yet.</p>
      <ul class="check" data-processors>
        <li><strong>Form host (not connected yet).</strong> Will store form submissions.</li>
        <li><strong>Israeli payment provider (not connected yet).</strong> Will take payment. This website never receives the card number.</li>
        <li><strong>Booking tool (not connected yet).</strong> Will take the time you choose and send the video link.</li>
        <li><strong>Google Calendar.</strong> Holds the booked session on Jordana's calendar.</li>
      </ul>
      <p>LetsGo receives a review only if you tick the separate LetsGo box. Until LetsGo offers an automatic import, that handoff is an email or a form, not a live connection from this website.</p>
      <h2>How long it is kept</h2>
      <p>Working plan, to be confirmed: enquiries from people who don't book are deleted or anonymised after 24 months. Booking and payment records are kept for the period Israeli tax law requires, often 7 years. Reviews stay until you ask for them to be removed. The consent record stays with the submission.</p>
      <h2>Your requests</h2>
      <p>You can ask to see, correct, or delete your details, subject to records I must keep for tax or for a booking that already happened. Write via the <a href="${h("contact.html")}">contact page</a>. If you are in the EU or UK, say so in the message and I will handle the request with the GDPR rights that apply, including a reply within a month where the law requires it.</p>
      <h2>Cookies and storage</h2>
      <p>The questionnaire keeps your answers in this browser's session storage until you close the tab, so the results page can show them. The analytics choice, if you make one, is stored in local storage on your device. Analytics cookies or scripts run only after you press Accept, and only if analytics is switched on in the configuration. It is off by default.</p>
      <p><a href="${h("contact.html")}">Contact me about this policy</a></p>
    </div>
  </section>`
}]);

pages.push(["terms.html", {
  title: "Terms · Jordana Young",
  description: "Draft terms for booking a one-to-one AI session with Jordana Young, including payment and cancellation.",
  active: "",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Terms</p>
      <h1>Terms of service</h1>
      <div class="draft-banner"><p>Draft, dated 20 November 2026. This is not legal advice. Have an Israeli lawyer review it, including the distance-selling rules in the Consumer Protection Law, 1981, before bookings open on 29 November 2026.</p></div>
      <h2>The service</h2>
      <p>I sell live, one-to-one, online teaching sessions in English, small-group cohorts, and, separately, custom workflow builds for companies. A one-to-one place, a cohort seat, and a company quote are different offers. Company work isn't sold from the 40-session inventory.</p>
      <h2>Price</h2>
      <p data-vat-note>Prices are in Israeli shekels (ILS). The figure on the payment page is the figure you pay.</p>
      <p>Private coaching prices step up as places sell: 8 sessions at ₪400, then 8 at ₪600, then 8 at ₪750, then 8 at ₪950, then 8 at ₪1,200. You pay the step that's open when the payment succeeds. Your level doesn't change that price. A cohort seat is ₪600 per person, with a maximum of 15 people, and it doesn't use those 40 places.</p>
      <h2>How a booking is confirmed</h2>
      <p>You pay first. A time is confirmed when the booking tool accepts it after payment. Unpaid holds are not a confirmed session. The seller is Jordana Young. A business registration number and address will be added here once the business is registered.</p>
      <h2>Cancellation and refunds</h2>
      <p data-cancellation-note>The written cancellation rules are not final yet. The working plan is a free reschedule up to 24 hours before the session, from the link in your confirmation. Ask for the rule in writing before you pay if you need it. This section will be updated before bookings open, in line with the Consumer Protection Law rules for distance transactions.</p>
      <h2>Your part</h2>
      <p>Bring a task you are allowed to share. Do not paste secrets or other people's personal data into AI tools during the session. You keep the artifact we build in your own account.</p>
      <h2>Company builds</h2>
      <p>A quote is an offer to talk, not a contract. The contract is the written proposal you accept. Scope, price, and timing live there.</p>
      <p><a href="${h("contact.html")}">Contact me about these terms</a></p>
    </div>
  </section>`
}]);

pages.push(["accessibility.html", {
  title: "Accessibility statement · Jordana Young",
  description: "Accessibility statement for Jordana Young's website, aligned with Israeli Standard 5568 and WCAG 2.0 Level AA.",
  active: "",
  body: (h) => `
  <section class="section">
    <div class="wrap-narrow">
      <p class="kicker">Accessibility</p>
      <h1>Accessibility statement</h1>
      <p>I want this website to work for the widest range of people. It is built to meet Israeli Standard 5568, which is based on the Web Content Accessibility Guidelines (WCAG) 2.0 Level AA, and the Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 2013.</p>
      <p>Statement date: 20 November 2026. This statement should be re-checked if counsel or an accessibility audit asks for changes.</p>
      <h2>What I have done</h2>
      <ul class="check">
        <li>Pages use headings, lists, and buttons in HTML, so they work with a keyboard and with common screen readers.</li>
        <li>Forms have visible labels, text errors, and a way to skip to the content.</li>
        <li>Colour contrast for text meets AA on the colours used here. Information is not given by colour alone.</li>
        <li>Text can be resized. The layout is built for a phone first.</li>
        <li>Motion is reduced when your device asks for that.</li>
        <li>The site is in English, and the language is marked in the page.</li>
      </ul>
      <h2>Limits I know about</h2>
      <p>Payment, booking, and the form host run on other companies' websites once they are connected. I pick providers that aim to be accessible, and I don't control their pages. If one of those pages blocks you, contact me and I'll take the booking or the form another way.</p>
      <h2>Contact</h2>
      <p>Accessibility contact: Jordana Young. Use the <a href="${h("contact.html")}">contact page</a> and write Accessibility in the message. <a data-email-link data-keep-label hidden href="">Email me</a></p>
      <p>Tell me the page, what you were trying to do, and what happened. I will reply with a practical next step. You can also ask for the information in another format.</p>
      <p>If you are not satisfied with the response, you can contact the Commission for Equal Rights of Persons with Disabilities. I will add their current details here if you ask, and after the statement is reviewed.</p>
      <p><a class="button button-solid" href="${h("contact.html")}">Contact me about access</a></p>
    </div>
  </section>`
}]);

const files = [];
for (const [file, opts] of pages) {
  write(file, opts);
  files.push(file);
}

const notFound = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page not found · Jordana Young</title>
  <base href="/jordana-ai-teaching/">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <main id="main" class="section">
    <div class="wrap-narrow">
      <h1>That page is not here.</h1>
      <p>The link may be old. The home page has the current price and the questionnaire.</p>
      <p><a class="button button-solid" href="index.html">Back to the home page</a></p>
    </div>
  </main>
</body>
</html>
`;
fs.writeFileSync(path.join(rootDir, "404.html"), notFound);

const urls = files.map((file) => (file === "index.html" ? SITE + "/" : SITE + "/" + file));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(rootDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(rootDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("Wrote", files.length, "pages");
