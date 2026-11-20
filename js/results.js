/* Shows the level saved by the questionnaire. */
(function () {
  var helpers = window.SiteHelpers;
  if (!helpers) return;
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

  text("result-level", record.levelLabel);
  text("result-score", "Score " + record.score + " out of " + record.max + ".");
  text("result-summary", record.levelSummary);
  text("result-path", record.pathLabel || "A path we choose together");
  text("result-path-summary", record.pathSummary || "");

  var adjust = document.getElementById("result-adjust");
  if (adjust) {
    if (record.capped) {
      adjust.hidden = false;
      adjust.textContent = "You have not used an AI tool yet, so I recommend we start at Beginner, even if another answer pointed higher. We can move quickly once the basics are in place.";
    } else if (record.bumped) {
      adjust.hidden = false;
      adjust.textContent = "You want to work on agents and automation, and your score shows you already have a base to build on, so I moved the recommendation up one level.";
    }
  }

  var prep = document.getElementById("result-prep");
  if (prep && record.levelId) prep.href = helpers.abs("prep/" + record.levelId + ".html");

  var company = document.getElementById("company-cta");
  if (company) company.hidden = !(record.levelId === "advanced" || record.levelId === "expert");
})();
