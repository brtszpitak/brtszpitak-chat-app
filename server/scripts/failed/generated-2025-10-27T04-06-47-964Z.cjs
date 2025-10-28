const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("What can I help you with? ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim().toLowerCase();
  if (command.startsWith("what")) {
    console.log("You asked a question!");
  } else if (command === "list files") {
    console.log("Implementing file listing...");
  } else if (command === "create folder") {
    console.log("Creating a new folder...");
  } else {
    console.log("Sorry, I didn't understand that.");
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
