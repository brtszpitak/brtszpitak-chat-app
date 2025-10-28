const fs = require("fs");
const path = require("path");

let commandHistory = [];

try {
  const historyFile = path.join(process.env.USERPROFILE, ".alice_history");
  commandHistory = JSON.parse(fs.readFileSync(historyFile, "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command !== "") {
    commandHistory.push(command);
    fs.writeFileSync(
      path.join(process.env.USERPROFILE, ".alice_history"),
      JSON.stringify(commandHistory)
    );
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});
