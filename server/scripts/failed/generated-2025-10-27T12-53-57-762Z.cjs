console.log("Rating System Initialized");

const ratings = {};

process.stdin.on("data", (input) => {
  const [command, response, rating] = input.toString().trim().split(" ");

  if (command === "rate") {
    ratings[response] = ratings[response] ? ratings[response] + parseInt(rating) : parseInt(rating);
    console.log(`Rated "${response}" as ${rating}.`);
  } else if (command === "getRating") {
    console.log(`Rating for "${response}": ${ratings[response] || 0}`);
  }
});

process.stdin.setEncoding("utf8");
