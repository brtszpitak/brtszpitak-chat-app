const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, "knowledge-graph.json"))) {
  knowledgeGraph = JSON.parse(
    fs.readFileSync(path.join(__dirname, "knowledge-graph.json"), "utf8")
  );
}

function saveKnowledgeGraph() {
  fs.writeFileSync(
    path.join(__dirname, "knowledge-graph.json"),
    JSON.stringify(knowledgeGraph, null, 2)
  );
}

function updateKnowledgeGraph(userId, key, value) {
  if (!knowledgeGraph[userId]) knowledgeGraph[userId] = {};
  knowledgeGraph[userId][key] = value;
  saveKnowledgeGraph();
}

function getFromKnowledgeGraph(userId, key) {
  return knowledgeGraph[userId] ? knowledgeGraph[userId][key] : null;
}

const userId = "test-user";
updateKnowledgeGraph(userId, "previous-conversation", "This is a test conversation");
console.log(getFromKnowledgeGraph(userId, "previous-conversation"));
