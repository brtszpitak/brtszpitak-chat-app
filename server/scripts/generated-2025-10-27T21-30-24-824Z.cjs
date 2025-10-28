const fs = require('fs');
let contextMemory = {};

try {
  contextMemory = JSON.parse(fs.readFileSync('context_memory.json', 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message !== '') {
    console.log(`You: ${message}`);
    // Simple example of context memory usage
    if (!contextMemory.conversations) contextMemory.conversations = [];
    contextMemory.conversations.push(message);
    fs.writeFileSync('context_memory.json', JSON.stringify(contextMemory, null, 2));
    console.log('Assistant: I remember that!');
  }
});

console.log('Welcome! I\'m here to help. Type something.');