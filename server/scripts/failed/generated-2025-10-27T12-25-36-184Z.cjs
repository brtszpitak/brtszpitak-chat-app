console.log("Initializing AI feedback system...");

const ratings = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const [command, ...args] = input.trim().split(/\s+/);

  if (command === "rate") {
    const id = args[0];
    const rating = parseInt(args[1], 10);

    if (!isNaN(rating) && rating >= 1 && rating <= 5) {
      ratings[id] = rating;
      console.log(`Rated response ${id} with ${rating}/5`);
    } else {
      console.error("Invalid rating. Please use a number between 1 and 5.");
    }
  } else if (command === "correct") {
    const id = args[0];
    const correction = args.slice(1).join(" ");

    console.log(`Corrected response ${id} to: ${correction}`);
    // TO DO: implement actual correction logic
  } else {
    console.error('Unknown command. Use "rate" or "correct"');
  }
});

console.log("Waiting for user feedback...");
