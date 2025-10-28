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
    // TO DO: implement NLP logic to respond to user queries
    rl.prompt();
  } else if (command.startsWith("run ")) {
    const windowsCommand = command.replace("run ", "");
    console.log(`Running Windows command: ${windowsCommand}`);
    // TO DO: implement logic to execute Windows commands securely
    rl.prompt();
  } else {
    console.log("Unknown command. Try again!");
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
