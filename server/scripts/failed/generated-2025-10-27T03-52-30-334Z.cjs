const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { promisify } = require("util");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLP",
  iam_apikey_name: "alice-nlp-apikey",
  version: "2022-04-07",
});

const analyzeText = promisify(nlu.analyze);

async function processUserInput(userInput) {
  const params = {
    text: userInput,
    features: {
      sentiment: {},
      keywords: {},
    },
  };

  try {
    const result = await analyzeText(params);
    console.log("Sentiment:", result.sentiment.document.label);
    console.log("Keywords:");
    result.keywords.result.forEach((keyword) => {
      console.log(`- ${keyword.text} (relevance: ${keyword.relevance})`);
    });
  } catch (err) {
    console.error(err);
  }
}

processUserInput("What do you think about this NLP module?");
