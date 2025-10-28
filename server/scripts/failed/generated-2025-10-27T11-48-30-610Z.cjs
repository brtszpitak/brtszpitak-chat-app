const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { IamAuthenticator } = require("watson-auth");

async function main() {
  const nlu = new NaturalLanguageUnderstandingV1({
    version: "2022-04-07",
    authenticator: new IamAuthenticator({
      apikey: "YOUR_API_KEY",
    }),
    serviceUrl:
      "https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/YOUR_INSTANCE_ID",
  });

  console.log('Enter your query (or "exit" to quit):');
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", async (data) => {
    const userInput = data.toString().trim();
    if (userInput === "exit") process.exit(0);

    try {
      const params = {
        text: userInput,
        features: {
          sentiment: {},
          entities: {},
        },
      };

      const analysisResults = await nlu.analyze(params);
      console.log(JSON.stringify(analysisResults, null, 2));
    } catch (err) {
      console.error(err);
    }

    console.log('Enter your query (or "exit" to quit):');
  });
}

main();
