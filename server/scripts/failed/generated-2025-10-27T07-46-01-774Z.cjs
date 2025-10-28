const fs = require("fs");
const moment = require("moment");

const ideaDate = "2025-10-27T07:45:14.617Z";
const ideaText =
  "I suggest implementing a context-aware knowledge graph to better understand user intent and provide more accurate and relevant responses. This would enable me to recognize relationships between topics, recall previous conversations, and offer more personalized assistance.";

fs.writeFileSync("idea.txt", `${moment(ideaDate).format("YYYY-MM-DD HH:mm:ss")} ${ideaText}`);
console.log(`Idea saved to idea.txt`);
