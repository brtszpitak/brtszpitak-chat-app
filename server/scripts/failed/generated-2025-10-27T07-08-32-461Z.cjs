const Nlp = require("compromise");

function processQuery(query) {
  const doc = Nlp(query);
  const sentences = doc.sentences().data();
  let result = "";

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (sentence.verbs().length > 0) {
      const verb = sentence.verbs()[0].text();
      const noun = sentence.nouns()[0]?.text() || "something";
      result += `You want to ${verb} the ${noun}. `;
    } else {
      result += `I didn't understand "${sentence.text()}". `;
    }
  }

  return result.trim();
}

const query = process.argv[2];
if (query) {
  console.log(processQuery(query));
} else {
  console.log("Please provide a query as an argument.");
}
