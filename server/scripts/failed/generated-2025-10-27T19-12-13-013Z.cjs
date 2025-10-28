const readline = require("readline");
const { spawn } = require("child_process");

let powershell = spawn("powershell.exe", ["-Command", "-"]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  if (line.trim() === "exit") {
    rl.close();
  } else {
    powershell.stdin.write(`${line}\n`);
  }
}).on("close", () => {
  process.exit(0);
});
