console.log(
  "Hello! I'm happy to chat with you in everyday conversational language. Please go ahead and type something."
);

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("");
rl.prompt();

rl.on("line", (line) => {
  console.log(`You said: ${line}`);
  // TO DO: implement NLP logic here
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
