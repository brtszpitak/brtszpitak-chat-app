const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  console.log("Loaded language model");

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async (input) => {
    try {
      const doc = await nlp(input.trim());
      const intent = doc.ents.find((ent) => ent.type === "PERSON")?.text;
      if (intent) console.log(`You want to interact with ${intent}`);
      else console.log("I did not understand your intent");
    } catch (err) {
      console.error(err);
    }
  });
})();
