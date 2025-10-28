console.log("User Feedback Collection System");

const prompts = ["What is your name?", "How old are you?", "What is your favorite color?"];

let ratings = {};

for (let i = 0; i < prompts.length; i++) {
  const response = prompt(prompts[i]);
  console.log(`You responded: ${response}`);

  let rating;
  while (true) {
    rating = prompt('Did I get it right? (1-5, where 1 is "not at all" and 5 is "exactly")');

    if (!isNaN(rating) && parseInt(rating) >= 1 && parseInt(rating) <= 5) break;
    console.log("Invalid rating. Please enter a number between 1 and 5.");
  }

  ratings[prompts[i]] = parseInt(rating);
}

console.log("Ratings:");
for (let prompt in ratings) {
  console.log(`${prompt}: ${ratings[prompt]}`);
}
