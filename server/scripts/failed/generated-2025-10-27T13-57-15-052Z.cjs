const fs = require("fs");
let data = {};
try {
  data = JSON.parse(fs.readFileSync("context.json", "utf8"));
} catch {}
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();
  if (command.startsWith("/set ")) {
    const [key, value] = command
      .substring(5)
      .trim()
      .split(/\s*:\s*/, 2);
    data[key] = value;
    fs.writeFileSync("context.json", JSON.stringify(data, null, 2));
    console.log(`Set ${key} to ${value}`);
  } else if (command.startsWith("/get ")) {
    const key = command.substring(5).trim();
    console.log(data[key]);
  } else if (command === "/list") {
    for (const key in data) console.log(`${key}: ${data[key]}`);
  }
});
process.stdin.on("end", () => process.exit());
