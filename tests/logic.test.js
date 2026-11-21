var assert = require("assert");
var logic = require("../js/logic.js");
var questions = require("../data/questions.json");
var inventory = require("../data/inventory.json");

function state(sold) {
  return logic.priceState(sold, inventory.tiers);
}

assert.strictEqual(logic.leftLine(state(0)), "10 of 10 left at 400 ILS");
assert.strictEqual(logic.nextLine(state(0)), "Next price: 600 ILS.");
assert.strictEqual(logic.leftLine(state(7)), "3 of 10 left at 400 ILS");
assert.strictEqual(state(7).nextPriceIls, 600);
assert.strictEqual(logic.leftLine(state(10)), "10 of 10 left at 600 ILS");
assert.strictEqual(logic.nextLine(state(10)), "Next price: 800 ILS.");
assert.strictEqual(logic.leftLine(state(20)), "10 of 10 left at 800 ILS");
assert.strictEqual(logic.leftLine(state(35)), "5 of 10 left at 1,200 ILS");
assert.strictEqual(logic.nextLine(state(35)), "This is the last price in this release.");
assert.strictEqual(state(40).soldOut, true);
assert.strictEqual(logic.leftLine(state(40)), "All 40 sessions in this release are sold.");
assert.strictEqual(state(41).soldOut, true);
assert.strictEqual(state(-3).priceIls, 400);
assert.strictEqual(logic.formatIls(1200), "1,200 ILS");

function answers(overrides) {
  var base = {
    q1: "never",
    q2: "none",
    q3: "nothing",
    q4: "unsure",
    q5: "no",
    q6: "no",
    q7: "no",
    q8: "none",
    q9: "none",
    q10: "hard",
    q11: "Help me write a weekly update.",
    q12: "work"
  };
  return Object.assign(base, overrides || {});
}

var beginner = logic.scoreAssessment(questions, answers());
assert.strictEqual(beginner.score, 0);
assert.strictEqual(beginner.level.id, "beginner");
assert.strictEqual(beginner.path.label, "Work productivity");

var top = logic.scoreAssessment(questions, answers({
  q1: "daily",
  q2: "lots",
  q3: "workflows",
  q4: "templates",
  q5: "regularly",
  q6: "several",
  q7: "several",
  q8: "very",
  q9: "very",
  q10: "explore",
  q12: "agents"
}));
assert.strictEqual(top.score, 30);
assert.strictEqual(top.level.id, "expert");
assert.strictEqual(top.bumped, false);

var edge = logic.scoreAssessment(questions, answers({
  q1: "weekly",
  q2: "one",
  q3: "writing",
  q4: "context",
  q5: "once",
  q6: "no",
  q7: "no",
  q8: "little",
  q9: "somewhat",
  q10: "help",
  q12: "writing"
}));
assert.strictEqual(edge.score, 2 + 1 + 2 + 2 + 1 + 0 + 0 + 1 + 1 + 1);
assert.strictEqual(edge.level.id, "intermediate");

var cap = logic.scoreAssessment(questions, answers({
  q1: "never",
  q2: "lots",
  q3: "workflows",
  q4: "templates",
  q5: "regularly",
  q6: "several",
  q7: "several",
  q8: "very",
  q9: "very",
  q10: "explore",
  q12: "agents"
}));
assert.ok(cap.score >= 12);
assert.strictEqual(cap.level.id, "beginner");
assert.strictEqual(cap.capped, true);
assert.strictEqual(cap.bumped, false);

var bump = logic.scoreAssessment(questions, answers({
  q1: "weekly",
  q2: "one",
  q3: "writing",
  q4: "context",
  q5: "once",
  q6: "heard",
  q7: "curious",
  q8: "little",
  q9: "somewhat",
  q10: "help",
  q12: "agents"
}));
assert.strictEqual(bump.score, 13);
assert.strictEqual(bump.bumped, true);
assert.strictEqual(bump.level.id, "advanced");

