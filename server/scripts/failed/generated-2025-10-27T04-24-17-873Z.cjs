const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLP",
  iam_apikey_name: "alice-nlp",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
  version: "2021-08-01",
});

const text = "I want to implement a natural language processing module";
const analyzeParams = {
  text,
  features: {
    concepts: {},
    entities: {},
    keywords: {},
    sentiment: {},
  },
};

naturalLanguageUnderstanding
  .analyze(analyzeParams)
  .then((analysisResults) => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch((err) => {
    console.log("error:", err);
  });
