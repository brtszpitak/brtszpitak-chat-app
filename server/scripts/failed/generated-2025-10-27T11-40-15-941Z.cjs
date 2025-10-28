const nlp = require("compromise");

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = nlp(input.trim());
  const verbs = doc.verbs().out("array");
  const nouns = doc.nouns().out("array");

  if (verbs.includes("run") && nouns.includes("command")) {
    console.log("You want to run a command!");
    // Ask for confirmation before executing the command
    process.stdout.write("Enter the PowerShell command: ");
  } else if (verbs.includes("ask") || verbs.includes("what")) {
    console.log("You have a question!");
    // Provide a helpful response or ask for clarification
    process.stdout.write("Please rephrase your question for better understanding.\n");
  } else {
    console.log("I didn't understand. Please try again.");
  }
});

process.stdin.on("end", () => {
  console.log("Goodbye!");
});