var noBump = logic.scoreAssessment(questions, answers({
  q1: "once",
  q2: "one",
  q3: "search",
  q4: "question",
  q5: "once",
  q6: "heard",
  q7: "curious",
  q8: "little",
  q9: "somewhat",
  q10: "help",
  q12: "agents"
}));
assert.ok(noBump.score < 12);
assert.strictEqual(noBump.bumped, false);
assert.strictEqual(noBump.level.id, "intermediate");

var tracked = new URL(logic.buildTrackedUrl(
  "https://cal.com/jordana/session",
  { name: "name", email: "email", phone: "phone", level: "a1", path: "a2", notes: "notes" },
  true,
  {
    name: "Dana Cohen",
    email: "dana@example.com",
    phone: "+972500000000",
    level: "Beginner",
    path: "Writing",
    price: "400 ILS"
  }
));
assert.strictEqual(tracked.searchParams.get("name"), "Dana Cohen");
assert.strictEqual(tracked.searchParams.get("email"), "dana@example.com");
assert.strictEqual(tracked.searchParams.get("a1"), "Beginner");
assert.strictEqual(tracked.searchParams.get("a2"), "Writing");
assert.ok(tracked.searchParams.get("notes").indexOf("Level: Beginner") === 0);
assert.ok(tracked.searchParams.get("notes").indexOf("Price: 400 ILS") !== -1);

assert.strictEqual(logic.cohortAvailability({ capacity: 15, enrolled: 0, status: "open" }).line, "15 of 15 seats left");
assert.strictEqual(logic.cohortAvailability({ capacity: 15, enrolled: 0, status: "open" }).waitlist, false);
assert.strictEqual(logic.cohortAvailability({ capacity: 15, enrolled: 12, status: "open" }).line, "3 of 15 seats left");
assert.strictEqual(logic.cohortAvailability({ capacity: 15, enrolled: 15, status: "open" }).waitlist, true);
assert.strictEqual(logic.cohortAvailability({ capacity: 15, enrolled: 0, status: "waitlist" }).waitlist, true);
assert.strictEqual(logic.cohortAvailability({ capacity: 15, enrolled: 4, status: "full" }).line, "11 of 15 seats left");
assert.strictEqual(logic.cohortAvailability({ capacity: 15, enrolled: 4, status: "full" }).waitlist, true);
assert.strictEqual(logic.formatSessionPattern([
  { day: "Sunday", durationMinutes: 90 },
  { day: "Sunday", durationMinutes: 90 },
  { day: "Sunday", durationMinutes: null }
]), "Sun 90 min, Sun 90 min, Sun (length TBC)");
assert.strictEqual(logic.formatSessionPattern([
  { day: "Wednesday", durationMinutes: 90 },
  { day: "Wednesday", durationMinutes: 90 },
  { day: "Wednesday", durationMinutes: 90 },
  { day: "Wednesday", durationMinutes: 90 }
]), "4 weekly Wednesday evenings, 90 minutes each (6 hours live)");
assert.strictEqual(logic.formatRunWhen({ month: "December 2026", startDate: null }).indexOf("Starts December 2026, dates coming soon"), 0);
assert.strictEqual(logic.runHasDate({ startDate: null, sessions: [{ date: null }] }), false);
assert.strictEqual(logic.runHasDate({ startDate: "2026-12-06" }), true);
assert.strictEqual(logic.cohortSchedule({ startDate: null }).comingSoon, true);
assert.strictEqual(logic.cohortSchedule({ startDate: "2027-03-02", time: "18:00 to 19:30" }).line, "Starts Tuesday 2 March 2027, 18:00 to 19:30 Israel time");
var ordered = logic.cohortsForLevel([
  { id: "beginner-later", levelId: "beginner", startDate: "2027-06-01" },
  { id: "expert", levelId: "expert", startDate: "2027-04-01" },
  { id: "beginner", levelId: "beginner", startDate: null },
  { id: "beginner-soon", levelId: "beginner", startDate: "2027-03-02" }
], "beginner");
assert.deepStrictEqual(ordered.map(function (item) { return item.id; }), ["beginner-soon", "beginner-later", "beginner"]);

console.log("logic tests passed");
