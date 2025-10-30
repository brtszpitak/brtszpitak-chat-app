const fs = require('fs');
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync('memory.json', 'utf8'));
} catch (e) {}

process.stdin.on('data', (input) => {
  const conversation = input.toString().trim();
  if (conversation.startsWith('remember:')) {
    const [_, key, value] = conversation.split(':');
    memory[key.trim()] = value.trim();
    fs.writeFileSync('memory.json', JSON.stringify(memory, null, 2));
  } else if (conversation.startsWith('recall:')) {
    const [, key] = conversation.split(':');
    console.log(memory[key.trim()]);
  }
});