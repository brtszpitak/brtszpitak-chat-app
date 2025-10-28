const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1.js");
const { IamAuthenticator } = require("ibm-watson/auth");

async function main() {
  const nlu = new NaturalLanguageUnderstandingV1({
    version: "2022-04-07",
    authenticator: new IamAuthenticator({
      apikey: "YOUR_API_KEY",
    }),
    serviceUrl: "https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com",
  });

  const text =
    "Implement a natural language processing module that allows users to interact with me using everyday language.";
  const analyzeParams = {
    text: text,
    features: {
      entities: {},
      keywords: {},
      sentiment: {},
    },
  };

  try {
    const analysisResults = await nlu.analyze(analyzeParams);
    console.log(JSON.stringify(analysisResults, null, 2));
  } catch (err) {
    console.log("Error:", err);
  }
}

main();
