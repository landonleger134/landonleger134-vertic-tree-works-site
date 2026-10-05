// ─────────────────────────────────────────────────────────────────────────
// ONE FILE for every business fact on the site. If it isn't confirmed,
// leave it null — the templates fall back to honest wording and never
// print a raw placeholder.
// ─────────────────────────────────────────────────────────────────────────

module.exports = {
  // THE LICENSE SWITCH. true = STAGE (pre-license). Set to false only after
  // the Louisiana arborist license is issued AND licenseNumber is filled in.
  // The build refuses to run with stage:false and no license number.
  stage: false,
  licenseNumber: "AR 26-3070", // Louisiana LDAF (Horticulture Commission) arborist license — Landon, passed 2026-09-29

  name: "Vertic Tree Works",
  legalName: "Vertic Tree Works LLC",
  url: "https://vertictree.com",
  phone: "(225) 418-2720",
  email: "info@vertictree.com",
  // Estimate form → ops app (Supabase edge function). Netlify Forms keeps a backup copy.
  leadEndpoint: "https://alxunsqvaujknsnsgoab.supabase.co/functions/v1/vertic-lead-capture",
  owners: ["Landon Leger", "Cole Grantham"],

  // Landon confirmed 2026-10-05: 24/7 for emergency response. Worded as
  // "24/7 emergency response" (not general office hours). The claim audit
  // allows "24/7" only while this is true; schema hours follow it.
  open247: true,
  // Regular hours text, used only when open247 is false. null = "Call or text for availability."
  hours: null,

  // Insurance dollar amounts — shown only when filled.
  glAmount: null, // e.g. "$1,000,000 per occurrence"
  wcAmount: null,
  wcStatus: null,

  // Payment wording — FAQ falls back to "terms are on your estimate".
  paymentMethods: null,
  depositPolicy: null,

  // Land clearing page exists but stays out of nav, the services grid, and
  // the sitemap (and is noindexed) until this is true.
  landClearingLive: true,

  // Only list gear that's actually ready. Per the 2026-09-29 brief the bucket
  // truck and chipper stay OFF the site (text and photos) until Landon says
  // they're cleaned up and logoed — the claim audit fails the build if either
  // is mentioned while not in this list. Cranes are never "ours": crane work
  // is arranged through trusted partners (see craneLine).
  equipment: [
    "Excavator for controlled takedowns",
    "Skid steers for cleanup and moving wood and debris",
    "Climbing and rigging gear for tight yards and controlled lowering",
    "Professional saw lineup, up to a large-bar saw for big oak work",
    "Dump trailer for haul-off",
  ],
  craneLine: "Crane-assisted removals arranged through trusted partners.",

  parishes: "East Baton Rouge, Ascension & Livingston Parishes",
  sisterCompany: { name: "Strata Exterior", url: "https://strata-exterior.com/" },

  // Real Google reviews only: { quote, name, city }. Empty = section hidden.
  reviews: [],

  // Real job photos only: { src, alt, category }. Categories:
  // equipment | removal | trimming | stump | storm | cleanup
  photos: [],
};

// Search engines: index only the real production domain. Previews and the
// temporary *.netlify.app address stay noindexed automatically.
module.exports.indexable =
  process.env.CONTEXT === "production" && /vertictree\.com/.test(process.env.URL || "");
module.exports.year = new Date().getFullYear();
