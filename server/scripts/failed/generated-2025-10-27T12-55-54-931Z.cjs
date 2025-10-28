const fs = require("fs");
const ratings = {};

process.stdin.on("data", (input) => {
  const [command, response, rating] = input.toString().trim().split(" ");
  if (command === "RATE") {
    if (rating === "HELPFUL" || rating === "NOT_HELPFUL") {
      if (!ratings[response]) ratings[response] = { helpful: 0, notHelpful: 0 };
      ratings[response][rating.toLowerCase()]++;
      fs.writeFileSync("ratings.json", JSON.stringify(ratings));
      console.log(`Rated response "${response}" as ${rating}.`);
    } else {
      console.error('Invalid rating. Please use "HELPFUL" or "NOT_HELPFUL".');
    }
  } else if (command === "STATS") {
    const total = Object.values(ratings).reduce(
      (acc, { helpful, notHelpful }) => acc + helpful + notHelpful,
      0
    );
    console.log(`Total ratings: ${total}`);
    for (const [response, rating] of Object.entries(ratings)) {
      const helpfulness =
        Math.round((rating.helpful / (rating.helpful + rating.notHelpful)) * 100) || 0;
      console.log(`Response "${response}" has a helpfulness score of ${helpfulness}%`);
    }
  } else {
    console.error('Unknown command. Please use "RATE" or "STATS".');
  }
});
