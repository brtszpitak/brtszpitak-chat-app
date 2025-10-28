console.log("Hello! I'm Alice. You can talk to me in everyday language.");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.setPrompt("> ");
rl.prompt();
rl.on("line", (line) => {
  console.log(`You said: ${line}`);
  // TO DO: implement NLP logic here
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
