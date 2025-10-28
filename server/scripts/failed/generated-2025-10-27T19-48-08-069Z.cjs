const spacy = require("spacy");

(async () => {
  try {
    const nlp = await spacy.load("en_core_web_sm");
    const doc = await nlp(
      "I suggest implementing a natural language processing module that enables me to better understand and respond to user requests, allowing for more conversational and human-like interactions."
    );
    console.log(doc.sentences.map((sentence) => sentence.text));
  } catch (err) {
    console.error(err);
  }
})();
