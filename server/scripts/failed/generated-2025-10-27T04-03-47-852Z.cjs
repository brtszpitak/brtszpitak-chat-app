console.log("Welcome to the NLP Module!");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const userQuery = line.trim();

  if (userQuery !== "") {
    console.log(`AI: I understand you said "${userQuery}".`);

    // TO DO: Implement NLP logic here to process user input
    // For now, just respond with a generic message

    console.log("AI: I'm not sure what to do with that yet. Stay tuned for future updates!");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
