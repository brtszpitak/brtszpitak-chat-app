const fs = require('fs');
let memory = {};

if (fs.existsSync('memory.json')) {
  memory = JSON.parse(fs.readFileSync('memory.json', 'utf8'));
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const command = input.trim();
  if (command.startsWith('remember ')) {
    const [key, value] = command.substring(9).trim().split('=');
    memory[key.trim()] = value.trim();
    fs.writeFileSync('memory.json', JSON.stringify(memory));
  } else if (command.startsWith('recall ')) {
    const key = command.substring(7).trim();
    console.log(memory[key]);
  }
});

process.stdin.on('end', () => {
  process.exit();
});