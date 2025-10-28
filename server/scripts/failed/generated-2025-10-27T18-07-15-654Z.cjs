fs.writeFileSync("memory.json", "{}");
let memory = require("./memory.json");

if (!memory.context) memory.context = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith("remember ")) {
    const [_, key, value] = command.split(" ");
    memory.context[key] = value;
    fs.writeFileSync("memory.json", JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command.startsWith("recall ")) {
    const [_, key] = command.split(" ");
    console.log(`Recalled: ${key} = ${memory.context[key]}`);
  } else {
    console.log("Unknown command");
  }
});
