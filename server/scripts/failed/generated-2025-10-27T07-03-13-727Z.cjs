const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim().toLowerCase();

  if (command.startsWith("what is")) {
    console.log(`Answer: ${command.substring(7).trim()}`);
  } else if (command === "list files") {
    console.log("Implementing file listing...");
    // Todo: implement file listing
  } else if (command === "shutdown computer") {
    console.log("Implementing shutdown...");
    // Todo: implement shutdown
  } else {
    console.log(`Unknown command: ${command}`);
  }

  rl.prompt();
});

rl.on("close", () => process.exit(0));
