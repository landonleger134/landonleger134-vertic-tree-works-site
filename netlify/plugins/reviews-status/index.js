// Shows how the Google reviews fetch went in the deploy summary (Netlify UI →
// deploy → summary), so nobody has to dig through the build log.
const fs = require("fs");
module.exports = {
  onSuccess({ utils }) {
    let msg = "No status recorded (the reviews data file didn't run).";
    try { msg = JSON.parse(fs.readFileSync(".reviews-status.json", "utf8")).status; } catch (e) {}
    utils.status.show({ title: "Google reviews", summary: msg });
  },
};
