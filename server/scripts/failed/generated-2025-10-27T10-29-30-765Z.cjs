const readline = require("readline");
const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Node.js SDK",
  iam_apikey_name: "node-sdk",
  iam_role_crn: "crn:v1:bluemix:public:conversation:us-south:a/...:...",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
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
      entities: {},
      keywords: {},
    },
  };

  nlu.analyze(params, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
  });

  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
