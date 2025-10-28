const NLP = require("compromise");

function processText(text) {
  const doc = NLP(text);
  const nouns = doc.nouns().data();
  const verbs = doc.verbs().data();

  console.log(`Detected nouns: ${nouns.map((n) => n.text).join(", ")}`);
  console.log(`Detected verbs: ${verbs.map((v) => v.text).join(", ")}`);
}

processText("I want to integrate natural language processing capabilities");
