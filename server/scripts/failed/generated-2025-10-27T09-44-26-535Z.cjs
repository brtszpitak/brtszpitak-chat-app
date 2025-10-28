const spacy = require("spacy");

async function init() {
  const nlp = await spacy.load("en_core_web_sm");
  process.stdin.setEncoding("utf8");
  process.stdout.write("You can talk to me now...\n");
  process.stdin.on("data", async (input) => {
    const doc = await nlp(input.toString().trim());
    console.log(doc.sentences.map((sentence) => sentence.text).join("\n"));
  });
}

init();
