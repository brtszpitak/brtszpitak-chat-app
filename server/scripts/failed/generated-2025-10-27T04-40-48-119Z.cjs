const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { promisify } = require("util");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "NLU api key",
  iam_apikey: "YOUR_API_KEY",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
});

const analyze = promisify(naturalLanguageUnderstanding.analyze.bind(naturalLanguageUnderstanding));

async function processInput(input) {
  const params = {
    text: input,
    features: {
      concepts: {},
      entities: {},
      keywords: {},
      sentiment: {},
    },
  };

  try {
    const response = await analyze(params);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => processInput(data.toString().trim()));
process.stdin.on("end", () => process.stdout.write(""));
