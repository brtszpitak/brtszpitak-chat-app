const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("What can I do for you? ");
rl.prompt();

rl.on("line", (line) => {
  const command = parseCommand(line);
  if (command) {
    executePowerShellCommand(command);
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

function parseCommand(input) {
  // TO DO: implement NLP logic to parse user input and return PowerShell command
  // For now, assume a simple mapping of keywords to commands
  const commands = {
    "list files": "Get-ChildItem",
    "create file": "New-Item -ItemType File",
  };
  for (const keyword in commands) {
    if (input.toLowerCase().includes(keyword)) {
      return commands[keyword];
    }
  }
  return null;
}

function executePowerShellCommand(command) {
  const ps = spawn("powershell.exe", ["-Command", command]);
  ps.stdout.on("data", (data) => {
    console.log(`PowerShell: ${data}`);
  });
  ps.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });
}
