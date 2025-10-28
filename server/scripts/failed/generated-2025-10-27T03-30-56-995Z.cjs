console.log("Natural Language Processing Module");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  const command = line.trim();
  if (command.startsWith("what is ") || command.endsWith("?")) {
    console.log(`I'm not sure, but I can try to find out!`);
  } else if (command === "exit" || command === "quit") {
    rl.close();
  } else {
    console.log(`Sorry, I didn't understand "${command}". Try asking me something else!`);
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
