// Claim audit — runs after every build (npm run build). Any hit fails the
// build, so a bad claim can never reach production through Netlify.
const fs = require("fs");
const path = require("path");
const site = require("../src/_data/site.js");

const OUT = path.join(__dirname, "..", "_site");
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(html|xml|txt)$/.test(f)) files.push(p);
  }
})(OUT);

const rules = [
  // Present-tense license claims while in STAGE. The FAQ *question*
  // "Are you a licensed arborist?" is allowed; statements are not.
  site.stage && [/licensed arborist(?!\?)/i, "present-tense licensed-arborist claim in STAGE"],
  site.stage && [/license\s*#|arborist\s*#/i, "license number shown in STAGE"],
  [/certified arborist/i, "certification claim (not held)"],
  [/\bISA\b/, "ISA credential claim (not held)"],
  [/24\s*\/\s*7|24-7|twenty-four/i, "24/7 claim"],
  [/[\w.+-]+@strata-exterior\.com/i, "Strata email on the Vertic site"],
  [/★|☆|\b\d(\.\d)?\s*(star|stars)\b|\b\d+\+?\s*(google\s*)?reviews\b/i, "rating / review-count claim"],
  [/years in business|in business since|since (19|20)\d\d|\d+\+?\s*years of experience/i, "years-in-business claim"],
  [/\[(HOURS|LICENSE-NUMBER|GL-AMOUNT|WC-AMOUNT|WC-STATUS|PAYMENT-METHODS|DEPOSIT-POLICY|REVIEW-PLACEHOLDER|VERTIC-DOMAIN|STAGE|POST-LICENSE|OPTIONAL)[^\]]*\]/, "raw placeholder token rendered"],
  [/#null\b|>\s*(null|undefined)\s*<|\bundefined\b/, "null/undefined leaked into output"],
  [/href="tel:(?!\+12259079013")/, "tel: link that isn't the real phone number"],
  [/href="mailto:(?!info@vertictree\.com")/, "mailto: link that isn't the Vertic inbox"],
  [/topping service|we top trees/i, "topping offered as a service"],
  !site.equipment.some((e) => /bucket truck/i.test(e)) && [/bucket truck/i, "bucket truck claimed but not in site.equipment"],
  !site.equipment.some((e) => /chipper/i.test(e)) && [/\bchipper\b/i, "chipper claimed but not in site.equipment"],
].filter(Boolean);

const hits = [];
for (const f of files) {
  const rel = path.relative(OUT, f);
  const txt = fs.readFileSync(f, "utf8");
  for (const [re, why] of rules) {
    const m = txt.match(re);
    if (m) hits.push(`${rel}: ${why} → "${txt.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, " ")}"`);
  }
  // Land clearing stays unlinked until it's live.
  if (!site.landClearingLive && rel !== path.join("land-clearing", "index.html") && /href="\/land-clearing\/"/.test(txt)) {
    hits.push(`${rel}: links to /land-clearing/ while landClearingLive is false`);
  }
}
if (!site.landClearingLive && /land-clearing/.test(fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8"))) {
  hits.push("sitemap.xml: lists /land-clearing/ while landClearingLive is false");
}

// CSS sanity: an unbalanced brace silently drops the next rule in every browser.
{
  const css = fs.readFileSync(path.join(OUT, "assets", "site.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  let depth = 0, line = 1;
  for (const ch of css) {
    if (ch === "\n") line++;
    if (ch === "{") depth++;
    if (ch === "}" && --depth < 0) { hits.push(`assets/site.css: unmatched "}" near line ${line}`); break; }
  }
  if (depth > 0) hits.push(`assets/site.css: ${depth} unclosed "{"`);
}

if (hits.length) {
  console.error(`\nCLAIM AUDIT FAILED — ${hits.length} hit(s):\n  ` + hits.join("\n  ") + "\n");
  process.exit(1);
}
console.log(`Claim audit passed (${files.length} files, ${site.stage ? "STAGE" : "POST-LICENSE"} mode).`);
