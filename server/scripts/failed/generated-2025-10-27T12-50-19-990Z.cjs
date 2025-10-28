console.log("Learning from user feedback script initialized");

const ratings = {};

process.stdin.on("data", (input) => {
  const [command, ...args] = input.toString().trim().split(" ");

  if (command === "rate") {
    const rating = parseInt(args[0], 10);
    const responseId = args[1];

    if (!ratings[responseId]) ratings[responseId] = [];
    ratings[responseId].push(rating);

    console.log(`Rated response ${responseId} with ${rating}`);
  } else if (command === "correct") {
    const correctResponse = args.join(" ");
    const originalResponseId = args[args.length - 1];

    console.log(`Corrected response ${originalResponseId} to: ${correctResponse}`);
  }
});

process.stdin.setEncoding("utf8");
