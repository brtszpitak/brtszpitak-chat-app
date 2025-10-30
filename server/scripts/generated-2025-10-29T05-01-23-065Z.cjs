const fs = require('fs');
const path = require('path');

let memory = {};

try {
  const filePath = path.join(__dirname, 'memory.json');
  const data = fs.readFileSync(filePath, 'utf8');
  memory = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding('utf8');
process.stdin.on('data', input => {
  const command = input.trim();
  if (command.startsWith('remember ')) {
    const [key, value] = command.split(/\s+(.*)/)[1].split(': ');
    memory[key] = value;
    fs.writeFileSync(path.join(__dirname, 'memory.json'), JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith('recall ')) {
    const key = command.split(/\s+(.*)/)[1];
    console.log(`Recalled: ${key} = ${memory[key] || '(not found)'}`);
  }
});