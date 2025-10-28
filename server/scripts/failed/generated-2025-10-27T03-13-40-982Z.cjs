console.log("Hello! I'm ready to understand your natural language input.\nPlease type something:");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput !== "") {
    console.log(`You said: ${userInput}`);
    // TO DO: implement NLP logic here
    console.log("I didn't understand that. Please rephrase.");
  }
});
