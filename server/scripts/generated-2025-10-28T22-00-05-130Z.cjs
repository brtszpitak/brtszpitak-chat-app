const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
}

function loadKnowledgeGraph() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'));
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
}

loadKnowledgeGraph();

const userInputs = [
  "I like coffee",
  "I prefer tea",
  "What do you know about me?"
];

for (const userInput of userInputs) {
  const utterance = userInput.toLowerCase();
  if (!knowledgeGraph[utterance]) knowledgeGraph[utterance] = {};
  
  if (utterance.includes("like")) {
    const preference = utterance.replace("i like", "").trim();
    knowledgeGraph[utterance].preference = preference;
  } else if (utterance.includes("prefer")) {
    const preference = utterance.replace("i prefer", "").trim();
    knowledgeGraph[utterance].preference = preference;
  }
  
  if (utterance === "what do you know about me?") {
    console.log(knowledgeGraph);
  }
}

saveKnowledgeGraph();