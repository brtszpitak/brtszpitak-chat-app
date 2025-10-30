const fs = require('fs');
let knowledgeGraph = {};

try {
  const savedGraph = fs.readFileSync('knowledge-graph.json', 'utf8');
  knowledgeGraph = JSON.parse(savedGraph);
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (!userInput) return;

  if (!knowledgeGraph[userInput]) {
    knowledgeGraph[userInput] = {};
  }

  console.log(`You said: ${userInput}`);
  console.log(`Context-aware response:`);

  // TO DO: implement context-aware logic here
  console.log("Not implemented yet");

  fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph, null, 2));
});

process.stdin.on('end', () => {
  process.exit();
});