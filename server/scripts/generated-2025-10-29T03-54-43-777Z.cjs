console.log("Hello! I'm happy to chat with you in everyday language.");
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.setPrompt('You: ');
rl.prompt();
rl.on('line', (line) => {
  console.log(`Alice: I'm still learning, but I'll do my best to understand you! You said: ${line}`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});