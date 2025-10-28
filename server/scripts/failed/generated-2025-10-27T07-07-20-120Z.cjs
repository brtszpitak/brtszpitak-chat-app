const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { promisify } = require("util");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "NLU credentials",
  iam_apikey: "<YOUR_API_KEY>",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
});

const analyzeText = promisify(nlu.analyze.bind(nlu));

async function processQuery(query) {
  const params = {
    text: query,
    features: {
      concepts: {},
      entities: {},
      keywords: {},
      sentiment: {},
    },
  };

  try {
    const response = await analyzeText(params);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}

processQuery("What is the weather like today?");
