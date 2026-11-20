/* Pure helpers for price steps and questionnaire scoring.
   Used in the browser as window.SiteLogic, and by tests/logic.test.js in Node.
*/
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.SiteLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function formatIls(amount) {
    var n = Math.round(Number(amount));
    if (!isFinite(n)) return "";
    var sign = n < 0 ? "-" : "";
    var digits = String(Math.abs(n));
    var withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return sign + withCommas + " ILS";
  }

  function priceState(sold, tiers) {
    var list = Array.isArray(tiers) ? tiers : [];
    var total = list.reduce(function (sum, tier) {
      return sum + Number(tier.slots || 0);
    }, 0);
    var numeric = Number(sold);
    if (!isFinite(numeric) || numeric < 0) numeric = 0;
    var safeSold = Math.min(Math.floor(numeric), total);
    var cursor = safeSold;

    for (var i = 0; i < list.length; i += 1) {
      var tier = list[i];
      var slots = Number(tier.slots || 0);
      if (cursor < slots) {
        var next = list[i + 1] || null;
        return {
          soldOut: false,
          sold: safeSold,
          total: total,
          priceIls: Number(tier.priceIls),
          left: slots - cursor,
          bandSize: slots,
          bandName: tier.name || "",
          bandIndex: i,
          nextPriceIls: next ? Number(next.priceIls) : null
        };
      }
      cursor -= slots;
    }

    var last = list[list.length - 1];
    return {
      soldOut: true,
      sold: safeSold,
      total: total,
      priceIls: null,
      left: 0,
      bandSize: last ? Number(last.slots || 0) : 0,
      bandName: null,
      bandIndex: list.length,
      nextPriceIls: null
    };
  }

  function leftLine(state) {
    if (!state || state.soldOut) {
      var total = state && state.total ? state.total : 40;
      return "All " + total + " sessions in this release are sold.";
    }
    return state.left + " of " + state.bandSize + " left at " + formatIls(state.priceIls);
  }

  function nextLine(state) {
    if (!state || state.soldOut) return "Join the list and I will write when the next release opens.";
    if (state.nextPriceIls == null) return "This is the last price in this release.";
    return "Next price: " + formatIls(state.nextPriceIls) + ".";
  }

  function pointsForQuestion(question, value) {
    if (!question || question.scored === false) return 0;
    if (question.type === "multi") {
      var selected = Array.isArray(value) ? value.slice() : [];
      if (question.exclusiveValue && selected.indexOf(question.exclusiveValue) !== -1) {
        selected = [];
      }
      var count = selected.length;
      var bands = question.scoreByCount || [];
      for (var i = 0; i < bands.length; i += 1) {
        if (count >= bands[i].min && count <= bands[i].max) return Number(bands[i].points || 0);
      }
      return 0;
    }
    var options = question.options || [];
    for (var j = 0; j < options.length; j += 1) {
      if (options[j].value === value) return Number(options[j].points || 0);
    }
    return 0;
  }

  function scoreAssessment(definition, answers) {
    var def = definition || {};
    var given = answers || {};
    var questions = def.questions || [];
    var score = 0;
    questions.forEach(function (question) {
      score += pointsForQuestion(question, given[question.id]);
    });

    var bands = def.bands || [];
    var levelIndex = 0;
    for (var i = 0; i < bands.length; i += 1) {
      if (score >= Number(bands[i].min) && score <= Number(bands[i].max)) {
        levelIndex = i;
        break;
      }
      if (score > Number(bands[i].max)) levelIndex = i;
    }

    var adjustments = def.adjustments || {};
    var cap = adjustments.capAtBeginnerIf;
    var capped = false;
    if (cap && given[cap.question] === cap.value) {
      levelIndex = 0;
      capped = true;
    }

    var bump = adjustments.bumpUpIf;
    var bumped = false;
    if (!capped && bump && given[bump.question] === bump.value && score >= Number(bump.minScore)) {
      if (levelIndex < bands.length - 1) {
        levelIndex += 1;
        bumped = true;
      }
    }

    var level = bands[levelIndex] || null;
    var pathId = "";
    questions.forEach(function (question) {
      if (question.setsPath) pathId = given[question.id] || "";
    });
    if (!pathId && given.q12) pathId = given.q12;
    var path = (def.paths && def.paths[pathId]) || null;

    return {
      score: score,
      max: Number(def.maxScore || 30),
      level: level,
      pathId: pathId,
      path: path,
      capped: capped,
      bumped: bumped
    };
  }

  function buildTrackedUrl(base, queryMap, includeNotes, values) {
    var url = new URL(base);
    var query = queryMap || {};
    var given = values || {};
    var pairs = {};
    pairs[query.name || "name"] = given.name || "";
    pairs[query.email || "email"] = given.email || "";
    pairs[query.phone || "phone"] = given.phone || "";
    pairs[query.level || "level"] = given.level || "";
    pairs[query.path || "path"] = given.path || "";
    if (includeNotes !== false) {
      pairs[query.notes || "notes"] = "Level: " + (given.level || "not set")
        + ". Path: " + (given.path || "not set")
        + ". Price: " + (given.price || "current") + ".";
    }
    Object.keys(pairs).forEach(function (key) {
      if (key && pairs[key]) url.searchParams.set(key, pairs[key]);
    });
    return url.toString();
  }

  return {
    formatIls: formatIls,
    priceState: priceState,
    leftLine: leftLine,
    nextLine: nextLine,
    pointsForQuestion: pointsForQuestion,
    scoreAssessment: scoreAssessment,
    buildTrackedUrl: buildTrackedUrl
  };
});
