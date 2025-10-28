const readline = require("readline");
const { spawn } = require("child_process");

let powershell;

function startPowerShell() {
  powershell = spawn("powershell.exe", ["-Command", '& { Write-Host "Ready" }']);
  powershell.stdout.on("data", (data) => console.log(`Powershell: ${data}`));
}

function processInput(input) {
  if (input.startsWith("exit")) return process.exit();
  try {
    const result = eval(input);
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

startPowerShell();

rl.setPrompt(">");
rl.prompt();

rl.on("line", (input) => {
  if (input.trim() === "") return rl.prompt();
  try {
    const command = translateToPowershell(input);
    powershell.stdin.write(`${command}\n`);
  } catch (err) {
    console.error(err.message);
  }
  rl.prompt();
});

function translateToPowershell(input) {
  // TO DO: implement NLP module to translate input to PowerShell commands
  return `Write-Host "${input}"`;
}

rl.on("close", () => process.exit());
