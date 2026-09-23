const site = require("./src/_data/site.js");

module.exports = function (eleventyConfig) {
  // Hard stop: the site can't go post-license without a real license number.
  if (!site.stage && !site.licenseNumber) {
    throw new Error("site.stage is false but site.licenseNumber is empty. Fill the license number before flipping.");
  }

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  eleventyConfig.addFilter("tel", (s) => "tel:+1" + String(s).replace(/\D/g, ""));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("byCategory", (photos, cat) => photos.filter((p) => p.category === cat));
  eleventyConfig.addFilter("absUrl", (path) => site.url + path);

  // ── Structured data (JSON-LD) — STAGE-accurate: no credential until the flip
  const license = require("./src/_data/license.js");
  const ld = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
  eleventyConfig.addFilter("bizLd", () => {
    const biz = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "@id": site.url + "/#business",
      name: site.legalName,
      url: site.url + "/",
      telephone: "+1-" + site.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
      email: site.email,
      description: "Owner-operated tree removal, trimming, stump grinding, and storm cleanup in Greater Baton Rouge.",
      areaServed: ["Baton Rouge, LA", "Prairieville, LA", "Denham Springs, LA", "Zachary, LA", "Central, LA", "Gonzales, LA",
        "East Baton Rouge Parish, LA", "Ascension Parish, LA", "Livingston Parish, LA"],
      founder: site.owners.map((name) => ({ "@type": "Person", name })),
    };
    if (license.credential) biz.hasCredential = license.credential;
    return ld(biz);
  });
  eleventyConfig.addFilter("crumbLd", (crumbs, url) => ld({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"], ...crumbs].map((c, i) => ({
      "@type": "ListItem", position: i + 1, name: c[0], item: site.url + (c[1] || url),
    })),
  }));
  eleventyConfig.addFilter("serviceLd", (name) => ld({
    "@context": "https://schema.org", "@type": "Service", name,
    provider: { "@id": site.url + "/#business" }, areaServed: "Greater Baton Rouge, LA",
  }));
  eleventyConfig.addFilter("faqLd", (faq) => ld({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  }));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
