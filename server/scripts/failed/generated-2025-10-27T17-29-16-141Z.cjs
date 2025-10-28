console.log("Welcome to the NLP Module!");
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
    console.log(`You asked about ${command.replace("what is ", "")}`);
  } else if (command === "list files") {
    console.log("Implement listing files functionality");
  } else if (command === "exit") {
    rl.close();
  } else {
    console.log("Sorry, I didn't understand that. Try again!");
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
