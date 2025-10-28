const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");
const { spawn } = require("child_process");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLP",
  iam_apikey_name: "alice-nlp",
  iam_role_crn: "YOUR_IBM_CLOUD_IAM_ROLE_CRN",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
});

const processCommand = (command) => {
  const child = spawn("powershell.exe", ["-Command", command]);
  child.stdout.on("data", (data) => console.log(`Powershell output: ${data}`));
};

const analyzeText = (text) => {
  const parameters = {
    text: text,
    features: {
      sentiment: {},
      keywords: {},
    },
  };
  nlu.analyze(parameters, (err, response) => {
    if (err) console.error(err);
    else {
      const sentiment = response.sentiment.document.label;
      const keywords = response.keywords.result.map((keyword) => keyword.text);
      console.log(`Sentiment: ${sentiment}`);
      console.log(`Keywords: ${keywords.join(", ")}`);

      // Map NLP output to concrete Windows commands
      if (keywords.includes("list") && keywords.includes("files")) {
        processCommand("Get-ChildItem -Path .");
      } else if (keywords.includes("create") && keywords.includes("folder")) {
        processCommand('New-Item -ItemType Directory -Path "New Folder"');
      }
    }
  });
};

console.log("Alice NLP is ready. Type a command:");
process.stdin.setEncoding("utf8");
process.stdin.on("data", (text) => analyzeText(text.toString().trim()));
