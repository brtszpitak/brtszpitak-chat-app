const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  console.log("Loaded Spacy model");

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async (input) => {
    try {
      const doc = await nlp(input.trim());
      const entities = doc.ents.map((entity) => ({ text: entity.text, label: entity.label_ }));
      console.log(entities);
    } catch (err) {
      console.error(err);
    }
  });
})();
