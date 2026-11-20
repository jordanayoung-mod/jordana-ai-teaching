/* Lead form, then one question at a time, scored in the browser. */
(function () {
  var helpers = window.SiteHelpers;
  var forms = window.SiteForms;
  var logic = window.SiteLogic;
  var leadForm = document.getElementById("lead-form");
  var quizForm = document.getElementById("quiz-form");
  if (!leadForm || !quizForm || !helpers || !logic) return;

  var questions = [];
  var index = 0;
  var answers = {};
  var definition = null;

  function storageSet(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* private mode */ }
  }

  helpers.loadJson(helpers.abs("data/questions.json")).then(function (data) {
    definition = data;
    questions = data.questions || [];
    var slot = document.getElementById("quiz-slot");
    if (slot && !questions.length) slot.textContent = "The questionnaire could not be loaded.";
  }).catch(function () {
    var slot = document.getElementById("quiz-slot");
    if (slot) slot.textContent = "The questionnaire could not be loaded. Refresh the page and try again.";
  });

  leadForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var honeypot = leadForm.querySelector("[name='company_website']");
    if (honeypot && honeypot.value) return;
    if (forms && !forms.validate(leadForm)) {
      forms.showAlert(leadForm, "Please fix the highlighted fields, then try again.", true);
      return;
    }
    var lead = forms.payloadFromForm(leadForm);
    storageSet("jyt_lead", lead);
    var button = leadForm.querySelector("[type='submit']");
    if (button) button.disabled = true;

    function begin(note) {
      if (button) button.disabled = false;
      leadForm.hidden = true;
      quizForm.hidden = false;
      if (note) {
        var noteEl = document.getElementById("quiz-note");
        if (noteEl) {
          noteEl.hidden = false;
          noteEl.textContent = note;
        }
      }
      var tries = 0;
      function show() {
        if (!questions.length && tries < 30) {
          tries += 1;
          window.setTimeout(show, 100);
          return;
        }
        render();
        quizForm.scrollIntoView();
      }
      show();
    }

    var key = "lead";
    if (!helpers.endpointReady(key)) {
      begin("Your details stay in this browser for now, because the form service is not connected yet. You can still see your level.");
      return;
    }
    forms.post(helpers.cfg.endpoints.lead, lead).then(function () {
      begin("");
    }).catch(function () {
      if (button) button.disabled = false;
      forms.showAlert(leadForm, "I could not send your details. Check the connection and try again, or continue and send them from the contact page afterwards.", true);
      var cont = document.getElementById("lead-continue");
      if (cont) cont.hidden = false;
    });
  });

  var continueBtn = document.getElementById("lead-continue");
  if (continueBtn) {
    continueBtn.addEventListener("click", function () {
      if (forms && !forms.validate(leadForm)) return;
      var lead = forms.payloadFromForm(leadForm);
      storageSet("jyt_lead", lead);
      leadForm.hidden = true;
      quizForm.hidden = false;
      render();
    });
  }

  function current() { return questions[index]; }

  function readCurrent() {
    var question = current();
    if (!question) return;
    if (question.type === "multi") {
      answers[question.id] = Array.prototype.map.call(
        quizForm.querySelectorAll("input[type='checkbox']:checked"),
        function (input) { return input.value; }
      );
    } else if (question.type === "text") {
      var area = quizForm.querySelector("textarea");
      answers[question.id] = area ? area.value.trim() : "";
    } else {
      var selected = quizForm.querySelector("input[type='radio']:checked");
      answers[question.id] = selected ? selected.value : "";
    }
  }

  function render() {
    var question = current();
    var slot = document.getElementById("quiz-slot");
    var progress = document.getElementById("quiz-progress");
    var bar = document.querySelector("#quiz-bar > span");
    var next = document.getElementById("quiz-next");
    var back = document.getElementById("quiz-back");
    if (!question || !slot) return;
    var position = index + 1;
    if (progress) progress.textContent = "Question " + position + " of " + questions.length;
    if (bar) bar.style.width = ((position / questions.length) * 100) + "%";
    var meter = document.getElementById("quiz-bar");
    if (meter) meter.setAttribute("aria-valuenow", String(position));
    if (meter) meter.setAttribute("aria-valuemax", String(questions.length));
    if (next) next.textContent = position === questions.length ? "See my level" : "Next";
    if (back) back.hidden = index === 0;
    slot.textContent = "";

    var set = document.createElement("fieldset");
    var legend = document.createElement("legend");
    legend.textContent = question.prompt;
    set.appendChild(legend);
    if (question.hint) {
      var hint = document.createElement("p");
      hint.className = "hint";
      hint.id = "q-hint";
      hint.textContent = question.hint;
      set.appendChild(hint);
    }
    var error = document.createElement("p");
    error.className = "field-error";
    error.id = "q-error";
    error.setAttribute("role", "alert");
    set.appendChild(error);

    if (question.type === "text") {
      var area = document.createElement("textarea");
      area.name = question.id;
      area.required = true;
      area.value = answers[question.id] || "";
      if (question.hint) area.setAttribute("aria-describedby", "q-hint");
      set.appendChild(area);
    } else if (question.type === "multi") {
      (question.options || []).forEach(function (option, optionIndex) {
        var id = question.id + "-" + optionIndex;
        var label = document.createElement("label");
        label.className = "choice";
        label.setAttribute("for", id);
        var input = document.createElement("input");
        input.type = "checkbox";
        input.id = id;
        input.name = question.id;
        input.value = option.value;
        var saved = answers[question.id] || [];
        input.checked = saved.indexOf(option.value) !== -1;
        input.addEventListener("change", function () {
          if (question.exclusiveValue && option.value === question.exclusiveValue && input.checked) {
            set.querySelectorAll("input").forEach(function (box) {
              if (box !== input) box.checked = false;
            });
          } else if (question.exclusiveValue && input.checked) {
            var exclusive = set.querySelector("input[value='" + question.exclusiveValue + "']");
            if (exclusive) exclusive.checked = false;
          }
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(option.label));
        set.appendChild(label);
      });
    } else {
      (question.options || []).forEach(function (option, optionIndex) {
        var id = question.id + "-" + optionIndex;
        var label = document.createElement("label");
        label.className = "choice";
        label.setAttribute("for", id);
        var input = document.createElement("input");
        input.type = "radio";
        input.id = id;
        input.name = question.id;
        input.value = option.value;
        input.checked = answers[question.id] === option.value;
        label.appendChild(input);
        label.appendChild(document.createTextNode(option.label));
        set.appendChild(label);
      });
    }
    slot.appendChild(set);
    var first = slot.querySelector("input, textarea");
    if (first) first.focus();
  }

  quizForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var question = current();
    readCurrent();
    var value = answers[question.id];
    var missing = question.type === "multi" ? !value || !value.length : !value;
    var error = document.getElementById("q-error");
    if (missing) {
      if (error) error.textContent = "Choose an answer to continue.";
      var field = quizForm.querySelector("input, textarea");
      if (field) field.focus();
      return;
    }
    if (error) error.textContent = "";
    if (index < questions.length - 1) {
      index += 1;
      render();
      return;
    }
    finish();
  });

  var back = document.getElementById("quiz-back");
  if (back) {
    back.addEventListener("click", function () {
      readCurrent();
      if (index > 0) {
        index -= 1;
        render();
      }
    });
  }

  function finish() {
    var result = logic.scoreAssessment(definition, answers);
    var record = {
      score: result.score,
      max: result.max,
      levelId: result.level && result.level.id,
      levelLabel: result.level && result.level.label,
      levelSummary: result.level && result.level.summary,
      pathId: result.pathId,
      pathLabel: result.path && result.path.label,
      pathSummary: result.path && result.path.summary,
      capped: result.capped,
      bumped: result.bumped,
      answers: answers,
      submittedAt: new Date().toISOString()
    };
    storageSet("jyt_result", record);
    var lead = {};
    try { lead = JSON.parse(sessionStorage.getItem("jyt_lead") || "{}"); } catch (err) { lead = {}; }
    var body = Object.assign({}, lead, record, { form: "questionnaire" });
    var next = helpers.abs("results.html");
    if (!helpers.endpointReady("questionnaire")) {
      window.location.href = next;
      return;
    }
    var nextButton = document.getElementById("quiz-next");
    if (nextButton) nextButton.disabled = true;
    forms.post(helpers.cfg.endpoints.questionnaire, body).finally(function () {
      window.location.href = next;
    });
  }
})();
