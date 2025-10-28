fs.writeFileSync("conversations.json", "{}");

let conversations = require("./conversations.json");

const today = new Date().toISOString();
const userInput = prompt("What would you like to talk about? ");
conversations[today] = { user: userInput, ai: "" };

console.log(`You said: ${userInput}`);

while (true) {
  const aiResponse = prompt(`AI: `);
  conversations[today].ai += `\n${aiResponse}`;
  fs.writeFileSync("conversations.json", JSON.stringify(conversations, null, 2));

  console.log(`Conversations saved.`);
}
