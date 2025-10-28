const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

async function main() {
  const nlu = new NaturalLanguageUnderstandingV1({
    version: "2022-04-07",
    authenticator: new IamAuthenticator({ apikey: "YOUR_API_KEY" }),
  });

  nlu.setServiceUrl("https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com");

  const text = "What is the weather like today?";
  const analyzeParams = {
    text: text,
    features: {
      sentiment: {},
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
      console.log("error:", err);
    });
}

main();
