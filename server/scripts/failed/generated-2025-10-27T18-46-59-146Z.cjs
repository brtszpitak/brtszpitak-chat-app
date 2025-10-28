const NLP = require("compromise");

function processInput(input) {
  const doc = NLP(input);
  const sentences = doc.sentences().data();

  for (let sentence of sentences) {
    if (sentence.verb().text() === "suggest") {
      console.log(`You suggested: ${sentence.clauses()[0].text()}`);
    } else if (sentence.verb().text() === "ask" || sentence.verb().text() === "give") {
      console.log(`You asked or gave command: ${sentence.text()}`);
    }
  }
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  processInput(input.toString().trim());
});
