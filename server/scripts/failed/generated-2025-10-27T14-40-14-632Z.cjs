const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome! You can now interact with me using everyday language.");

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim();
  if (command.startsWith("what is ") || command.endsWith("?")) {
    console.log("Sorry, I don't have an answer to that yet.");
  } else if (command.startsWith("run ") || command.includes(" execute ")) {
    const powershellCommand = command.replace(/^run /, "").replace(/ execute /, "");
    const powershell = spawn("powershell.exe", ["-Command", powershellCommand]);
    powershell.stdout.on("data", (data) => {
      console.log(`Powershell output: ${data}`);
    });
    powershell.stderr.on("data", (data) => {
      console.error(`Powershell error: ${data}`);
    });
  } else {
    console.log("Sorry, I didn't understand that.");
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
