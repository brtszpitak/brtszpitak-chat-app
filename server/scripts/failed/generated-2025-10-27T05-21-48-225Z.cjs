const fs = require("fs");
const path = require("path");
const spacy = require("spacy");

async function main() {
  const nlp = await spacy.load("en_core_web_sm");
  const input =
    "I suggest implementing a natural language processing module that enables me to better understand and respond to user queries, allowing for more conversational and intuitive interactions.";
  const doc = await nlp(input);
  console.log(`Entities: ${[...doc.ents].map((e) => e.text).join(", ")}`);
}

main();
