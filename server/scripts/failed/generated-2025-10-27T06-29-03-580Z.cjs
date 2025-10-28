const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "knowledge-graph.json"), "utf8");
  knowledgeGraph = JSON.parse(data);
} catch (e) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput in knowledgeGraph) {
    console.log(knowledgeGraph[userInput]);
  } else {
    console.log("I didn't understand that. Please try again.");
    knowledgeGraph[userInput] = "Unknown";
  }
  fs.writeFileSync(path.join(__dirname, "knowledge-graph.json"), JSON.stringify(knowledgeGraph));
});

process.stdin.on("end", () => {
  process.exit();
});
