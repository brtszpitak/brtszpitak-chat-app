const fs = require("fs");
let memory = {};

if (fs.existsSync("memory.json")) {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const conversationId = Math.random().toString(36).substr(2, 9);
  const userInput = input.trim();
  memory[conversationId] = { user: userInput };

  console.log(`You said: ${userInput}`);
  console.log("How would you like to proceed?");

  fs.writeFileSync("memory.json", JSON.stringify(memory));
});

process.stdin.on("end", () => {
  process.stdout.write("Goodbye!");
});
