const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.on('data', (input) => {
  const userInput = input.toString().trim();
  if (userInput === '') return;

  const currentDate = new Date().toISOString();

  if (!knowledgeGraph[currentDate]) knowledgeGraph[currentDate] = {};

  knowledgeGraph[currentDate][userInput] = true;

  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph, null, 2));

  console.log(`Interaction recorded: ${currentDate} - ${userInput}`);
});

process.stdin.setEncoding('utf8');
process.stdin.resume();