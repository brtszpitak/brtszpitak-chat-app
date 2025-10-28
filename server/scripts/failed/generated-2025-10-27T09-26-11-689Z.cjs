const fs = require("fs");
let memory = {};

try {
  const storedMemory = fs.readFileSync("memory.json", "utf8");
  memory = JSON.parse(storedMemory);
} catch (err) {}

process.stdin.on("data", (input) => {
  const message = input.toString().trim();
  if (message !== "") {
    const response = respond(memory, message);
    console.log(response);
    updateMemory(memory, message, response);
  }
});

function respond(memory, message) {
  // TO DO: implement AI logic to generate a response based on memory and message
  return `Response to "${message}"`;
}

function updateMemory(memory, message, response) {
  const conversation = { message, response };
  if (!memory.conversations) memory.conversations = [];
  memory.conversations.push(conversation);
  fs.writeFileSync("memory.json", JSON.stringify(memory));
}
