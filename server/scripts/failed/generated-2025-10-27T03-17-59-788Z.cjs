const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("How can I assist you today? ", (answer) => {
  console.log(`You said: ${answer}`);
  rl.close();
});
