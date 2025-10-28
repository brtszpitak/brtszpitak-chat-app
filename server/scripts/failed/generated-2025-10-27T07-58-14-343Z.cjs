const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  console.log("Loaded spaCy model.");

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async (input) => {
    const doc = await nlp(input.trim());
    console.log(`Entities: ${[...doc.ents].map((e) => e.text).join(", ")}`);
  });
})();
