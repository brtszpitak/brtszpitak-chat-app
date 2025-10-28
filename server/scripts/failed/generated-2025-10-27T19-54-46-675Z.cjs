console.log("Learning from user feedback script started");

const userInput = [];
let learningMode = true;

while (learningMode) {
  const feedback = prompt('Please provide feedback (type "exit" to stop): ');

  if (feedback.toLowerCase() === "exit") {
    learningMode = false;
  } else {
    userInput.push(feedback);
    console.log(`Received feedback: ${feedback}`);
  }
}

console.log("User feedback collected:");
userInput.forEach((feedback, index) => console.log(`${index + 1}. ${feedback}`));
