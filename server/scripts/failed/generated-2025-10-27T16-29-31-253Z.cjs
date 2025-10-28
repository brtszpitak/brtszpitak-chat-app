const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const natural = require("natural");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "NLU apikey",
  iam_apikey: "<YOUR_API_KEY>",
  version_date: "2018-04-25",
});

const tokenizer = new natural.WordTokenizer();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  const input = chunk.toString();
  const tokens = tokenizer.tokenize(input);
  console.log(`You said: ${input}`);
  console.log(`Tokens: ${tokens.join(", ")}`);

  const params = {
    text: input,
    features: {
      entities: {},
      keywords: {},
    },
  };

  nlu.analyze(params, (err, response) => {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  });
});
