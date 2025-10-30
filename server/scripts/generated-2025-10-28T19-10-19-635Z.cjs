const fs = require('fs');
const path = require('path');

let memory = {};

try {
  const memoryFile = fs.readFileSync(path.join(process.cwd(), 'memory.json'), 'utf8');
  memory = JSON.parse(memoryFile);
} catch (err) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const userInput = input.trim();
  if (userInput === ':save') {
    fs.writeFileSync(path.join(process.cwd(), 'memory.json'), JSON.stringify(memory));
    console.log('Memory saved.');
  } else if (userInput.startsWith(':recall')) {
    const key = userInput.substring(7).trim();
    console.log(memory[key] || `No memory found for ${key}.`);
  } else {
    console.log(`You said: ${userInput}`);
    memory[userInput] = new Date().toISOString();
  }
});

process.stdin.on('end', () => process.exit());