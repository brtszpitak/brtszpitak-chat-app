const fs = require('fs');
const path = require('path');

let memory = {};

try {
  const memoryFile = path.join(process.cwd(), 'memory.json');
  memory = JSON.parse(fs.readFileSync(memoryFile, 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', input => {
  const command = input.trim();
  if (command.startsWith('remember ')) {
    const [key, value] = command.slice(9).trim().split('=');
    memory[key] = value;
    fs.writeFileSync(path.join(process.cwd(), 'memory.json'), JSON.stringify(memory, null, 2));
    console.log(`Remembered ${key} as ${value}`);
  } else if (command.startsWith('recall ')) {
    const key = command.slice(7).trim();
    console.log(memory[key]);
  }
});

process.stdin.on('end', () => process.exit());