const NaturalLanguageUnderstanding = require("natural").NaturalLanguageUnderstanding;
const nlu = new NaturalLanguageUnderstanding("stanford");

process.stdin.setEncoding("utf8");
process.stdin.on("data", async (input) => {
  try {
    const response = await nlu.analyze(input.toString().trim());
    console.log(response);
  } catch (e) {
    console.error(e);
  }
});
