const fs = require("fs");
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
} catch (e) {}

process.stdin.on("data", async (data) => {
  const input = data.toString().trim();
  if (input.startsWith(":remember")) {
    const [_, key, value] = input.split(" ");
    memory[key] = value;
    fs.writeFileSync("memory.json", JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (input.startsWith(":recall")) {
    const [_, key] = input.split(" ");
    console.log(memory[key]);
  } else {
    console.log("Unknown command");
  }
});
