```cjs
const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

function saveGraph() {
  fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph, null, 2));
}

function loadGraph() {
  try {
    knowledgeGraph = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8'));
  } catch (e) {}
}

loadGraph();

console.log('Welcome to the context-aware knowledge graph!');
console.log('Type "remember <key> <value>" to store information, "recall <key>" to retrieve it, or "exit" to quit.');

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const [command, key, value] = input.trim().split(' ');
  
  if (command === 'remember') {
    knowledgeGraph[key] = value;
    saveGraph();
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command === 'recall') {
    console.log(knowledgeGraph[key]);
  } else if (command === 'exit') {
    process.exit(0);
  }
});
```