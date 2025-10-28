const fs = require("fs");

let memory = {};

if (fs.existsSync("./memory.json")) {
  memory = JSON.parse(fs.readFileSync("./memory.json", "utf8"));
}

process.stdin.on("data", (input) => {
  const userInput = input.toString().trim();
  if (!memory[userInput]) memory[userInput] = [];
  console.log(`You said: ${userInput}`);
  console.log(`Previous conversations about this topic:`);
  for (const conversation of memory[userInput]) {
    console.log(`- ${conversation}`);
  }
  const response = promptUser(userInput);
  memory[userInput].push(response);
  fs.writeFileSync("./memory.json", JSON.stringify(memory, null, 2));
});

function promptUser(input) {
  // TO DO: implement AI logic to respond to user input
  return `AI Response: I'm not sure what to say about ${input} yet...`;
}

process.stdin.setEncoding("utf8");
process.stdin.resume();
