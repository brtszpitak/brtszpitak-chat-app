const fs = require("fs");
let memory = {};

if (fs.existsSync("memory.json")) {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput.startsWith(":recall ")) {
    const topic = userInput.substring(7);
    if (memory[topic]) {
      console.log(memory[topic]);
    } else {
      console.log(`No memory of ${topic} found.`);
    }
  } else {
    console.log(`You said: ${userInput}`);
    memory[input] = new Date().toISOString();
    fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
  }
});

process.stdin.on("end", () => {
  process.exit();
});
