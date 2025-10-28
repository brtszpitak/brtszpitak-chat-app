const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

function updateKnowledgeGraph(conversation) {
  const conversationId = conversation.id;
  if (!knowledgeGraph[conversationId]) {
    knowledgeGraph[conversationId] = {};
  }
  Object.keys(conversation).forEach((key) => {
    if (key !== "id") {
      knowledgeGraph[conversationId][key] = conversation[key];
    }
  });
}

function recallFromKnowledgeGraph(conversationId, key) {
  return knowledgeGraph[conversationId] && knowledgeGraph[conversationId][key];
}

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

const conversation = {
  id: "123",
  user: "John Doe",
  topic: "AI development",
};

updateKnowledgeGraph(conversation);

console.log(recallFromKnowledgeGraph("123", "user")); // John Doe
console.log(recallFromKnowledgeGraph("123", "topic")); // AI development

saveKnowledgeGraph();
