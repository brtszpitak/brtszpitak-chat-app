const NLP = require("compromise");

async function processInput(input) {
  const doc = await NLP(input);
  const intent = doc.match("# Verb").out("array")[0];
  const task = doc.match("# Noun").out("array")[0];

  if (intent && task) {
    console.log(`You want to ${intent} the ${task}.`);
  } else {
    console.log("I didn't understand that. Please try again!");
  }
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  processInput(input.trim()).catch((err) => console.error(err));
});

console.log("Ready! Type something to interact with me...");
