const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

function saveGraph() {
  fs.writeFileSync(path.join(__dirname, "knowledge-graph.json"), JSON.stringify(knowledgeGraph));
}

function loadGraph() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "knowledge-graph.json"));
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
}

loadGraph();

function updateGraph(userInput) {
  const timestamp = new Date().toISOString();
  knowledgeGraph[timestamp] = userInput;
  saveGraph();
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  const userInput = chunk.toString().trim();
  updateGraph(userInput);
  console.log(`You said: ${userInput}`);
});

console.log("Type something to update the knowledge graph...");
