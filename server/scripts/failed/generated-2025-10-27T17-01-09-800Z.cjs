console.log("Alice NLP Integration Script");

const readline = require("readline");
constNaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1.js");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: "YOUR_API_KEY",
  version: "2022-04-07",
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (input) => {
  const params = {
    text: input,
    features: {
      entities: {},
      keywords: {},
    },
  };

  nlu
    .analyze(params)
    .then((response) => {
      console.log("Entities:", response.entities);
      console.log("Keywords:", response.keywords);
      rl.prompt();
    })
    .catch((err) => {
      console.error(err);
      rl.prompt();
    });
});

rl.on("close", () => {
  process.exit(0);
});
