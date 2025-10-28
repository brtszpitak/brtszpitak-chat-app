const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim();
  if (command.startsWith("what is")) {
    const question = command.replace("what is ", "");
    console.log(`Answer: ${question} is a great topic!`);
  } else if (command.startsWith("list files")) {
    console.log("Listing files...");
    // TO DO: implement file listing functionality
  } else {
    console.log("Unknown command. Try again!");
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
