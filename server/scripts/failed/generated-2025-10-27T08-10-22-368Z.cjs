const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { promisify } = require("util");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLP",
  iam_apikey_name: "alice-nlp",
  version: "2022-04-07",
});

const analyzeText = promisify(nlu.analyze.bind(nlu));

async function processUserInput(input) {
  const params = {
    text: input,
    features: {
      sentiment: {},
      entities: {},
    },
  };

  try {
    const result = await analyzeText(params);
    console.log(result.sentiment.document.label);
    console.log(result.entities);
  } catch (err) {
    console.error(err);
  }
}

processUserInput("What can you do for me today?");
