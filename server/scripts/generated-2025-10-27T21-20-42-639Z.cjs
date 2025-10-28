const fs = require('fs');
let memory = {};

if (fs.existsSync('memory.json')) {
  memory = JSON.parse(fs.readFileSync('memory.json', 'utf8'));
}

process.stdin.on('data', (input) => {
  const conversation = input.toString().trim();
  if (!memory[conversation]) memory[conversation] = [];
  console.log(`You said: ${conversation}`);
  console.log(`Previous conversations about this topic:`);
  for (const prevConversation of memory[conversation]) {
    console.log(`- ${prevConversation}`);
  }
  fs.writeFileSync('memory.json', JSON.stringify(memory));
});

process.stdin.setEncoding('utf8');
process.stdin.resume();