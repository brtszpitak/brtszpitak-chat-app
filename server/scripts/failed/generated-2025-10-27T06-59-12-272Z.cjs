const fs = require("fs");
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const message = input.trim();
  if (!message) return;

  if (Object.keys(memory).length === 0) {
    memory[Date.now()] = { message };
  } else {
    const lastConversation = Object.values(memory)[Object.values(memory).length - 1];
    const response = `You said: ${lastConversation.message}. Now you say: ${message}`;
    memory[Date.now()] = { message, response };
  }

  fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
});

process.stdin.on("end", () => process.exit());
