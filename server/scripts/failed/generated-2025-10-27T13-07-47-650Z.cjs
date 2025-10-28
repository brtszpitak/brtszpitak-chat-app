const fs = require("fs");
let conversations = {};

if (fs.existsSync("conversations.json")) {
  conversations = JSON.parse(fs.readFileSync("conversations.json", "utf8"));
}

process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (!conversations[input]) conversations[input] = [];
  console.log(`You said: ${input}`);
  const response = `I remember you saying that before!`;
  console.log(response);
  conversations[input].push(response);
  fs.writeFileSync("conversations.json", JSON.stringify(conversations));
});

process.stdin.setEncoding("utf8");
process.stdin.resume();
