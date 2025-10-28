const fs = require("fs");
const path = require("path");

let contextMemory = {};

try {
  const memoryFile = "context_memory.json";
  const memoryPath = path.join(process.cwd(), memoryFile);
  if (fs.existsSync(memoryPath)) {
    contextMemory = JSON.parse(fs.readFileSync(memoryPath, "utf8"));
  }
} catch (error) {
  console.error("Error loading context memory:", error);
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const message = input.trim();
  if (message) {
    console.log(`You said: ${message}`);
    // Simple example of storing conversation history
    if (!contextMemory.history) contextMemory.history = [];
    contextMemory.history.push(message);
    try {
      fs.writeFileSync("context_memory.json", JSON.stringify(contextMemory, null, 2));
    } catch (error) {
      console.error("Error saving context memory:", error);
    }
  }
});

process.stdin.on("end", () => process.stdout.write("Goodbye!"));
