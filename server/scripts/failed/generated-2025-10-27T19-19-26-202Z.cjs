console.log("Hello! I'm ready to assist you in natural language. What can I help you with?");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  console.log(`AI: You said "${line}"`);

  // Very basic NLP - just to demonstrate the concept
  const command = line.trim().toLowerCase();
  if (command.startsWith("what is your name")) {
    console.log("My name is Alice, nice to meet you!");
  } else if (command.startsWith("help me")) {
    console.log("I can assist with various tasks. Please be more specific.");
  } else {
    console.log("I didn't understand that. Can you please rephrase?");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
