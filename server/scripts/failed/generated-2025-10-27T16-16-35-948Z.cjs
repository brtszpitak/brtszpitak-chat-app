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
    console.log(`Alice: ${response}`);
    memory[message] = response;
    fs.writeFileSync(path.join(__dirname, "memory.json"), JSON.stringify(memory, null, 2));
  }
});

function respond(memory, message) {
  if (memory[message]) return memory[message];
  else return "I didn't understand that. Please try again.";
}

process.stdin.on("end", () => process.exit());
