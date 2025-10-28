console.log("Initializing conversation memory...");

const conversationMemory = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput.startsWith(":recall")) {
    const recallKey = userInput.substring(7).trim();
    console.log(`Recalling previous conversation: ${conversationMemory[recallKey]}`);
  } else if (userInput.startsWith(":remember")) {
    const rememberKey = userInput.substring(9, userInput.indexOf(" ", 9)).trim();
    const rememberValue = userInput.substring(userInput.indexOf(" ", 9) + 1).trim();
    conversationMemory[rememberKey] = rememberValue;
    console.log(`Remembering: ${rememberKey} => ${rememberValue}`);
  } else {
    console.log("Unknown command. Use :remember <key> <value> or :recall <key>");
  }
});
