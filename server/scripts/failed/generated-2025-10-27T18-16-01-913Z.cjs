const fs = require("fs");
let data = {};
try {
  data = JSON.parse(fs.readFileSync("./feedback.json", "utf8"));
} catch {}
process.stdin.on("data", (input) => {
  const [cmd, ...args] = input.toString().trim().split(/\s+/);
  if (cmd === "correct") {
    const [id, correction] = args;
    data[id] = { ...(data[id] || {}), correction };
  } else if (cmd === "rate") {
    const [id, rating] = args;
    data[id] = { ...(data[id] || {}), rating: parseInt(rating) };
  }
  fs.writeFileSync("./feedback.json", JSON.stringify(data, null, 2));
});
process.stdin.setEncoding("utf8");
console.log('Enter commands (e.g. "correct <id> <correction>" or "rate <id> <rating>")');
