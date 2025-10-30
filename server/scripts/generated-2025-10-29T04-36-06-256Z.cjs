const fs = require('fs');
const path = require('path');

let memory = {};

if (fs.existsSync(path.join(__dirname, 'memory.json'))) {
  memory = JSON.parse(fs.readFileSync(path.join(__dirname, 'memory.json'), 'utf8'));
}

process.stdin.on('data', (input) => {
  const conversation = input.toString().trim();
  if (conversation.startsWith('remember ')) {
    const [key, value] = conversation.split(' ').slice(1);
    memory[key] = value;
    fs.writeFileSync(path.join(__dirname, 'memory.json'), JSON.stringify(memory));
    console.log(`Remembered ${key} as ${value}`);
  } else if (conversation.startsWith('recall ')) {
    const key = conversation.split(' ')[1];
    console.log(memory[key]);
  }
});