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

  var DAY_SHORT = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat"
  };

  function formatSessionPattern(sessions) {
    var list = sessions || [];
    if (!list.length) return "";
    var known = list.every(function (session) { return typeof session.durationMinutes === "number"; });
    var sameDay = list.every(function (session) { return session.day && session.day === list[0].day; });
    var sameLength = known && list.every(function (session) {
      return session.durationMinutes === list[0].durationMinutes;
    });
    if (list.length >= 4 && sameDay && sameLength) {
      var hours = (list[0].durationMinutes * list.length) / 60;
      var hoursLabel = hours === 1 ? "1 hour" : hours + " hours";
      return list.length + " weekly " + list[0].day + " evenings, " + list[0].durationMinutes + " minutes each (" + hoursLabel + " live)";
    }
    return list.map(function (session) {
      var day = DAY_SHORT[session.day] || session.day || "Session";
      if (session.durationMinutes == null) return day + " (length TBC)";
      return day + " " + session.durationMinutes + " min";
    }).join(", ");
  }

  function runHasDate(run) {
    if (!run) return false;
    if (run.startDate) return true;
    return (run.sessions || []).some(function (session) { return !!session.date; });
  }

  function formatRunWhen(run) {
    var item = run || {};
    if (!runHasDate(item)) {
      return "Starts " + (item.month || "soon") + ", dates coming soon";
    }
    var schedule = cohortSchedule({
      startDate: item.startDate,
      weekday: item.weekday,
      time: item.time || ((item.sessions || [])[0] && (item.sessions || [])[0].start) || ""
    });
    return schedule.line;
  }

  function sortRuns(runs) {
    return (runs || []).slice().sort(function (a, b) {
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      if (a.startDate < b.startDate) return -1;
      if (a.startDate > b.startDate) return 1;
      return 0;
    });
  }

  function cohortSchedule(cohort) {
    var item = cohort || {};
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (!item.startDate) {
      return { comingSoon: true, line: "The next date is coming soon." };
    }
    var parts = String(item.startDate).split("-");
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    if (!year || month < 1 || month > 12 || !day) {
      return { comingSoon: true, line: "The next date is coming soon." };
    }
    var weekday = item.weekday;
    if (!weekday && typeof Intl !== "undefined") {
      var utc = new Date(Date.UTC(year, month - 1, day, 10, 0, 0));
      weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "Asia/Jerusalem" }).format(utc);
    }
    var dateLabel = day + " " + months[month - 1] + " " + year;
    var when = "Starts " + (weekday ? weekday + " " : "") + dateLabel;
    if (item.time) when += ", " + item.time + " Israel time";
    else when += ", Israel time";
    return { comingSoon: false, line: when };
  }

  function cohortsForLevel(cohorts, levelId) {
    return (cohorts || []).filter(function (item) {
      return item && (item.levelId === levelId || item.id === levelId);
    }).slice().sort(function (a, b) {
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      if (a.startDate < b.startDate) return -1;
      if (a.startDate > b.startDate) return 1;
      return 0;
    });
  }

  function cohortAvailability(cohort) {
    var item = cohort || {};
    var capacity = Number(item.capacity);
    if (!isFinite(capacity) || capacity < 0) capacity = 15;
    var enrolled = Number(item.enrolled);
    if (!isFinite(enrolled) || enrolled < 0) enrolled = 0;
    var left = Math.max(0, capacity - enrolled);
    var status = String(item.status || "open");
    var waitlist = status === "waitlist" || status === "full" || enrolled >= capacity;
    return {
      left: left,
      capacity: capacity,
      enrolled: enrolled,
      waitlist: waitlist,
      line: left + " of " + capacity + " seats left"
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
    formatSessionPattern: formatSessionPattern,
    runHasDate: runHasDate,
    formatRunWhen: formatRunWhen,
    sortRuns: sortRuns,
    cohortSchedule: cohortSchedule,
    cohortsForLevel: cohortsForLevel,
    cohortAvailability: cohortAvailability,
    buildTrackedUrl: buildTrackedUrl
  };
});
