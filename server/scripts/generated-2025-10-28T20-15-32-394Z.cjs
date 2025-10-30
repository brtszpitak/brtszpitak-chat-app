const fs = require('fs');
const path = require('path');

let memory = {};

if (fs.existsSync('memory.json')) {
  memory = JSON.parse(fs.readFileSync('memory.json', 'utf8'));
}

function saveMemory() {
  fs.writeFileSync('memory.json', JSON.stringify(memory, null, 2));
}

function recall(conversationId) {
  return memory[conversationId];
}

function remember(conversationId, data) {
  memory[conversationId] = data;
  saveMemory();
}

const conversationId = new Date().toISOString();

console.log(`Welcome to our conversation! (ID: ${conversationId})`);

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message !== '') {
    remember(conversationId, message);
    console.log(`You said: ${message}`);
    console.log(`Recalling previous conversation...`);
    console.log(`Previous messages: ${recall(conversationId)}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('Goodbye!');
});