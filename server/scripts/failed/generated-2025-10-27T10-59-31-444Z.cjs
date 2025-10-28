const fs = require("fs");
const path = require("path");

let contextMemory = {};

if (fs.existsSync(path.join(__dirname, "context.json"))) {
  contextMemory = JSON.parse(fs.readFileSync(path.join(__dirname, "context.json"), "utf8"));
}

process.stdin.on("data", (input) => {
  const message = input.toString().trim();
  console.log(`You said: ${message}`);

  // Update context memory
  if (!contextMemory.history) contextMemory.history = [];
  contextMemory.history.push(message);

  fs.writeFileSync(path.join(__dirname, "context.json"), JSON.stringify(contextMemory));

  // Simple response for demonstration purposes
  console.log("I remember that!");
});

process.stdin.setEncoding("utf8");
process.stdin.resume();
