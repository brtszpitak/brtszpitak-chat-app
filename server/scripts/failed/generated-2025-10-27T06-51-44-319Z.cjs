const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { username, password } = require("./credentials.json");

async function processText(text) {
  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    iam_apikey_description: "Alice NLP",
    iam_apikey_name: "alice-nlp",
    url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
    username,
    password,
    version: "2021-08-01",
  });

  const analyzeParams = {
    text,
    features: {
      entities: {},
      keywords: {},
    },
  };

  try {
    const results = await naturalLanguageUnderstanding.analyze(analyzeParams);
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error(err);
  }
}

processText("Hello, I suggest implementing a natural language processing module.");
