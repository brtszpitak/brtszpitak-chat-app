const fs = require("fs");

let knowledgeGraph = {};

function saveKnowledgeGraph() {
  fs.writeFileSync("./knowledge-graph.json", JSON.stringify(knowledgeGraph));
}

function loadKnowledgeGraph() {
  try {
    knowledgeGraph = JSON.parse(fs.readFileSync("./knowledge-graph.json").toString());
  } catch (e) {}
}

loadKnowledgeGraph();

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  const input = chunk.toString().trim();
  if (input !== "") {
    const context = input.split(" ")[0];
    const response = input.substring(context.length).trim();
    knowledgeGraph[context] = knowledgeGraph[context] || [];
    knowledgeGraph[context].push(response);
    saveKnowledgeGraph();
    console.log(`Context: ${context}, Response: ${response}`);
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});
