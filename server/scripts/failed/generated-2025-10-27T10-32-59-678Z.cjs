const fs = require("fs");
const path = require("path");

let convoLog = {};

try {
  convoLog = JSON.parse(fs.readFileSync(path.join(__dirname, "convo.log"), "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const timestamp = new Date().toISOString();
  const message = input.trim();

  if (!convoLog[timestamp]) convoLog[timestamp] = [];

  convoLog[timestamp].push(message);

  fs.writeFileSync(path.join(__dirname, "convo.log"), JSON.stringify(convoLog));

  console.log(`You said: ${message}`);
});

process.stdin.on("end", () => process.exit());
