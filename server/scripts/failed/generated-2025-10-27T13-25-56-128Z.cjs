const fs = require("fs");
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const message = input.trim();
  if (message !== "") {
    console.log(`You: ${message}`);
    const response = respond(memory, message);
    console.log(`AI: ${response}`);
    memory[Date.now()] = { question: message, answer: response };
    fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
  }
});

function respond(memory, message) {
  // TO DO: implement natural language processing to identify relevant information
  return `I'm still learning, but I'll remember that for next time!`;
}

process.stdin.on("end", () => process.exit());
