const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLP",
  iam_apikey_name: "alice-nlp",
  iam_role_crn: "your_iam_role_crn",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
});

const analyzeText = (text) => {
  const params = {
    text,
    features: {
      entities: {},
      keywords: {},
    },
  };

  nlu.analyze(params, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
  });
};

analyzeText("Create a task to buy milk");
