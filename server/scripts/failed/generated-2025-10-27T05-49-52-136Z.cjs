const { spacy } = require("spacy");

(async () => {
  const nlp = await spacy.load("en_core_web_sm");
  console.log("Loaded NLP module");

  function processUserInput(input) {
    const doc = nlp(input);
    const entities = doc.ents.map((entity) => ({ text: entity.text, label: entity.label_ }));
    const intent = doc.cats;

    console.log(`Entities: ${JSON.stringify(entities)}`);
    console.log(`Intent: ${JSON.stringify(intent)}`);
  }

  processUserInput("What is the weather like today?");
})();
