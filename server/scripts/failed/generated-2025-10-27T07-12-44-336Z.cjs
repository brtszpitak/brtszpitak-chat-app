const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("What can I help you with? ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim().toLowerCase();

  if (command.startsWith("what is")) {
    const query = command.replace("what is ", "");
    console.log(`You asked about ${query}. I'm still learning, but I can try to help!`);
  } else if (command === "list files") {
    console.log("Implementing file listing functionality...");
    // TO DO: implement file listing using Node.js and Windows commands
  } else {
    console.log(`Sorry, I didn't understand '${line}'. Try rephrasing or asking something else!`);
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
