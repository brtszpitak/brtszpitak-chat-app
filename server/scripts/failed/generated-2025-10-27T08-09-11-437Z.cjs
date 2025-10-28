const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLU",
  iam_apikey_name: "alice-nlu",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
  version: "2021-08-01",
});

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const params = {
    text: input.toString(),
    features: {
      entities: {},
      keywords: {},
    },
  };
  nlu.analyze(params, (err, response) => {
    if (err) console.error(err);
    else {
      console.log(response.entities);
      console.log(response.keywords);
    }
  });
});
