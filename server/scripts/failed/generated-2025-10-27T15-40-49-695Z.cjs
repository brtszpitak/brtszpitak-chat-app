const fs = require("fs");
let data = {};
try {
  data = JSON.parse(fs.readFileSync("user_prefs.json", "utf8"));
} catch {}
const now = new Date().toISOString();
process.stdin.on("data", (input) => {
  const feedback = input.toString().trim();
  if (feedback === "like" || feedback === "dislike") {
    const lastResponse = data.last_response;
    if (lastResponse) {
      data.responses[lastResponse] = data.responses[lastResponse] || {};
      data.responses[lastResponse][feedback] = (data.responses[lastResponse][feedback] || 0) + 1;
      fs.writeFileSync("user_prefs.json", JSON.stringify(data, null, 2));
    }
  }
});
process.stdin.setEncoding("utf8");
console.log('Provide feedback by typing "like" or "dislike" and pressing Enter.');
