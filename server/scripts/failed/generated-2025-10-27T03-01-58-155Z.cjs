const readline = require("readline");
const { spawn } = require("child_process");

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  let command = line.trim();
  if (command.startsWith("exit")) {
    rl.close();
  } else {
    console.log(`Processing command: ${command}`);
    let powershell = spawn("powershell.exe", ["-Command", `& { ${command} }`]);
    powershell.stdout.on("data", (data) => {
      console.log(`Powershell output: ${data.toString().trim()}`);
    });
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
