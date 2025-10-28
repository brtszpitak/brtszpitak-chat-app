const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim().toLowerCase();
  if (command.startsWith("what is my")) {
    console.log(`Your current directory is ${process.cwd()}`);
  } else if (command.includes("list files")) {
    require("child_process").exec("dir", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`STDERR: ${stderr}`);
        return;
      }
      console.log(stdout);
    });
  } else {
    console.log("Sorry, I didn't understand that. Try again!");
  }
  rl.prompt();
});
