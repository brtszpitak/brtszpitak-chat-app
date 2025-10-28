const fs = require('fs');
let contextMemory = {};

try {
  contextMemory = JSON.parse(fs.readFileSync('context_memory.json', 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const userQuery = input.trim();
  if (userQuery !== '') {
    console.log(`You said: ${userQuery}`);
    contextMemory[userQuery] = contextMemory[userQuery] || { count: 0 };
    contextMemory[userQuery].count++;
    fs.writeFileSync('context_memory.json', JSON.stringify(contextMemory, null, 2));
  }
});

process.stdin.on('end', () => {
  console.log('Goodbye!');
});