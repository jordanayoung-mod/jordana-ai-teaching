/* Level, score, course outcomes, then the open groups for that level. */
(function () {
  var helpers = window.SiteHelpers;
  var logic = window.SiteLogic;
  if (!helpers || !logic) return;
  var mount = document.getElementById("result");
  if (!mount) return;
  var empty = document.getElementById("result-empty");
  var record = null;
  try { record = JSON.parse(sessionStorage.getItem("jyt_result") || "null"); } catch (err) { record = null; }
  if (!record || !record.levelId) {
    if (empty) empty.hidden = false;
    mount.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  mount.hidden = false;

  function text(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || "";
  }
  function add(parent, tag, className, value) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (value != null) el.textContent = value;
    parent.appendChild(el);
    return el;
  }
  function readStore(key) {
    try { return JSON.parse(sessionStorage.getItem(key) || "null"); } catch (err) { return null; }
  }
  function paymentHref(run, level) {
    var base = run.cohortPaymentUrl || "";
    if (!base || /placeholder|example\.com/i.test(base)) return "";
    var lead = readStore("jyt_lead") || {};
    try {
      return logic.buildTrackedUrl(base, {
        name: "name", email: "email", level: "level", path: "course", notes: "notes"
      }, true, {
        name: [lead.firstName, lead.lastName].filter(Boolean).join(" "),
        email: lead.email || "",
        phone: lead.phone || "",
        level: level.level,
        path: run.name,
        price: "₪600"
      });
    } catch (err) {
      return "";
    }
  }

  var levelName = record.levelLabel || "your";
  text("result-level", "You're at the " + levelName + " level");
  text("result-summary", record.levelSummary);
  text("result-score", "Your score is " + record.score + " out of " + record.max + ".");
  text("result-path", record.pathLabel || "A path we can choose together");
  text("result-path-summary", record.pathSummary || "");

  var adjust = document.getElementById("result-adjust");
  if (adjust) {
    if (record.capped) {
      adjust.hidden = false;
      adjust.textContent = "You haven't used an AI tool yet, so we'll start at Beginner, even if another answer pointed higher. We can move quickly once the basics are in place.";
    } else if (record.bumped) {
      adjust.hidden = false;
      adjust.textContent = "You want to work on agents and automation, and your score shows you already have a base to build on, so I moved the recommendation up one level.";
    }
  }

  var prep = document.getElementById("result-prep");
  if (prep && record.levelId) prep.href = helpers.abs("prep/" + record.levelId + ".html");

  var company = document.getElementById("company-cta");
  if (company) company.hidden = !(record.levelId === "advanced" || record.levelId === "expert");

  var list = document.getElementById("result-outcomes");
  var offer = document.getElementById("cohort-offer-body");

  helpers.loadJson(helpers.abs("data/cohorts.json")).then(function (data) {
    var level = null;
    (data.levels || []).forEach(function (item) {
      if (item.id === record.levelId) level = item;
    });
    if (list) {
      list.textContent = "";
      var outcomes = (level && level.outcomes) || [];
      if (!outcomes.length) {
        add(list, "li", "", "I'll confirm the outcomes for this level before the cohort opens.");
      } else {
        outcomes.forEach(function (item) { add(list, "li", "", item); });
      }
    }
    if (!offer) return;
    offer.textContent = "";
    if (!level || level.visible === false) {
      add(offer, "p", "", "The " + levelName + " cohort isn't on the calendar yet. I'll open it when the first dates are set. Join the waitlist and you'll hear first.");
      var wait = document.createElement("a");
      wait.className = "button button-solid";
      wait.href = helpers.abs("cohorts.html") + "?level=" + encodeURIComponent(record.levelId) + "#cohort-waitlist";
      wait.textContent = "Join the waitlist";
      offer.appendChild(wait);
      return;
    }
    var runs = logic.sortRuns(level.runs || []);
    if (record.levelId === "beginner") {
      add(offer, "p", "", "December has two Beginner groups, both on Sunday nights. Pick either one.");
    }
    runs.forEach(function (run) {
      var state = logic.cohortAvailability(run);
      var box = document.createElement("article");
      box.className = "run";
      add(box, "h3", "run-name", run.name);
      add(box, "p", "", logic.formatRunWhen(run));
      var pattern = logic.formatSessionPattern(run.sessions);
      if (pattern) add(box, "p", "muted", pattern);
      add(box, "p", "cohort-seats", state.line);
      if (state.waitlist) {
        var next = runs.filter(function (other) {
          return other.id !== run.id && !logic.cohortAvailability(other).waitlist;
        })[0];
        add(box, "p", "", next
          ? "This group is full. The next group is " + next.name + "."
          : "This group is full. Join the waitlist and I'll write when a seat opens.");
      }
      offer.appendChild(box);
    });
    var datedOpen = runs.filter(function (run) {
      return logic.runHasDate(run) && !logic.cohortAvailability(run).waitlist;
    });
    var ask = document.createElement("div");
    ask.className = "run-ask";
    if (datedOpen.length) {
      add(ask, "p", "", "Want to save your seat?");
      datedOpen.forEach(function (run) {
        var href = paymentHref(run, level);
        var button = document.createElement("a");
        button.className = "button button-solid";
        button.textContent = "Yes, sign me up for " + run.name;
        button.href = href || helpers.abs("contact.html");
        ask.appendChild(button);
        if (!href) add(ask, "p", "hint", "The payment link for " + run.name + " isn't connected yet. That button opens the contact page.");
      });
    } else {
      add(ask, "p", "", "Dates aren't set yet, so I can't take a payment for a seat. Join the waitlist and you'll hear first.");
      var link = document.createElement("a");
      link.className = "button button-solid";
      link.href = helpers.abs("cohorts.html") + "?level=" + encodeURIComponent(level.id) + "#cohort-waitlist";
      link.textContent = "Join the waitlist to hear first";
      ask.appendChild(link);
    }
    offer.appendChild(ask);
  }).catch(function () {
    if (list) {
      list.textContent = "";
      add(list, "li", "", "The course outcomes didn't load. Open the cohorts page to read them.");
    }
    if (offer) offer.textContent = "I couldn't load the groups. Open the cohorts page, or use the contact form.";
  });
})();
