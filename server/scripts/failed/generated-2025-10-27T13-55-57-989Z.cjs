const fs = require("fs");
let memory = {};

function remember(key, value) {
  memory[key] = value;
  fs.writeFileSync("memory.json", JSON.stringify(memory));
}

function recall(key) {
  if (fs.existsSync("memory.json")) {
    memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
  }
  return memory[key];
}

const userInput = process.argv[2];

if (userInput.startsWith("remember ")) {
  const [_, key, value] = userInput.split(" ");
  remember(key, value);
} else if (userInput.startsWith("recall ")) {
  const [_, key] = userInput.split(" ");
  console.log(recall(key));
} else {
  console.log("Unknown command");
}
