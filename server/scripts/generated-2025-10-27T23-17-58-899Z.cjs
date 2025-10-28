const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge_graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', input => {
  const userInput = input.trim();
  if (!userInput) return;

  const now = new Date().toISOString();
  const conversationId = `conversation-${now}`;
  knowledgeGraph[conversationId] = { userInputs: [userInput], responses: [] };

  fs.writeFileSync(path.join(__dirname, 'knowledge_graph.json'), JSON.stringify(knowledgeGraph, null, 2));

  console.log(`You said: ${userInput}`);
  console.log('How should I respond? (type "exit" to quit)');
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!');
});