const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { promisify } = require("util");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Nodejs apikey",
  iam_apikey: "YOUR_API_KEY",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
});

const analyze = promisify(nlu.analyze.bind(nlu));

async function processInput(input) {
  const params = {
    text: input,
    features: {
      sentiment: {},
      keywords: {},
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
