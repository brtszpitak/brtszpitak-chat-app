const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim().toLowerCase();
  if (command.startsWith("what is")) {
    const query = command.replace("what is ", "");
    console.log(`Searching for ${query}...`);
    // TO DO: implement NLP logic to respond to user queries
    rl.prompt();
  } else if (command === "exit") {
    rl.close();
  } else {
    console.log("Unknown command. Try again!");
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
