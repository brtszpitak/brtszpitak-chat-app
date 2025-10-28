const readline = require("readline");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon();

lexicon.addEntry("what", "WH_Query");
lexicon.addEntry("is", "WH_Query");
lexicon.addEntry("how", "WH_Query");
lexicon.addEntry("do", "DO_Command");
lexicon.addEntry("make", "DO_Command");
lexicon.addEntry("run", "RUN_Command");

const classifier = new natural.BayesClassifier(lexicon);

classifier.train([
  { text: "what is the time", category: "WH_Query" },
  { text: "do something", category: "DO_Command" },
  { text: "make a folder", category: "DO_Command" },
  { text: "run notepad", category: "RUN_Command" },
]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const tokens = tokenizer.tokenize(line);
  const classification = classifier.classify(tokens.join(" "));

  switch (classification) {
    case "WH_Query":
      console.log("I'll answer your question!");
      break;
    case "DO_Command":
      console.log("I'll do that for you!");
      break;
    case "RUN_Command":
      const commandParts = line.split(" ");
      const command = commandParts[1];

      try {
        require("child_process").execSync(`start ${command}`);
        console.log(`Ran ${command} successfully!`);
      } catch (e) {
        console.error(`Failed to run ${command}: ${e.message}`);
      }
      break;
  }

  rl.prompt();
}).on("close", () => {
  process.exit(0);
});
