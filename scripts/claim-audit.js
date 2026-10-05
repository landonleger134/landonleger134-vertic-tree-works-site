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
  !site.open247 && [/24\s*\/\s*7|24-7|twenty-four/i, "24/7 claim while site.open247 is false"],
  [/[\w.+-]+@strata-exterior\.com/i, "Strata email on the Vertic site"],
  [/★|☆|\b\d(\.\d)?\s*(star|stars)\b|\b\d+\+?\s*(google\s*)?reviews\b/i, "rating / review-count claim"],
  [/years in business|in business since|since (19|20)\d\d|\d+\+?\s*years of experience/i, "years-in-business claim"],
  [/\[(HOURS|LICENSE-NUMBER|GL-AMOUNT|WC-AMOUNT|WC-STATUS|PAYMENT-METHODS|DEPOSIT-POLICY|REVIEW-PLACEHOLDER|VERTIC-DOMAIN|STAGE|POST-LICENSE|OPTIONAL)[^\]]*\]/, "raw placeholder token rendered"],
  [/#null\b|>\s*(null|undefined)\s*<|\bundefined\b/, "null/undefined leaked into output"],
  [new RegExp('href="tel:(?!\\+1' + site.phone.replace(/\D/g, "") + '")'), "tel: link that isn't site.phone"],
  [/907[-.\s)]*9013/, "Strata's phone number (225) 907-9013 on the Vertic site"],
  [/href="mailto:(?!info@vertictree\.com")/, "mailto: link that isn't the Vertic inbox"],
  [/topping service|we top trees/i, "topping offered as a service"],
  [/50\s*\/\s*50|fifty[-\s]fifty|equity split|ownership split|\bLeger\b|\bGrantham\b/i, "ownership split or owner last name on a public page (first names only)"],
  [/new company|\bstart-?up\b/i, "“new company” / startup language on a public page"],
  // 2026-09-29 brief §12
  [/\bour cranes?\b|\bwe own\b|\bour fleet\b|\bown(s|ed)? (a |the |our )?cranes?\b|\bin-house crane/i, "owned-crane / fleet wording (cranes are arranged through trusted partners)"],
  [/\$\s?\d{1,3}(,\d{3}){1,}|per occurrence|in coverage|coverage limits?|policy limits?/i, "insurance dollar amount / coverage figure"],
  !site.stage && [/Licensed Arborist\s*#/i, "old-format license claim (use the verbatim license line)"],
  !site.stage && [new RegExp("License No\\.(?! " + site.licenseNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b)"), "license number that isn't site.licenseNumber"],
  !site.stage && [/LDAF Licensed Arborist(?!, License No\. )/, "license line not verbatim"],
  !site.equipment.some((e) => /bucket truck/i.test(e)) && [/bucket truck/i, "bucket truck claimed but not in site.equipment"],
  !site.equipment.some((e) => /chipper/i.test(e)) && [/\bchipper\b/i, "chipper claimed but not in site.equipment"],
].filter(Boolean);

const hits = [];
for (const f of files) {
  const rel = path.relative(OUT, f);
  // Customers' own words (Google reviews) aren't our claims — judge only our copy.
  const txt = fs.readFileSync(f, "utf8").replace(/<blockquote class="review">[\s\S]*?<\/blockquote>/g, "");
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

// "What we do" grid: 3 + 2 (never a lone card). Each card spans 2 of 6
// columns; with exactly 5 cards the last two span 3 — check the markup count
// and that the stylesheet still carries that rule.
{
  const css = fs.readFileSync(path.join(OUT, "assets", "site.css"), "utf8");
  const has3x2 = /repeat\(6,\s*1fr\)/.test(css) && /\.services__item:first-child:nth-last-child\(5\)\s*~\s*\.services__item:nth-child\(n\+4\)\s*\{\s*grid-column:\s*span 3/.test(css);
  for (const rel of ["index.html", "services/index.html"]) {
    const html = fs.readFileSync(path.join(OUT, rel), "utf8");
    const n = (html.match(/class="services__item/g) || []).length;
    if (n === 5 && !has3x2) hits.push(`${rel}: 5 service cards but the 3 + 2 grid rule is missing`);
    if (n % 3 === 1 && n !== 4) hits.push(`${rel}: ${n} service cards would leave one alone on the last row`);
  }
}

// The verbatim license line must be on these pages once licensed.
if (!site.stage) {
  const line = "Louisiana LDAF Licensed Arborist, License No. " + site.licenseNumber;
  for (const rel of ["index.html", "about/index.html", "faq/index.html", "insurance-trust/index.html", "contact/index.html"]) {
    const f = path.join(OUT, rel);
    if (!fs.existsSync(f) || !fs.readFileSync(f, "utf8").includes(line)) hits.push(`${rel}: verbatim license line missing`);
  }
}

if (hits.length) {
  console.error(`\nCLAIM AUDIT FAILED — ${hits.length} hit(s):\n  ` + hits.join("\n  ") + "\n");
  process.exit(1);
}
console.log(`Claim audit passed (${files.length} files, ${site.stage ? "STAGE" : "POST-LICENSE"} mode).`);
