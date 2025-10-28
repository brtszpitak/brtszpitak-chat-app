const NaturalLanguageUnderstanding = require("stanford-corenlp");

(async () => {
  const nlu = new NaturalLanguageUnderstanding({
    server: "http://localhost:9000",
  });

  await nlu.annotate("What can you do for me?", ["tokenize", "ssplit", "pos", "lemma"]);

  console.log(nlu);
})();
