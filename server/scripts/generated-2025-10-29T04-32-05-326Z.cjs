const fs = require('fs');
const path = require('path');

let storagePath = path.join(__dirname, 'knowledgeGraph.json');

let knowledgeGraph = {};

try {
  knowledgeGraph = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userInput = input.trim();
  
  if (userInput.startsWith('remember ')) {
    const [_, key, value] = userInput.split(' ');
    knowledgeGraph[key] = value;
    fs.writeFileSync(storagePath, JSON.stringify(knowledgeGraph, null, 2));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (userInput.startsWith('forget ')) {
    const [_, key] = userInput.split(' ');
    delete knowledgeGraph[key];
    fs.writeFileSync(storagePath, JSON.stringify(knowledgeGraph, null, 2));
    console.log(`Forgot: ${key}`);
  } else {
    console.log('Unknown command. Use "remember <key> <value>" or "forget <key>".');
  }
});

process.stdin.on('end', () => {
  process.exit();
});