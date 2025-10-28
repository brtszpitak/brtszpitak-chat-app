console.log("Hello! I'm ready to understand your natural language input.");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  try {
    const intent = parseIntent(line);
    if (intent.command) {
      console.log(`I understand you want to ${intent.command}.`);
      // TO DO: implement Windows command execution using PowerShell
    } else {
      console.log(`I didn't quite understand. Can you rephrase?`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    rl.prompt();
  }
});

function parseIntent(input) {
  // Simple intent parsing, replace with a real NLP library
  const commands = ["list files", "create folder"];
  for (const command of commands) {
    if (input.toLowerCase().includes(command)) {
      return { command };
    }
  }
  return {};
}
