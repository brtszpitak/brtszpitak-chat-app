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
    console.log(`Answer: ${command.replace("what is ", "")} is a great question!`);
  } else if (command === "list files") {
    console.log("Listing files...");
    // TO DO: implement file listing logic
  } else if (command === "exit") {
    rl.close();
  } else {
    console.log(`Sorry, I didn't understand "${command}".`);
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
