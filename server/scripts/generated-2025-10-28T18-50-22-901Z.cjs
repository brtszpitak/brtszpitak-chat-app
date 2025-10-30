const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding('utf8');
process.stdout.write('Welcome to our conversation! What would you like to talk about?\n');

process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message !== '') {
    const date = new Date().toISOString();
    knowledgeGraph[date] = { message };
    fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph, null, 2));
    process.stdout.write(`You said: ${message}\n`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!\n');
});