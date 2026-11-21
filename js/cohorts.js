/* Renders visible cohort levels and their runs from data/cohorts.json. */
(function () {
  var helpers = window.SiteHelpers;
  var logic = window.SiteLogic;
  if (!helpers || !logic) return;

  function readStore(key) {
    try { return JSON.parse(sessionStorage.getItem(key) || "null"); } catch (err) { return null; }
  }

  function paymentHref(run, level) {
    var base = run.cohortPaymentUrl || "";
    if (!base || /placeholder|example\.com/i.test(base)) return "";
    var lead = readStore("jyt_lead") || {};
    var name = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
    try {
      return logic.buildTrackedUrl(base, {
        name: "name",
        email: "email",
        level: "level",
        path: "course",
        notes: "notes"
      }, true, {
        name: name,
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

  function add(parent, tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    parent.appendChild(el);
    return el;
  }

  function selectValue(id, value) {
    var select = document.getElementById(id);
    if (!select || !value) return;
    Array.prototype.forEach.call(select.options, function (option) {
      if (option.value === value) select.value = value;
    });
  }

  function focusWaitlist(levelId, runId) {
    selectValue("cohort-level", levelId);
    selectValue("cohort-run", runId);
    window.setTimeout(function () {
      var field = document.getElementById("cohort-run") || document.getElementById("cohort-level");
      if (field) field.focus();
    }, 0);
  }

  function renderRun(run, level, mode) {
    var state = logic.cohortAvailability(run);
    var box = document.createElement("div");
    box.className = "run";
    add(box, "h3", "run-name", run.name);
    add(box, "p", "", logic.formatRunWhen(run));
    var pattern = logic.formatSessionPattern(run.sessions);
    if (pattern) add(box, "p", "muted", pattern);
    add(box, "p", "cohort-seats", state.line);
    if (state.waitlist) {
      add(box, "p", "", "This group is full.");
    }
    if (mode === "full") {
      var actions = document.createElement("p");
      actions.className = "actions";
      if (!state.waitlist && logic.runHasDate(run)) {
        var href = paymentHref(run, level);
        var sign = document.createElement("a");
        sign.className = "button button-solid";
        sign.textContent = "Yes, sign me up";
        sign.href = href || "contact.html";
        actions.appendChild(sign);
        if (!href) {
          add(actions, "span", "hint", "The payment link for this group isn't connected yet. The button opens the contact page.");
        }
      } else {
        var wait = document.createElement("a");
        wait.className = "button button-solid";
        wait.href = "#cohort-waitlist";
        wait.textContent = "Join the waitlist";
        wait.addEventListener("click", function () { focusWaitlist(level.id, run.id); });
        actions.appendChild(wait);
      }
      box.appendChild(actions);
    }
    return box;
  }

  function renderLevel(level, mode) {
    var article = document.createElement("article");
    article.className = "cohort-card";
    article.id = "level-" + level.id;
    add(article, "p", "kicker", level.level);
    add(article, mode === "full" ? "h2" : "h3", "", level.name);
    add(article, "p", "", level.promise);
    if (mode === "full" && level.outcomes && level.outcomes.length) {
      add(article, "h3", "", "By the end of this course you will…");
      var outcomes = document.createElement("ul");
      outcomes.className = "check";
      level.outcomes.forEach(function (item) {
        add(outcomes, "li", "", item);
      });
      article.appendChild(outcomes);
    }
    if (mode === "full" && level.topics && level.topics.length) {
      add(article, "h3", "", level.topics.length === 3 ? "The three sessions" : "The four weeks");
      var topics = document.createElement("ol");
      topics.className = "check";
      level.topics.forEach(function (item) { add(topics, "li", "", item); });
      article.appendChild(topics);
    }
    var runs = logic.sortRuns(level.runs || []);
    if (runs.length) {
      var list = document.createElement("div");
      list.className = "run-list";
      runs.forEach(function (run) { list.appendChild(renderRun(run, level, mode)); });
      article.appendChild(list);
    }
    if (mode !== "full") {
      var more = document.createElement("a");
      more.href = "cohorts.html#level-" + level.id;
      more.textContent = "See this cohort";
      article.appendChild(more);
    }
    return article;
  }

  function visibleLevels(data) {
    return (data.levels || []).filter(function (level) { return level.visible !== false; });
  }

  var full = document.querySelector("[data-cohort-list]");
  var teaser = document.querySelector("[data-cohort-teaser]");
  if (full) full.setAttribute("aria-busy", "true");
  if (teaser) teaser.setAttribute("aria-busy", "true");
  if (full || teaser) {
    helpers.loadJson(helpers.abs("data/cohorts.json")).then(function (data) {
      var levels = visibleLevels(data);
      if (full) {
        full.textContent = "";
        full.setAttribute("aria-busy", "false");
        levels.forEach(function (level) { full.appendChild(renderLevel(level, "full")); });
      }
      if (teaser) {
        teaser.textContent = "";
        teaser.setAttribute("aria-busy", "false");
        levels.forEach(function (level) { teaser.appendChild(renderLevel(level, "teaser")); });
      }
    }).catch(function () {
      var message = "I couldn't load the cohort list. Use the contact page and tell me which level and night you want.";
      if (full) full.textContent = message;
      if (teaser) teaser.textContent = message;
    });
  }

  var form = document.getElementById("cohort-waitlist-form");
  if (!form) return;
  var params = new URLSearchParams(window.location.search);
  var result = readStore("jyt_result") || {};
  var lead = readStore("jyt_lead") || {};
  selectValue("cohort-level", params.get("level") || result.levelId || "");
  selectValue("cohort-run", params.get("run") || "");
  selectValue("cohort-path", params.get("path") || result.pathId || "");
  if ((lead.firstName || lead.lastName) && form.name && !form.name.value) {
    form.name.value = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  }
  if (lead.email && form.email && !form.email.value) form.email.value = lead.email;
  if (lead.phone && form.phone && !form.phone.value) form.phone.value = lead.phone;
  var prefill = document.getElementById("cohort-prefill");
  if (prefill && (params.get("level") || result.levelId)) {
    prefill.hidden = false;
    prefill.textContent = "Your level is filled in from the questionnaire. Change the group if you want a different night.";
  }
})();
