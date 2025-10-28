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
    const query = command.replace("what is ", "");
    console.log(`Searching for ${query}...`);
    // TO DO: implement NLP and Windows command execution
    rl.prompt();
  } else {
    console.log("Unknown command. Try asking a question or giving a command.");
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
