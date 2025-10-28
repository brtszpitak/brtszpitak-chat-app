const fs = require("fs");
let memory = {};

if (fs.existsSync("memory.json")) {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
}

function saveMemory() {
  fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
}

process.stdin.on("data", (input) => {
  const message = input.toString().trim();
  if (!memory[message]) memory[message] = { count: 1 };
  else memory[message].count++;
  saveMemory();
});

process.stdout.write("I'm listening...\n");
process.stdout.write("> ");
