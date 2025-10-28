const readline = require("readline");
const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Node.js SDK",
  iam_apikey_name: "node-sdk",
  iam_api_key: "YOUR_API_KEY",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", (line) => {
  const params = {
    text: line,
    features: {
      concepts: {},
      entities: {},
      keywords: {},
      sentiment: {},
    },
  };

  nlu.analyze(params, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  });

  rl.prompt();
});
