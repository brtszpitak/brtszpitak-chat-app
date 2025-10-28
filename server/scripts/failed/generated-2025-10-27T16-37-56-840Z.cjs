const spacy = require("spacy");

(async () => {
  try {
    const nlp = await spacy.load("en_core_web_sm");
    const doc = await nlp("What can you do for me?");
    console.log(`Entity recognition: ${doc.ents.map((e) => e.text).join(", ")}`);
    console.log(`Part-of-speech tagging: ${doc.map((t) => t.pos_).join(", ")}`);
  } catch (err) {
    console.error(err);
  }
})();
