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
    console.log(`You asked about ${query}. I'm still learning, but I'll try to help!`);
  } else if (command.startsWith("do ")) {
    const action = command.replace("do ", "");
    console.log(`You want me to ${action}. Let me see what I can do...`);
  } else {
    console.log("I didn't understand that. Try asking a question or giving an instruction!");
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
