console.log("Natural Language Understanding Module (Basic Demo)");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const userInput = line.trim();

  if (userInput.toLowerCase() === "hello") {
    console.log("AI: Hello! How can I assist you today?");
  } else if (userInput.toLowerCase() === "quit") {
    rl.close();
  } else {
    console.log(`AI: Sorry, I didn't understand "${userInput}". Try again or type "quit" to exit.`);
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
