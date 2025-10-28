const fs = require("fs");
const path = require("path");

let contextMemory = {};

try {
  const memoryFile = "context_memory.json";
  const memoryPath = path.join(__dirname, memoryFile);
  if (fs.existsSync(memoryPath)) {
    contextMemory = JSON.parse(fs.readFileSync(memoryPath, "utf8"));
  }
} catch (e) {
  console.error("Failed to load context memory:", e);
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const message = input.trim();
  if (message) {
    console.log(`You said: ${message}`);
    // TO DO: implement personalized response logic using contextMemory
    // For now, just echo the message back
    console.log(`AI response: I remember you said "${message}"`);
    try {
      fs.writeFileSync(
        "context_memory.json",
        JSON.stringify({ ...contextMemory, [Date.now()]: message })
      );
    } catch (e) {
      console.error("Failed to save context memory:", e);
    }
  }
});
