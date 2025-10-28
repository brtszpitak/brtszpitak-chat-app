const readline = require("readline");
const { v4: uuidv4 } = require("uuid");

let conversationHistory = [];

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .on("line", (input) => {
    const conversationId = uuidv4();
    const userInput = input.trim();

    if (userInput !== "") {
      conversationHistory.push({ id: conversationId, text: userInput });
      console.log(`You said: ${userInput}`);

      // TO DO: implement natural language processing and knowledge graph integration
      // for now, provide a simple suggestion based on the last user input
      const lastUserInput = conversationHistory[conversationHistory.length - 1].text;
      if (lastUserInput.includes("file")) {
        console.log(`You might want to try: Get-ChildItem`);
      } else if (lastUserInput.includes("process")) {
        console.log(`You might want to try: Get-Process`);
      } else {
        console.log("I'm not sure what you mean. Please provide more context.");
      }
    }
  })
  .on("close", () => process.exit(0));
