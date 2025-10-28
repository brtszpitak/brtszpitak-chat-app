const fs = require("fs");
let memory = {};

if (fs.existsSync("memory.json")) {
  memory = JSON.parse(fs.readFileSync("memory.json", "utf8"));
}

process.stdin.on("data", (input) => {
  const message = input.toString().trim();
  if (message.startsWith("/recall ")) {
    const keyword = message.substring(7);
    if (memory[keyword]) {
      console.log(memory[keyword]);
    } else {
      console.log("No memory found for", keyword);
    }
  } else {
    memory[Date.now()] = message;
    fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
    console.log("Memory updated");
  }
});
