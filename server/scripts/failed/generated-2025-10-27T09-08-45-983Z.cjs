const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  const query = "What is the weather like today?";
  const doc = await nlp(query);
  console.log(`Entities: ${[...doc.ents].map((e) => e.text).join(", ")}`);
  console.log(`Intent: ${doc.cats}`);
})();
