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
    // TO DO: implement NLP module to process query
    rl.prompt();
  } else if (command.startsWith("run ")) {
    const powershellCommand = command.replace("run ", "");
    console.log(`Running PowerShell command: ${powershellCommand}`);
    // TO DO: implement running PowerShell commands securely
    rl.prompt();
  } else {
    console.log("Unknown command. Try again!");
    rl.prompt();
  }
}).on("close", () => {
  process.exit(0);
});
