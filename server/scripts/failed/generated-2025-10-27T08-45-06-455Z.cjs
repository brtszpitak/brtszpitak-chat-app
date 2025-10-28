const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1.js");
const { IamAuthenticator } = require("ibm-watson/auth");

async function main() {
  const nlu = new NaturalLanguageUnderstandingV1({
    version: "2022-04-07",
    authenticator: new IamAuthenticator({
      apikey: "YOUR_API_KEY",
    }),
  });

  nlu.setServiceUrl("https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com");

  const text = "I want to collaborate on tasks using everyday conversational language.";
  const analyzeParams = {
    text,
    features: {
      sentiment: {},
      entities: {},
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
