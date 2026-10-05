// Reports how the Google reviews fetch went: in the deploy summary (Netlify UI)
// and as one line in the ops project's function log (site-build-status), so it
// can be checked without digging through the build log. Never fails the build.
const fs = require("fs");
const STATUS_URL = "https://alxunsqvaujknsnsgoab.supabase.co/functions/v1/site-build-status";
module.exports = {
  async onSuccess({ utils }) {
    let msg = "No status recorded (the reviews data file didn't run).";
    try { msg = JSON.parse(fs.readFileSync(".reviews-status.json", "utf8")).status; } catch (e) {}
    utils.status.show({ title: "Google reviews", summary: msg });
    try {
      await fetch(STATUS_URL, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: "vertictree.com", topic: "google-reviews", status: msg }), signal: AbortSignal.timeout(8000) });
    } catch (e) { console.log("[reviews-status] couldn't report status:", e.message); }
  },
};
