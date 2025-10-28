const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { NLUTokenizer } = require("nlu");

async function main() {
  const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey_description: "My NLU Apikey",
    iam_apikey: "<your-api-key>",
    url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
  });

  const tokenizer = new NLUTokenizer();

  let input =
    "Implement a natural language processing module to enable users to interact with me using everyday language";

  let tokens = await tokenizer.tokenize(input);

  let params = {
    text: input,
    features: {
      keywords: {},
      entities: {},
    },
  };

  nlu
    .analyze(params)
    .then((analysisResults) => {
      console.log(JSON.stringify(analysisResults, null, 2));
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

main();
