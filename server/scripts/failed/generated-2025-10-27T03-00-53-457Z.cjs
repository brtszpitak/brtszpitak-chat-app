const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("What would you like to do? ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim();
  if (command.startsWith("exit")) {
    process.exit(0);
  } else {
    console.log(`You said: ${command}`);
    // todo: implement NLP module to parse user input and generate PowerShell commands
    // for now, just echo the command as a placeholder
    const powershell = spawn("powershell.exe", [
      "-Command",
      `Write-Host "Received command: ${command}"`,
    ]);
    powershell.stdout.on("data", (data) => {
      console.log(`Powershell output: ${data}`);
    });
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
