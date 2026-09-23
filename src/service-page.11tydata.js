const site = require("./_data/site.js");
const resolveFaq = require("../lib/faq.js");
module.exports = {
  eleventyComputed: {
    title: (d) => d.s.title,
    description: (d) => d.s.description,
    crumbs: (d) => [["Services", "/services/"], [d.s.name]],
    serviceSchema: (d) => d.s.name,
    faq: (d) => resolveFaq(d.s.faq),
    faqSchema: (d) => resolveFaq(d.s.faq),
    noindex: (d) => Boolean(d.s.optional && !site.landClearingLive),
    bodyClass: (d) => (d.s.emergency ? "service service--storm" : "service"),
  },
};
