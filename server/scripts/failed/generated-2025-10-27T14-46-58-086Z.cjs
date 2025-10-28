const fs = require("fs");
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput === "") return;

  console.log(`You: ${userInput}`);

  if (!memory[userInput]) memory[userInput] = [];
  memory[userInput].push(new Date().toISOString());

  fs.writeFileSync("./memory.json", JSON.stringify(memory, null, 2));

  console.log("Memory:", Object.keys(memory).length);
});

process.stdin.on("end", () => process.exit());
