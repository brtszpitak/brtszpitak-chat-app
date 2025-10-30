const fs = require('fs');
const path = require('path');

let storagePath = path.join(__dirname, 'context.json');
let context = {};

try {
  context = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  let userInput = input.trim();
  if (userInput === '') return;

  // Simple conversation history
  context[userInput] = (context[userInput] || 0) + 1;
  fs.writeFileSync(storagePath, JSON.stringify(context));

  console.log(`You said "${userInput}" ${context[userInput]} time(s) before.`);
});

process.stdin.on('end', () => process.exit());