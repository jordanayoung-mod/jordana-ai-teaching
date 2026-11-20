/* Posts any form with data-endpoint to the matching URL in config.js. */
(function () {
  var helpers = window.SiteHelpers || {};
  var cfg = helpers.cfg || window.SITE_CONFIG || {};

  function fieldValue(form, name) {
    var fields = form.querySelectorAll("[name='" + name + "']");
    if (!fields.length) return "";
    if (fields[0].type === "checkbox") {
      if (fields.length === 1) return fields[0].checked ? (fields[0].value || "yes") : "";
      return Array.prototype.filter.call(fields, function (field) { return field.checked; }).map(function (field) { return field.value; });
    }
    if (fields[0].type === "radio") {
      var chosen = Array.prototype.find.call(fields, function (field) { return field.checked; });
      return chosen ? chosen.value : "";
    }
    return fields[0].value.trim();
  }

  function showAlert(form, message, isError) {
    var box = form.querySelector("[data-alert]");
    if (!box) return;
    box.hidden = false;
    box.className = "form-alert" + (isError ? " is-error" : "");
    box.textContent = message;
    box.focus();
  }

  function clearErrors(form) {
    form.querySelectorAll("[data-error-for]").forEach(function (el) { el.textContent = ""; });
    form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
  }

  function validate(form) {
    clearErrors(form);
    var firstInvalid = null;
    form.querySelectorAll("[required]").forEach(function (field) {
      var ok = true;
      if (field.type === "checkbox" || field.type === "radio") {
        var group = form.querySelectorAll("[name='" + field.name + "']");
        ok = Array.prototype.some.call(group, function (item) { return item.checked; });
      } else {
        ok = field.value.trim().length > 0;
      }
      if (field.type === "email" && ok) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      }
      if (!ok) {
        field.setAttribute("aria-invalid", "true");
        var error = form.querySelector("[data-error-for='" + field.name + "']");
        if (error && !error.textContent) error.textContent = "Please complete this field.";
        if (!firstInvalid) firstInvalid = field;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function payloadFromForm(form) {
    var payload = {
      form: form.getAttribute("data-endpoint"),
      submittedAt: new Date().toISOString(),
      source: window.location.href
    };
    var seen = {};
    form.querySelectorAll("input[name], select[name], textarea[name]").forEach(function (field) {
      if (seen[field.name] || field.name === "company_website") return;
      seen[field.name] = true;
      payload[field.name] = fieldValue(form, field.name);
      if (field.type === "checkbox") {
        var label = form.querySelector("label[for='" + field.id + "']");
        if (label) payload[field.name + "Text"] = label.textContent.trim();
      }
    });
    return payload;
  }

  function encodeUrl(payload) {
    var params = new URLSearchParams();
    Object.keys(payload).forEach(function (key) {
      var value = payload[key];
      if (Array.isArray(value)) value.forEach(function (item) { params.append(key, item); });
      else if (value !== undefined && value !== null) params.append(key, String(value));
    });
    return params;
  }

  function post(url, payload) {
    var format = (cfg.endpoints && cfg.endpoints.format) || "form";
    var attempt;
    if (format === "json") {
      attempt = fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      attempt = fetch(url, { method: "POST", mode: "cors", body: encodeUrl(payload), headers: { "Accept": "application/json" } });
    }
    return attempt.then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return { ok: true };
    }).catch(function () {
      return fetch(url, { method: "POST", mode: "no-cors", body: encodeUrl(payload) }).then(function () {
        return { ok: true, unconfirmed: true };
      });
    });
  }

  function handle(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var honeypot = form.querySelector("[name='company_website']");
      if (honeypot && honeypot.value) {
        showAlert(form, "Thank you. Your form has been received.", false);
        form.reset();
        return;
      }
      if (!validate(form)) {
        showAlert(form, "Please fix the highlighted fields, then try again.", true);
        return;
      }
      var key = form.getAttribute("data-endpoint");
      var url = cfg.endpoints && cfg.endpoints[key];
      var ready = helpers.endpointReady ? helpers.endpointReady(key) : !!url;
      if (!ready) {
        showAlert(form, form.getAttribute("data-unconfigured") || "This form is not connected yet. Please use the contact page and I will take it from there.", true);
        return;
      }
      var button = form.querySelector("[type='submit']");
      if (button) button.disabled = true;
      post(url, payloadFromForm(form)).then(function (result) {
        if (button) button.disabled = false;
        if (!result || !result.ok) {
          showAlert(form, "The form did not go through. Please try again, or use the contact page.", true);
          return;
        }
        var success = form.getAttribute("data-success") || "Thank you. I have your message.";
        if (result.unconfirmed) {
          success += " If you do not get a confirmation, send me the same details from the contact page, because this browser could not read a receipt from the form service.";
        }
        showAlert(form, success, false);
        form.reset();
      }).catch(function () {
        if (button) button.disabled = false;
        showAlert(form, "The form did not go through. Please try again, or use the contact page.", true);
      });
    });
  }

  document.querySelectorAll("form[data-endpoint]").forEach(handle);
  window.SiteForms = { validate: validate, showAlert: showAlert, payloadFromForm: payloadFromForm, post: post };
})();
