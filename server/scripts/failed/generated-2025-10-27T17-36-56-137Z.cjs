const natural = require("natural");

const nlp = new natural.LangGuageProcessor();

nlp.addDocument("What is your name?", "My name is Alice.");
nlp.addDocument(
  "How can I collaborate with you?",
  "You can ask me questions or give commands using everyday language."
);
nlp.addDocument("What time is it?", () => {
  return new Date().toLocaleTimeString();
});

process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const response = nlp.process(input.toString().trim());
  if (response) console.log(response.answer);
});

console.log("Ask me something!");
