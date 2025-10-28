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

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput !== "") {
    knowledgeGraph[userInput] = knowledgeGraph[userInput] || {};
    console.log(`You said: ${userInput}`);
    console.log(`I remember you previously talked about: `);
    for (const key in knowledgeGraph) {
      if (Object.hasOwnProperty.call(knowledgeGraph, key)) {
        console.log(`- ${key}`);
      }
    }
  }
});

process.stdin.on("end", () => {
  saveKnowledgeGraph();
});
