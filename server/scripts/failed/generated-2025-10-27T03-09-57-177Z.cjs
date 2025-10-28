const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

classifier.addDocument(["what", "is", "the", "weather"], "weather");
classifier.addDocument(["list", "files"], "ls");
classifier.addDocument(["create", "new", "file"], "touch");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line.toLowerCase());
  const classification = classifier.classify(tokens);

  switch (classification) {
    case "weather":
      console.log("Sorry, I'm a local AI, I don't have access to real-time weather information.");
      break;
    case "ls":
      console.log(
        "You want me to list files. Please note that this is a simulated response as Node.js cannot directly interact with the Windows file system without additional modules or configurations."
      );
      break;
    case "touch":
      console.log(
        "You want me to create a new file. Please note that this is a simulated response as Node.js cannot directly interact with the Windows file system without additional modules or configurations."
      );
      break;
    default:
      console.log(`I didn't understand that. Try rephrasing your question or command.`);
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
