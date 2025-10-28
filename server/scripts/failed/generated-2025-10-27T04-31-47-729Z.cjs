console.log(
  "Implementing NLP module is a great idea! However, for now, let's just simulate a conversational interaction."
);

const userInput = prompt("You: ");

if (userInput.toLowerCase().includes("hello")) {
  console.log("AI: Hello! How can I assist you today?");
} else if (userInput.toLowerCase().includes("what time is it")) {
  const currentTime = new Date().toLocaleTimeString();
  console.log(`AI: The current time is ${currentTime}.`);
} else {
  console.log("AI: Sorry, I didn't understand that. Can you please rephrase?");
}
