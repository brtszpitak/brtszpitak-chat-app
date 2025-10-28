const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { promisify } = require("util");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLP",
  iam_apikey_name: "alice-nlp",
  iam_role_crn: "your_iam_role_crn",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
});

const analyze = promisify(nlu.analyze.bind(nlu));

async function processText(text) {
  const params = {
    text,
    features: {
      entities: {},
      keywords: {},
      sentiment: {},
    },
  };

  try {
    const result = await analyze(params);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

processText("Hello, Alice! Can you help me with something?");
