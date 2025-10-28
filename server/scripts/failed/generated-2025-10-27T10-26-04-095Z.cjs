const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  "Hello! I'm Alice, your AI collaborator. Ask me anything or give me instructions in everyday language."
);

rl.setPrompt("");
rl.prompt();

rl.on("line", (line) => {
  const userInput = line.trim().toLowerCase();

  if (userInput === "hello" || userInput === "hi") {
    console.log("Hello! How can I assist you today?");
  } else if (userInput.includes("what time")) {
    const currentTime = new Date().toLocaleTimeString();
    console.log(`The current time is ${currentTime}.`);
  } else {
    console.log(`I didn't understand that. Please rephrase or ask a different question.`);
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
