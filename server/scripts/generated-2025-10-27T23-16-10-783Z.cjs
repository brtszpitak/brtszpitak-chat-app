const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput) {
    console.log(`You said: ${userInput}`);
    const now = new Date().toISOString();
    knowledgeGraph[now] = { input: userInput, response: '' };
    fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph, null, 2));
  }
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!');
});