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
    console.log(`Answer: ${query} is a ${getDefinition(query)}`);
  } else if (userInput.startsWith("run ")) {
    const command = userInput.replace("run ", "");
    try {
      require("child_process").execSync(command, { shell: true });
      console.log(`Command '${command}' executed successfully.`);
    } catch (error) {
      console.error(`Error executing command '${command}': ${error.message}`);
    }
  } else {
    console.log("Unknown command or question.");
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

function getDefinition(query) {
  // TO DO: implement NLP logic to retrieve definition
  return "NOT IMPLEMENTED YET";
}
