const spacy = require("spacy");

(async () => {
  try {
    const nlp = await spacy.load("en_core_web_sm");
    console.log("Loaded NLP model.");

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", async (input) => {
      input = input.trim();
      if (input !== "") {
        const doc = await nlp(input);
        console.log(`Entities: ${[...doc.ents].map((e) => e.text).join(", ")}`);
      }
    });

    console.log("Type something to analyze:");
  } catch (err) {
    console.error(err);
  }
})();
