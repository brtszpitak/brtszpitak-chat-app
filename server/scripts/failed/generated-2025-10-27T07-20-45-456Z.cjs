const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  process.stdin.setEncoding("utf8");
  process.stdout.write("Alice NLP Module > ");
  process.stdin.on("data", async (input) => {
    try {
      const doc = await nlp(input.toString().trim());
      console.log(doc.sentences.map((sentence) => sentence.text).join("\n"));
    } catch (e) {
      console.error(e);
    }
    process.stdout.write("Alice NLP Module > ");
  });
})();
