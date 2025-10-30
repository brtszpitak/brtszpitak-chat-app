const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

if (fs.existsSync(path.join(__dirname, 'knowledgeGraph.json'))) {
  knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledgeGraph.json'), 'utf8'));
}

function saveKnowledgeGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledgeGraph.json'), JSON.stringify(knowledgeGraph));
}

function recallTopic(topic) {
  return knowledgeGraph[topic] || null;
}

function rememberTopic(topic, information) {
  knowledgeGraph[topic] = information;
  saveKnowledgeGraph();
}

function respondBasedOnContext(input) {
  const topics = Object.keys(knowledgeGraph);
  for (const topic of topics) {
    if (input.includes(topic)) {
      const info = recallTopic(topic);
      return `I remember we discussed ${topic} earlier. ${info}`;
    }
  }
  return 'I don't have any information about that topic.';
}

console.log(respondBasedOnContext('Hello, how are you?')); // I don't have any information about that topic.
rememberTopic(' favorite color', 'Your favorite color is blue.');
console.log(respondBasedOnContext('What is my favorite color?')); // I remember we discussed  favorite color earlier. Your favorite color is blue.