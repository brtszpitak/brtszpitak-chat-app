const fs = require("fs");
let contextMemory = {};

if (fs.existsSync("context.json")) {
  contextMemory = JSON.parse(fs.readFileSync("context.json", "utf8"));
}

function saveContext() {
  fs.writeFileSync("context.json", JSON.stringify(contextMemory));
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (!userInput) return;

  if (userInput.startsWith(":remember ")) {
    const topic = userInput.substring(9);
    contextMemory[topic] = contextMemory[topic] || [];
    console.log(`Remembering ${topic}...`);
  } else if (userInput.startsWith(":recall ")) {
    const topic = userInput.substring(8);
    if (contextMemory[topic]) {
      console.log(`Recalling ${topic}:`);
      for (const item of contextMemory[topic]) {
        console.log(`- ${item}`);
      }
    } else {
      console.log(`No memory of ${topic}.`);
    }
  } else {
    const topic = userInput;
    if (!contextMemory[topic]) contextMemory[topic] = [];
    contextMemory[topic].push(userInput);
    console.log(`Added to memory: ${userInput}`);
  }

  saveContext();
});

process.stdin.on("end", () => {
  process.stdout.write("\n");
});
