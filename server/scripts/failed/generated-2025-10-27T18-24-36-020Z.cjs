console.log("User Feedback Collection Script");

const userInput = {
  response: "",
  rating: 0,
};

console.log("Please enter a response you received from me:");
process.stdin.once("data", (input) => {
  userInput.response = input.toString().trim();
  console.log(`You entered: ${userInput.response}`);
  console.log("How would you rate this response? (1-5)");
  process.stdin.once("data", (rating) => {
    userInput.rating = parseInt(rating.toString().trim());
    console.log(`You rated it: ${userInput.rating}`);
    console.log("Thank you for your feedback!");
    console.log("Response:", userInput.response);
    console.log("Rating:", userInput.rating);
  });
});
