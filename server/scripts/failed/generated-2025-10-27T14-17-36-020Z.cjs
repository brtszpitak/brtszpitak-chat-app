console.log("Alice NLP Integration Script");

const readline = require("readline");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1.js");
const { IamAuthenticator } = require("ibm-watson/auth");

const nlu = new NaturalLanguageUnderstandingV1({
  version: "2022-04-07",
  authenticator: new IamAuthenticator({
    apikey: "YOUR_API_KEY",
  }),
});

nlu.setServiceUrl(
  "https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/YOUR_INSTANCE_ID"
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your natural language command: ", (cmd) => {
  const analyzeParams = {
    text: cmd,
    features: {
      concepts: {},
      entities: {},
      keywords: {},
      sentiment: {},
    },
  };

  nlu
    .analyze(analyzeParams)
    .then((analysisResults) => {
      console.log(JSON.stringify(analysisResults, null, 2));
      rl.close();
    })
    .catch((err) => {
      console.error("Error:", err);
      rl.close();
    });
});
