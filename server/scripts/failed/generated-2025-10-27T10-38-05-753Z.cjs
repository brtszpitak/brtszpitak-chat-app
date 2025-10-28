const fs = require("fs");
let memory = {};

if (fs.existsSync("./memory.json")) {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (!userInput) return;

  if (userInput.startsWith("remember ")) {
    const [_, key, value] = userInput.split(" ");
    memory[key] = value;
    fs.writeFileSync("./memory.json", JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (userInput.startsWith("recall ")) {
    const [_, key] = userInput.split(" ");
    if (memory[key]) {
      console.log(`Recalled: ${key} = ${memory[key]}`);
    } else {
      console.log(`Unknown key: ${key}`);
    }
  } else {
    console.log("Unknown command");
  }
});
