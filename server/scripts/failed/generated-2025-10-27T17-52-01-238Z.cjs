const fs = require("fs");
const path = require("path");

let conversationLog = {};

if (fs.existsSync(path.join(__dirname, "conversation-log.json"))) {
  conversationLog = JSON.parse(
    fs.readFileSync(path.join(__dirname, "conversation-log.json"), "utf8")
  );
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput !== "") {
    console.log(`You: ${userInput}`);
    const response = generateResponse(userInput, conversationLog);
    console.log(`AI: ${response}`);
    conversationLog[userInput] = response;
    fs.writeFileSync(
      path.join(__dirname, "conversation-log.json"),
      JSON.stringify(conversationLog)
    );
  }
});

function generateResponse(input, log) {
  // TO DO: implement natural language processing to identify relevant information
  return `I'm not sure I understand. Can you please provide more context?`;
}
