const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, "knowledge-graph.json"), JSON.stringify(knowledgeGraph));
}

function loadKnowledgeGraph() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "knowledge-graph.json"));
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
}

loadKnowledgeGraph();

const userInputHistory = {};

function updateKnowledgeGraph(userId, conversationData) {
  if (!knowledgeGraph[userId]) knowledgeGraph[userId] = {};
  Object.assign(knowledgeGraph[userId], conversationData);
  saveKnowledgeGraph();
}

function getConversationContext(userId) {
  return knowledgeGraph[userId];
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, userId, ...data] = input.trim().split(" ");
  if (command === "update") updateKnowledgeGraph(userId, JSON.parse(data.join(" ")));
  else if (command === "get-context") console.log(JSON.stringify(getConversationContext(userId)));
});

process.stdin.on("end", () => process.exit(0));
