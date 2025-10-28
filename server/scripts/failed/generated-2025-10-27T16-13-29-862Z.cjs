console.log("User Feedback Collection System");

const ratings = {};
let userId = 1;

function rateResponse(responseId, rating) {
  if (!ratings[responseId]) ratings[responseId] = [];
  ratings[responseId].push({ userId, rating });
}

function correctResponse(responseId, correction) {
  console.log(`Correction for response ${responseId}: ${correction}`);
}

rateResponse(1, 5);
rateResponse(1, 4);
rateResponse(2, 3);

correctResponse(1, "More accurate answer");

console.log(ratings);
