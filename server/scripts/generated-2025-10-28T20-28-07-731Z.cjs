const fs = require('fs');
const path = require('path');

let memory = {};

function saveMemory() {
  fs.writeFileSync(path.join(__dirname, 'memory.json'), JSON.stringify(memory));
}

function loadMemory() {
  try {
    memory = JSON.parse(fs.readFileSync(path.join(__dirname, 'memory.json')).toString());
  } catch (e) {}
}

loadMemory();

const updateMemory = (key, value) => {
  memory[key] = value;
  saveMemory();
};

const getFromMemory = key => memory[key];

process.stdin.setEncoding('utf8');
process.stdin.on('data', input => {
  const [command, ...args] = input.trim().split(' ');
  
  if (command === 'set') {
    updateMemory(args[0], args.slice(1).join(' '));
  } else if (command === 'get') {
    console.log(getFromMemory(args[0]));
  }
});

process.stdin.on('end', () => process.exit());