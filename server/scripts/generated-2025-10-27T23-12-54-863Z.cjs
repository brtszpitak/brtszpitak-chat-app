console.log('Hello! I\'m happy to chat with you.');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('You: ');
rl.prompt();

rl.on('line', (line) => {
  const userQuery = line.trim();
  if (userQuery !== '') {
    console.log(`AI: I understand you said "${userQuery}". Currently, I can only respond with this simple acknowledgement.`);
    rl.prompt();
  }
}).on('close', () => {
  process.exit(0);
});