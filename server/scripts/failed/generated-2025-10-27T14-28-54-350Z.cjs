console.log("Learning from User Feedback Script");

const ratings = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, ...args] = input.trim().split(" ");

  if (command === "rate") {
    const [id, rating] = args;
    ratings[id] = parseInt(rating);
    console.log(`Rated response ${id} with ${rating}`);
  } else if (command === "correct") {
    const [id, correction] = args;
    console.log(`Corrected response ${id} to "${correction}"`);
  } else {
    console.log("Unknown command");
  }
});

process.stdin.on("end", () => {
  console.log("Ratings:", ratings);
});
