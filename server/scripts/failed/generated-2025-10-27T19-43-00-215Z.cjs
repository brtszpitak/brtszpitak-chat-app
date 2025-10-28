console.log("Rating System Prototype");

const ratings = {};
let userId = 1;

function rateResponse(responseId, rating) {
  if (!ratings[responseId]) ratings[responseId] = [];
  ratings[responseId].push({ userId, rating });
}

function correctResponse(responseId, correction) {
  console.log(`Correcting response ${responseId} to: ${correction}`);
}

rateResponse(1, 5);
rateResponse(1, 4);
rateResponse(2, 3);

correctResponse(1, "Improved response");

console.log(ratings);
