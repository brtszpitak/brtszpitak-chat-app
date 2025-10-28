const nl = require("compromise");

console.log("Type something: ");
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const doc = nl(input.toString().trim());
  console.log(doc.out("text"));
  process.stdout.write("Type something: ");
});
