console.log("Feedback Collector v0.1");
const ratings = {};
process.stdin.setEncoding("utf8");
process.stdout.write("Enter your rating (1-5) and a comment: ");
process.stdin.on("data", (input) => {
  const [rating, ...comment] = input.trim().split(" ");
  if (!rating || isNaN(rating) || rating < 1 || rating > 5)
    return process.stdout.write("Invalid rating. Try again: ");
  ratings[new Date().toISOString()] = { rating: parseInt(rating), comment: comment.join(" ") };
  console.log(`Rating ${rating} and comment "${comment.join(" ")}" recorded.`);
  process.stdout.write("Enter your rating (1-5) and a comment: ");
});
