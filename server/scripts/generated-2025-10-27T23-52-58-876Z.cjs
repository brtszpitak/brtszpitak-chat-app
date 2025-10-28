const fs = require('fs');
let knowledgeGraph = {};

function addNode(topic, details) {
  if (!knowledgeGraph[topic]) knowledgeGraph[topic] = [];
  knowledgeGraph[topic].push(details);
}

function recallTopic(topic) {
  return knowledgeGraph[topic] || [];
}

function saveKnowledgeGraph() {
  fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph, null, 2));
}

function loadKnowledgeGraph() {
  try {
    const data = fs.readFileSync('knowledge-graph.json', 'utf8');
    knowledgeGraph = JSON.parse(data);
  } catch (e) {}
}

loadKnowledgeGraph();

console.log('Welcome to the conversational AI!');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const [command, ...args] = input.trim().split(' ');
  
  if (command === 'add') {
    addNode(args[0], args.slice(1).join(' '));
    console.log(`Added node to topic ${args[0]}`);
  } else if (command === 'recall') {
    const topic = args[0];
    const details = recallTopic(topic);
    console.log(`Recalling topic ${topic}:`);
    details.forEach((detail) => console.log(`- ${detail}`));
  } else if (command === 'save') {
    saveKnowledgeGraph();
    console.log('Knowledge graph saved!');
  } else {
    console.log('Unknown command. Try "add <topic> <details>", "recall <topic>", or "save".');
  }
});

process.stdin.on('end', () => {
  process.exit(0);
});