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
  if (command === "exit") {
    rl.close();
  } else {
    try {
      const powershell = spawn("powershell.exe", ["-Command", `& { ${command} }`]);
      powershell.stdout.on("data", (data) => {
        console.log(`Output: ${data}`);
      });
      powershell.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
      });
    } catch (err) {
      console.error(`Error executing command: ${err}`);
    }
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
