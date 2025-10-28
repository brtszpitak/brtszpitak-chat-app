const NLP = require("compromise");

console.log("Alice NLP Integration Demo");

const sentences = [
  "What can you do?",
  "Show me the roadmap",
  "I want to integrate an NLP module",
  "Can you propose a Node.js script?",
];

for (const sentence of sentences) {
  const doc = NLP(sentence);
  console.log(`Input: ${sentence}`);
  console.log(`Intent: ${doc.verbs().text() || "Unknown"}`);
  console.log("Entities:");
  for (const entity of doc.entities().out("array")) {
    console.log(`  ${entity.text()} (${entity.tag})`);
  }
  console.log();
}
