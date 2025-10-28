const fs = require("fs");
let memory = {};

if (fs.existsSync("memory.json")) {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput in memory) {
    console.log(`You mentioned ${userInput} before. Context recalled.`);
  } else {
    console.log("I don't recall this topic.");
  }
  memory[userInput] = new Date().toISOString();
  fs.writeFileSync("memory.json", JSON.stringify(memory));
});

process.stdin.on("end", () => process.exit());
