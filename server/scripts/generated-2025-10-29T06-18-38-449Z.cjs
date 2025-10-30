const fs = require('fs');
const path = require('path');

let knowledgeGraph = {};

if (fs.existsSync('knowledge-graph.json')) {
  knowledgeGraph = JSON.parse(fs.readFileSync('knowledge-graph.json', 'utf8'));
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', input => {
  const message = input.trim();
  if (message.startsWith('remember ')) {
    const [key, value] = message.split(' ').slice(1);
    knowledgeGraph[key] = value;
    fs.writeFileSync('knowledge-graph.json', JSON.stringify(knowledgeGraph));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (message.startsWith('recall ')) {
    const key = message.split(' ')[1];
    if (knowledgeGraph.hasOwnProperty(key)) {
      console.log(`${key} = ${knowledgeGraph[key]}`);
    } else {
      console.log(`Unknown: ${key}`);
    }
  } else {
    console.log('Unknown command');
  }
});