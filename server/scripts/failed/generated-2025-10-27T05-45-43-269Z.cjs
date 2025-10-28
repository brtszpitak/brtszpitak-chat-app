const fs = require("fs");
const path = require("path");

let knowledgeGraph = {};

const saveKnowledgeGraph = () => {
  fs.writeFileSync(path.join(__dirname, "knowledge-graph.json"), JSON.stringify(knowledgeGraph));
};

const loadKnowledgeGraph = () => {
  try {
    knowledgeGraph = JSON.parse(
      fs.readFileSync(path.join(__dirname, "knowledge-graph.json")).toString()
    );
  } catch (e) {}
};

loadKnowledgeGraph();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const conversation = input.trim();
  if (!conversation) return;

  knowledgeGraph[conversation] = (knowledgeGraph[conversation] || []).concat([
    new Date().toISOString(),
  ]);

  saveKnowledgeGraph();

  console.log(`You said: ${conversation}`);
  console.log(`I remember this conversation from: ${knowledgeGraph[conversation].join(", ")}`);
});

process.stdin.on("end", () => process.exit());
