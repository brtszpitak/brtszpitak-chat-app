const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const graphFile = 'knowledge-graph.json';
  const graphPath = path.join(__dirname, graphFile);
  knowledgeGraph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message.startsWith('remember ')) {
    const keyValuePair = message.substring(8).split(': ');
    knowledgeGraph[keyValuePair[0]] = keyValuePair[1];
    fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
  } else if (message.startsWith('recall ')) {
    const key = message.substring(7);
    console.log(knowledgeGraph[key]);
  } else {
    console.log('Unknown command');
  }
});

process.stdin.on('end', () => process.exit());