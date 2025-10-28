const readline = require("readline");
const { spawn } = require("child_process");

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  let command;
  if (/^what is (.+)$/.test(line)) {
    command = `powershell -Command "Get-ChildItem -Path ${RegExp.$1}"`;
  } else if (/^list (.+)$/.test(line)) {
    command = `powershell -Command "Get-ChildItem -Path ${RegExp.$1}"`;
  } else if (/^go to (.+)$/.test(line)) {
    command = `powershell -Command "Set-Location -Path '${RegExp.$1}'"`;
  } else if (/^create (.+)$/.test(line)) {
    command = `powershell -Command "New-Item -ItemType File -Path '${RegExp.$1}'"`;
  } else {
    console.log("Unknown command");
    return;
  }

  let pwsh = spawn("powershell", ["-Command", command]);
  pwsh.stdout.on("data", (data) => {
    console.log(`Powershell: ${data}`);
  });
  pwsh.stderr.on("data", (data) => {
    console.error(`Powershell error: ${data}`);
  });

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
