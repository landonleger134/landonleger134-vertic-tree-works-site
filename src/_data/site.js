// ─────────────────────────────────────────────────────────────────────────
// ONE FILE for every business fact on the site. If it isn't confirmed,
// leave it null — the templates fall back to honest wording and never
// print a raw placeholder.
// ─────────────────────────────────────────────────────────────────────────

module.exports = {
  // THE LICENSE SWITCH. true = STAGE (pre-license). Set to false only after
  // the Louisiana arborist license is issued AND licenseNumber is filled in.
  // The build refuses to run with stage:false and no license number.
  stage: true,
  licenseNumber: null, // e.g. "1234"

  name: "Vertic Tree Works",
  legalName: "Vertic Tree Works LLC",
  url: "https://vertictree.com",
  phone: "(225) 418-2720",
  email: "info@vertictree.com",
  // Estimate form → ops app (Supabase edge function). Netlify Forms keeps a backup copy.
  leadEndpoint: "https://alxunsqvaujknsnsgoab.supabase.co/functions/v1/vertic-lead-capture",
  owners: ["Landon Leger", "Cole Grantham"],

  // Landon confirmed 24/7 (2026-09-23). Only keep this true while someone
  // really answers after hours — the claim audit allows "24/7" only when it is.
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

  // Only list gear that's actually ready. Uncomment as it arrives.
  equipment: [
    "Bucket truck for height and controlled cuts",
    "Aerial lifts for reaching limbs where the truck can’t go",
    "Climbing and rigging gear for tight yards and controlled lowering",
    "Professional saw lineup, up to a large-bar saw for big oak work",
    "Chipper for on-site processing",
    "Dump trailer for haul-off",
    "Skid steer for moving wood and debris",
  ],

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
