const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  const text = "I suggest implementing a natural language processing module";
  const doc = await nlp(text);
  console.log(`Entities: ${[...doc.ents].map((e) => e.text).join(", ")}`);
})();
