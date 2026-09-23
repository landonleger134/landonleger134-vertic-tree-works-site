// Answers that depend on facts in site.js that may still be unconfirmed.
// Every one falls back to honest wording — no raw [PLACEHOLDER] ever renders.
const s = require("./site.js");

const coverage = [
  s.glAmount && `General liability: ${s.glAmount}.`,
  s.wcAmount && `Workers’ compensation: ${s.wcAmount}.`,
].filter(Boolean).join(" ");

module.exports = {
  hours: s.open247 ? "Open 24/7 — call or text anytime." : s.hours || "Call or text for availability.",
  insurance: `Yes. Ask for our certificate of insurance before we start.${coverage ? " " + coverage : ""}`,
  coverageLines: [
    s.glAmount && ["General liability", s.glAmount],
    s.wcAmount && ["Workers’ compensation", s.wcAmount],
  ].filter(Boolean),
  wcStatus: s.wcStatus,
  afterHoursQ: "Do you answer around the clock?",
  afterHoursA: s.open247
    ? "Yes — we’re open 24/7. Call or text anytime, day or night. Active hazards like a tree on a house or a blocked drive come first."
    : s.hours
    ? `Our hours are ${s.hours}. Outside that, call or text and we’ll get back to you as fast as we can — active hazards come first. If we can’t take it right away, we’ll say so.`
    : "Call or text for availability. We prioritize active hazards. If we can’t take it right away, we’ll say so — better than a promise we can’t keep.",
  payment: [
    s.paymentMethods ? `We accept ${s.paymentMethods}.` : null,
    s.depositPolicy ? `Deposits: ${s.depositPolicy}.` : null,
    "Payment terms are written on your estimate before any work starts.",
  ].filter(Boolean).join(" "),
};
