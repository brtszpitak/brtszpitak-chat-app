const readline = require("readline");
const { NLPManager } = require("@nlpjs/nlp");

(async () => {
  const nlpManager = new NLPManager({ languages: ["en"] });
  await nlpManager.addCorpus();
  await nlpManager.train();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt("You: ");
  rl.prompt();

  rl.on("line", async (line) => {
    try {
      const response = await nlpManager.process(line);
      console.log(`AI: ${response.answer || "I didn't understand."}`);
    } catch (err) {
      console.error(err);
    }
    rl.prompt();
  }).on("close", () => process.exit(0));
})();
