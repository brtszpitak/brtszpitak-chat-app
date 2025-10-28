const fs = require('fs');
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync('memory.json', 'utf8'));
} catch (e) {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
  const message = input.trim();
  if (message.startsWith(':')) {
    const [command, ...args] = message.slice(1).trim().split(/\s+/);
    switch (command) {
      case 'set':
        memory[args[0]] = args[1];
        break;
      case 'get':
        console.log(memory[args[0]]);
        break;
      case 'forget':
        delete memory[args[0]];
        break;
    }
  } else {
    // process message as a normal conversation input
    console.log(`You said: ${message}`);
  }

  fs.writeFileSync('memory.json', JSON.stringify(memory, null, 2));
});

process.stdin.on('end', () => {
  process.exit();
});