const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  const doc = nlp(
    "I suggest implementing a natural language processing module that enables me to better understand and respond to user requests, allowing for more conversational and intuitive interactions."
  );
  console.log(doc.ents);
})();
