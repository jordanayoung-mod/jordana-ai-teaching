/* Prefills the goals form from the questionnaire, when those details are still in this tab. */
(function () {
  var params = new URLSearchParams(window.location.search);
  var level = params.get("level") || "";
  var lead = {};
  var result = {};
  try { lead = JSON.parse(sessionStorage.getItem("jyt_lead") || "{}"); } catch (err) { lead = {}; }
  try { result = JSON.parse(sessionStorage.getItem("jyt_result") || "{}"); } catch (err) { result = {}; }
  var form = document.getElementById("goals-form");
  if (!form) return;
  if (lead.firstName) form.firstName.value = lead.firstName;
  if (lead.lastName) form.lastName.value = lead.lastName;
  if (lead.email) form.email.value = lead.email;
  var levelField = form.level;
  var value = (level || result.levelId || "").toLowerCase();
  if (levelField && value) {
    Array.prototype.forEach.call(levelField.options, function (option) {
      if (option.value === value) levelField.value = value;
    });
  }
})();
