const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, "knowledge-graph.json"))) {
  knowledgeGraph = JSON.parse(
    fs.readFileSync(path.join(__dirname, "knowledge-graph.json"), "utf8")
  );
}

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, "knowledge-graph.json"), JSON.stringify(knowledgeGraph));
}

function recall(topic) {
  return knowledgeGraph[topic] || null;
}

function remember(topic, details) {
  knowledgeGraph[topic] = details;
  saveKnowledgeGraph();
}

remember("previous-conversation", "This is a sample conversation.");

console.log(recall("previous-conversation"));
