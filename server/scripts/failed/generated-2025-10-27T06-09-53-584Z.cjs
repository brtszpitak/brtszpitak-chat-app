const spacy = require("spacy");

async function processInput(input) {
  const nlp = await spacy.load("en_core_web_sm");
  const doc = await nlp(input);
  console.log(doc.json());
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  processInput(input.toString().trim()).catch((err) => console.error(err));
});
