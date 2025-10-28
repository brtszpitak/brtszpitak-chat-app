const Nlp = require("compromise");

const nlp = new Nlp();

process.stdin.setEncoding("utf8");
process.stdin.on("data", async (input) => {
  const text = input.trim();
  if (text) {
    try {
      const doc = nlp.text(text);
      const sentences = doc.sentences().out("array");
      for (const sentence of sentences) {
        console.log(`You asked: ${sentence.text()}`);
        // Add more NLP logic here, e.g., intent detection, entity extraction
      }
    } catch (err) {
      console.error(err);
    }
  }
});
