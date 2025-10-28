console.log("Rating System Prototype");
const ratings = {};

process.stdin.setEncoding("utf8");

console.log('Enter your feedback (e.g., "correct" or "incorrect"):');
process.stdin.on("data", (input) => {
  const rating = input.trim().toLowerCase();
  if (rating === "correct" || rating === "incorrect") {
    ratings[rating] ? ratings[rating]++ : (ratings[rating] = 1);
    console.log(`Rating: ${JSON.stringify(ratings)}`);
    console.log('Enter your feedback (e.g., "correct" or "incorrect"):');
  } else {
    console.log('Invalid input. Please enter "correct" or "incorrect".');
    console.log('Enter your feedback (e.g., "correct" or "incorrect"):');
  }
});

process.stdin.on("end", () => {
  console.log("Final Ratings:", JSON.stringify(ratings));
});
