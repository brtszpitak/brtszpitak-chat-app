const readline = require("readline");
const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "NLP API key",
  iam_apikey: "<YOUR_API_KEY>",
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
      sentiment: {},
      keywords: {},
    },
  };

  nlu.analyze(params, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Sentiment: ${response.sentiment.document.label}`);
      console.log("Keywords:");
      response.keywords.result.forEach((keyword) => {
        console.log(`${keyword.text} - Relevance: ${keyword.relevance}`);
      });
    }
  });

  rl.prompt();
});
