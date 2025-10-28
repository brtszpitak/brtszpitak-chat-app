const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1.js");
const { IamAuthenticator } = require("ibm-watson/auth");

const nlu = new NaturalLanguageUnderstandingV1({
  version: "2022-04-07",
  authenticator: new IamAuthenticator({
    apikey: "YOUR_API_KEY",
  }),
});

nlu
  .analyze({
    html: "<p>Hello from Node.js!</p>",
    features: {
      entities: {},
      keywords: {},
    },
  })
  .then((response) => {
    console.log(JSON.stringify(response, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
