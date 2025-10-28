const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1");
const { spawn } = require("child_process");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey_description: "Alice NLU",
  iam_apikey_name: "alice-nlu",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/",
  version: "2022-04-07",
});

process.stdin.setEncoding("utf8");
process.stdout.write("Welcome to Alice! Type a command:\n");

process.stdin.on("data", async (input) => {
  const text = input.trim();
  if (text === "") return;

  try {
    const params = { text, features: { entities: {}, keywords: {} } };
    const response = await nlu.analyze(params);

    const entities = response.entities.results.map((entity) => entity.type);
    const keywords = response.keywords.results.map((keyword) => keyword.text);

    console.log(`Entities: ${entities.join(", ")}`);
    console.log(`Keywords: ${keywords.join(", ")}`);

    if (entities.includes("DATE") && keywords.includes("suggest")) {
      const command = `echo "Implementing NLP module..."> implementation-log.txt`;
      spawn("powershell.exe", ["-Command", command]);
    }
  } catch (err) {
    console.error(err);
  }
});
