const readline = require("readline");
const { spawn } = require("child_process");

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("What would you like to do? ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim().toLowerCase();

  switch (true) {
    case command.startsWith("what is"):
      console.log(
        `You asked about ${command.substring(8)}. I'm still learning, but I can try to help!`
      );
      break;
    case command.startsWith("run "):
      const powershellCommand = command.substring(4);
      const powershell = spawn("powershell", ["-Command", powershellCommand]);
      powershell.stdout.on("data", (data) => {
        console.log(`Powershell output: ${data}`);
      });
      powershell.stderr.on("data", (data) => {
        console.error(`Powershell error: ${data}`);
      });
      break;
    default:
      console.log(`I didn't understand '${command}'. Try asking a question or giving a command!`);
  }

  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
