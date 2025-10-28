const fs = require("fs");
const path = require("path");

let history = [];

const learnFromInteraction = (input) => {
  const timestamp = new Date().toISOString();
  history.push({ timestamp, input });
  fs.writeFileSync(path.join(__dirname, "history.json"), JSON.stringify(history));
};

const provideSuggestions = () => {
  if (!fs.existsSync(path.join(__dirname, "history.json"))) return [];
  const storedHistory = fs.readFileSync(path.join(__dirname, "history.json"));
  history = JSON.parse(storedHistory);

  let suggestions = [];
  for (let i = 0; i < history.length - 1; i++) {
    if (history[i].input.includes(history[history.length - 1].input)) {
      suggestions.push(`powershell ${history[i + 1].input}`);
    }
  }
  return suggestions;
};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  learnFromInteraction(input.trim());
  const suggestions = provideSuggestions();
  console.log(suggestions.join("\n"));
});

console.log("Type your PowerShell command or topic to get suggestions...");
