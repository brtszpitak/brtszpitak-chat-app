const fs = require('fs');
let knowledgeGraph = {};

try {
  knowledgeGraph = JSON.parse(fs.readFileSync('knowledge-graph.json', 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (!userInput) return;

  const now = new Date().toISOString();
  knowledgeGraph[now] = { user_input: userInput, response: '' };

  console.log(`You said: ${userInput}`);
  console.log('Please respond with your answer...');

  process.stdin.once('data', (response) => {
    knowledgeGraph[now].response = response.trim();
    fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph, null, 2));
    console.log('Response saved!');
  });
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!\n');
});