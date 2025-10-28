const fs = require("fs");
const path = require("path");

let contextPath = path.join(__dirname, "context.json");
let context = {};

try {
  context = JSON.parse(fs.readFileSync(contextPath, "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  let input = data.trim();
  if (input.startsWith("remember ")) {
    let key = input.substring(9);
    context[key] = context[key] || [];
    process.stdout.write(`What would you like to remember about ${key}?`);
    process.stdin.once("data", (data) => {
      context[key].push(data.trim());
      fs.writeFileSync(contextPath, JSON.stringify(context));
      process.stdout.write(`Remembered!\n`);
    });
  } else if (input.startsWith("recall ")) {
    let key = input.substring(7);
    if (context[key]) {
      process.stdout.write(`${key}:\n${context[key].join("\n")}\n`);
    } else {
      process.stdout.write(`No memory of ${key}.\n`);
    }
  } else {
    process.stdout.write("Unknown command.\n");
  }
});

process.stdin.on("end", () => {
  process.exit();
});
