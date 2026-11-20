/* Pay first, then open the scheduler, with name, email, and level on the link. */
(function () {
  var helpers = window.SiteHelpers;
  var logic = window.SiteLogic;
  if (!helpers || !logic) return;
  var pay = document.getElementById("pay-link");
  var schedule = document.getElementById("schedule-link");
  if (!pay && !schedule) return;

  var lead = {};
  var result = {};
  try { lead = JSON.parse(sessionStorage.getItem("jyt_lead") || "{}"); } catch (err) { lead = {}; }
  try { result = JSON.parse(sessionStorage.getItem("jyt_result") || "{}"); } catch (err) { result = {}; }

  var gate = document.getElementById("book-gate");
  var flow = document.getElementById("book-flow");
  var known = lead.email && (lead.firstName || lead.name);
  if (gate && flow) {
    gate.hidden = !!known;
    flow.hidden = !known;
  }

  var gateForm = document.getElementById("book-gate-form");
  if (gateForm) {
    gateForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (window.SiteForms && !window.SiteForms.validate(gateForm)) return;
      lead = {
        firstName: gateForm.firstName.value.trim(),
        lastName: gateForm.lastName.value.trim(),
        email: gateForm.email.value.trim(),
        phone: gateForm.phone.value.trim()
      };
      var selected = gateForm.level.options[gateForm.level.selectedIndex];
      result.levelId = gateForm.level.value;
      result.levelLabel = selected ? selected.text : gateForm.level.value;
      try {
        sessionStorage.setItem("jyt_lead", JSON.stringify(lead));
        sessionStorage.setItem("jyt_result", JSON.stringify(result));
      } catch (err) { /* ignore */ }
      if (gate) gate.hidden = true;
      if (flow) flow.hidden = false;
      applyLinks();
    });
  }

  function fullName() {
    return [lead.firstName, lead.lastName].filter(Boolean).join(" ") || lead.name || "";
  }

  function build(base, priceLabel) {
    var booking = (helpers.cfg && helpers.cfg.booking) || {};
    return logic.buildTrackedUrl(base, booking.query, booking.includeNotes, {
      name: fullName(),
      email: lead.email || "",
      phone: lead.phone || "",
      level: result.levelLabel || "",
      path: result.pathLabel || "",
      price: priceLabel || ""
    });
  }

  function noteFor(anchor) {
    var sib = anchor && anchor.parentElement ? anchor.parentElement.nextElementSibling : null;
    if (sib && sib.hasAttribute("data-link-note")) return sib;
    return null;
  }

  function setLink(anchor, base, priceLabel, missingText) {
    if (!anchor) return;
    var note = noteFor(anchor);
    if (!base) {
      anchor.setAttribute("aria-disabled", "true");
      anchor.href = helpers.abs("contact.html");
      anchor.textContent = missingText;
      if (note) note.hidden = false;
      return;
    }
    try {
      anchor.href = build(base, priceLabel);
      anchor.removeAttribute("aria-disabled");
      if (note) note.hidden = true;
    } catch (err) {
      anchor.href = helpers.abs("contact.html");
      anchor.textContent = missingText;
      if (note) {
        note.hidden = false;
        note.textContent = "That link does not look like a full web address. Update it in config.js.";
      }
    }
  }

  function applyLinks(state) {
    var booking = (helpers.cfg && helpers.cfg.booking) || {};
    var priceLabel = state && !state.soldOut ? logic.formatIls(state.priceIls) : "the current price";
    if (state && !state.soldOut && pay) {
      var payLabel = pay.getAttribute("data-label") || "Pay";
      if (booking.paymentUrl) pay.textContent = payLabel + " " + priceLabel;
    }
    setLink(pay, booking.paymentUrl, priceLabel, "Payment link not connected yet. Contact me");
    setLink(schedule, booking.schedulerUrl, priceLabel, "Booking link not connected yet. Contact me");
    var who = document.getElementById("book-who");
    if (who) {
      var level = result.levelLabel ? " Level: " + result.levelLabel + "." : "";
      who.textContent = fullName()
        ? "Booking for " + fullName() + " (" + (lead.email || "no email") + ")." + level
        : "Add your name and email so the calendar invite can include them.";
    }
    var prep = document.getElementById("book-prep");
    if (prep && result.levelId) prep.href = helpers.abs("prep/" + result.levelId + ".html");
  }

  helpers.loadInventory().then(function (data) {
    var state = logic.priceState(data.sold, data.tiers);
    applyLinks(state);
  }).catch(function () { applyLinks(null); });

  if (known) applyLinks(null);
})();
