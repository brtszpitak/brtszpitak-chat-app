fs.writeFileSync("memory.json", "{}");

let memory = require("./memory.json");

process.stdin.setEncoding("utf8");
process.stdout.write("What would you like to talk about? ");
process.stdin.on("data", (input) => {
  const conversation = input.trim();
  if (!memory[conversation]) memory[conversation] = [];
  console.log(`You said: ${conversation}`);
  process.stdout.write("How would you like me to respond? ");
  process.stdin.once("data", (response) => {
    memory[conversation].push(response.toString().trim());
    fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
    process.stdout.write("Response saved. What's next? ");
  });
});
