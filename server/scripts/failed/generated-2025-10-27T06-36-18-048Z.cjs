const fs = require("fs");
let memory = {};

function remember(key, value) {
  memory[key] = value;
  fs.writeFileSync("memory.json", JSON.stringify(memory));
}

function recall(key) {
  return memory[key];
}

function learn(input) {
  const words = input.split(" ");
  for (const word of words) {
    remember(word, (recall(word) || 0) + 1);
  }
}

function respond(input) {
  let response = "";
  const words = input.split(" ");
  for (const word of words) {
    if (recall(word)) {
      response += `I remember you mentioned ${word} before!\n`;
    } else {
      response += `I'm not familiar with ${word}. Can you tell me more?\n`;
    }
  }
  return response;
}

if (!fs.existsSync("memory.json")) {
  fs.writeFileSync("memory.json", JSON.stringify({}));
}

memory = JSON.parse(fs.readFileSync("memory.json"));

console.log(respond("hello world"));
learn("hello world");
console.log(respond("hello again"));
