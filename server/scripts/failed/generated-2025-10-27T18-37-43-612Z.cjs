const fs = require("fs");
let memory = {};
try {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
} catch (e) {}
process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  const input = data.trim();
  if (!input.startsWith(":")) {
    console.log(`You: ${input}`);
    memory[input] = new Date().toISOString();
  } else {
    const command = input.substring(1).trim();
    if (command === "recall") {
      Object.keys(memory).forEach((key) => console.log(`${key}: ${memory[key]}`));
    } else if (command.startsWith("forget ")) {
      delete memory[command.substring(7)];
    }
  }
  fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
});
process.stdin.on("end", () => process.exit());
