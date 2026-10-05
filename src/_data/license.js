// Every license-dependent sentence on the site lives here as a
// STAGE / POST-LICENSE pair. Only the active variant is ever rendered.
// The license line is used VERBATIM everywhere (2026-09-29 brief):
//   "Louisiana LDAF Licensed Arborist, License No. AR 26-3070"
// The number lives only in site.licenseNumber.
const { stage, licenseNumber } = require("./site.js");

const L = `Louisiana LDAF Licensed Arborist, License No. ${licenseNumber}`;
const pick = (stageText, postText) => (stage ? stageText : postText);

module.exports = {
  stage,
  line: stage ? null : L,
  heroTrust: pick(
    "Fully insured · Owner-operated · Serving East Baton Rouge, Ascension & Livingston Parishes",
    `${L} · Licensed and Insured · Serving East Baton Rouge, Ascension & Livingston Parishes`
  ),
  chip: pick("Fully insured · Owner-operated · COI on request", `${L} · Licensed and Insured · COI on request`),
  areaTrust: (place) =>
    pick(`Fully insured · Owner-operated · Serving ${place}`, `${L} · Licensed and Insured · Serving ${place}`),
  metaDescriptionHome:
    "Owner-operated tree trimming, removal & stump grinding in Baton Rouge, Prairieville, Denham Springs & nearby. Free estimates — call (225) 418-2720.",
  faqQuestion: "Are you licensed?",
  faqAnswer: pick(
    "We’re working through Louisiana arborist licensing. We’ll tell you exactly where that stands when you ask. We carry insurance and can provide a certificate before work starts.",
    `Yes. ${L}, issued through the Louisiana Department of Agriculture & Forestry’s Horticulture Commission. We’re licensed and insured, and we can provide a certificate of insurance before work begins.`
  ),
  serviceFaqQuestion: "Are you a licensed arborist?",
  serviceFaqAnswer: pick(
    "We’re working through Louisiana licensing. Ask us about current credentials and insurance — we’ll be straight with you.",
    `Yes. ${L}. Licensed and insured — COI on request.`
  ),
  about: pick(
    "We’re building Vertic the right way — insured, equipped, and working through Louisiana arborist licensing. Ask us about current credentials and we’ll be direct. Insurance certificates are available on request.",
    `${L}. Landon holds the license, issued through the Louisiana Department of Agriculture & Forestry, Horticulture Commission. We’re licensed and insured; a certificate of insurance is available on request.`
  ),
  insurance: pick(
    "Louisiana arborist licensing is in progress. Ask us for current status anytime — we’ll give you a straight answer.",
    `${L}, issued through the Louisiana Department of Agriculture & Forestry, Horticulture Commission. Ask and we’ll show it alongside your COI.`
  ),
  // Emitted into JSON-LD only after the flip.
  credential: stage ? null : {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "license",
    name: L,
    identifier: licenseNumber,
    recognizedBy: { "@type": "GovernmentOrganization", name: "Louisiana Department of Agriculture and Forestry, Horticulture Commission" },
  },
  identifier: stage ? null : { "@type": "PropertyValue", name: "Louisiana LDAF Arborist License", value: licenseNumber },
};
