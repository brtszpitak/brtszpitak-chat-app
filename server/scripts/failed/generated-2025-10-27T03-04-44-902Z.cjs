const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });
rl.setPrompt("You: ");
rl.prompt();
rl.on("line", (line) => {
  const intent = line.trim().toLowerCase();
  if (intent.startsWith("what is your name")) console.log("My name is Alice.");
  else if (intent.startsWith("list files")) console.log(require("fs").readdirSync(".").join("\n"));
  else console.log("Sorry, I didn't understand that.");
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
