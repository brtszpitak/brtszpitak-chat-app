const fs = require("fs");
let data = {};
try {
  data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
} catch {}
process.stdin.on("data", (input) => {
  const feedback = input.toString().trim();
  if (!feedback.startsWith(":")) return;
  const [command, ...args] = feedback.split(" ");
  switch (command) {
    case ":correct":
      data[args[0]] = args.slice(1).join(" ");
      break;
    case ":incorrect":
      delete data[args[0]];
      break;
  }
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
});
process.stdin.setEncoding("utf8");
