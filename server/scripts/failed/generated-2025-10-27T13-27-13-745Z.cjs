const fs = require("fs");
const path = require("path");

let memory = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "memory.json"), "utf8");
  memory = JSON.parse(data);
} catch (err) {}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const message = input.trim();
  if (message !== "") {
    console.log(`You: ${message}`);
    const response = respond(memory, message);
    console.log(`AI: ${response}`);
    memory[Date.now()] = { user: message, ai: response };
  }
});

process.stdin.on("end", () => {
  fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory));
});

function respond(memory, message) {
  // TO DO: implement natural language processing to identify relevant information
  return `I'm sorry, I don't understand what you mean by "${message}".`;
}
