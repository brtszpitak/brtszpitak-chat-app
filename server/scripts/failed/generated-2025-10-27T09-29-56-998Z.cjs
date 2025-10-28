const spacy = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  console.log("Natural Language Processing module loaded.");

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async (input) => {
    const doc = await nlp(input.trim());
    const intent = doc.ents.find((ent) => ent.label_ === "TASK")?.text;
    if (intent) {
      console.log(`You want to ${intent}.`);
    } else {
      console.log("I didn't understand your request.");
    }
  });
})();
