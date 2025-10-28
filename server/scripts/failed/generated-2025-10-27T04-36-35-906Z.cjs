console.log("Alice NLP Integration Script");

const readline = require("readline");
const { NlpManager } = require("node-nlp");

const manager = new NlpManager({ languages: ["en"] });
manager.addDocument("en", "Hello how are you?", "greeting.how_are_you");
manager.addDocument("en", "Hi, what's up?", "greeting.hi");
manager.addDocument("en", "What can you do?", "question.capabilities");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
  manager
    .process(line)
    .then((result) => {
      if (result.intent === "greeting.how_are_you") {
        console.log("I'm doing great, thanks!");
      } else if (result.intent === "greeting.hi") {
        console.log("Hi!");
      } else if (result.intent === "question.capabilities") {
        console.log("I can understand natural language and respond accordingly.");
      } else {
        console.log("Sorry, I didn't understand that. Try rephrasing?");
      }
    })
    .catch((err) => {
      console.error(err);
    });
  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
