const fs = require('fs');
const path = require('path');

let memory = {};

function remember(topic, data) {
  if (!memory[topic]) memory[topic] = [];
  memory[topic].push(data);
}

function recall(topic) {
  return memory[topic] || [];
}

function saveMemory() {
  fs.writeFileSync(path.join(__dirname, 'memory.json'), JSON.stringify(memory));
}

function loadMemory() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'memory.json'));
    memory = JSON.parse(data);
  } catch (e) {}
}

loadMemory();

console.log('Remembering...');
remember('conversations', 'This is the start of our conversation.');
remember('conversations', 'We are discussing knowledge graphs.');

console.log('Recalling conversations:', recall('conversations'));

saveMemory();