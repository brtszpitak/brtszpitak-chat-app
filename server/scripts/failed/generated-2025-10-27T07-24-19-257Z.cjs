const readline = require("readline");
const { spawn } = require("child_process");

let powershell;

startShell();

async function startShell() {
  powershell = spawn("powershell.exe", [
    "-Command",
    "& { [Console]::InputEncoding = [Text.Encoding]::UTF8; }",
  ]);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async (line) => {
    try {
      powershell.stdin.write(`${line}\n`);
      powershell.stdin.end();
      let result = await getOutput();
      console.log(result);
      rl.prompt();
    } catch (err) {
      console.error(err);
      rl.prompt();
    }
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

async function getOutput() {
  return new Promise((resolve, reject) => {
    let output = "";
    powershell.stdout.on("data", (data) => {
      output += data.toString();
    });
    powershell.stdout.on("end", () => {
      resolve(output.trim());
    });
  });
}
