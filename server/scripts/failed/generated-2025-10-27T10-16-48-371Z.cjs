const fs = require("fs");
let memory = {};

if (fs.existsSync("memory.json")) {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const message = input.trim();
  if (!message) return;

  if (!memory[message]) memory[message] = [];

  console.log(`You said: ${message}`);

  const responses = memory[message];
  if (responses.length > 0) {
    console.log("Follow-ups:");
    for (const response of responses) {
      console.log(`- ${response}`);
    }
  }

  process.stdout.write("Your response: ");
});

process.stdin.on("end", () => {
  fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
});
