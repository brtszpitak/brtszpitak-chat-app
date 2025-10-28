const fs = require("fs");
const path = require("path");

let convoLogPath = path.join(process.env.USERPROFILE, "convo_log.json");

try {
  let convoLog = JSON.parse(fs.readFileSync(convoLogPath, "utf8"));
} catch (e) {
  let convoLog = {};
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  let message = input.trim();
  if (message) {
    let timestamp = new Date().toISOString();
    convoLog[timestamp] = message;
    fs.writeFileSync(convoLogPath, JSON.stringify(convoLog, null, 2));
    console.log(`Logged conversation at ${timestamp}`);
  }
});

console.log("Type your messages to log conversations...");
