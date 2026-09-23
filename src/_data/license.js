// Every license-dependent sentence on the site lives here as a
// STAGE / POST-LICENSE pair. Only the active variant is ever rendered.
const { stage, licenseNumber } = require("./site.js");

const L = `Louisiana Licensed Arborist #${licenseNumber}`;
const pick = (stageText, postText) => (stage ? stageText : postText);

module.exports = {
  stage,
  heroTrust: pick(
    "Fully insured · Owner-operated · Serving East Baton Rouge, Ascension & Livingston Parishes",
    `${L} · Fully insured · Serving East Baton Rouge, Ascension & Livingston Parishes`
  ),
  chip: pick("Fully insured · Owner-operated · COI on request", `${L} · Fully insured · COI on request`),
  areaTrust: (place) =>
    pick(`Fully insured · Owner-operated · Serving ${place}`, `${L} · Fully insured · Serving ${place}`),
  metaDescriptionHome: pick(
    "Owner-operated tree trimming, removal & stump grinding in Baton Rouge, Prairieville, Denham Springs & nearby. Free estimates — call (225) 907-9013.",
    "Owner-operated tree trimming, removal & stump grinding in Greater Baton Rouge. Louisiana licensed arborist · Fully insured. Free estimates: (225) 907-9013."
  ),
  faqQuestion: "Are you licensed?",
  faqAnswer: pick(
    "We’re working through Louisiana arborist licensing. We’ll tell you exactly where that stands when you ask. We carry insurance and can provide a certificate before work starts.",
    `Yes. ${L}. We can show credentials and provide a certificate of insurance before work begins.`
  ),
  serviceFaqQuestion: "Are you a licensed arborist?",
  serviceFaqAnswer: pick(
    "We’re working through Louisiana licensing. Ask us about current credentials and insurance — we’ll be straight with you.",
    `Yes. ${L}. Happy to show credentials and COI.`
  ),
  about: pick(
    "We’re building Vertic the right way — insured, equipped, and working through Louisiana arborist licensing. Ask us about current credentials and we’ll be direct. Insurance certificates are available on request.",
    `${L}. Certificate of insurance available on request.`
  ),
  insurance: pick(
    "Louisiana arborist licensing is in progress. Ask us for current status anytime — we’ll give you a straight answer.",
    `${L}. Credentials available for review with your COI.`
  ),
  // Emitted into JSON-LD only after the flip.
  credential: stage
    ? null
    : { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: L },
};
