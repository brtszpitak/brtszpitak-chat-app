const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  console.log("NLP module loaded.");

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async (input) => {
    try {
      const doc = await nlp(input.toString().trim());
      console.log(`Entities: ${[...doc.ents].map((ent) => ent.text).join(", ")}`);
      console.log(`Intent: ${doc.cats}`);
    } catch (err) {
      console.error(err);
    }
  });
})();
