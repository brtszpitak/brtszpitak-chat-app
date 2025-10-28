const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

const loadKnowledgeGraph = () => {
  try {
    const graphData = fs.readFileSync(path.join(__dirname, "knowledge_graph.json"), "utf8");
    knowledgeGraph = JSON.parse(graphData);
  } catch (err) {
    console.error(err);
  }
};

const saveKnowledgeGraph = () => {
  try {
    const graphData = JSON.stringify(knowledgeGraph, null, 2);
    fs.writeFileSync(path.join(__dirname, "knowledge_graph.json"), graphData);
  } catch (err) {
    console.error(err);
  }
};

loadKnowledgeGraph();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userMessage = input.trim();
  if (!userMessage) return;

  // simple context-aware response example
  if (knowledgeGraph[userMessage]) {
    console.log(`You mentioned ${userMessage} before!`);
  } else {
    knowledgeGraph[userMessage] = true;
    console.log(`I'll remember that you like ${userMessage}.`);
  }

  saveKnowledgeGraph();
});

process.stdin.on("end", () => process.exit());
