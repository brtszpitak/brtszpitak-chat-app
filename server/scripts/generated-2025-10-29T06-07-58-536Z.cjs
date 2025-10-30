const fs = require('fs');
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync('./memory.json', 'utf8'));
} catch (e) {}

process.stdin.on('data', (input) => {
  const command = input.toString().trim();
  if (command.startsWith('remember')) {
    const [_, key, value] = command.split(' ');
    memory[key] = value;
    fs.writeFileSync('./memory.json', JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith('recall')) {
    const [_, key] = command.split(' ');
    console.log(`Recalled: ${key} = ${memory[key]}`);
  }
});