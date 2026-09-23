// Swap the tokens in service FAQ lists for live, flag-aware answers.
const license = require("../src/_data/license.js");
const answers = require("../src/_data/answers.js");

module.exports = function resolveFaq(items) {
  return items.map(([q, a]) => {
    if (q === "INSURANCE") return ["Are you insured?", answers.insurance];
    if (q === "LICENSE") return [license.serviceFaqQuestion, license.serviceFaqAnswer];
    if (q === "HOURS") return [answers.afterHoursQ, answers.afterHoursA];
    return [q, a];
  });
};
