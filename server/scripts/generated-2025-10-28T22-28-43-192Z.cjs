const fs = require('fs');
const path = require('path');

let memory = {};

if (fs.existsSync(path.join(__dirname, 'memory.json'))) {
  memory = JSON.parse(fs.readFileSync(path.join(__dirname, 'memory.json'), 'utf8'));
}

function saveMemory() {
  fs.writeFileSync(path.join(__dirname, 'memory.json'), JSON.stringify(memory));
}

function remember(key, value) {
  memory[key] = value;
  saveMemory();
}

function recall(key) {
  return memory[key];
}

console.log('Welcome! I can retain information about our conversations.');

while (true) {
  const input = prompt('What would you like to talk about or ask me to remember? ');
  if (input.startsWith('remember ')) {
    const [_, key, value] = input.split(' ');
    remember(key, value);
    console.log(`I remembered ${key} as ${value}.`);
  } else if (input.startsWith('recall ')) {
    const [_, key] = input.split(' ');
    const value = recall(key);
    console.log(`I recalled ${key} as ${value}.`);
  } else {
    console.log('I didn\'t understand that. Try "remember <key> <value>" or "recall <key>".');
  }
}