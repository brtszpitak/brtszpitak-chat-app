const fs = require('fs');
let knowledgeGraph = {};

try {
  const data = fs.readFileSync('knowledge_graph.json', 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

function saveKnowledgeGraph() {
  fs.writeFileSync('knowledge_graph.json', JSON.stringify(knowledgeGraph, null, 2));
}

function updateGraph(topic, preference) {
  if (!knowledgeGraph[topic]) knowledgeGraph[topic] = {};
  knowledgeGraph[topic][preference] = (knowledgeGraph[topic][preference] || 0) + 1;
  saveKnowledgeGraph();
}

function suggestTopic(userInput) {
  let maxPreference = 0, suggestedTopic = '';
  for (const topic in knowledgeGraph) {
    if (Object.values(knowledgeGraph[topic]).some(preference => userInput.includes(preference))) {
      const preferenceCount = Object.values(knowledgeGraph[topic]).reduce((a, b) => a + b, 0);
      if (preferenceCount > maxPreference) {
        maxPreference = preferenceCount;
        suggestedTopic = topic;
      }
    }
  }
  return suggestedTopic;
}

const userInput = 'example user input';
updateGraph('conversations', userInput);
console.log(suggestTopic(userInput));