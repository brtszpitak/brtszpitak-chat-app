console.log("Hello! I'm Alice. You can talk to me in natural language.");
const readline = require("readline");
const { spacy } = require("@nlpjs/spacy");

(async () => {
  const nlp = await spacy();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async (line) => {
    try {
      const doc = await nlp.process(line);
      console.log(`You said: ${doc.text}`);
      if (doc.entities.length > 0) {
        console.log("Entities found:");
        doc.entities.forEach((entity) => console.log(`${entity.type}: ${entity.text}`));
      }
    } catch (err) {
      console.error(err);
    }
    rl.prompt();
  }).on("close", () => process.exit(0));
})();
