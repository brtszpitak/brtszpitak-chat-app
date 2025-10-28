const fs = require("fs");
let data = {};

try {
  data = JSON.parse(fs.readFileSync("./feedback.json", "utf8"));
} catch (e) {}

process.stdin.setEncoding("utf8");

console.log("Welcome! I'm here to learn from you.");

function ask(question) {
  process.stdout.write(question + " ");
}

ask("What is your question or topic? ");

process.stdin.on("data", async (input) => {
  const response = "My response: I don't know yet...";
  console.log(response);

  ask("Did I get it right? (yes/no): ");

  process.stdin.once("data", (answer) => {
    if (answer.trim().toLowerCase() === "yes") {
      data[input.trim()] = response;
    } else {
      ask("Correct me: ");

      process.stdin.once("data", (correction) => {
        data[input.trim()] = correction.toString().trim();
        fs.writeFileSync("./feedback.json", JSON.stringify(data, null, 2));

        console.log("Thank you for correcting me!");
      });
    }

    process.stdin.resume();
  });
});
