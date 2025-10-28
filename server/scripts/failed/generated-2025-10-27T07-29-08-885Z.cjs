const fs = require("fs");
const path = require("path");

let dataPath = path.join(__dirname, "knowledgeGraph.json");

try {
  let data = fs.readFileSync(dataPath, "utf8");
  knowledgeGraph = JSON.parse(data);
} catch (err) {
  knowledgeGraph = {};
}

function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(knowledgeGraph));
}

function updateGraph(key, value) {
  if (!knowledgeGraph[key]) knowledgeGraph[key] = [];
  knowledgeGraph[key].push(value);
  saveData();
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim().split(" ")[0];
  const args = input.trim().slice(command.length).trim();

  if (command === "remember") updateGraph(args, new Date().toISOString());
  else console.log(`Unknown command: ${command}`);
});

process.stdin.on("end", () => process.exit());
