const fs = require("fs");
let memory = {};
try {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
} catch (e) {}
process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  const input = data.trim();
  if (!input) return;
  console.log(`You: ${input}`);
  if (!memory[input]) memory[input] = [];
  memory[input].push(new Date().toISOString());
  fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
  console.log(`Memory updated!`);
});
process.stdin.on("end", () => {
  process.exit();
});
