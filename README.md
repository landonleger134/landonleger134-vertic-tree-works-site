# Vertic Tree Works — website

Static site built with [Eleventy](https://www.11ty.dev/), hosted on Netlify. Every push to `main` builds and deploys.

## The two files you'll actually edit

**`src/_data/site.js`** holds every business fact: phone, email, hours, insurance amounts, payment terms, equipment, reviews, photos, and the land-clearing switch. If a value is `null`, the site shows honest fallback wording (for example "Call or text for availability") and never prints a raw placeholder.

**`src/_data/license.js`** holds every license-dependent sentence as a STAGE / POST-LICENSE pair. You normally don't edit it. It reads the switch in `site.js`.

## Flipping to licensed (after the LDAF license is issued)

In `src/_data/site.js`:

```js
stage: false,
licenseNumber: "1234",   // the real number
```

Commit and push. That one change updates the trust bars, the About, FAQ, and Insurance pages, the home meta description, and the structured data (the credential is added to the JSON-LD). The build refuses to run if `stage` is `false` and `licenseNumber` is empty.

## Claim audit (runs on every build)

`npm run build` = Eleventy build, then `scripts/claim-audit.js`. **Any hit fails the build, so Netlify won't deploy it.** It fails on:

- a present-tense "licensed arborist" or a license number while in STAGE
- "certified arborist" or ISA claims
- 24/7 claims
- a Strata email address
- star ratings, review counts, years-in-business
- a raw `[PLACEHOLDER]` token, or `null`/`undefined` in output
- a phone link other than (225) 418-2720, or an email link other than info@vertictree.com
- a bucket truck or chipper mentioned while it isn't listed in `site.equipment`
- any link to `/land-clearing/` while `landClearingLive` is `false`

## Other switches in `site.js`

- `landClearingLive` — while `false`, the land-clearing page exists but is unlinked, noindexed, and left out of the sitemap.
- `reviews` — real Google reviews only (`{ quote, name, city }`). While the list is empty, the reviews section doesn't render.
- `photos` — real job photos only (`{ src, alt, category }`). Put the files in `src/assets/photos/`. The gallery and the homepage teaser appear automatically.
- `hours`, `glAmount`, `wcAmount`, `paymentMethods`, `depositPolicy` — each fact appears on the site once you fill it in.

## Search indexing

Search indexing is automatic. Pages are `noindex` and robots.txt blocks crawling unless the build runs in Netlify production **and** the site's primary URL is vertictree.com. Previews and the temporary `*.netlify.app` address are never indexed.

## Estimate form

The estimate form uses Netlify Forms (form name `estimate`), with a honeypot for spam and one optional photo upload. To set up email notifications: Netlify → Site configuration → Forms → Form notifications.

## Local development

```
npm install
npm run serve     # http://localhost:8080
npm run build     # build + claim audit
```
