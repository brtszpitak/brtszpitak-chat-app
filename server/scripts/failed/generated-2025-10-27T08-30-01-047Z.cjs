const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("Hello! I'm here to help. What can I do for you?");
rl.on("line", (input) => {
  const command = input.trim().toLowerCase();
  if (command.startsWith("what")) console.log("You asked what...");
  else if (command.includes("help")) console.log("I'm happy to assist!");
  else console.log(`Sorry, I didn't understand '${command}'.`);
  rl.prompt();
}).on("close", () => process.exit(0));
