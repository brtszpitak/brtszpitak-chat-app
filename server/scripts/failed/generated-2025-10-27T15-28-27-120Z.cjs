const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const userInput = line.trim();

  if (userInput.startsWith("what is")) {
    const query = userInput.replace("what is ", "");
    console.log(`You asked about ${query}. I'll provide information about it.`);
    // TO DO: implement NLP logic to process the query
  } else if (userInput.startsWith("do ")) {
    const task = userInput.replace("do ", "");
    console.log(`You instructed me to ${task}. I'll perform the task.`);
    // TO DO: implement NLP logic to execute the task
  } else {
    console.log("I didn't understand your input. Please try again.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
