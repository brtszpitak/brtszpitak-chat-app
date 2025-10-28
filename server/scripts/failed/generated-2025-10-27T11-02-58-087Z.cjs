console.log("Memory feature is not implemented yet.");

const conversationHistory = [];

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput === "exit") process.exit(0);

  console.log(`You: ${userInput}`);
  conversationHistory.push(userInput);

  // TO DO: implement natural language processing to identify relevant connections and follow-ups
  console.log("AI: Sorry, I don't understand you yet.");
});
