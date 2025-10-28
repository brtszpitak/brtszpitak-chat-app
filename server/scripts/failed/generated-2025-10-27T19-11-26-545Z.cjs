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
    // TO DO: implement natural language understanding and Windows command generation
    console.log("Not implemented yet!");
  } else if (command.startsWith("do ")) {
    const action = command.replace("do ", "");
    console.log(`Performing action: ${action}`);
    // TO DO: implement natural language understanding and Windows command generation
    console.log("Not implemented yet!");
  } else {
    console.log('Unknown command. Try "what is" or "do" followed by your request.');
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
