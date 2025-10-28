const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim();
  if (command.startsWith("exit")) {
    rl.close();
  } else {
    try {
      const powershell = spawn("powershell.exe", ["-Command", command]);
      powershell.stdout.on("data", (data) => {
        console.log(`Alice: ${data}`);
      });
      powershell.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
      });
      powershell.on("close", () => {
        rl.prompt();
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      rl.prompt();
    }
  }
});

rl.on("close", () => {
  process.exit(0);
});
