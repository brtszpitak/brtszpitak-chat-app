const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("What can I help you with? ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim().toLowerCase();
  if (command.startsWith("what is")) {
    const query = command.replace("what is ", "");
    spawn("powershell.exe", ["-Command", `Get-Help ${query}`]);
  } else if (command.startsWith("run ")) {
    const powershellCmd = command.replace("run ", "");
    spawn("powershell.exe", ["-Command", powershellCmd]);
  } else {
    console.log(`Sorry, I didn't understand "${line}"`);
  }
  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
