console.log("Hello! I'm ready to chat.");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.prompt();
rl.on("line", (line) => {
  console.log(`You said: ${line}`);
  // TO DO: implement NLP logic here
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
