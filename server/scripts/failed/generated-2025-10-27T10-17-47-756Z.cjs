const fs = require("fs");
let memory = {};

if (fs.existsSync("./memory.json")) {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput !== "") {
    const timestamp = new Date().toISOString();
    const conversationId = Object.keys(memory).length + 1;
    memory[conversationId] = { timestamp, userInput };
    fs.writeFileSync("./memory.json", JSON.stringify(memory, null, 2));
    console.log(`Conversation saved. ID: ${conversationId}`);
  }
});

process.stdin.on("end", () => {
  process.exit();
});
