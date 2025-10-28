const Nlp = require("compromise");

const nlp = new Nlp();

nlp.on("parse", (result) => {
  console.log(`You said: ${result.text}`);
  if (result.match(/what is your name/i)) {
    console.log("My name is Alice, I am a local AI collaborator running on Bartosz's Windows PC.");
  } else if (result.match(/run (.+)$/i)) {
    const command = result.matches[0].groups()[1];
    console.log(`You want me to run: ${command}`);
    // TO DO: implement command execution
  } else {
    console.log("I didn't understand that. Please rephrase your question or command.");
  }
});

console.log(
  "Welcome! You can ask me questions or give commands using everyday conversational language."
);
console.log('Type "exit" to quit.');

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  nlp.parse(input.toString().trim());
  if (input.toString().trim().toLowerCase() === "exit") process.exit();
});
