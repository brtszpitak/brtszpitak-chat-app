const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.on('data', (input) => {
  const conversation = input.toString().trim();
  const [command, ...args] = conversation.split(/\s+/);

  if (command === 'remember') {
    const key = args[0];
    const value = args.slice(1).join(' ');
    knowledgeGraph[key] = value;
  } else if (command === 'recall') {
    const key = args[0];
    console.log(knowledgeGraph[key]);
  }

  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph, null, 2));
});

process.stdin.setEncoding('utf8');
process.stdin.resume();