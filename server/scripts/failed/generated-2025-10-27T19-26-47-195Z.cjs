const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLU",
  iam_api_key: "YOUR_API_KEY",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
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
    if (err) {
      console.log(err);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  });
});
