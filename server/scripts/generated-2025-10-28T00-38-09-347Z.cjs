const fs = require('fs');
let memory = {};
try { memory = JSON.parse(fs.readFileSync('memory.json', 'utf8')); } catch {}
process.stdin.setEncoding('utf8');
process.stdout.write('Welcome! I\'m here to assist you.\n');
process.stdin.on('data', (input) => {
  const command = input.trim();
  if (command.startsWith('remember ')) {
    const [_, key, value] = command.split(' ');
    memory[key] = value;
    fs.writeFileSync('memory.json', JSON.stringify(memory, null, 2));
    process.stdout.write(`Remembered ${key} as ${value}\n`);
  } else if (command.startsWith('recall ')) {
    const [_, key] = command.split(' ');
    if (memory.hasOwnProperty(key)) {
      process.stdout.write(`${key}: ${memory[key]}\n`);
    } else {
      process.stdout.write(`I don't remember ${key}\n`);
    }
  } else {
    process.stdout.write(`Unknown command: ${command}\n`);
  }
});