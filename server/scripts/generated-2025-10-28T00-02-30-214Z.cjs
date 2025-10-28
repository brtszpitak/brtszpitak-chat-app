const fs = require('fs');
let memory = {};
try { memory = JSON.parse(fs.readFileSync('memory.json', 'utf8')); } catch (_) {}
process.stdin.setEncoding('utf8');
process.stdin.on('data', input => {
  const command = input.trim();
  if (command.startsWith('remember ')) {
    const [key, value] = command.slice(9).trim().split(': ');
    memory[key] = value;
    fs.writeFileSync('memory.json', JSON.stringify(memory));
    console.log(`Remembered: ${key} -> ${value}`);
  } else if (command.startsWith('recall ')) {
    const key = command.slice(7).trim();
    console.log(memory[key]);
  }
});
process.stdin.on('end', () => process.exit());