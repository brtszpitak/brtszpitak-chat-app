const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "knowledge_graph.json"), "utf8");
  knowledgeGraph = JSON.parse(data);
} catch (e) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput in knowledgeGraph) {
    console.log(knowledgeGraph[userInput]);
  } else {
    console.log("I don't have any information about that.");
    knowledgeGraph[userInput] = {};
    fs.writeFileSync(path.join(__dirname, "knowledge_graph.json"), JSON.stringify(knowledgeGraph));
  }
});
