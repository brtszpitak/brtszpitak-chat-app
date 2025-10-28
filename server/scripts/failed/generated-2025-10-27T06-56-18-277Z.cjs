const fs = require("fs");
let memory = {};

try {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const command = input.trim();

  if (command.startsWith("remember ")) {
    const [_, key, value] = command.split(" ");
    memory[key] = value;
    fs.writeFileSync("./memory.json", JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith("recall ")) {
    const [_, key] = command.split(" ");
    if (memory.hasOwnProperty(key)) {
      console.log(`${key} = ${memory[key]}`);
    } else {
      console.log(`Unknown memory key: ${key}`);
    }
  } else {
    console.log("Unknown command");
  }
});

process.stdin.on("end", () => {
  process.exit();
});
