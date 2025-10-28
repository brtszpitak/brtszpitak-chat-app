const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  try {
    const intent = parseIntent(line.trim());
    if (intent.command) {
      console.log(`Executing command: ${intent.command}`);
      // TO DO: implement Windows command execution using PowerShell
    } else if (intent.question) {
      console.log(`Answering question: ${intent.question}`);
      // TO DO: implement knowledge base or web search to answer questions
    }
  } catch (e) {
    console.error(e.message);
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

function parseIntent(input) {
  const commands = ["list files", "create folder", "delete file"];
  const questions = ["what is the time", "what is the weather like"];

  for (const command of commands) {
    if (input.toLowerCase().includes(command)) {
      return { command: command };
    }
  }

  for (const question of questions) {
    if (input.toLowerCase().includes(question)) {
      return { question: question };
    }
  }

  throw new Error("Unknown intent");
}
