const NLP = require("compromise");

const nlp = NLP();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const text = input.trim();
  if (text) {
    const doc = nlp.text(text);
    const intent = doc.match("#Intent").out("array")[0];
    const action = doc.match("#Action").out("array")[0];
    console.log(` Intent: ${intent} | Action: ${action}`);
  }
});
