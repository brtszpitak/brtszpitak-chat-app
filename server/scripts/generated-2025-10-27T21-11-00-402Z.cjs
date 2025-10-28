const fs = require('fs');
let memory = {};

function remember(key, value) {
  memory[key] = value;
  fs.writeFileSync('memory.json', JSON.stringify(memory));
}

function recall(key) {
  return memory[key];
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  const input = chunk.trim();
  if (input.startsWith('remember ')) {
    const [_, key, value] = input.split(' ');
    remember(key, value);
  } else if (input.startsWith('recall ')) {
    const [_, key] = input.split(' ');
    console.log(recall(key));
  }
});

process.stdin.on('end', () => {
  process.exit();
});