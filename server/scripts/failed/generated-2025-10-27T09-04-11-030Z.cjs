console.log("Context Memory Feature Prototype");

const contextMemory = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const userInput = input.trim();
  if (userInput.startsWith(":remember ")) {
    const [_, key, value] = userInput.split(" ");
    contextMemory[key] = value;
    console.log(`Remembered: ${key} = ${value}`);
  } else if (userInput.startsWith(":recall ")) {
    const [_, key] = userInput.split(" ");
    const value = contextMemory[key];
    if (value) {
      console.log(`Recalled: ${key} = ${value}`);
    } else {
      console.log(`No memory found for: ${key}`);
    }
  } else {
    console.log("Unknown command. Use :remember or :recall");
  }
});
