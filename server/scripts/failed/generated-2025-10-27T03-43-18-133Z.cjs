const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const command = parseCommand(line);
  if (command) {
    console.log(`Executing: ${command}`);
    // TO DO: implement executing Windows commands using PowerShell
  } else {
    console.log("Unknown command. Please try again.");
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

function parseCommand(input) {
  const phrases = {
    "what is the current directory": "Get-Location",
    "list files and directories": "Get-ChildItem",
    // add more phrases and corresponding commands here
  };
  for (const phrase in phrases) {
    if (input.toLowerCase().includes(phrase)) {
      return phrases[phrase];
    }
  }
  return null;
}
