const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

try {
  const data = fs.readFileSync(path.join(__dirname, 'knowledge-graph.json'), 'utf8');
  knowledgeGraph = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message.startsWith(':remember ')) {
    const [_, key, value] = message.split(' ');
    knowledgeGraph[key] = value;
    fs.writeFileSync(path.join(__dirname, 'knowledge-graph.json'), JSON.stringify(knowledgeGraph));
  } else if (message.startsWith(':recall ')) {
    const [_, key] = message.split(' ');
    console.log(knowledgeGraph[key]);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('\n');
});