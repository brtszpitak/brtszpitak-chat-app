const fs = require("fs");
let memory = {};

if (fs.existsSync("./memory.json")) {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
}

process.stdin.on("data", (input) => {
  const userInput = input.toString().trim();
  if (userInput === ":save") {
    fs.writeFileSync("./memory.json", JSON.stringify(memory, null, 2));
    console.log("Memory saved.");
  } else if (userInput.startsWith(":recall ")) {
    const query = userInput.substring(8);
    for (const key in memory) {
      if (key.includes(query)) {
        console.log(`Recalling: ${memory[key]}`);
      }
    }
  } else {
    memory[Date.now()] = userInput;
    console.log("Input stored in memory.");
  }
});
