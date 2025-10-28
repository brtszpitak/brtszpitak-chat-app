const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("What would you like to do? ");
rl.prompt();

rl.on("line", (line) => {
  const command = parseCommand(line);
  if (command) {
    executeCommand(command);
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

function parseCommand(input) {
  // Very basic NLP for demo purposes only
  const commands = {
    "list files": "dir",
    "show directory": "dir",
    "create new file": "type nul > newfile.txt",
    exit: "exit",
  };
  for (const phrase in commands) {
    if (input.toLowerCase().includes(phrase)) {
      return commands[phrase];
    }
  }
  console.log("Unknown command. Please try again.");
  return null;
}

function executeCommand(command) {
  const powershell = spawn("powershell.exe", ["-Command", command]);
  powershell.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  powershell.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
  powershell.on("exit", () => {
    console.log("Command executed.");
  });
}
