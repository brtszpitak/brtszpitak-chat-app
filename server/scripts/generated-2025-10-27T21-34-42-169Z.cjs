const fs = require('fs');
const path = require('path');

let memory = {};

function remember(key, value) {
  memory[key] = value;
  fs.writeFileSync(path.join(__dirname, 'memory.json'), JSON.stringify(memory));
}

function recall(key) {
  if (Object.keys(memory).includes(key)) return memory[key];
  else return null;
}

if (!fs.existsSync(path.join(__dirname, 'memory.json'))) {
  fs.writeFileSync(path.join(__dirname, 'memory.json'), '{}');
} else {
  memory = JSON.parse(fs.readFileSync(path.join(__dirname, 'memory.json')).toString());
}

console.log('Ready to collaborate!');

process.stdin.on('data', (input) => {
  const command = input.toString().trim();
  if (command.startsWith('remember')) {
    const [_, key, value] = command.split(' ');
    remember(key, value);
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith('recall')) {
    const [_, key] = command.split(' ');
    const value = recall(key);
    if (value) console.log(`Recalled: ${key} = ${value}`);
    else console.log(`No memory of ${key}`);
  }
});