const fs = require("fs");

let memory = {};

if (fs.existsSync("./memory.json")) {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
}

process.stdin.on("data", (chunk) => {
  const input = chunk.toString().trim();
  const [command, ...args] = input.split(" ");

  if (command === "remember") {
    const key = args[0];
    const value = args.slice(1).join(" ");
    memory[key] = value;
    fs.writeFileSync("./memory.json", JSON.stringify(memory));
    console.log(`Remembered: ${key} = ${value}`);
  } else if (command === "recall") {
    const key = args[0];
    console.log(memory[key]);
  }
});
