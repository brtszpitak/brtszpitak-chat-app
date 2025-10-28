const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLU",
  iam_apikey_name: "alice-nlu-apikey",
  iam_role_crn: "your_iam_role_crn",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
});

const text = "I want to implement a natural language processing module";
const analyzeParams = {
  text,
  features: {
    concepts: {},
    entities: {},
    keywords: {},
  },
};

nlu
  .analyze(analyzeParams)
  .then((analysisResults) => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch((err) => {
    console.error("Error:", err);
  });
