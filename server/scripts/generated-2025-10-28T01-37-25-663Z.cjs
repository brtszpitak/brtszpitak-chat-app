console.log("Hello! I'm Alice. You can talk to me in everyday language.");
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.setPrompt('You: ');
rl.prompt();
rl.on('line', (line) => {
  console.log(`Alice: I'm not smart enough to understand "${line}" yet. Stay tuned for NLP updates!`);
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});