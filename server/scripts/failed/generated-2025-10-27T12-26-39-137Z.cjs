console.log("Learning from User Feedback Script");
const ratings = {};
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, ...args] = input.trim().split(/\s+/);
  if (command === "rate") {
    const [id, rating] = args;
    if (!ratings[id]) ratings[id] = [];
    ratings[id].push(parseInt(rating));
    console.log(`Rated response ${id} with ${rating}`);
  } else if (command === "correct") {
    const [id, correction] = args;
    console.log(`Corrected response ${id} to: ${correction}`);
  }
});
process.stdin.on("end", () => {
  console.log("Ratings:", ratings);
});
