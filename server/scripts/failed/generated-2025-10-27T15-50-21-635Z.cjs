const readline = require("readline");
const { spawn } = require("child_process");

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You > ");
rl.prompt();

rl.on("line", (line) => {
  let command;

  if (/^what is my name/i.test(line)) {
    command = "echo Alice";
  } else if (/^list files/i.test(line)) {
    command = "dir";
  } else if (/^create new file (.*)/i.test(line)) {
    command = `type nul > ${RegExp.$1}.txt`;
  } else {
    console.log("Sorry, I didn't understand that.");
    rl.prompt();
    return;
  }

  let powershell = spawn("powershell.exe", ["-Command", command]);

  powershell.stdout.on("data", (data) => {
    console.log(`Powershell > ${data}`);
  });

  powershell.stderr.on("data", (data) => {
    console.error(`Powershell > ${data}`);
  });

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
