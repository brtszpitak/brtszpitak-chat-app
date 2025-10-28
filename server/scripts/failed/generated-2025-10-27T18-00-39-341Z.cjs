const fs = require("fs");
let contextMemory = {};

try {
  contextMemory = JSON.parse(fs.readFileSync("context_memory.json", "utf8"));
} catch (e) {}

process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  console.log(`You said: ${input}`);

  // Simple example of adapting to user's preferences
  if (!contextMemory.preferences) contextMemory.preferences = {};
  if (input.includes("like")) {
    const preference = input.replace("I like ", "");
    contextMemory.preferences[preference] = true;
    console.log(`Noted, you like ${preference}`);
  } else if (input.includes("dislike")) {
    const preference = input.replace("I dislike ", "");
    contextMemory.preferences[preference] = false;
    console.log(`Noted, you dislike ${preference}`);
  }

  fs.writeFileSync("context_memory.json", JSON.stringify(contextMemory, null, 2));
});

process.stdin.setEncoding("utf8");
