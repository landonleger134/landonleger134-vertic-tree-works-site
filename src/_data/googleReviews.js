// Google reviews for the homepage, fetched at BUILD time (Places API (New)).
//  - Finds the Vertic Tree Works profile by text search, then pulls its reviews.
//  - Keeps only 5-star reviews that have text, newest first, max 3.
//  - Never fails the build: any problem → no reviews, section hidden.
//  - Google's terms: review content may not be stored more than 30 days. The
//    site rebuilds on the 1st and 15th (.github/workflows/refresh-reviews.yml),
//    so what's shown is always refreshed well inside that window.
// The API key lives only in Netlify (GOOGLE_PLACES_API_KEY, builds scope).
// Local testing: REVIEWS_FIXTURE=path/to/place.json uses a saved response.
const fs = require("fs");
const path = require("path");
// Status for the deploy summary (netlify/plugins/reviews-status) — not published.
function report(status){ try{ fs.writeFileSync(path.join(process.cwd(), ".reviews-status.json"), JSON.stringify({ at: new Date().toISOString(), status })); }catch(e){} }

const QUERY = "Vertic Tree Works, 12677 Jefferson Hwy, Baton Rouge, LA 70816";
const MAX = 3;

function trimText(t, max = 320) {
  const s = String(t || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ") > 200 ? cut.lastIndexOf(" ") : max).replace(/[,;:.\s]+$/, "") + "…";
}

function shape(place) {
  const reviews = (place.reviews || [])
    .filter((r) => r.rating === 5 && r.text && String(r.text.text || "").trim())
    .sort((a, b) => String(b.publishTime || "").localeCompare(String(a.publishTime || "")))
    .slice(0, MAX)
    .map((r) => ({
      text: trimText(r.text.text),
      full: String(r.text.text || "").length > 320,
      author: (r.authorAttribution && r.authorAttribution.displayName) || "Google user",
      authorUri: (r.authorAttribution && r.authorAttribution.uri) || null,
      when: r.relativePublishTimeDescription || "",
      uri: r.googleMapsUri || place.googleMapsUri || null,
    }));
  return { reviews, mapsUri: place.googleMapsUri || null, placeName: place.displayName && place.displayName.text };
}

async function fetchJson(url, opts) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${res.status} ${(body.error && body.error.message) || ""}`.trim());
    return body;
  } finally { clearTimeout(timer); }
}

module.exports = async function () {
  const empty = { reviews: [], mapsUri: null };
  try {
    if (process.env.REVIEWS_FIXTURE) {
      return shape(JSON.parse(fs.readFileSync(process.env.REVIEWS_FIXTURE, "utf8")));
    }
    const key = process.env.GOOGLE_PLACES_API_KEY;
    if (!key) { console.log("[googleReviews] no GOOGLE_PLACES_API_KEY — reviews section hidden"); report("No GOOGLE_PLACES_API_KEY in this build — reviews hidden"); return empty; }

    const found = await fetchJson("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress" },
      body: JSON.stringify({ textQuery: QUERY, maxResultCount: 3 }),
    });
    const match = (found.places || []).find((p) => /vertic/i.test((p.displayName && p.displayName.text) || ""));
    if (!match) {
      const names = (found.places || []).map((p) => (p.displayName && p.displayName.text) || "?").join(", ") || "none";
      console.log("[googleReviews] Vertic profile not found by text search — reviews hidden");
      report("Vertic profile not found by search (got: " + names + ") — reviews hidden"); return empty;
    }

    const place = await fetchJson(`https://places.googleapis.com/v1/places/${encodeURIComponent(match.id)}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "id,displayName,googleMapsUri,reviews" },
    });
    const out = shape(place);
    console.log(`[googleReviews] ${out.placeName} (${match.id}): ${(place.reviews || []).length} returned, showing ${out.reviews.length} five-star`);
    report(`OK — ${out.placeName} (${match.id}): Google returned ${(place.reviews || []).length} reviews, showing ${out.reviews.length} five-star`);
    return out;
  } catch (e) {
    console.log("[googleReviews] fetch failed — reviews hidden this build:", e.message);
    report("Google request failed: " + String(e.message).slice(0, 300) + " — reviews hidden");
    return empty;
  }
};
