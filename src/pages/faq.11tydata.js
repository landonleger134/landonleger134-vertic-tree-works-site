const site = require("../_data/site.js");
const license = require("../_data/license.js");
const answers = require("../_data/answers.js");
const tel = site.phone;

const faq = [
  ["What areas do you serve?", `Greater Baton Rouge — East Baton Rouge, Ascension, and Livingston Parishes. Cities include Baton Rouge, Prairieville, Denham Springs, Zachary, Central, and Gonzales. Call ${tel} if you’re nearby and unsure.`],
  ["How do I get an estimate?", `Call or text ${tel}, or use the estimate form. Photos of the tree help. Most jobs need a short on-site visit for a firm price.`],
  ["Is the estimate free?", "Yes. On-site estimates for typical residential jobs are free and no-obligation. If a job is unusual — a large clearing project, say — we’ll tell you up front how we’ll scope it."],
  [license.faqQuestion, license.faqAnswer],
  ["Are you insured? Can I see a COI?", `${answers.insurance} We can send it to you, your HOA, or your mortgage company.`],
  ["What should I expect on estimate day?", "We look at the tree, its lean, the defects we can see, truck access, drop zones, and anything near the work — fences, AC units, septic, lines. You get a clear scope and a written number. No pressure."],
  ["How fast can you respond after a storm?", `We prioritize hazards — trees on houses, blocked drives, hanging limbs that could drop. Response depends on call volume and crew availability. ${answers.hours}`],
  ["Do you handle trees on houses for insurance claims?", "We do the tree work and can provide photos plus an itemized invoice. We’re not insurance adjusters — your carrier decides coverage. If power lines are involved, contact the utility first."],
  ["Do you clean up the wood and brush?", "Yes on standard quoted scopes — it leaves with us. Want firewood rounds left? Tell us at the estimate. Stump grinding is separate unless it’s packaged in."],
  ["What about property lines and neighbor trees?", "We only cut what you’re authorized to cut. If the tree is on the line or the neighbor’s side, get agreement first. We’ll help you think it through on the visit."],
  ["How do payments work?", answers.payment],
  ["Do you top trees or crepe myrtles?", "No. Topping creates weak growth and long-term risk. We prune for structure and clearance. Crepe myrtles get proper reduction and shaping — not “crepe murder.”"],
  ["Can you grind the stump the same day?", "Usually, yes. Once in a while access or scheduling pushes it to a follow-up visit — same-day or follow-up will be on the quote."],
  ["What’s the difference between Vertic and Strata Exterior?", `Vertic Tree Works is tree work — trimming, removal, stumps, storm. Strata Exterior (strata-exterior.com) is our sister company for fencing and exterior work. Different websites and contact info — for tree work, use ${tel} or ${site.email}.`],
  ["Do you do commercial tree work?", "Residential is our focus. Light commercial — small retail sites, churches, HOA common areas — we’ll quote case by case."],
];

module.exports = { faq, faqSchema: faq };
