const fs = require("fs");
const ratings = {};

process.stdin.on("data", (input) => {
  const [command, ...args] = input.toString().trim().split(" ");
  if (command === "rate") {
    const [id, rating] = args;
    ratings[id] = parseInt(rating);
    console.log(`Rated response ${id} with ${rating}`);
  } else if (command === "correct") {
    const [id, correction] = args;
    fs.appendFileSync("corrections.txt", `${id}:${correction}\n`);
    console.log(`Corrected response ${id} to "${correction}"`);
  }
});

console.log('Ready to learn! Type "rate <id> <rating>" or "correct <id> <correction>".');
