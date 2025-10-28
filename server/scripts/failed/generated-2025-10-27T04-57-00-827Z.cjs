const Nlp = require("compromise");

const aliceBrain = {};

aliceBrain.understand = (input) => {
  const doc = Nlp(input);
  const verbs = doc.verbs().out("array");
  const nouns = doc.nouns().out("array");

  if (verbs.includes("integrate")) {
    if (nouns.includes("NLP") && nouns.includes("module")) {
      console.log("Integrating NLP module...");
    }
  } else if (verbs.includes("interact")) {
    if (nouns.includes("users") && nouns.includes("me")) {
      console.log("Enabling conversational interaction...");
    }
  } else {
    console.log(`I didn't understand: ${input}`);
  }
};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  aliceBrain.understand(input.trim());
});

console.log("Alice is ready. Type something...");
