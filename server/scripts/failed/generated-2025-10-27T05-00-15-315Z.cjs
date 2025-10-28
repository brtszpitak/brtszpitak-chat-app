const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { username, password } = require("./credentials.json");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLP",
  iam_apikey_name: "alice-nlp",
  iam_role_crn: "CRNv1:::::",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
  version: "2022-04-07",
  username,
  password,
});

const analyzeText = (text) => {
  const params = {
    text,
    features: {
      entities: {},
      keywords: {},
    },
  };

  nlu.analyze(params, (error, response) => {
    if (error) console.error(error);
    else console.log(response.results);
  });
};

analyzeText("Hello, Alice!");
